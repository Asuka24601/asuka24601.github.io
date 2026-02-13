import type {
    CommentItemInterface,
    CommentDataInterface,
} from '../interfaces/comment'

import { timeToString } from '../lib/utils'
import Avatar from './avater'
import CRTOverlay from './effect/CRTOverlay'
import TextJitter from './effect/textJitter'

import { create } from 'zustand'
import type { MenuItemStore } from '../interfaces/menuItem'
import { memo } from 'react'

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

export function CommentItemComponent({
    comment,
}: {
    comment: CommentItemInterface
}) {
    return (
        <div className="group border-neutral/50 hover:bg-primary/20 border-b border-dashed p-3 transition-colors last-of-type:border-none">
            <div className="flex gap-4">
                {/* Avatar Frame */}
                <div className="shrink-0">
                    <div className="border-neutral/30 bg-base-100/20 h-10 w-10 border p-0.5">
                        <Avatar
                            src={comment.avatar}
                            alt={comment.name}
                            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
                        />
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    {/* Log Header */}
                    <div className="text-[10px] opacity-60">
                        <span className="text-secondary before:content-['['] after:content-[']']">
                            {timeToString(comment.time).dateTime}
                        </span>
                        <span className="text-base-content/30 mx-2 before:content-['|']"></span>
                        <span className="text-warning uppercase before:content-['USER:_']">
                            {comment.name}
                        </span>
                        <span className="text-base-content/30 mx-2 before:content-['|']"></span>
                        <span className="text-base-content/50 uppercase before:content-['SRC:_']">
                            {comment.from}
                        </span>
                    </div>

                    {/* Message */}
                    <div className="text-base-content/90 text-sm leading-relaxed wrap-break-word">
                        <span className="text-primary/50 mr-2 select-none">{`>>`}</span>
                        {comment.message}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CommentComponent({
    commentsData,
    className,
}: {
    commentsData: CommentDataInterface
    className?: string | undefined
}) {
    const comments = commentsData.data
    if (!comments) return null

    return (
        <div className={`w-full text-sm ${className || ''}`}>
            <div className="border-terminal relative">
                <CRTOverlay />
                <TextJitter>
                    {/* Header */}
                    <div className="border-neutral/30 mb-4 flex items-end justify-between border-b-2 border-dashed pb-2">
                        <div>
                            <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_SYSTEM\_LOGS']"></div>
                            <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['USER\_COMMENTS']"></div>
                        </div>
                        <div className="text-right">
                            <div className="text-base-content text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['TOTAL\_ENTRIES']"></div>
                            <div className="text-warning text-xs opacity-70 after:content-['_RECORDS']">
                                {comments.length}
                            </div>
                        </div>
                    </div>

                    {/* List */}
                    <div className="scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent flex max-h-150 flex-col overflow-y-auto pr-2">
                        {comments.map((item, index) => (
                            <CommentItemComponent key={index} comment={item} />
                        ))}
                    </div>

                    <div className="text-base-content mt-4 text-[10px] opacity-50">
                        <span className="uppercase before:content-['>>_END_OF_LOG']"></span>
                        <span className="ml-1 animate-pulse after:content-['\_']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}

export const CommentMenuItem = memo(MenuItem)
export const CommentStore = useMenuItemStore
