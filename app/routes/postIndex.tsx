import { NavLink } from 'react-router'
import type { PostListInterface } from '../interfaces/post'
import type { Route } from './+types/postIndex'
import fetchData from '../lib/fetchData'
import { timeToString } from '../lib/utils'

// import type { Route } from "./+types/postIndex";

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader(): Promise<PostListInterface> {
    const filePath = '/data/post.json'
    const loaderData = await fetchData(filePath, 'json')
    return loaderData
}

export default function PostIndex({ loaderData }: Route.ComponentProps) {
    // console.log(loaderData);
    const { lastUpdateDate, posts } = loaderData
    const items = posts.map((item) => (
        <li key={item.frontMatter.title} className="list-row">
            {item.frontMatter.cover ? (
                <div className="avatar">
                    <img
                        className="w-24 rounded"
                        src={item.frontMatter.cover}
                        alt={item.frontMatter.title}
                    />
                </div>
            ) : null}
            <div className="flex flex-col justify-between gap-5 p-3">
                <div>
                    <h1 className="text-base">
                        <strong>
                            <NavLink to={item.path}>
                                {item.frontMatter.title}
                            </NavLink>
                        </strong>
                    </h1>

                    <br />

                    <q className="text-sm font-light">
                        {item.frontMatter.description}
                    </q>
                </div>

                <time
                    dateTime={timeToString(item.frontMatter.date).date}
                    className="text-end text-xs opacity-70"
                >
                    {timeToString(item.frontMatter.date).dateTime}
                </time>
            </div>
        </li>
    ))

    return (
        <div className="bg-base-100-custom w-full rounded-md p-5 shadow-xl">
            <ul className="list">{...items}</ul>
            <div className="divider my-1"></div>

            <p className="text-end text-xs opacity-80">
                Last Update:{' '}
                <time
                    dateTime={timeToString(lastUpdateDate as string).date}
                    className="badge badge-neutral"
                >
                    {timeToString(lastUpdateDate as string).dateTime}
                </time>
            </p>
        </div>
    )
}
