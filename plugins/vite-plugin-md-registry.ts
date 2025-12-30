import type { Plugin } from 'vite'
// import fs from "fs/promises";
import path from 'path'
import { glob } from 'glob'

interface mdRegistry {
    contentDir: string
    devVirtualModule?: boolean
}

declare global {
    var __MD_REGISTRY_PLUGIN_INITIALIZED__: boolean | undefined
}

export function mdRegistry(options: mdRegistry): Plugin {
    let isBuild = false

    // 虚拟模块 ID 前缀
    const VIRTUAL_MODULE_PREFIX = 'virtual:md-registry'
    const RESOLVED_VIRTUAL_MODULE_PREFIX = '\0' + VIRTUAL_MODULE_PREFIX

    return {
        name: 'vite-plugin-md-registry',

        // 插件配置解析完成时
        configResolved(resolvedConfig) {
            if (resolvedConfig.build.ssr) return
            if (globalThis.__MD_REGISTRY_PLUGIN_INITIALIZED__) return
            globalThis.__MD_REGISTRY_PLUGIN_INITIALIZED__ = true
            isBuild = resolvedConfig.command === 'build'

            console.log(
                `📝 vite-plugin-md-registry@${isBuild ? '构建' : '开发'}模式: 插件已启用`
            )
            // console.log(`  内容目录: ${options.contentDir}`);
        },

        // 构建开始时
        async buildStart() {
            return
        },

        // 开发服务器配置
        configureServer(server) {
            if (!options.devVirtualModule) return

            console.log(
                `👀 vite-plugin-md-registry@开发模式: 启用虚拟模块和文件监听`
            )

            // 监听 content 目录变化
            const watcher = server.watcher
            const contentDir = path.resolve(options.contentDir)

            watcher.add(contentDir)

            watcher.on('add', async (filePath) => {
                if (filePath.includes(contentDir) && filePath.endsWith('.md')) {
                    console.log(
                        `📄 Markdown 文件注册表更新: ${path.relative(contentDir, filePath)}`
                    )

                    // 清除相关虚拟模块的缓存
                    const module = server.moduleGraph.getModuleById(
                        VIRTUAL_MODULE_PREFIX
                    )
                    if (module) {
                        server.moduleGraph.invalidateModule(module)
                    }

                    // 通知客户端更新
                    server.ws.send({
                        type: 'full-reload',
                        path: '*',
                    })
                }
            })
        },

        resolveId(id: string) {
            if (id.startsWith(VIRTUAL_MODULE_PREFIX)) {
                return RESOLVED_VIRTUAL_MODULE_PREFIX + '.tsx'
            }
        },

        async load(id: string) {
            if (!id.startsWith(RESOLVED_VIRTUAL_MODULE_PREFIX)) return null
            if (!options.devVirtualModule) {
                return `
                import React from 'react'
                export default function ErrorMessage() = {return React.createElement('p',null,'开发虚拟模块已禁用')}
                `
            }

            const pattern = path
                .join(options.contentDir, '**/*.md')
                .replace(/\\/gm, '/')

            // output example: contents\\test.md, contents\\post\\test.md, contents\\page\\about\\test.md
            const mdFiles = await glob(pattern)

            // output example: test, post/test, page/about/test
            const slugs = mdFiles.map((item) =>
                item
                    .substring(options.contentDir.length + 1, item.length - 3)
                    .replace(/\\/gm, '/')
            )

            const res =
                '{' +
                slugs
                    .map(
                        (value) =>
                            `'${value}':()=>import('virtual:md-content/${value}')`
                    )
                    .toString() +
                '}'

            return `export const mdRegistry = ${res} `
        },
    }
}
