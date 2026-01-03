/* eslint-disable react-refresh/only-export-components */
import type { Route } from './+types/home'
import ProfileCard from '../components/profileCard'
import type { HomeLoaderDataInterface } from '../interfaces/home'
import fetchData from '../lib/fetchData'
import TodoList from '../components/todoList'
import CommentComponent from '../components/commentComponent'
import TagComponent from '../components/tagsComponent'

export async function clientLoader(): Promise<HomeLoaderDataInterface> {
    const todosFilePath = '/data/todos.json'
    const commentsFilePath = '/data/comments.json'
    const tagsFilePath = '/data/tags.json'
    const loaderTodoData = await fetchData(todosFilePath, 'json')
    const loaderCommentsData = await fetchData(commentsFilePath, 'json')
    const loaderTagsData = await fetchData(tagsFilePath, 'json')
    return {
        commentData: loaderCommentsData,
        todoListData: loaderTodoData,
        tagData: loaderTagsData,
    }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const { commentData, todoListData, tagData } = loaderData

    return (
        <>
            <div className="grid h-full min-h-full grid-cols-[auto_1fr] gap-3">
                <aside className="bg-base-100 w-60 rounded-md px-2 py-4 opacity-85 shadow-2xl">
                    <ProfileCard />
                </aside>

                <section className="bg-base-100 rounded-md p-5 opacity-85 shadow-2xl">
                    <h1 className="text-xs tracking-wide opacity-60">
                        Recent Articles
                    </h1>
                    <br />
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Odio dolorum esse ipsam vel pariatur explicabo ducimus
                    nostrum cupiditate dolores itaque eaque, impedit asperiores
                    veniam culpa corporis temporibus. Maxime, dicta veniam.
                </section>

                <aside className="bg-base-100 w-60 rounded-md px-2 py-4 opacity-85 shadow-2xl">
                    <h1 className="p-4 pb-2 text-xs tracking-wide opacity-60">
                        TODOs
                    </h1>
                    <TodoList todoListData={todoListData} />
                </aside>

                <section className="bg-base-100 rounded-md p-5 opacity-85 shadow-2xl">
                    <h1 className="text-xs tracking-wide opacity-60">Notice</h1>
                    <br />
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Autem velit illo veritatis labore exercitationem illum eum
                    distinctio molestiae eveniet modi repellendus recusandae,
                    dolorem, non iste. Voluptatibus alias eligendi asperiores
                    provident.
                </section>

                <section className="bg-base-100 col-span-2 w-full rounded-md p-5 opacity-85 shadow-2xl">
                    <h1 className="text-xs tracking-wide opacity-60">Tags</h1>
                    <br />
                    <TagComponent TagsData={tagData} />
                </section>

                <section className="bg-base-100 col-span-2 w-full rounded-md p-5 opacity-85 shadow-2xl">
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
