import type {
    CommentItemInterface,
    CommentDataInterface,
} from '../interfaces/comment'

import { timeToString } from '../lib/utils'
import Avatar from './avater'
import CRTOverlay from './effect/CRTOverlay'
import TextJitter from './effect/textJitter'

export function CommentItemComponent({
    comment,
}: {
    comment: CommentItemInterface
}) {
    return (
        <div className="group border-b border-dashed border-white/10 p-3 transition-colors hover:bg-white/5">
            <div className="flex gap-4">
                {/* Avatar Frame */}
                <div className="shrink-0">
                    <div className="border-primary/30 h-10 w-10 border bg-black/20 p-0.5">
                        <Avatar
                            src={comment.avatar}
                            alt={comment.name}
                            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
                        />
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    {/* Log Header */}
                    <div className="font-mono text-[10px] opacity-60">
                        <span className="text-secondary before:content-['['] after:content-[']']">
                            {timeToString(comment.time).dateTime}
                        </span>
                        <span className="mx-2 text-white/30 before:content-['|']"></span>
                        <span className="text-warning uppercase before:content-['USER:_']">
                            {comment.name}
                        </span>
                        <span className="mx-2 text-white/30 before:content-['|']"></span>
                        <span className="text-white/50 uppercase before:content-['SRC:_']">
                            {comment.from}
                        </span>
                    </div>

                    {/* Message */}
                    <div className="font-mono text-sm leading-relaxed wrap-break-word text-white/90">
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
        <div className={`w-full font-mono text-sm ${className || ''}`}>
            <div className="border-terminal">
                <CRTOverlay />
                <TextJitter>
                    {/* Header */}
                    <div className="border-primary/30 mb-4 flex items-end justify-between border-b-2 border-dashed pb-2">
                        <div>
                            <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_SYSTEM\_LOGS']"></div>
                            <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['USER\_COMMENTS']"></div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['TOTAL\_ENTRIES']"></div>
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

                    <div className="text-base-100 mt-4 text-[10px] opacity-50">
                        <span className="uppercase before:content-['>>_END_OF_LOG']"></span>
                        <span className="ml-1 animate-pulse after:content-['\_']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
