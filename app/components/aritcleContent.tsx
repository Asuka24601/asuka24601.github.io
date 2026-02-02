import type { ReactNode } from 'react'
import mdxComponents from '../components/mdxComponent'
import { MDXProvider } from '@mdx-js/react'
import CRTOverlay from './effect/CRTOverlay'
import TextJitter from './effect/textJitter'
import { TagItemComponent } from './home/tagsComponent'
import { timeToString } from '../lib/utils'

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
            <h1 className="after:animate-blink text-base-content after:bg-base-content relative text-7xl text-shadow-2xs after:ml-2.5 after:inline-block after:h-1 after:w-5">
                <strong>{title}</strong>
            </h1>

            <div className="text-base-content flex justify-center text-sm text-shadow-xs">
                <span className="first-letter:uppercase">
                    <strong>{author}</strong>
                </span>
                <div className="bg-base-content/75 static mx-3 block h-5 w-0.5"></div>
                <time dateTime={date}>
                    <strong>
                        {new Date(date).toLocaleDateString('zh-CN')}
                    </strong>
                </time>
            </div>
            {description && (
                <p className="text-base-content text-shadow-2xs">
                    <strong>{description}</strong>
                </p>
            )}
        </header>
    )
}

export function AriticleFooter({ tags, time }: { tags: Tags; time?: string }) {
    return (
        <footer className="flex flex-col gap-3 py-4 text-sm text-gray-500">
            {tags && tags.length > 0 && (
                <div className="flex flex-row flex-wrap items-center gap-2">
                    <span className={`text-xs after:content-['TAGS:_']`}></span>
                    {tags.map((tag: string, index: number) => (
                        <TagItemComponent key={index} tag={{ name: tag }} />
                    ))}
                </div>
            )}
            <p>
                <span className="text-xs after:content-['_•_LAST\_MODIFIED:_']">
                    {import.meta.env.DEV ? 'DEV' : 'BUILD'}
                </span>
                <span className="text-accent">
                    {time
                        ? timeToString(time).time
                        : new Date().toLocaleDateString('zh-CN')}
                </span>
            </p>
        </footer>
    )
}

export function ArticleError({ slug }: { slug: string }) {
    return (
        <div className="mx-auto max-w-3xl px-4 py-8 font-mono text-sm">
            <div className="border-terminal">
                <CRTOverlay />
                <TextJitter>
                    <div className="border-neutral/30 bg-base-200 flex flex-col gap-6 border-2 border-double p-6 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                        {/* Header */}
                        <div className="border-neutral/30 flex items-end justify-between border-b-2 border-dashed pb-2">
                            <div>
                                <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_SYSTEM_ALERT']"></div>
                                <div className="text-warning text-xl font-black tracking-widest uppercase">
                                    END_OF_UNIVERSE
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-base-content text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['ERROR_CODE']"></div>
                                <div className="text-warning text-xl font-bold">
                                    404
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="py-2">
                            <div className="relative mb-6 text-center">
                                <div className="text-warning text-9xl font-black opacity-10 select-none">
                                    ∞
                                </div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                    <div className="bg-base-200/80 text-base-content px-4 text-lg font-bold tracking-widest uppercase backdrop-blur-sm">
                                        来到了宇宙的尽头
                                    </div>
                                    <div className="text-base-content/50 text-xs">
                                        TARGET_LOST: {slug}
                                    </div>
                                </div>
                            </div>

                            <div className="border-warning/50 text-base-content/80 border-l-2 bg-white/5 p-4 text-xs">
                                <p className="text-warning mb-2 font-bold uppercase">
                                    &gt;&gt; DIAGNOSTIC_REPORT:
                                </p>
                                <ul className="list-disc space-y-1 pl-5 font-mono">
                                    <li>Markdown_File_Not_Found</li>
                                    <li>Path_Coordinates_Invalid</li>
                                    <li>Permission_Denied</li>
                                </ul>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="border-neutral/30 text-base-content/40 flex items-center justify-between border-t border-dashed pt-4 text-[10px] uppercase">
                            <span className="animate-pulse">&gt; _</span>
                        </div>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
