/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import type { Route } from './+types/home'
import type { ProfileStatisticsInterface } from '../interfaces/profile'
import type { CommentDataInterface } from '../interfaces/comment'
import type { TodoListDataInterface } from '../interfaces/todo'
import type { TagDataInterface } from '../interfaces/tags'
import type { PostListInterface } from '../interfaces/post'
import ProfileCard from '../components/home/profileCard'
import type { HomeLoaderDataInterface } from '../interfaces/home'
import fetchData, {
    fetchCommentTotalNumber,
    fetchPostTotalNumber,
    fetchTagTotalNumber,
} from '../lib/fetchData'
import TodoList from '../components/home/todoList'
import CommentComponent from '../components/commentComponent'
import TagComponent from '../components/home/tagsComponent'
import AriticleContene from '../components/aritcleContent'
import RecentComponent from '../components/home/recentComponent'
import { mdRegistry } from 'virtual:md-registry'
import { useBannerStore, useProfileDataStore } from '../lib/store'
import { useLayoutEffect, useRef } from 'react'
import PrologueComponent from '../components/home/prologue '

export async function clientLoader(): Promise<HomeLoaderDataInterface> {
    const todosFilePath = '/data/todos.json'
    const commentsFilePath = '/data/comments.json'
    const tagsFilePath = '/data/tags.json'
    const postFilePath = '/data/post.json'
    const loaderTodoData: TodoListDataInterface = await fetchData(
        todosFilePath,
        'json'
    )
    const loaderCommentsData: CommentDataInterface = await fetchData(
        commentsFilePath,
        'json'
    )
    const loaderTagsData: TagDataInterface = await fetchData(
        tagsFilePath,
        'json'
    )
    const loaderPostsData: PostListInterface = await fetchData(
        postFilePath,
        'json'
    )
    const loaderProfileStatistics: ProfileStatisticsInterface = [
        {
            name: '文章',
            value: await fetchPostTotalNumber(),
            routePath: '/posts',
        },
        {
            name: '标签',
            value: await fetchTagTotalNumber(),
            routePath: '/tags',
        },
        {
            name: '留言',
            value: await fetchCommentTotalNumber(),
            routePath: '/comments',
        },
    ]

    // 通过虚拟模块加载 Markdown 内容, 仅为测试用，后续将修改
    const noticeModule = import.meta.env.DEV
        ? (await await mdRegistry['pages/notice']).default()
        : (await import('../contents/pages/notice')).default

    return {
        commentData: loaderCommentsData,
        todoListData: loaderTodoData,
        tagData: loaderTagsData,
        NoticeModule: noticeModule,
        recentData: loaderPostsData,
        profileStatistics: loaderProfileStatistics,
    }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const {
        commentData,
        todoListData,
        tagData,
        NoticeModule,
        recentData,
        profileStatistics,
    } = loaderData

    const elementRef = useRef<HTMLDivElement>(null)

    const resetImage = useBannerStore((state) => state.resetImage)
    const resetBannerRelative = useBannerStore(
        (state) => state.resetBannerRelative
    )
    const setBannerRelative = useBannerStore((state) => state.setBannerRelative)
    const profileData = useProfileDataStore((state) => state.profileData)

    const handleAction = () => {
        setBannerRelative(true)
    }

    useLayoutEffect(() => {
        handleAction()
        return () => {
            resetBannerRelative()
            resetImage()
        }
    }, [])

    return (
        <>
            <PrologueComponent
                fullText={profileData.data.discription}
                className="absolute left-1/2 flex h-dvh w-full flex-row items-center justify-center"
                style={{
                    top: `calc((var(--banner-height) / 2 + 72) * -1px)`,
                    translate: '-50% -50%',
                }}
            >
                {/* <p className="text-nowrap">{profileData.data.discription}</p> */}
            </PrologueComponent>

            <div
                ref={elementRef}
                className="mx-auto grid h-full min-h-full max-w-400 grid-cols-[auto_1fr] gap-5 px-5 *:hover:z-1"
            >
                <aside className="flex h-fit w-60 flex-col gap-5">
                    <div className="bg-base-100-custom h-fit rounded-md px-4 py-4 shadow-xl">
                        <ProfileCard
                            className="h-full"
                            profileData={profileData}
                            profileStatistics={profileStatistics}
                        />
                    </div>

                    <div className="bg-base-100-custom h-fit rounded-md px-2 py-4 shadow-xl">
                        <h1 className="p-4 pb-2 text-xs tracking-wide opacity-60">
                            TODOs
                        </h1>
                        <TodoList
                            todoListItems={todoListData.subjects.filter(
                                (item) => !item.state
                            )}
                        />
                    </div>

                    <div className="bg-base-100-custom h-fit w-full rounded-md p-5 shadow-xl">
                        <h1 className="text-xs tracking-wide opacity-60">
                            Tags
                        </h1>
                        <br />
                        <TagComponent TagsData={tagData} />
                    </div>
                </aside>

                <div className="flex flex-col gap-5">
                    <section className="bg-base-100-custom rounded-md p-5 shadow-xl">
                        <AriticleContene className="verflow-y-auto">
                            <NoticeModule />
                        </AriticleContene>
                    </section>
                    <section className="bg-base-100-custom h-fit rounded-md p-5 shadow-xl">
                        <h1 className="text-xs tracking-wide opacity-60">
                            Recent Articles
                        </h1>
                        <br />
                        <RecentComponent
                            recentData={recentData}
                            count={10}
                            className="px-2"
                        />
                    </section>
                    <section className="bg-base-100-custom w-full rounded-md p-5 shadow-xl">
                        <h1 className="text-xs tracking-wide opacity-60">
                            Comments
                        </h1>
                        <br />
                        <CommentComponent
                            commentsData={commentData}
                            className="px-2"
                        />
                    </section>
                </div>
            </div>
        </>
    )
}
