// plugins/vite-plugin-md-to-route.ts
import type { Plugin } from 'vite'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import v8 from 'v8'
import { glob } from 'glob'
import matter from 'gray-matter'
import type {
    FrontMatter,
    MarkdownFile,
    RouteManifest,
} from '../app/interfaces/post'
import type { TagDataInterface } from '../app/interfaces/tags'
import { generateMDXModuleCode } from '../templates/mdxModuleCode'
import { generateVirtualErrorModuleCode } from '../templates/virtualErrorModuleCode'

declare global {
    var __MD_CONTENT_PLUGIN_INITIALIZED__: boolean | undefined
}

// ==================== 类型定义 ====================

export interface MdToRoutePluginOptions {
    /** Markdown 内容目录 */
    contentDir: string
    /** 生成组件输出目录 */
    outputDir: string
    /** 源代码目录 */
    srcDir?: string
    /** 路由前缀，如 '/blog' */
    routePrefix?: string
    /** 开发时使用虚拟模块（默认：true） */
    devVirtualModule?: boolean
    /** 文件匹配模式（默认：'**\/*.md'） */
    pattern?: string
    /** 读取文件并发数（默认：20） */
    concurrency?: number
}

// ==================== 工具函数 ====================
function toPascalCase(str: string): string {
    return str
        .replace(/[^\p{L}\p{N}]+(.)/gu, (_, chr) => chr.toUpperCase())
        .replace(/[^\p{L}\p{N}]/gu, '')
}

function toMD5(str: string): string {
    return crypto.createHash('md5').update(str).digest('hex')
}

// ==================== 插件主类 ====================
class MarkdownProcessor {
    private options: Required<MdToRoutePluginOptions>
    private MARKDOWN_FILES_CACHE: MarkdownFile[] = []
    private cachePath: string
    private fileHashes: Map<string, string> = new Map()

    constructor(options: MdToRoutePluginOptions) {
        this.options = {
            srcDir: 'app/',
            routePrefix: '',
            devVirtualModule: true,
            pattern: '**/*.md',
            concurrency: 20,
            ...options,
        }
        // 定义缓存路径
        this.cachePath = path.resolve(
            process.cwd(),
            'node_modules',
            '.cache',
            'vite-plugin-md-to-route',
            'cache.bin'
        )
    }

    // 计算文件哈希
    private async calculateFileHash(filePath: string): Promise<string> {
        const fileBuffer = await fs.readFile(filePath)
        return this.computeHash(fileBuffer)
    }

    private computeHash(content: Buffer): string {
        const hashSum = crypto.createHash('sha256')
        hashSum.update(content)
        return hashSum.digest('hex')
    }

    // 加载缓存
    private async loadCache(): Promise<void> {
        try {
            await fs.access(this.cachePath)
            const cacheContent = await fs.readFile(this.cachePath)
            const cachedData = v8.deserialize(cacheContent)

            this.MARKDOWN_FILES_CACHE = cachedData.files || []
            this.fileHashes = cachedData.hashes || new Map()
            console.log('📦 已加载缓存数据')
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log('⚠️ 未找到缓存或缓存无效')
            this.MARKDOWN_FILES_CACHE = []
            this.fileHashes = new Map()
        }
    }

    // 保存缓存
    private async saveCache(): Promise<void> {
        try {
            const cacheDir = path.dirname(this.cachePath)
            await fs.mkdir(cacheDir, { recursive: true })
            const dataToCache = {
                hashes: this.fileHashes,
                files: this.MARKDOWN_FILES_CACHE,
            }
            await fs.writeFile(this.cachePath, v8.serialize(dataToCache))
            console.log(`缓存已保存到 ${this.cachePath}`)
        } catch (error) {
            console.error('无法保存缓存：', error)
        }
    }

    // 扫描并读取所有 Markdown 文件
    private async scanMarkdownFiles(): Promise<MarkdownFile[]> {
        const pattern = path
            .join(this.options.contentDir, this.options.pattern)
            .replace(/\\/gm, '/')
        console.log(`🔍 扫描 Markdown 文件\n🔍 pattern: ${pattern}`)
        const files = await glob(pattern)

        // 如果没有 './pages/about.md' 或 './pages/notice.md' 则创建
        if (!files.includes(`${this.options.contentDir}\\pages\\about.md`)) {
            console.error(
                `没有 'pages/about.md'，现以创建空文件，请手动修改文件`
            )
            // 在源目录创建 pages/about.md 和 pages/notice.md 确保程序能进行下去
            await fs.writeFile(
                `${this.options.contentDir}\\pages\\about.md`,
                '# about',
                'utf-8'
            )
        }
        if (!files.includes(`${this.options.contentDir}\\pages\\notice.md`)) {
            console.error(
                `没有 'pages/notice.md'，现以创建空文件，请手动修改文件`
            )
            await fs.writeFile(
                `${this.options.contentDir}\\pages\\notice.md`,
                '# notice',
                'utf-8'
            )
        }

        // 创建缓存查找表
        const cachedFilesMap = new Map<string, MarkdownFile>()
        this.MARKDOWN_FILES_CACHE.forEach((file) => {
            cachedFilesMap.set(path.normalize(file.filePath), file)
        })

        const nextFileHashes = new Map<string, string>()

        const results: (MarkdownFile | null)[] = new Array(files.length)
        let nextIndex = 0

        const processFile = async (index: number) => {
            const filePath = files[index]
            try {
                const normalizedPath = path.normalize(filePath)
                const fileBuffer = await fs.readFile(filePath)
                const hash = this.computeHash(fileBuffer)
                nextFileHashes.set(normalizedPath, hash)

                const cachedHash = this.fileHashes.get(normalizedPath)
                const cachedFile = cachedFilesMap.get(normalizedPath)

                if (cachedHash === hash && cachedFile) {
                    return cachedFile
                }

                return await this.scanMarkdownFile(filePath, fileBuffer)
            } catch (error) {
                console.error(`❌ 读取文件失败 ${filePath}:`, error)
                return null
            }
        }

        const worker = async () => {
            while (nextIndex < files.length) {
                const index = nextIndex++
                results[index] = await processFile(index)
                // 显式让出事件循环，避免大量同步计算阻塞主线程
                await new Promise((resolve) => setImmediate(resolve))
            }
        }

        const concurrency = this.options.concurrency
        const workers = Array.from(
            { length: Math.min(concurrency, files.length) },
            () => worker()
        )

        await Promise.all(workers)

        const markdownFiles = results.filter(
            (item): item is MarkdownFile => item !== null
        )

        // 更新哈希表
        this.fileHashes = nextFileHashes

        // 按日期排序
        return markdownFiles.sort(
            (a, b) =>
                new Date(b.frontMatter.date).getTime() -
                new Date(a.frontMatter.date).getTime()
        )
    }

    // 扫描单个指定 Markdown
    private async scanMarkdownFile(
        filePath: string,
        fileBuffer?: Buffer
    ): Promise<MarkdownFile> {
        const slug = this.extractSlug(filePath)

        // 读取文件内容
        console.log(`📄 读取文件: ${filePath}`)

        if (!fileBuffer) fileBuffer = await fs.readFile(filePath)
        const content = fileBuffer.toString('utf-8')
        const { data: frontMatter, content: markdownContent } = matter(content)
        const basename = path.basename(filePath, '.md')
        const basenameLength = basename.length
        const componentName = toPascalCase(basename.replace(/[/-]/g, '_'))
        const exportName = `Post${toMD5(toPascalCase(slug.replace(/[/-]/g, '_')))}`
        const componentFilPath = `${slug.substring(
            0,
            slug.length - basenameLength
        )}${componentName}\\index.tsx`.replace(/\//g, '\\')

        // 验证必要字段
        if (!frontMatter.title) {
            console.warn(`⚠️  文件 ${filePath} 缺少 title 字段`)
            console.warn(
                `⚠️  已为文件 ${filePath} 添加 title 字段：${basename}`
            )
            frontMatter.title = basename
        }

        if (!frontMatter.date) {
            console.warn(`⚠️  文件 ${filePath} 缺少 date 字段`)
            frontMatter.date = new Date().toISOString().split('T')[0]
        }

        return {
            slug,
            filePath,
            routePath: slug,
            frontMatter: frontMatter as FrontMatter,
            content: markdownContent,
            exportName: exportName,
            componentFilPath: componentFilPath,
        }
    }

    // 扫描并读取所有 Markdown 文件到 this.MARKDOWN_FILES_CACHE
    async scanMarkdownFilesSync(): Promise<void> {
        await this.loadCache()
        this.MARKDOWN_FILES_CACHE = await this.scanMarkdownFiles()
        await this.saveCache()
    }

    // 更新指定的 Markdown 文件数据
    async updateMarkdownFile(filePath: string): Promise<void> {
        const fileBuffer = await fs.readFile(filePath)
        const hash = this.computeHash(fileBuffer)
        this.fileHashes.set(path.normalize(filePath), hash)
        const markdownFile = await this.scanMarkdownFile(filePath, fileBuffer)

        const index = this.MARKDOWN_FILES_CACHE.findIndex(
            (file) => file.filePath === filePath
        )

        if (index !== -1) {
            this.MARKDOWN_FILES_CACHE[index] = markdownFile
        } else {
            this.MARKDOWN_FILES_CACHE.push(markdownFile)
        }
        await this.saveCache()
    }

    // 获取所有 Markdown 文件
    async getMarkdownFiles(): Promise<MarkdownFile[]> {
        if (this.MARKDOWN_FILES_CACHE.length === 0) {
            await this.scanMarkdownFilesSync()
        }
        return this.MARKDOWN_FILES_CACHE
    }

    // 通过 slug 获取 Markdonw
    async getMarkdownFileBySlug(slug: string): Promise<MarkdownFile | null> {
        const files = await this.getMarkdownFiles()
        const ans = files.find((file) => file.slug === slug)
        return ans || null
    }

    // 从文件路径提取 slug
    extractSlug(filePath: string): string {
        const relative = path.relative(this.options.contentDir, filePath)
        const dirname = path.dirname(relative)
        const basename = path.basename(filePath, '.md')

        // 如果文件在子目录中，将目录名包含在 slug 中
        if (dirname !== '.') {
            return `${dirname}/${basename}`.replace(/\\/g, '/')
        } else {
            return basename.replace(/\\/g, '/')
        }
    }

    // 将 Markdown 转换为 TSX 组件
    async convertToTsx(markdownFile: MarkdownFile): Promise<string> {
        return generateMDXModuleCode(
            markdownFile.slug,
            markdownFile.frontMatter,
            markdownFile.content,
            markdownFile.filePath
        )
    }

    // 生成路由清单
    async generateRouteManifest(): Promise<RouteManifest> {
        const files = await this.getMarkdownFiles()
        const routes = files.map((file) => {
            return {
                slug: file.slug,
                path: `${this.options.routePrefix ? this.options.routePrefix + '/' : ''}${file.slug}`,
                component: `${path
                    .relative(
                        this.options.srcDir,
                        `${this.options.outputDir}/${file.componentFilPath}`
                    )
                    .replace(/\\/g, '/')}`,
                frontMatter: file.frontMatter,
            }
        })

        return {
            routes,
            generatedAt: new Date().toISOString(),
        }
    }

    // 生成索引文件的辅助方法
    async generateIndexFile(outputDir: string) {
        const files = await this.getMarkdownFiles()
        const imports = files
            .map((file) => {
                return `import ${file.exportName}, { frontMatter as ${file.exportName}FrontMatter } from './${file.routePath.replace(
                    /\\$/,
                    '/'
                )}/index'`
            })
            .join('\n')

        const exports = files
            .map((file) => {
                return `  ${file.exportName},
  ${file.exportName}FrontMatter`
            })
            .join(',\n')

        const allPosts = files.map((file) => {
            return {
                slug: file.slug,
                componentName: `${file.exportName}`,
                frontMatter: file.frontMatter,
            }
        })

        const indexContent = `
// =============================================
// 自动生成的索引文件，请勿手动编辑！
// 生成时间: ${new Date().toISOString()}
// =============================================

${imports}

// 导出所有组件
export {
${exports}
}

// 所有文章数据
export const allPosts = ${JSON.stringify(allPosts, null, 2)}

// 按标签分类的文章
export const postsByTag = (() => {
  const result: Record<string, Array<typeof allPosts[0]>> = {}
  
  allPosts.forEach(post => {
    const tags = post.frontMatter.tags || []
    tags.forEach(tag => {
      if (!result[tag]) result[tag] = []
      result[tag].push(post)
    })
  })
  
  return result
})()

// 按年份分类的文章
export const postsByYear = (() => {
  const result: Record<string, Array<typeof allPosts[0]>> = {}
  
  allPosts.forEach(post => {
    const year = new Date(post.frontMatter.date).getFullYear().toString()
    if (!result[year]) result[year] = []
    result[year].push(post)
  })
  
  return result
})()

// 工具函数：获取相邻文章
export function getAdjacentPosts(currentSlug: string) {
  const index = allPosts.findIndex(post => post.slug === currentSlug)
  
  return {
    prev: index > 0 ? allPosts[index - 1] : null,
    next: index < allPosts.length - 1 ? allPosts[index + 1] : null
  }
}
`

        await fs.writeFile(
            path.join(outputDir, 'index.ts'),
            indexContent,
            'utf-8'
        )
    }

    // 生成Tag清单
    async generateTagManifest(): Promise<TagDataInterface> {
        const files = await this.getMarkdownFiles()
        const tags = new Map<string, number>()
        let total = 0

        files.forEach((file) => {
            const frontMatterTags = file.frontMatter.tags || []
            frontMatterTags.forEach((tag) => {
                tags.set(tag, (tags.get(tag) || 0) + 1)
                total += 1
            })
        })

        return {
            total,
            tags: Array.from(tags.entries())
                .map(([name, count]) => ({
                    name,
                    count,
                }))
                .sort((a, b) => b.count - a.count),
            generatedAt: new Date().toISOString(),
        }
    }
}

// ==================== Vite 插件实现 ====================
export function mdToRoutePlugin(options: MdToRoutePluginOptions): Plugin {
    let processor: MarkdownProcessor
    // let config: ResolvedConfig;
    let isBuild = false

    // 虚拟模块 ID 前缀
    const VIRTUAL_MODULE_PREFIX = 'virtual:md-content/'
    const RESOLVED_VIRTUAL_MODULE_PREFIX = '\0' + VIRTUAL_MODULE_PREFIX

    return {
        name: 'vite-plugin-md-to-route',

        // 插件配置解析完成时
        configResolved(resolvedConfig) {
            // if (globalThis.__MD_CONTENT_PLUGIN_INITIALIZED__) return
            // globalThis.__MD_CONTENT_PLUGIN_INITIALIZED__ = true
            isBuild = resolvedConfig.command === 'build'
            processor = new MarkdownProcessor(options)
            processor.scanMarkdownFilesSync()

            console.log(
                `📝 vite-plugin-md-to-route@${isBuild ? '构建' : '开发'}模式: 插件已启用`
            )
            console.log(`  内容目录: ${options.contentDir}`)
        },

        // 构建开始时
        async buildStart() {
            if (!isBuild) return

            console.log('🔨 开始处理 Markdown 文件...')

            try {
                // 1. 扫描所有 Markdown 文件
                const markdownFiles = await processor.getMarkdownFiles()
                console.log(`   找到 ${markdownFiles.length} 个 Markdown 文件`)

                // 2. 确保输出目录存在
                const outputDir = path.resolve(options.outputDir)
                await fs.mkdir(outputDir, { recursive: true })
                console.log(`   输出目录: ${outputDir}`)

                // 3. 为每个文件生成组件
                for (const file of markdownFiles) {
                    const tsxContent = await processor.convertToTsx(file)

                    console.log(`     📄 生成: ${file.componentFilPath}`)
                    const outputPath = path.join(
                        outputDir,
                        file.componentFilPath
                    )
                    // 确保目标路径存在，不存在则创建
                    const dir = path.dirname(outputPath)
                    await fs.mkdir(dir, { recursive: true })
                    //

                    console.log(`        目标路径: ${outputPath}`)
                    await fs.writeFile(outputPath, tsxContent, 'utf-8')
                    console.log(`     ✅ 生成: ${outputPath}`)
                }

                // 4. 生成路由清单
                const manifest = await processor.generateRouteManifest()
                const manifestPath = path.join(outputDir, '__manifest.json')
                await fs.writeFile(
                    manifestPath,
                    JSON.stringify(manifest, null, 2),
                    'utf-8'
                )

                // 5. 生成索引文件
                await processor.generateIndexFile(outputDir)

                // 6. 生成Tag清单
                const tagManifest = await processor.generateTagManifest()
                const tagManifestPath = path.join(outputDir, 'tags.json')
                await fs.writeFile(
                    tagManifestPath,
                    JSON.stringify(tagManifest, null, 2),
                    'utf-8'
                )

                console.log('🎉 Markdown 处理完成！')
            } catch (error) {
                console.error('❌ Markdown 处理失败:', error)
                throw error
            }
        },

        // 开发服务器配置
        configureServer(server) {
            if (!options.devVirtualModule) return

            console.log(
                `👀 vite-plugin-md-to-route@开发模式: 启用虚拟模块和文件监听`
            )

            // 监听 content 目录变化
            const watcher = server.watcher
            const contentDir = path.resolve(options.contentDir)

            watcher.add(contentDir)

            let timer: NodeJS.Timeout | null = null
            const changedFiles = new Set<string>()

            watcher.on('change', (filePath) => {
                if (filePath.includes(contentDir) && filePath.endsWith('.md')) {
                    changedFiles.add(filePath)

                    if (timer) clearTimeout(timer)

                    timer = setTimeout(async () => {
                        timer = null
                        const files = Array.from(changedFiles)
                        changedFiles.clear()

                        console.log(
                            `📄 检测到 ${files.length} 个 Markdown 文件更新`
                        )

                        try {
                            for (const file of files) {
                                const relativeDir = path.relative(
                                    contentDir,
                                    file
                                )
                                await processor.updateMarkdownFile(
                                    path
                                        .join(options.contentDir, relativeDir)
                                        .replace(/\\/gm, '/')
                                )
                            }

                            const outputDir = path.resolve(options.outputDir)

                            // 重新生成路由清单
                            const manifest =
                                await processor.generateRouteManifest()
                            const manifestPath = path.join(
                                outputDir,
                                '__manifest.json'
                            )
                            await fs.writeFile(
                                manifestPath,
                                JSON.stringify(manifest, null, 2),
                                'utf-8'
                            )

                            // 重新生成索引文件
                            await processor.generateIndexFile(outputDir)

                            // 重新生成Tag清单
                            const tagManifest =
                                await processor.generateTagManifest()
                            const tagManifestPath = path.join(
                                outputDir,
                                'tags.json'
                            )
                            await fs.writeFile(
                                tagManifestPath,
                                JSON.stringify(tagManifest, null, 2),
                                'utf-8'
                            )
                            console.log('🎉 处理完成！')

                            // 清除相关虚拟模块的缓存
                            for (const file of files) {
                                const relativePath = path.relative(
                                    contentDir,
                                    file
                                )
                                const slug = processor.extractSlug(relativePath)
                                const virtualModuleId = `${VIRTUAL_MODULE_PREFIX}${slug}`

                                const module =
                                    server.moduleGraph.getModuleById(
                                        virtualModuleId
                                    )
                                if (module) {
                                    server.moduleGraph.invalidateModule(module)
                                }
                            }

                            // 通知客户端更新
                            server.ws.send({
                                type: 'full-reload',
                                path: '*',
                            })
                        } catch (error) {
                            console.error('❌ 更新失败:', error)
                        }
                    }, 200)
                }
            })
        },

        // 解析虚拟模块 ID
        resolveId(id: string) {
            if (id.startsWith(VIRTUAL_MODULE_PREFIX)) {
                const slug = id.slice(VIRTUAL_MODULE_PREFIX.length)
                return `${RESOLVED_VIRTUAL_MODULE_PREFIX}${slug}.tsx`
            }
            // 处理带.tsx扩展名的二次请求（某些情况下Vite会再次请求）
            if (id.startsWith(RESOLVED_VIRTUAL_MODULE_PREFIX)) {
                return id
            }
        },

        // 加载虚拟模块（开发时使用）
        async load(id: string) {
            if (!id.startsWith(RESOLVED_VIRTUAL_MODULE_PREFIX)) return null
            if (!options.devVirtualModule) {
                return `
                import React from 'react'
                export default function ErrorMessage() = {return React.createElement('p',null,'开发虚拟模块已禁用')}
                `
            }

            // 提取slug：去掉前缀和.tsx扩展名
            const slugWithExt = id.slice(RESOLVED_VIRTUAL_MODULE_PREFIX.length)
            const slug = slugWithExt.replace(/\.tsx$/, '')

            const filePath = path.join(options.contentDir, `${slug}.md`)

            try {
                // 读取Markdown文件
                console.log(`👌 加载文件: ${slug}`)

                const markdownFile = await processor.getMarkdownFileBySlug(slug)

                if (!markdownFile) throw new Error('Markdown 文件不存在')

                // 使用gray-matter解析Front Matter和内容
                const { frontMatter, content } = markdownFile

                // 验证必要字段
                if (!frontMatter.title) {
                    frontMatter.title = slug
                }

                if (!frontMatter.date) {
                    frontMatter.date = new Date().toISOString().split('T')[0]
                }

                // 生成MDX模块的代码
                return generateMDXModuleCode(
                    slug,
                    frontMatter as FrontMatter,
                    content,
                    filePath
                )
            } catch (error) {
                // 文件不存在或其他错误
                console.error(`❌ 加载虚拟模块失败: ${slug}`, error)
                return generateVirtualErrorModuleCode(slug, error as Error)
            }
        },
    }
}
