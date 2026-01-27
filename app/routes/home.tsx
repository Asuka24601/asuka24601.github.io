/* eslint-disable react-hooks/exhaustive-deps */
import type { ProfileStatisticsInterface } from '../interfaces/profile'
import ProfileCard from '../components/home/profileCard'
import {
    fetchCommentTotalNumber,
    fetchPostTotalNumber,
    fetchTagTotalNumber,
} from '../lib/fetchData'
import TodoList from '../components/home/todoList'
import CommentComponent from '../components/commentComponent'
import TagComponent from '../components/home/tagsComponent'
import AriticleContene from '../components/aritcleContent'
import RecentComponent from '../components/home/recentComponent'
import { useProfileDataStore } from '../lib/store'
import { useRef, useMemo } from 'react'
import PrologueComponent from '../components/home/prologue '
import NoticeModule from '../contents/pages/Notice'
import commentData from '../assets/data/comments.json'
import todoListData from '../assets/data/todos.json'
import tagData from '../contents/tags.json'
import postsData from '../contents/__manifest.json'
import BannerContent from '../components/headContent'

export default function Home() {
    const profileStatistics: ProfileStatisticsInterface = useMemo(
        () => [
            {
                name: '文章',
                value: fetchPostTotalNumber(),
                routePath: '/posts',
            },
            {
                name: '标签',
                value: fetchTagTotalNumber(),
                routePath: '/tags',
            },
            {
                name: '留言',
                value: fetchCommentTotalNumber(),
                routePath: '/comments',
            },
        ],
        []
    )

    const todoListItems = useMemo(
        () => todoListData.data.filter((item) => !item.completed),
        []
    )

    const elementRef = useRef<HTMLDivElement>(null)
    const profileData = useProfileDataStore((state) => state.profileData)
    const wrapperRef = useRef<HTMLDivElement>(null)

    return (
        <>
            <div ref={wrapperRef} className="contents">
                <BannerContent wrapperRef={wrapperRef}>
                    <PrologueComponent
                        fullText={profileData.data.discription}
                        className="flex h-full w-full flex-row items-center justify-center"
                    />
                </BannerContent>

                <div
                    ref={elementRef}
                    className="relative mx-auto grid h-full min-h-full max-w-300 grid-cols-[auto_1fr] gap-5 px-5"
                    style={{
                        marginTop: 'calc(var(--scroll-percent) * 25 * -1%)',
                    }}
                >
                    <aside className="flex h-fit w-60 flex-col gap-5">
                        <div className="bg-base-100/85 h-fit rounded-md px-4 py-4 shadow-xl">
                            <ProfileCard
                                className="h-full"
                                profileData={profileData}
                                profileStatistics={profileStatistics}
                            />
                        </div>

                        <div className="bg-base-100/85 z-1 h-fit rounded-md px-2 py-4 shadow-xl">
                            <h1 className="p-4 pb-2 text-xs tracking-wide opacity-60">
                                TODOs
                            </h1>
                            <TodoList todoListItems={todoListItems} />
                        </div>

                        <div className="bg-base-100/85 h-fit w-full rounded-md p-5 shadow-xl">
                            <h1 className="text-xs tracking-wide opacity-60">
                                Tags
                            </h1>
                            <br />
                            <TagComponent TagsData={tagData} />
                        </div>
                    </aside>

                    <div className="flex flex-col gap-5">
                        <section className="bg-base-100/85 rounded-md p-5 shadow-xl">
                            <AriticleContene className="verflow-y-auto">
                                <NoticeModule />
                            </AriticleContene>
                        </section>
                        <section className="bg-base-100/85 h-fit rounded-md p-5 shadow-xl">
                            <h1 className="text-xs tracking-wide opacity-60">
                                Recent Articles
                            </h1>
                            <br />
                            <RecentComponent
                                recentData={postsData}
                                count={5}
                                className="px-2"
                            />
                        </section>
                        <section className="bg-base-100/85 w-full rounded-md p-5 shadow-xl">
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
            </div>
        </>
    )
}
