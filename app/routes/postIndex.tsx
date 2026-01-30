import { NavLink, useNavigation } from 'react-router'
import { timeToString } from '../lib/utils'
import { useEffect } from 'react'
import ProgressiveImage from '../components/progressiveImage'
import RouteManifest from '../contents/__manifest.json'
import CRTOverlay from '../components/effect/CRTOverlay'
import TextJitter from '../components/effect/textJitter'

export default function PostIndex() {
    const { generatedAt: lastUpdateDate, routes: posts } = RouteManifest
    const navigation = useNavigation()

    // 监听导航状态，在开始加载新内容时（内容变更前）立即滚动到顶部
    useEffect(() => {
        if (navigation.state === 'loading') {
            window.scrollTo({
                top: 0,
                behavior: 'instant',
            })
        }
    }, [navigation.state])

    return (
        <div className="mx-auto w-full max-w-6xl font-mono text-sm">
            <div
                className="border-terminal transition-all duration-500"
                style={{
                    border: 'none',
                    background: 'none',
                    padding: '0',
                    marginTop: 'var(--navbar-height)',
                }}
            >
                <CRTOverlay />
                <TextJitter>
                    <div className="border-primary bg-modalBlack relative flex flex-col overflow-hidden border-4 border-double">
                        {/* Header */}
                        <div className="border-primary/30 flex items-end justify-between border-b-2 border-dashed bg-black/20 p-4">
                            <div>
                                <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_DATABASE_ACCESS']"></div>
                                <div className="text-primary text-2xl font-black tracking-widest uppercase before:content-['SELECT\_*\_FROM\_POSTS']"></div>
                            </div>
                            <div className="hidden text-right sm:block">
                                <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['LAST\_UPDATE']">
                                    {' '}
                                </div>
                                <div className="text-warning text-xs">
                                    {
                                        timeToString(lastUpdateDate as string)
                                            .dateTime
                                    }
                                </div>
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex flex-col">
                            {posts.map((item) => (
                                <div
                                    key={item.frontMatter.title}
                                    className="group relative border-b border-dashed border-white/10 p-4 transition-all hover:bg-white/5"
                                >
                                    {/* Hover Indicator */}
                                    <div className="bg-primary absolute top-0 bottom-0 left-0 w-1 opacity-0 transition-opacity group-hover:opacity-100"></div>

                                    <div className="flex gap-6">
                                        {/* Content */}
                                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                                            {/* Meta Header */}
                                            <div className="flex items-center gap-3 text-[10px] text-white/50">
                                                <span className="text-primary">
                                                    [
                                                    {
                                                        timeToString(
                                                            item.frontMatter
                                                                .date
                                                        ).date
                                                    }
                                                    ]
                                                </span>
                                                <span className="h-3 w-px bg-white/20"></span>
                                                <span className="uppercase before:content-['AUTH:_']">
                                                    {item.frontMatter.author}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h2 className="group-hover:text-warning text-xl font-bold tracking-wide text-white transition-colors">
                                                <NavLink
                                                    to={item.path}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span className="text-primary/50 -ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100">{`>`}</span>
                                                    {item.frontMatter.title}
                                                </NavLink>
                                            </h2>

                                            {/* Description */}
                                            <p className="line-clamp-2 text-xs leading-relaxed text-white/70">
                                                {item.frontMatter.description}
                                            </p>

                                            {/* Footer: Tags */}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {item.frontMatter.tags?.map(
                                                    (tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-secondary group-hover:border-secondary/30 border border-white/10 bg-black/20 px-1.5 py-0.5 text-[10px] transition-colors before:content-['#']"
                                                        >
                                                            {tag}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Image (Optional) */}
                                        {item.frontMatter.cover && (
                                            <div className="hidden w-32 shrink-0 sm:block">
                                                <div className="group-hover:border-primary/30 border border-white/10 bg-black/40 p-1 transition-colors">
                                                    <div className="relative aspect-video w-full overflow-hidden grayscale transition-all duration-500 group-hover:grayscale-0">
                                                        <ProgressiveImage
                                                            src={
                                                                item.frontMatter
                                                                    .cover
                                                            }
                                                            alt={
                                                                item.frontMatter
                                                                    .title
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                        {/* Scanline effect overlay for image */}
                                                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,2px_100%] opacity-20"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="border-primary/30 flex items-center justify-between border-t border-dashed bg-black/20 p-2 px-4 text-[10px] text-white/40 uppercase">
                            <span className="before:content-['TOTAL\_ENTRIES:_']">
                                {posts.length}
                            </span>
                            <span className="animate-pulse after:content-['\_END\_OF\_STREAM']"></span>
                        </div>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
