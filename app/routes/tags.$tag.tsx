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
                        <TextJitter className="border-primary! bg-modalBlack grid min-h-full grid-rows-[auto_1fr_auto] border-4 border-double">
                            {/* Header */}
                            <div className="border-primary/30 border-b-2 border-dashed bg-black/20 p-4">
                                <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_TAG_QUERY']"></div>
                                <div className="text-primary text-xl font-black tracking-widest uppercase">
                                    <span className="mr-2 text-white/50">{`>>`}</span>
                                    SEARCH_RESULTS:{' '}
                                    <span className="text-secondary">
                                        #{tag}
                                    </span>
                                </div>
                                <div className="mt-2 font-mono text-xs text-white/40">
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
                                                className="group hover:border-primary hover:bg-primary/10 relative flex flex-col border border-dashed border-white/20 bg-white/5 p-4 transition-all"
                                            >
                                                {/* Card Header */}
                                                <div className="mb-2 flex items-center justify-between text-[10px] text-white/40">
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
                                                <h3 className="group-hover:text-primary mb-2 line-clamp-2 text-lg font-bold text-white transition-colors">
                                                    {post.frontMatter.title}
                                                </h3>

                                                {/* Description */}
                                                {post.frontMatter
                                                    .description && (
                                                    <p className="mb-4 line-clamp-3 flex-grow font-mono text-xs text-white/60">
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
                                                                        : 'text-white/50'
                                                                }`}
                                                            >
                                                                #{t}
                                                            </span>
                                                        )
                                                    )}
                                                </div>

                                                {/* Corner accents */}
                                                <div className="group-hover:border-primary absolute top-0 left-0 h-2 w-2 border-t border-l border-white/20 transition-colors"></div>
                                                <div className="group-hover:border-primary absolute right-0 bottom-0 h-2 w-2 border-r border-b border-white/20 transition-colors"></div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-full flex flex-col items-center justify-center border border-dashed border-white/5 py-16 text-white/30">
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
                            <div className="border-primary/30 flex justify-between border-t border-dashed bg-black/20 p-2 px-4 text-[10px] text-white/40 uppercase">
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
