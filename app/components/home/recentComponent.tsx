import type { RouteManifest } from '../../interfaces/post'
import { timeToString } from '../../lib/utils'
import SvgIcon from '../SvgIcon'
import { Link } from 'react-router'
import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'

export default function RecentComponent({
    className,
    recentData,
    count,
}: {
    className?: string | undefined
    recentData: RouteManifest
    count: number
}) {
    const recentPosts = recentData.routes
        .sort((b, a) => {
            const da = new Date(a.frontMatter.date).getTime()
            const db = new Date(b.frontMatter.date).getTime()
            return da - db
        })
        .slice(0, count)

    return (
        <div className={`w-full font-mono text-sm ${className || ''}`}>
            <div className="border-terminal">
                <CRTOverlay />
                <TextJitter>
                    {/* Header */}
                    <div className="border-primary/30 mb-4 flex items-end justify-between border-b-2 border-dashed pb-2">
                        <div>
                            <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_SYSTEM_UPDATE']"></div>
                            <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['RECENT\_LOGS']"></div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['STATUS']"></div>
                            <div className="text-warning animate-pulse text-xs opacity-70 before:content-['ONLINE']"></div>
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-2">
                        {recentPosts.map((item, index) => {
                            const t = timeToString(item.frontMatter.date)
                            return (
                                <div
                                    key={index}
                                    className="group border-b border-dashed border-white/10 p-2 pb-2 transition-colors last:border-0 hover:bg-white/5"
                                >
                                    <div className="mb-1 flex items-baseline gap-2 text-[10px] opacity-50">
                                        <span className="text-success/90 before:content-['['] after:content-[']']">
                                            {t.date}
                                        </span>
                                        <span className="text-white/30">
                                            {t.time}
                                        </span>
                                        <span className="font-mono text-white/30 before:content-['LOG_ID:']">
                                            {(index + 1)
                                                .toString()
                                                .padStart(3, '0')}
                                        </span>
                                    </div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex w-full flex-col gap-1">
                                            <Link
                                                to={`posts/${item.path}`}
                                                className="text-success/80 hover:text-success block truncate font-bold tracking-wide uppercase transition-colors"
                                            >
                                                <span className="text-primary/50 mr-2 select-none">{`>`}</span>
                                                {item.frontMatter.title}
                                            </Link>
                                            <div className="line-clamp-2 pl-4 text-xs text-white/60">
                                                {item.frontMatter.description}
                                            </div>
                                        </div>
                                        <Link
                                            to={`posts/${item.path}`}
                                            target="_blank"
                                            className="text-success shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <SvgIcon name="openNew" size={14} />
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="text-base-100 mt-4 text-[10px] opacity-50">
                        <span className="uppercase before:content-['>>_END_OF_TRANSMISSION']"></span>
                        <span className="ml-1 animate-pulse before:content-['\_']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
