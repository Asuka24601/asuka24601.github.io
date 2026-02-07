import type { ProfileStatisticsInterface } from '../interfaces/profile'
import ProfileCard from '../components/home/profileCard'
import TodoList from '../components/home/todoList'
import CommentComponent from '../components/commentComponent'
import TagComponent from '../components/home/tagsComponent'
import RecentComponent from '../components/home/recentComponent'
import { useProfileDataStore } from '../lib/store'
import { useRef, useMemo } from 'react'
import PrologueComponent from '../components/home/prologue '
import commentData from '../assets/data/comments.json'
import todoListData from '../assets/data/todos.json'
import tagData from '../contents/tags.json'
import postsData from '../contents/__manifest.json'
import BannerContent from '../components/bannerContent'
import Notice from '../components/home/notice'
import CRTOverlay from '../components/effect/CRTOverlay'
import TextJitter from '../components/effect/textJitter'

export default function Home() {
    const profileStatistics: ProfileStatisticsInterface = useMemo(
        () => [
            {
                name: '文章',
                value: postsData.routes.length,
                routePath: '/posts',
            },
            {
                name: '标签',
                value: tagData.tags.length,
                routePath: '/tags',
            },
            {
                name: '留言',
                value: commentData.data.length,
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
                <BannerContent wrapperRef={wrapperRef} hiddenImg={true}>
                    <PrologueComponent
                        fullText={profileData.data.discription}
                        className="relative flex h-full w-full flex-row items-center justify-center"
                    />
                </BannerContent>

                <div className="border-neutral border-t-4 border-double"></div>

                <div className="border-terminal z-2 mx-auto flex h-full min-h-full max-w-6xl overflow-visible! border-none!">
                    <CRTOverlay className="z-0!" />
                    <TextJitter>
                        <div
                            ref={elementRef}
                            className="relative flex flex-col gap-5 will-change-transform lg:grid lg:grid-cols-[auto_1fr]"
                            style={{
                                transform:
                                    'translateY(calc(var(--scroll-percent) * -25vw))',
                            }}
                        >
                            <aside className="flex h-fit flex-col gap-5 lg:w-md">
                                <div className="contents">
                                    <ProfileCard
                                        className="bg-base-200 h-full"
                                        profileData={profileData}
                                        profileStatistics={profileStatistics}
                                    />
                                </div>

                                <div className="contents">
                                    <TagComponent
                                        TagsData={tagData}
                                        className="bg-base-200"
                                    />
                                </div>
                            </aside>

                            <div className="flex flex-col gap-5">
                                <section className="contents">
                                    <Notice className="bg-base-200" />
                                </section>
                                <section className="contents">
                                    <RecentComponent
                                        className="bg-base-200"
                                        recentData={postsData}
                                        count={5}
                                    />
                                </section>
                                <section className="contents">
                                    <TodoList
                                        todoListItems={todoListItems}
                                        className="bg-base-200"
                                    />
                                </section>
                                <section className="contents">
                                    <CommentComponent
                                        className="bg-base-200"
                                        commentsData={commentData}
                                    />
                                </section>
                            </div>
                        </div>
                    </TextJitter>
                </div>
            </div>
        </>
    )
}
