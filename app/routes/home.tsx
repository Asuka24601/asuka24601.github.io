/* eslint-disable react-refresh/only-export-components */
import type { Route } from './+types/home'
import ProfileCard from '../components/home/profileCard'
import type { HomeLoaderDataInterface } from '../interfaces/home'
import fetchData from '../lib/fetchData'
import TodoList from '../components/home/todoList'
import CommentComponent from '../components/commentComponent'
import TagComponent from '../components/tagsComponent'
import AriticleContene from '../components/aritcleContent'
import RecentComponent from '../components/home/recentComponent'
import { mdRegistry } from 'virtual:md-registry'

export async function clientLoader(): Promise<HomeLoaderDataInterface> {
    const todosFilePath = '/data/todos.json'
    const commentsFilePath = '/data/comments.json'
    const tagsFilePath = '/data/tags.json'
    const postFilePath = '/data/post.json'
    const loaderTodoData = await fetchData(todosFilePath, 'json')
    const loaderCommentsData = await fetchData(commentsFilePath, 'json')
    const loaderTagsData = await fetchData(tagsFilePath, 'json')
    const loaderPostsData = await fetchData(postFilePath, 'json')

    // 通过虚拟模块加载 Markdown 内容, 仅为测试用，后续将修改
    const noticeModulePath = await mdRegistry['pages/notice']
    if (!noticeModulePath) {
        console.log('加载失败')
    }
    const noticeModule = await noticeModulePath()

    return {
        commentData: loaderCommentsData,
        todoListData: loaderTodoData,
        tagData: loaderTagsData,
        NoticeModule: noticeModule.default,
        recentData: loaderPostsData,
    }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const { commentData, todoListData, tagData, NoticeModule, recentData } =
        loaderData

    return (
        <>
            <div className="grid h-full min-h-full grid-cols-[auto_1fr] gap-5 *:hover:z-1">
                <aside className="flex h-fit w-60 flex-col gap-5">
                    <div className="bg-base-100-custom h-fit rounded-md px-2 py-4 shadow-xl">
                        <ProfileCard className="h-full" />
                    </div>

                    <div className="bg-base-100-custom h-fit rounded-md px-2 py-4 shadow-xl">
                        <h1 className="p-4 pb-2 text-xs tracking-wide opacity-60">
                            TODOs
                        </h1>
                        <TodoList todoListData={todoListData} />
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
