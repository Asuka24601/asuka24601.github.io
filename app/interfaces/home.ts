import type { CommentDataInterface } from './comment'
import type { TodoListDataInterface } from './todo'
import type { TagDataInterface } from './tags'
import type { JSX } from 'react'

export interface HomeLoaderDataInterface {
    commentData: CommentDataInterface
    todoListData: TodoListDataInterface
    tagData: TagDataInterface
    NoticeModule: () => JSX.Element
}
