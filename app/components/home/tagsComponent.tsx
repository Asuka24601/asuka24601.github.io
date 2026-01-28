import type { CSSProperties } from 'react'
import type { TagItemInterface, TagDataInterface } from '../../interfaces/tags'
import { memo } from 'react'
import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'

export function TagItemComponent({
    tag,
    className,
    style,
}: {
    tag: TagItemInterface
    className?: string | undefined
    style?: CSSProperties | undefined
}) {
    return (
        <div
            className={`group border-azure/30 hover:border-azure hover:bg-modalBox/90 bg-modalBox/60 relative flex cursor-pointer items-center gap-2 border border-dashed px-2 py-1 transition-all hover:border-solid ${className}`}
        >
            {/* Chip decoration */}
            <div className="bg-azure/50 group-hover:bg-azure h-1.5 w-1.5 group-hover:animate-pulse"></div>

            <span
                className="text-azure/70 group-hover:text-azure font-mono text-xs font-bold uppercase"
                style={style}
            >
                {tag.name}
            </span>
            {/* Tech decoration */}
            <span className="text-azure/30 group-hover:text-azure/50 font-mono text-[8px] before:content-['x']">
                {tag.count}
            </span>
        </div>
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
                            <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['MEMORY_BANKS']"></div>
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
