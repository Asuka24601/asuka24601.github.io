import type { CommentDataInterface } from './comment'
import type { TodoListDataInterface } from './todo'
import type { TagDataInterface } from './tags'
import type { PostListInterface } from './post'
import type {
    ProfileDataInterface,
    ProfileStatisticsInterface,
} from './profile'
import type { JSX } from 'react'

export interface HomeLoaderDataInterface {
    commentData: CommentDataInterface
    todoListData: TodoListDataInterface
    tagData: TagDataInterface
    recentData: PostListInterface
    profileData: ProfileDataInterface
    profileStatistics: ProfileStatisticsInterface
    NoticeModule: () => JSX.Element
}
