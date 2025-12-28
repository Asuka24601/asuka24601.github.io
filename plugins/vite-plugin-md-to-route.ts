/* eslint-disable @typescript-eslint/no-explicit-any */
// plugins/vite-plugin-md-to-route.ts
import type { Plugin } from "vite";
import fs from "fs/promises";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

// ==================== 类型定义 ====================
export interface FrontMatter {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  [key: string]: any;
}

export interface MarkdownFile {
  slug: string;
  filePath: string;
  frontMatter: FrontMatter;
  content: string;
}

export interface RouteComponent {
  componentName: string;
  routePath: string;
  filePath: string;
  frontMatter: FrontMatter;
}

export interface MdToRoutePluginOptions {
  /** Markdown 内容目录 */
  contentDir: string;
  /** 生成组件输出目录 */
  outputDir: string;
  /** 路由前缀，如 '/blog' */
  routePrefix?: string;
  /** 开发时使用虚拟模块（默认：true） */
  devVirtualModule?: boolean;
  /** 文件匹配模式（默认：'**\/*.md'） */
  pattern?: string;
  /** Markdown 转换选项 */
  markdownOptions?: {
    remarkPlugins?: any[];
    rehypePlugins?: any[];
  };
}

export interface RouteManifest {
  routes: Array<{
    slug: string;
    path: string;
    component: string;
    frontMatter: FrontMatter;
  }>;
  generatedAt: string;
}

// ==================== 工具函数 ====================
function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^./, (chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
}

// function toKebabCase(str: string): string {
//   return str
//     .replace(/([a-z])([A-Z])/g, "$1-$2")
//     .replace(/[\s_]+/g, "-")
//     .toLowerCase();
// }

// function escapeTemplateLiteral(content: string): string {
//   return content
//     .replace(/\\/g, "\\\\")
//     .replace(/`/g, "\\`")
//     .replace(/\${/g, "\\${")
//     .replace(/\r\n/g, "\n");
// }

// ==================== 插件主类 ====================
class MarkdownProcessor {
  private options: Required<MdToRoutePluginOptions>;

  constructor(options: MdToRoutePluginOptions) {
    this.options = {
      routePrefix: "/blog",
      devVirtualModule: true,
      pattern: "**/*.md",
      markdownOptions: {},
      ...options,
    };
  }

  // 扫描并读取所有 Markdown 文件
  async scanMarkdownFiles(): Promise<MarkdownFile[]> {
    const pattern = path.join(this.options.contentDir, this.options.pattern);
    const files = await glob(pattern, { ignore: ["**/node_modules/**"] });

    const markdownFiles: MarkdownFile[] = [];

    for (const filePath of files) {
      try {
        const relativePath = path.relative(this.options.contentDir, filePath);
        const slug = this.extractSlug(relativePath);

        const content = await fs.readFile(filePath, "utf-8");
        const { data: frontMatter, content: markdownContent } = matter(content);

        // 验证必要字段
        if (!frontMatter.title) {
          console.warn(`⚠️  文件 ${filePath} 缺少 title 字段`);
          frontMatter.title = slug;
        }

        if (!frontMatter.date) {
          console.warn(`⚠️  文件 ${filePath} 缺少 date 字段`);
          frontMatter.date = new Date().toISOString().split("T")[0];
        }

        markdownFiles.push({
          slug,
          filePath,
          frontMatter: frontMatter as FrontMatter,
          content: markdownContent,
        });
      } catch (error) {
        console.error(`❌ 读取文件失败 ${filePath}:`, error);
      }
    }

    // 按日期排序
    return markdownFiles.sort(
      (a, b) =>
        new Date(b.frontMatter.date).getTime() -
        new Date(a.frontMatter.date).getTime(),
    );
  }

  // 从文件路径提取 slug
  private extractSlug(filePath: string): string {
    const relative = path.relative(this.options.contentDir, filePath);
    const dirname = path.dirname(relative);
    const basename = path.basename(filePath, ".md");

    // 如果文件在子目录中，将目录名包含在 slug 中
    if (dirname !== ".") {
      return `${dirname}/${basename}`;
    }

    return basename;
  }

  // 将 Markdown 转换为 TSX 组件
  async convertToTsx(markdownFile: MarkdownFile): Promise<string> {
    const componentName = `Post${toPascalCase(markdownFile.slug.replace(/[/-]/g, "_"))}`;
    // const routePath = `${this.options.routePrefix}/${markdownFile.slug}`;

    // 转换 Markdown 为 MDX
    const mdxCode = await compile(markdownFile.content, {
      outputFormat: "function-body",
      development: false,
      remarkPlugins: [
        remarkGfm,
        ...(this.options.markdownOptions?.remarkPlugins || []),
      ],
      rehypePlugins: [
        rehypeHighlight,
        ...(this.options.markdownOptions?.rehypePlugins || []),
      ],
    });

    return `
// =============================================
// 自动生成的文件，请勿手动编辑！
// 源文件: ${markdownFile.filePath}
// 生成时间: ${new Date().toISOString()}
// =============================================

import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Link } from 'react-router-dom'
import '../styles/markdown.css'

// Front Matter 数据
export const frontMatter = ${JSON.stringify(markdownFile.frontMatter, null, 2)}

// MDX 内容组件
const MDXContent = ${mdxCode.value}

// 自定义 MDX 组件
const mdxComponents = {
  h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
  h3: (Props: any) => <h3 className="text-2xl font-semibold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="my-4 leading-relaxed" {...props} />,
  a: ({ href, children, ...props }: any) => {
    const isInternal = href?.startsWith('/') || href?.startsWith('#')
    
    if (isInternal) {
      return (
        <Link to={href || '#'} className="text-blue-600 hover:underline" {...props}>
          {children}
        </Link>
      )
    }
    
    return (
      <a 
        href={href} 
        className="text-blue-600 hover:underline"
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  },
  code: ({ className, children, ...props }: any) => {
    const isInline = !className?.includes('language-')
    
    return isInline ? (
      <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm" {...props}>
        {children}
      </code>
    ) : (
      <pre className="my-4 p-4 rounded-lg overflow-auto bg-gray-900 text-gray-100">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    )
  },
  // 可以继续添加更多自定义组件...
}

// 主组件
export default function ${componentName}() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 文章头部 */}
      <header className="mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          {frontMatter.title}
        </h1>
        
        <div className="mt-6 flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
          <time dateTime={frontMatter.date}>
            {new Date(frontMatter.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          
          {frontMatter.tags && frontMatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {frontMatter.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {frontMatter.description && (
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
            {frontMatter.description}
          </p>
        )}
      </header>
      
      {/* 文章内容 */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXProvider components={mdxComponents}>
          <MDXContent />
        </MDXProvider>
      </div>
      
      {/* 文章底部 */}
      <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          本文发布于 {frontMatter.date} • 由 Markdown 自动生成
        </p>
      </footer>
    </article>
  )
}

// 页面元数据（供 React Router 使用）
export const meta = () => [
  { title: \`\${frontMatter.title} | 我的博客\` },
  { name: 'description', content: frontMatter.description || frontMatter.title },
  { property: 'og:title', content: frontMatter.title },
  { property: 'og:description', content: frontMatter.description || frontMatter.title },
  { property: 'article:published_time', content: frontMatter.date },
  ...(frontMatter.tags || []).map((tag: string) => ({
    property: 'article:tag',
    content: tag
  }))
]
`;
  }

  // 生成路由清单
  async generateRouteManifest(files: MarkdownFile[]): Promise<RouteManifest> {
    const routes = files.map((file) => ({
      slug: file.slug,
      path: `${this.options.routePrefix}/${file.slug}`,
      component: `Post${toPascalCase(file.slug.replace(/[/-]/g, "_"))}`,
      frontMatter: file.frontMatter,
    }));

    return {
      routes,
      generatedAt: new Date().toISOString(),
    };
  }

  // 生成索引文件的辅助方法
  async generateIndexFile(files: MarkdownFile[], outputDir: string) {
    const imports = files
      .map((file) => {
        const componentName = `Post${toPascalCase(file.slug.replace(/[/-]/g, "_"))}`;
        const fileName = `blog.${file.slug.replace(/\//g, ".")}`;
        return `import ${componentName}, { frontMatter as ${componentName}FrontMatter } from './${fileName}'`;
      })
      .join("\n");

    const exports = files
      .map((file) => {
        const componentName = `Post${toPascalCase(file.slug.replace(/[/-]/g, "_"))}`;
        return `  ${componentName},
  ${componentName}FrontMatter`;
      })
      .join(",\n");

    const allPosts = files.map((file) => ({
      slug: file.slug,
      componentName: `Post${toPascalCase(file.slug.replace(/[/-]/g, "_"))}`,
      frontMatter: file.frontMatter,
    }));

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
`;

    await fs.writeFile(path.join(outputDir, "index.ts"), indexContent, "utf-8");
  }

  // 3. 生成虚拟模块代码的方法
    generateVirtualModuleCode(slug: string, frontMatter: any, mdxCode: string,): string {
      // 关键：确保代码是有效的JSX/TSX
      // 1. 导入React（必需）
      // 2. 使用正确的JSX语法
      // 3. 避免语法错误
      
      return `// =============================================
// 虚拟模块: ${slug}
// 生成时间: ${new Date().toISOString()}
// =============================================

import React from 'react'
import { MDXProvider } from '@mdx-js/react'
// import './markdown.css'

// Front Matter数据
export const frontMatter = ${JSON.stringify(frontMatter, null, 2)}

// MDX编译结果 MDXContent
const MDXContent = \`${mdxCode}\`

// 自定义MDX组件
const mdxComponents = {
  // 标题组件
  h1: (props) => React.createElement('h1', {
    className: 'text-3xl font-bold my-4 text-gray-900 dark:text-white'
  }, props.children),
  
  h2: (props) => React.createElement('h2', {
    className: 'text-2xl font-semibold my-3 text-gray-800 dark:text-gray-200'
  }, props.children),
  
  // 段落
  p: (props) => React.createElement('p', {
    className: 'my-2 leading-relaxed text-gray-700 dark:text-gray-300'
  }, props.children),
  
  // 链接
  a: (props) => {
    const isInternal = props.href?.startsWith('/') || props.href?.startsWith('#')
    
    if (isInternal) {
      return React.createElement('a', {
        href: props.href,
        className: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline',
        ...props
      }, props.children)
    }
    
    return React.createElement('a', {
      href: props.href,
      className: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline',
      target: '_blank',
      rel: 'noopener noreferrer',
      ...props
    }, props.children)
  },
  
  // 内联代码
  code: (props) => {
    const isInline = !props.className?.includes('language-')
    
    if (isInline) {
      return React.createElement('code', {
        className: 'px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-gray-800 dark:text-gray-200',
        ...props
      }, props.children)
    }
    
    return React.createElement('pre', {
      className: 'my-3 p-3 bg-gray-900 text-gray-100 rounded overflow-auto'
    }, 
      React.createElement('code', {
        className: props.className,
        ...props
      }, props.children)
    )
  },
  
  // 引用
  blockquote: (props) => React.createElement('blockquote', {
    className: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-3 text-gray-600 dark:text-gray-400'
  }, props.children),
  
  // 列表
  ul: (props) => React.createElement('ul', {
    className: 'list-disc pl-5 my-3 space-y-1'
  }, props.children),
  
  ol: (props) => React.createElement('ol', {
    className: 'list-decimal pl-5 my-3 space-y-1'
  }, props.children),
  
  li: (props) => React.createElement('li', {
    className: 'my-1'
  }, props.children),
  
  // 图片
  img: (props) => React.createElement('img', {
    ...props,
    className: 'max-w-full h-auto rounded my-4',
    loading: 'lazy'
  })
}

// 主组件
export default function PostContent() {
  return React.createElement(
    'article',
    { className: 'max-w-3xl mx-auto px-4 py-6' },
    // 文章头部
    React.createElement(
      'header',
      { className: 'mb-6 pb-4 border-b border-gray-200 dark:border-gray-700' },
      [
        React.createElement(
          'h1',
          { 
            key: 'title',
            className: 'text-3xl font-bold text-gray-900 dark:text-white mb-3'
          },
          frontMatter.title
        ),
        React.createElement(
          'div',
          { 
            key: 'meta',
            className: 'flex items-center text-gray-500 dark:text-gray-400 text-sm'
          },
          [
            React.createElement(
              'time',
              { 
                key: 'date',
                dateTime: frontMatter.date
              },
              new Date(frontMatter.date).toLocaleDateString('zh-CN')
            ),
            frontMatter.tags && frontMatter.tags.length > 0 && React.createElement(
              'div',
              { key: 'tags', className: 'ml-4 flex flex-wrap gap-2' },
              frontMatter.tags.map((tag, index) => 
                React.createElement(
                  'span',
                  { 
                    key: index,
                    className: 'px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs'
                  },
                  '#' + tag
                )
              )
            )
          ]
        ),
        frontMatter.description && React.createElement(
          'p',
          { 
            key: 'description',
            className: 'mt-4 text-gray-600 dark:text-gray-300'
          },
          frontMatter.description
        )
      ]
    ),
    // 文章内容
    React.createElement(
      'div',
      { className: 'prose dark:prose-invert max-w-none' },
      React.createElement(
        MDXProvider,
        { components: mdxComponents },
        // React.createElement(MDXContent)
        MDXContent
      )
    ),
    // 文章底部
    React.createElement(
      'footer',
      { 
        className: 'mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500'
      },
      '开发模式 • 最后更新: ' + new Date().toLocaleTimeString()
    )
  )
}

// React Router v7 meta函数
export function meta() {
  return [
    { title: \`\${frontMatter.title} | 我的博客（开发模式）\` },
    { name: 'description', content: frontMatter.description || frontMatter.title }
  ]
}
`
    }

    // 4. 错误处理模块
    generateErrorModule(slug: string, error: any): string {
      return `
import React from 'react'

export default function ErrorPost() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-red-700 mb-3">
          加载文章失败
        </h2>
        <p className="text-red-600 mb-2">
          无法加载文章: <strong>${slug}</strong>
        </p>
        <p className="text-sm text-gray-600">
          错误信息: ${error instanceof Error ? error.message : String(error)}
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>可能的原因:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Markdown文件不存在</li>
            <li>文件路径错误</li>
            <li>文件权限问题</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export const frontMatter = {
  title: '加载失败',
  date: new Date().toISOString().split('T')[0]
}

export const meta = () => [
  { title: '文章加载失败 | 我的博客' }
]
`;
    }
}

// ==================== Vite 插件实现 ====================
export function mdToRoutePlugin(options: MdToRoutePluginOptions): Plugin {
  let processor: MarkdownProcessor;
  // let config: ResolvedConfig;
  let isBuild = false;

  // 虚拟模块 ID 前缀
  const VIRTUAL_MODULE_PREFIX = "virtual:md-content/";
  const RESOLVED_VIRTUAL_MODULE_PREFIX = "\0" + VIRTUAL_MODULE_PREFIX;

  return {
    name: "vite-plugin-md-to-route",

    // 插件配置解析完成时
    configResolved(resolvedConfig) {
      // config = resolvedConfig;
      isBuild = resolvedConfig.command === "build";
      processor = new MarkdownProcessor(options);

      console.log(
        `📝 ${isBuild ? "构建" : "开发"}模式: Markdown 路由插件已启用`,
      );
      // console.log(`  内容目录: ${options.contentDir}`);
      // console.log(`  输出目录: ${options.outputDir}`);
    },

    // 构建开始时
    async buildStart() {
      if (!isBuild) return;

      console.log("🔨 开始处理 Markdown 文件...");

      try {
        // 1. 扫描所有 Markdown 文件
        const markdownFiles = await processor.scanMarkdownFiles();
        console.log(`  找到 ${markdownFiles.length} 个 Markdown 文件`);

        // 2. 确保输出目录存在
        const outputDir = path.resolve(options.outputDir);
        await fs.mkdir(outputDir, { recursive: true });

        // 3. 为每个文件生成组件
        for (const file of markdownFiles) {
          const tsxContent = await processor.convertToTsx(file);
          const fileName = `blog.${file.slug.replace(/\//g, ".")}.tsx`;
          const outputPath = path.join(outputDir, fileName);

          await fs.writeFile(outputPath, tsxContent, "utf-8");
          console.log(`   ✅ 生成: ${fileName}`);
        }

        // 4. 生成路由清单
        const manifest = await processor.generateRouteManifest(markdownFiles);
        const manifestPath = path.join(outputDir, "__manifest.json");
        await fs.writeFile(
          manifestPath,
          JSON.stringify(manifest, null, 2),
          "utf-8",
        );

        // 5. 生成索引文件
        await processor.generateIndexFile(markdownFiles, outputDir);

        console.log("🎉 Markdown 处理完成！");
      } catch (error) {
        console.error("❌ Markdown 处理失败:", error);
        throw error;
      }
    },

    // 开发服务器配置
    configureServer(server) {
      if (!options.devVirtualModule) return;

      console.log(`👀 vite-plugin-md-to-route@开发模式: 启用虚拟模块和文件监听`);

      // 监听 content 目录变化
      const watcher = server.watcher;
      const contentDir = path.resolve(options.contentDir);

      watcher.add(contentDir);

      watcher.on("change", async (filePath) => {
        if (filePath.includes(contentDir) && filePath.endsWith(".md")) {
          console.log(
            `📄 Markdown 文件更新: ${path.relative(contentDir, filePath)}`,
          );

          // 清除相关虚拟模块的缓存
          const relativePath = path.relative(contentDir, filePath);
          const slug = relativePath.replace(/\.md$/, "").replace(/\\/g, "/");
          const virtualModuleId = `${VIRTUAL_MODULE_PREFIX}${slug}`;

          const module = server.moduleGraph.getModuleById(virtualModuleId);
          if (module) {
            server.moduleGraph.invalidateModule(module);
          }

          // 通知客户端更新
          server.ws.send({
            type: "full-reload",
            path: "*",
          });
        }
      });
    },

    // 解析虚拟模块 ID
    resolveId(id: string) {
      // console.log(id);
      if (id.startsWith(VIRTUAL_MODULE_PREFIX)) {
        // console.log(
        //   "解析虚拟模块 ID: " +
        //     RESOLVED_VIRTUAL_MODULE_PREFIX +
        //     id.slice(VIRTUAL_MODULE_PREFIX.length),
        // );
        const slug = id.slice(VIRTUAL_MODULE_PREFIX.length);
        return `${RESOLVED_VIRTUAL_MODULE_PREFIX}${slug}.tsx`;
      }
      // 处理带.tsx扩展名的二次请求（某些情况下Vite会再次请求）
      if (id.startsWith(RESOLVED_VIRTUAL_MODULE_PREFIX)) {
        return id;
      }

      // return null;
    },

    // 加载虚拟模块（开发时使用）
    async load(id: string) {
      if (!id.startsWith(RESOLVED_VIRTUAL_MODULE_PREFIX)) return null;
      // console.log("虚拟模块 ID: " + id);
      if (!options.devVirtualModule) {
        return "export default () => <div>开发虚拟模块已禁用</div>";
      }

      // 提取slug：去掉前缀和.tsx扩展名
      const slugWithExt = id.slice(RESOLVED_VIRTUAL_MODULE_PREFIX.length);
      const slug = slugWithExt.replace(/\.tsx$/, "");

      const filePath = path.resolve(options.contentDir, `${slug}.md`);

      try {
        // 读取Markdown文件
        const rawContent = await fs.readFile(filePath, "utf-8");

        // 使用gray-matter解析Front Matter和内容
        const { data: frontMatter, content: markdownContent } =
          matter(rawContent);

        // 验证必要字段
        if (!frontMatter.title) {
          frontMatter.title = slug;
        }

        if (!frontMatter.date) {
          frontMatter.date = new Date().toISOString().split("T")[0];
        }

        // // 将Markdown编译为MDX
        // const mdxCompiled = await compile(markdownContent, {
        //   outputFormat: "function-body",
        //   development: !isBuild, // 开发模式
        //   remarkPlugins: [remarkGfm],
        //   rehypePlugins: [rehypeHighlight],
        // });

        // 3. 生成虚拟模块的代码
        return processor.generateVirtualModuleCode(
          slug,
          frontMatter,
          markdownContent,
        );
      } catch (error) {
        // 文件不存在或其他错误
        console.error(`❌ 加载虚拟模块失败: ${slug}`, error)
        return processor.generateErrorModule(slug, error);
      }
    },
    
  };
}
