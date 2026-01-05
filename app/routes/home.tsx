/* eslint-disable react-refresh/only-export-components */
import type { Route } from './+types/home'
import ProfileCard from '../components/profileCard'
import type { HomeLoaderDataInterface } from '../interfaces/home'
import fetchData from '../lib/fetchData'
import TodoList from '../components/todoList'
import CommentComponent from '../components/commentComponent'
import TagComponent from '../components/tagsComponent'
import AriticleContene from '../components/aritcleContent'
import { mdRegistry } from 'virtual:md-registry'

export async function clientLoader(): Promise<HomeLoaderDataInterface> {
    const todosFilePath = '/data/todos.json'
    const commentsFilePath = '/data/comments.json'
    const tagsFilePath = '/data/tags.json'
    const loaderTodoData = await fetchData(todosFilePath, 'json')
    const loaderCommentsData = await fetchData(commentsFilePath, 'json')
    const loaderTagsData = await fetchData(tagsFilePath, 'json')

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
    }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const { commentData, todoListData, tagData, NoticeModule } = loaderData

    return (
        <>
            <div className="grid h-full min-h-full grid-cols-[auto_1fr] gap-5 *:hover:z-1">
                <aside className="bg-base-100 w-60 rounded-md px-2 py-4 opacity-85 shadow-xl">
                    <ProfileCard className="h-full" />
                </aside>

                <section className="bg-base-100 rounded-md p-5 opacity-85 shadow-xl">
                    <h1 className="text-xs tracking-wide opacity-60">
                        Recent Articles
                    </h1>
                    <br />
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Amet molestiae hic voluptates neque quos, officia mollitia
                    ipsa, iste doloremque libero, et sequi dicta distinctio
                    minima cupiditate praesentium fuga animi magni?
                </section>

                <aside className="bg-base-100-custom h-fit w-60 rounded-md px-2 py-4 shadow-xl">
                    <h1 className="p-4 pb-2 text-xs tracking-wide opacity-60">
                        TODOs
                    </h1>
                    <TodoList todoListData={todoListData} />
                </aside>

                <section className="bg-base-100 rounded-md p-5 opacity-85 shadow-xl">
                    <h1 className="text-xs tracking-wide opacity-60">Notice</h1>
                    <br />
                    <AriticleContene className="max-h-svh overflow-y-auto">
                        <NoticeModule />
                    </AriticleContene>
                </section>

                <section className="bg-base-100 col-span-2 w-full rounded-md p-5 opacity-85 shadow-xl">
                    <h1 className="text-xs tracking-wide opacity-60">Tags</h1>
                    <br />
                    <TagComponent TagsData={tagData} />
                </section>

                <section className="bg-base-100 col-span-2 w-full rounded-md p-5 opacity-85 shadow-xl">
                    <h1 className="text-xs tracking-wide opacity-60">
                        Comments
                    </h1>
                    <br />
                    <CommentComponent commentsData={commentData} />
                </section>
            </div>
        </>
    )
}
