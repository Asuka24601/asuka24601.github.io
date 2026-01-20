import { NavLink } from 'react-router'
import type { PostListInterface } from '../interfaces/post'
import type { Route } from './+types/postIndex'
import fetchData from '../lib/fetchData'
import { timeToString } from '../lib/utils'
import { useBannerStore } from '../lib/store'
import { useLayoutEffect } from 'react'
import ProgressiveImage from '../components/progressiveImage'
import SvgIcon from '../components/SvgIcon'

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader(): Promise<PostListInterface> {
    const filePath = '/data/post.json'
    const loaderData = await fetchData(filePath, 'json')
    return loaderData
}

export default function PostIndex({ loaderData }: Route.ComponentProps) {
    const { lastUpdateDate, posts } = loaderData

    const resetImage = useBannerStore((state) => state.resetImage)
    const resetBannerRelative = useBannerStore(
        (state) => state.resetBannerRelative
    )
    const setBannerRelative = useBannerStore((state) => state.setBannerRelative)

    const handleAction = () => {
        setBannerRelative(false)
    }

    useLayoutEffect(() => {
        handleAction()
        return () => {
            resetImage()
            resetBannerRelative()
        }
    })

    return (
        <div className="mx-auto max-w-400 p-5">
            <div className="bg-base-100/90 rounded-xs p-5 shadow-xl">
                <ul className="list">
                    {posts.map((item) => (
                        <li key={item.frontMatter.title} className="list-row">
                            {item.frontMatter.cover ? (
                                <div className="avatar w-24">
                                    <div className="my-auto aspect-auto h-fit w-full">
                                        <ProgressiveImage
                                            src={item.frontMatter.cover}
                                            alt={item.frontMatter.title}
                                        />
                                    </div>
                                </div>
                            ) : null}
                            <div className="flex flex-col justify-between gap-5 p-3">
                                <div className="flex flex-col gap-3">
                                    <h1 className="text-2xl">
                                        <strong>
                                            <NavLink to={item.path}>
                                                {item.frontMatter.title}
                                            </NavLink>
                                        </strong>
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <span>
                                            <SvgIcon name="account" size={18} />
                                        </span>
                                        <p className="text-xs first-letter:uppercase">
                                            {item.frontMatter.author}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>
                                            <SvgIcon name="hash" size={18} />
                                        </span>

                                        <div className="grid grid-flow-col gap-1">
                                            {item.frontMatter.tags &&
                                                item.frontMatter.tags?.map(
                                                    (tag, index) => (
                                                        <span
                                                            className="badge text-base-100 bg-[color-mix(in_srgb,var(--color-primary),white)]/90 text-xs"
                                                            key={index}
                                                        >
                                                            {tag}
                                                        </span>
                                                    )
                                                )}
                                        </div>
                                    </div>

                                    <q className="text-xs font-extralight">
                                        {item.frontMatter.description}
                                    </q>
                                </div>

                                <time
                                    dateTime={
                                        timeToString(item.frontMatter.date).date
                                    }
                                    className="text-end text-xs opacity-70"
                                >
                                    {
                                        timeToString(item.frontMatter.date)
                                            .dateTime
                                    }
                                </time>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="divider my-1"></div>

                <p className="pt-2 text-end text-xs opacity-80">
                    Last Update:{' '}
                    <time
                        dateTime={timeToString(lastUpdateDate as string).date}
                        className="badge badge-neutral text-xs"
                    >
                        {timeToString(lastUpdateDate as string).dateTime}
                    </time>
                </p>
            </div>
        </div>
    )
}
