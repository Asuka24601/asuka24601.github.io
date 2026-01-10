import type { ReactNode } from 'react'
import mdxComponents from '../components/mdxComponent'
import { MDXProvider } from '@mdx-js/react'
import type { FrontMatter } from '../interfaces/post'

export default function AriticleContene({
    children,
    className,
}: {
    children: ReactNode
    className?: string | undefined
}) {
    return (
        <main className={'prose dark:prose-invert max-w-none ' + className}>
            <MDXProvider components={mdxComponents}>{children}</MDXProvider>
        </main>
    )
}

export function AriticleHeader({ frontMatter }: { frontMatter: FrontMatter }) {
    return (
        <header className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
            <h1 className="after:animate-blink relative mb-3 text-3xl font-bold text-gray-900 after:ml-2.5 after:inline-block after:h-1 after:w-5 after:bg-gray-900 dark:text-white">
                {frontMatter.title}
            </h1>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={frontMatter.date}>
                    {new Date(frontMatter.date).toLocaleDateString('zh-CN')}
                </time>

                {frontMatter.tags && frontMatter.tags.length > 0 && (
                    <div className="ml-4 flex flex-wrap gap-2">
                        {frontMatter.tags.map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="bg-info rounded px-2 py-0.5 text-xs text-teal-50 dark:bg-gray-800"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {frontMatter.description && (
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {frontMatter.description}
                </p>
            )}
        </header>
    )
}

export function AriticleFooter() {
    return (
        <footer className="mt-8 border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-700">
            {import.meta.env.DEV ? '开发模式' : '发表模式'} • 最后更新:{' '}
            {new Date().toLocaleTimeString()}
        </footer>
    )
}

export function ArticleError({ slug }: { slug: string }) {
    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                <h2 className="mb-3 text-2xl font-bold text-red-700">
                    加载文章失败
                </h2>
                <p className="mb-2 text-red-600">
                    无法加载文章: <strong>{slug}</strong>
                </p>
                <div className="mt-4 text-sm text-gray-500">
                    <p>可能的原因:</p>
                    <ul className="mt-2 list-disc pl-5">
                        <li>Markdown文件不存在</li>
                        <li>文件路径错误</li>
                        <li>文件权限问题</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
