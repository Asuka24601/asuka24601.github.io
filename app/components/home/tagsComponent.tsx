import type { CSSProperties } from 'react'
import type { TagItemInterface, TagDataInterface } from '../../interfaces/tags'
import { generateTagStyleByWeight } from '../../lib/utils'
import { memo } from 'react'

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
        <>
            <span className={`rounded-xl p-1.5 ${className}`} style={style}>
                {tag.name}
            </span>
        </>
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
    const total = TagsData.total

    return (
        <>
            <ul className={className + ' flex flex-wrap gap-2'}>
                {tags.map((tag, index) => (
                    <li key={index} className="inline-block">
                        <TagItemComponent
                            tag={tag}
                            className="dynamic-tag"
                            style={generateTagStyleByWeight(tag.count / total)}
                        />
                    </li>
                ))}
            </ul>
        </>
    )
}

export default memo(TagComponent)
