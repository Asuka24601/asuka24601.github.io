/* eslint-disable react-refresh/only-export-components */
import CRTOverlay from '../components/effect/CRTOverlay'
import TextJitter from '../components/effect/textJitter'
import type { Route } from './+types/tags.$tag'
import { searchService } from '../lib/search'
import { Link } from 'react-router'
import { timeToString } from '../lib/utils'

export function clientLoader({ params }: Route.ClientLoaderArgs) {
    return {
        tag: params.tag,
    }
}

export default function PostList({ loaderData }: Route.ComponentProps) {
    const tag = loaderData.tag

    const posts = searchService.search('', [tag])

    return (
        <>
            <div className="mx-auto min-h-screen w-full">
                <div className="border-terminal mx-auto grid min-h-[inherit] max-w-6xl overflow-visible! border-none! p-4 lg:p-6">
                    <div className="min-h-full w-full pt-(--navbar-height) transition-transform duration-500">
                        <CRTOverlay />
                        <TextJitter className="border-neutral! bg-base-200 grid min-h-full grid-rows-[auto_1fr_auto] border-4 border-double">
                            {/* Header */}
                            <div className="border-neutral/30 bg-base-100/20 border-b-2 border-dashed p-4">
                                <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_TAG_QUERY']"></div>
                                <div className="text-primary text-xl font-black tracking-widest uppercase">
                                    <span className="text-base-content/50 mr-2">{`>>`}</span>
                                    SEARCH_RESULTS:{' '}
                                    <span className="text-secondary">
                                        #{tag}
                                    </span>
                                </div>
                                <div className="text-base-content/40 mt-2 font-mono text-xs">
                                    FOUND {posts.length} ENTRIES
                                </div>
                            </div>

                            <div className="contents">
                                {/* Results Grid */}
                                <div className="grid h-fit gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {posts.length > 0 ? (
                                        posts.map((post) => (
                                            <Link
                                                key={post.slug}
                                                to={'/posts/' + post.path}
                                                className="group hover:border-neutral hover:bg-primary/10 border-neutral/20 bg-primary/5 relative flex flex-col border border-dashed p-4 transition-all"
                                            >
                                                {/* Card Header */}
                                                <div className="text-base-content/40 mb-2 flex items-center justify-between text-[10px]">
                                                    <span className="font-mono">
                                                        [
                                                        {
                                                            timeToString(
                                                                post.frontMatter
                                                                    .date
                                                            ).date
                                                        }
                                                        ]
                                                    </span>
                                                    <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                                        OPEN_FILE
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className="group-hover:text-primary text-base-content mb-2 line-clamp-2 text-lg font-bold transition-colors">
                                                    {post.frontMatter.title}
                                                </h3>

                                                {/* Description */}
                                                {post.frontMatter
                                                    .description && (
                                                    <p className="text-base-content/60 mb-4 line-clamp-3 grow font-mono text-xs">
                                                        {
                                                            post.frontMatter
                                                                .description
                                                        }
                                                    </p>
                                                )}

                                                {/* Tags */}
                                                <div className="mt-auto flex flex-wrap gap-2 border-t border-dashed border-white/10 pt-2">
                                                    {post.frontMatter.tags?.map(
                                                        (t) => (
                                                            <span
                                                                key={t}
                                                                className={`text-[10px] opacity-70 ${
                                                                    t === tag
                                                                        ? 'text-secondary font-bold'
                                                                        : 'text-base-content/50'
                                                                }`}
                                                            >
                                                                #{t}
                                                            </span>
                                                        )
                                                    )}
                                                </div>

                                                {/* Corner accents */}
                                                <div className="group-hover:border-neutral border-neutral/20 absolute top-0 left-0 h-2 w-2 border-t border-l transition-colors"></div>
                                                <div className="group-hover:border-neutral border-neutral/20 absolute right-0 bottom-0 h-2 w-2 border-r border-b transition-colors"></div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-base-content/30 col-span-full flex flex-col items-center justify-center border border-dashed border-white/5 py-16">
                                            <div className="mb-4 text-6xl font-black opacity-10">
                                                404
                                            </div>
                                            <div className="font-mono text-sm tracking-widest uppercase">
                                                &lt; NO_DATA_FOUND_FOR_TAG /&gt;
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-neutral/30 text-base-content/40 bg-base-200/20 flex justify-between border-t border-dashed p-2 px-4 text-[10px] uppercase">
                                <span>STATUS: READY</span>
                                <span className="animate-pulse">_</span>
                            </div>
                        </TextJitter>
                    </div>
                </div>
            </div>
        </>
    )
}
