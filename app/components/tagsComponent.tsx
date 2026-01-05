import type { TagItemInterface, TagDataInterface } from '../interfaces/tags'

export function TagItemComponent({
    tag,
    className,
}: {
    tag: TagItemInterface
    className?: string | undefined
}) {
    return (
        <>
            <span className={`badge ${className}`}>{tag.name}</span>
        </>
    )
}

export default function TagComponent({
    TagsData,
    className,
}: {
    TagsData: TagDataInterface
    className?: string | undefined
}) {
    const tags = TagsData.tags
    return (
        <>
            <div className={className}>
                {tags.map((tag, index) => (
                    <div key={index} className="mr-2 inline-block">
                        <TagItemComponent tag={tag} />
                    </div>
                ))}
            </div>
        </>
    )
}
