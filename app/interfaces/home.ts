import type { CommentDataInterface } from './comment'
import type { TodoListDataInterface } from './todo'
import type { TagDataInterface } from './tags'

export interface HomeLoaderDataInterface {
    commentData: CommentDataInterface
    todoListData: TodoListDataInterface
    tagData: TagDataInterface
}
