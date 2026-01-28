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
                    className="relative mx-auto grid h-full min-h-full max-w-300 grid-cols-[auto_1fr] gap-5 px-5 will-change-transform"
                    style={{
                        transform:
                            'translateY(calc(var(--scroll-percent) * -25vw))',
                    }}
                >
                    <aside className="flex h-fit w-100 flex-col gap-5">
                        <div className="contents">
                            <ProfileCard
                                className="h-full"
                                profileData={profileData}
                                profileStatistics={profileStatistics}
                            />
                        </div>

                        <div className="contents">
                            <TagComponent TagsData={tagData} />
                        </div>
                    </aside>

                    <div className="flex flex-col gap-5">
                        <section className="contents">
                            <Notice />
                        </section>
                        <section className="contents">
                            <RecentComponent recentData={postsData} count={5} />
                        </section>
                        <section className="contents">
                            <TodoList todoListItems={todoListItems} />
                        </section>
                        <section className="contents">
                            <CommentComponent commentsData={commentData} />
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}
