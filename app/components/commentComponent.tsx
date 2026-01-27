import type {
    CommentItemInterface,
    CommentDataInterface,
} from '../interfaces/comment'

import { timeToString } from '../lib/utils'
import Avatar from './avater'

export function CommentItemComponent({
    comment,
}: {
    comment: CommentItemInterface
}) {
    return (
        <>
            <div className="chat chat-start">
                <div className="chat-image">
                    <div className="avatar w-10">
                        <Avatar
                            src={comment.avatar}
                            alt={comment.name}
                            className="rounded-full"
                        />
                    </div>
                </div>
                <div className="chat-header">
                    {comment.name}
                    <time className="text-xs opacity-50">
                        {timeToString(comment.time).dateTime}
                    </time>
                </div>
                <p className="chat-bubble max-w-full">{comment.message}</p>
                <span className="chat-footer opacity-50">
                    From : {comment.from}
                </span>
            </div>
        </>
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
    return (
        <>
            <ul className={className + ' list'}>
                {comments.map((item, index) => (
                    <li key={index} className="list-row px-0">
                        <CommentItemComponent comment={item} />
                    </li>
                ))}
            </ul>
        </>
    )
}
