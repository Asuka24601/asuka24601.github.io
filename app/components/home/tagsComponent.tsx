import type { CSSProperties } from 'react'
import type { TagDataInterface } from '../../interfaces/tags'
import { memo } from 'react'
import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'
import { Link } from 'react-router'

interface TagItem {
    name: string
    count?: number
}

export function TagItemComponent({
    tag,
    className,
    style,
}: {
    tag: TagItem
    className?: string | undefined
    style?: CSSProperties | undefined
}) {
    return (
        <Link to={`/tags/${tag.name}`}>
            <div
                className={`group hover:border-secondary relative flex cursor-pointer items-center gap-2 border border-solid border-white/10 bg-black/20 px-2 py-1 transition-all hover:bg-black/90 ${className}`}
            >
                {/* Chip decoration */}
                <div className="bg-secondary/50 group-hover:bg-secondary h-1.5 w-1.5 group-hover:animate-pulse"></div>

                <span
                    className="text-secondary/70 group-hover:text-secondary font-mono text-xs font-bold uppercase"
                    style={style}
                >
                    {tag.name}
                </span>
                {/* Tech decoration */}
                {tag.count && (
                    <span className="text-secondary/30 group-hover:text-secondary/50 font-mono text-[8px] before:content-['x']">
                        {tag.count}
                    </span>
                )}
            </div>
        </Link>
    )
}

function TagComponent({
    TagsData,
    className,
}: {
    TagsData: TagDataInterface
    className?: string | undefined
}) {
    const tags = TagsData.tags
    // const total = TagsData.total

    return (
        <div className={`w-full font-mono text-sm ${className || ''}`}>
            <div className="border-terminal">
                <CRTOverlay />
                <TextJitter>
                    {/* Header */}
                    <div className="border-primary/30 mb-4 flex items-end justify-between border-b-2 border-dashed pb-2">
                        <div>
                            <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_INDEXING']"></div>
                            <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['MEMORY\_BANKS']"></div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['CAPACITY']"></div>
                            <div className="text-warning text-xs opacity-70 after:content-['_UNITS']">
                                {tags.length}
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <TagItemComponent key={index} tag={tag} />
                        ))}
                    </div>

                    <div className="text-base-100 mt-4 text-[10px] opacity-50">
                        <span className="uppercase before:content-['>>_DATA_INTEGRITY_CHECK:_OK']"></span>
                        <span className="ml-1 animate-pulse after:content-['\_']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}

export default memo(TagComponent)
