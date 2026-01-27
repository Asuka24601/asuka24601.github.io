import type { ReactNode } from 'react'
import mdxComponents from '../components/mdxComponent'
import { MDXProvider } from '@mdx-js/react'

type Tags = string[]

export default function AriticleContene({
    children,
    className,
    id,
}: {
    children: ReactNode
    className?: string | undefined
    id?: string
}) {
    return (
        <main
            id={id}
            className={`prose dark:prose-invert max-w-none font-serif ${className || ''}`}
        >
            <MDXProvider components={mdxComponents}>{children}</MDXProvider>
        </main>
    )
}

export function AriticleHeader({
    title,
    author,
    date,
    description,
    className,
    style,
}: {
    title: string
    author: string
    date: string
    description?: string
    className?: string | undefined
    style?: React.CSSProperties | undefined
}) {
    return (
        <header
            className={`${className || ''} flex flex-col justify-center gap-5 text-center`}
            style={style}
        >
            <h1 className="after:animate-blink text-base-100 after:bg-base-100 relative text-7xl text-shadow-2xs after:ml-2.5 after:inline-block after:h-1 after:w-5">
                <strong>{title}</strong>
            </h1>

            <div className="text-base-200 flex justify-center text-sm text-shadow-xs">
                <span className="first-letter:uppercase">
                    <strong>{author}</strong>
                </span>
                <div className="bg-base-100/75 static mx-3 block h-5 w-0.5"></div>
                <time dateTime={date}>
                    <strong>
                        {new Date(date).toLocaleDateString('zh-CN')}
                    </strong>
                </time>
            </div>
            {description && (
                <p className="text-base-100 text-shadow-2xs">
                    <strong>{description}</strong>{' '}
                </p>
            )}
        </header>
    )
}

export function AriticleFooter({ tags }: { tags: Tags }) {
    return (
        <footer className="flex flex-col gap-3 py-4 text-sm text-gray-500">
            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <span className={`after:content-[':']`}>标签</span>
                    {tags.map((tag: string, index: number) => (
                        <span
                            key={index}
                            className="rounded px-2 py-0.5 text-xs text-teal-50"
                            style={{
                                background: `color-mix(in srgb, var(--color-primary), white)`,
                            }}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
            <p>
                {import.meta.env.DEV ? '开发模式' : '发表模式'} • 最后更新:{' '}
                {new Date().toLocaleTimeString()}
            </p>
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
