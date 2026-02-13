import type { ProfileStatisticsInterface } from '../interfaces/profile'
import ProfileCard, {
    ProfileCardMenuItem,
    ProfileCardStore,
} from '../components/home/profileCard'
import TodoList, {
    TodoListMenuItem,
    TodoListStore,
} from '../components/home/todoList'
import CommentComponent, {
    CommentMenuItem,
    CommentStore,
} from '../components/commentComponent'
import TagComponent, {
    TagComponentMenuItem,
    TagComponentStore,
} from '../components/home/tagsComponent'
import RecentComponent, {
    RecentMenuItem,
    RecentStore,
} from '../components/home/recentComponent'
import { useProfileDataStore } from '../lib/store'
import { useEffect, useRef, useState } from 'react'
import PrologueComponent from '../components/home/prologue '
import commentData from '../assets/data/comments.json'
import todoListData from '../assets/data/todos.json'
import tagData from '../contents/tags.json'
import postsData from '../contents/__manifest.json'
import BannerContent from '../components/bannerContent'
import Notice, { NoticeStore, NoticeMenuItem } from '../components/home/notice'
import CRTOverlay from '../components/effect/CRTOverlay'
import TextJitter from '../components/effect/textJitter'
import Dock from '../components/dock'
import SvgIcon from '../components/SvgIcon'
import WindowComp from '../components/effect/window'

const profileStatistics: ProfileStatisticsInterface = [
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
]
const todoListItems = todoListData.data.filter((item) => !item.completed)

export default function Home() {
    const profileData = useProfileDataStore((state) => state.profileData)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const [showDonw, setShowDown] = useState(true)

    useEffect(() => {
        if (wrapperRef.current) {
            setShowDown(wrapperRef.current.style.order === '1')
        }
    }, [])

    const scrollDown = () => {
        if (wrapperRef.current) {
            wrapperRef.current.style.order =
                wrapperRef.current.style.order === '2' ? '1' : '2'
            setShowDown(wrapperRef.current.style.order === '1')
        }
    }

    return (
        <>
            <div className="flex flex-col">
                <BannerContent wrapperRef={wrapperRef} hiddenImg={true}>
                    <PrologueComponent
                        fullText={profileData.data.discription}
                        className="relative flex h-dvh w-full flex-row items-center justify-center"
                    />
                </BannerContent>

                <div className="border-terminal z-2 order-1 m-0! flex h-dvh w-full overflow-hidden! border-none! p-0!">
                    <CRTOverlay className="z-0!" />
                    <TextJitter className="h-full! w-full!">
                        <div className="relative h-full w-full">
                            <WindowComp
                                initialX={20}
                                initialY={20}
                                initialW={450}
                                childrenStore={ProfileCardStore}
                            >
                                <section className="contents">
                                    <ProfileCard
                                        className="bg-base-200"
                                        profileData={profileData}
                                        profileStatistics={profileStatistics}
                                    />
                                </section>
                            </WindowComp>

                            <WindowComp
                                initialX={40}
                                initialY={40}
                                initialW={400}
                                childrenStore={TagComponentStore}
                            >
                                <section className="contents">
                                    <TagComponent
                                        TagsData={tagData}
                                        className="bg-base-200"
                                    />
                                </section>
                            </WindowComp>
                            <WindowComp
                                initialX={60}
                                initialY={60}
                                initialW={350}
                                childrenStore={NoticeStore}
                            >
                                <section className="contents">
                                    <Notice className="bg-base-200" />
                                </section>
                            </WindowComp>

                            <WindowComp
                                initialX={80}
                                initialY={80}
                                initialW={450}
                                childrenStore={RecentStore}
                            >
                                <section className="contents">
                                    <RecentComponent
                                        className="bg-base-200"
                                        recentData={postsData}
                                        count={5}
                                    />
                                </section>
                            </WindowComp>

                            <WindowComp
                                initialX={100}
                                initialY={100}
                                initialW={350}
                                childrenStore={TodoListStore}
                            >
                                <section className="contents">
                                    <TodoList
                                        todoListItems={todoListItems}
                                        className="bg-base-200"
                                    />
                                </section>
                            </WindowComp>

                            <WindowComp
                                initialX={120}
                                initialY={120}
                                initialW={400}
                                childrenStore={CommentStore}
                            >
                                <section className="contents">
                                    <CommentComponent
                                        className="bg-base-200"
                                        commentsData={commentData}
                                    />
                                </section>
                            </WindowComp>
                        </div>
                    </TextJitter>
                </div>
            </div>
            <Dock>
                <>
                    <ProfileCardMenuItem />
                    <TagComponentMenuItem />
                    <NoticeMenuItem />
                    <RecentMenuItem />
                    <TodoListMenuItem />
                    <CommentMenuItem />
                    <button
                        onClick={scrollDown}
                        className={
                            'btn btn-ghost flex h-20 justify-center border-0 bg-transparent shadow-none transition-all duration-300 ease-in-out'
                        }
                    >
                        <div className="text-base-content drop-shadow-base-300 animate-bounce bg-transparent drop-shadow-2xl">
                            <SvgIcon
                                name="arrowDown"
                                size={40}
                                className={`text-base-content opacity-50 ${
                                    showDonw ? '' : 'rotate-180'
                                }`}
                            />
                        </div>
                    </button>
                </>
            </Dock>
        </>
    )
}
