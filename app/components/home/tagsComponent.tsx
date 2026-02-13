import type { CSSProperties } from 'react'
import type { TagDataInterface } from '../../interfaces/tags'
import { memo } from 'react'
import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'
import { Link } from 'react-router'

import { create } from 'zustand'
import type { MenuItemStore } from '../../interfaces/menuItem'

const useMenuItemStore = create<MenuItemStore>()((set) => ({
    open: true,
    setMenuItemState: (usr) => set({ open: usr }),
}))

const MenuItem = () => {
    const setMenuItemOpen = useMenuItemStore((state) => state.setMenuItemState)

    const handleClick = () => {
        setMenuItemOpen(true)
    }

    return (
        <>
            <div className="aspect-square h-full w-auto">
                <button className="btn h-full w-full" onClick={handleClick}>
                    P
                </button>
            </div>
        </>
    )
}

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
                className={`group hover:border-secondary bg-base-300/20 hover:bg-base-300/90 border-base-content/10 relative flex cursor-pointer items-center gap-2 border border-solid px-2 py-1 transition-all ${className}`}
            >
                {/* Chip decoration */}
                <div className="bg-secondary/50 group-hover:bg-secondary h-1.5 w-1.5 group-hover:animate-pulse"></div>

                <span
                    className="text-secondary/70 group-hover:text-secondary text-xs font-bold uppercase"
                    style={style}
                >
                    {tag.name}
                </span>
                {/* Tech decoration */}
                {tag.count && (
                    <span className="text-secondary/30 group-hover:text-secondary/50 text-[8px] before:content-['x']">
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
        <div className={`w-full text-sm ${className || ''}`}>
            <div className="border-terminal relative">
                <CRTOverlay />
                <TextJitter>
                    {/* Header */}
                    <div className="border-neutral/30 mb-4 flex items-end justify-between border-b-2 border-dashed pb-2">
                        <div>
                            <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_INDEXING']"></div>
                            <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['MEMORY\_BANKS']"></div>
                        </div>
                        <div className="text-right">
                            <div className="text-base-content text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['CAPACITY']"></div>
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

                    <div className="text-base-content mt-4 text-[10px] opacity-50">
                        <span className="uppercase before:content-['>>_DATA_INTEGRITY_CHECK:_OK']"></span>
                        <span className="ml-1 animate-pulse after:content-['\_']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}

export default memo(TagComponent)
export const TagComponentMenuItem = memo(MenuItem)
export const TagComponentStore = useMenuItemStore
