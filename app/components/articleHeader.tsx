import type { FrontMatter } from '../interfaces/post'

export default function AriticleHeader(frontMatter: FrontMatter) {
    return (
        <header className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
            <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
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
                                className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
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
