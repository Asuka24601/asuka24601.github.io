/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useBannerStore, useProfileDataStore } from '../lib/store'
import cover from '../assets/cover.webp'
import camera from '../assets/camera.webp'
import AriticleContene from '../components/aritcleContent'
import AboutIntroduction from '../contents/pages/about'
import TimeLine from '../components/about/timeLine'
import DataItem from '../components/about/dataItem'
import fetchData from '../lib/fetchData'
import type { TodoListDataInterface } from '../interfaces/todo'
import type { Route } from './+types/about'
import { PieChartSvg } from '../components/chart'
import { BlockMath } from 'react-katex'
import HealthStatus from '../components/about/healthStatus'
import Table2Col from '../components/about/table'
import { LocationComponent } from '../components/about/location'

export async function clientLoader(): Promise<{
    todoListData: TodoListDataInterface
}> {
    const filePath = '/data/todos.json'
    const todoListData = await fetchData(filePath, 'json')

    return { todoListData }
}

const sectionStyle: React.CSSProperties = {
    position: 'absolute',
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '-99',
    scale: '0',
}

const ABOUT_ITEMS_CONFIG = [
    // { key: 'location', name: 'location', question: '你来自哪里?' },
    { key: 'species', name: 'species', icon: 'dna', question: '你是什么物种?' },
    { key: 'race', name: 'race', icon: 'skull', question: '你是什么种族?' },
    { key: 'gender', name: 'gender', question: '你是GG还是MM?' },
    { key: 'birthday', name: 'birthday', question: '你多少岁了?' },
    { key: 'death', name: 'death', question: '你什么时候死?' },
    {
        key: 'sexualOrientation',
        name: 'sexual orientation',
        icon: 'sexual',
        question: '你喜欢GG还是MM?',
    },
    {
        key: 'politicalOrientation',
        name: 'political orientation',
        icon: 'political',
        question: '你是左还是右?',
    },
    { key: 'religion', name: 'religion', question: '你信仰宗教吗?' },
    {
        key: 'pronouns',
        name: 'pronouns',
        icon: 'meh',
        question: '你希望别人怎么称呼你?',
    },
    {
        key: 'ancestor',
        name: 'ancestor',
        icon: 'human',
        question: '你的祖先是谁?',
    },
    {
        key: 'marriage',
        name: 'marriage',
        icon: 'wedding',
        question: '你结婚了吗?',
    },
    {
        key: 'physicalForm',
        name: 'physical form',
        icon: 'physic',
        question: '你是什么样子?',
    },
    {
        key: 'bloodType',
        name: 'blood type',
        icon: 'blood',
        question: '你是什么血型?',
    },
    {
        key: 'allergen',
        name: 'allergen',
        question: '你有对什么东西过敏吗?',
    },
]

export default function About({ loaderData }: Route.ComponentProps) {
    const { todoListData } = loaderData

    const elementRef = useRef<HTMLImageElement>(null)
    const [content, setContent] = useState('archive')
    const articleRef = useRef<HTMLDivElement>(null)

    const changeContent = (target: string) => {
        if (content === target) return
        setContent(target)
        articleRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }

    const resetImage = useBannerStore((state) => state.resetImage)
    const resetBannerRelative = useBannerStore(
        (state) => state.resetBannerRelative
    )
    const setBannerShow = useBannerStore((state) => state.setBannerShow)
    const resetBannerShow = useBannerStore((state) => state.resetBannerShow)
    const setBannerRelative = useBannerStore((state) => state.setBannerRelative)

    const handleAction = () => {
        setBannerShow(false)
        setBannerRelative(false)
    }

    useLayoutEffect(() => {
        handleAction()
        return () => {
            resetImage()
            resetBannerRelative()
            resetBannerShow()
        }
    }, [])

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        let ticking = false

        const handleMouseMove = (event: MouseEvent) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = element.getBoundingClientRect()
                    const centerX = rect.left + rect.width / 2
                    const centerY = rect.top + rect.height / 2

                    const angle =
                        Math.atan2(
                            centerY - event.clientY,
                            centerX - event.clientX
                        ) *
                            (180 / Math.PI) +
                        90

                    element.style.setProperty('--rotate-angle', `${angle}deg`)
                    ticking = false
                })
                ticking = true
            }
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    window.addEventListener('mousemove', handleMouseMove)
                } else {
                    window.removeEventListener('mousemove', handleMouseMove)
                }
            },
            { threshold: 0 }
        )
        observer.observe(element)

        return () => {
            observer.disconnect()
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    const avatarOnClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const element = e.target
        if (element instanceof HTMLImageElement) {
            if (element.classList.contains('animate__swing')) return
            element.classList.add('animate__swing')
            setTimeout(() => {
                element.classList.remove('animate__swing')
            }, 1000)
        }
    }

    const profileData = useProfileDataStore((state) => state.profileData)

    return (
        <>
            <div>
                <div className="relative -top-18 h-full w-full overflow-hidden bg-black">
                    <img
                        src={cover}
                        alt="cover"
                        draggable="false"
                        className="pointer-events-none h-full w-full object-cover object-top"
                    />
                    <img
                        ref={elementRef}
                        src={camera}
                        alt="camera"
                        draggable="false"
                        className="absolute top-[48%] left-1/2 h-full -translate-1/2 scale-[36.78%] object-cover drop-shadow-[0_30px_10px] drop-shadow-black"
                        style={{
                            transform: `rotate(var(--rotate-angle))`,
                        }}
                    />
                </div>
                <article className="relative -top-43 mx-auto flex max-w-400 flex-col items-center justify-center">
                    <div className="avatar h-50 w-50">
                        {profileData.data.avatar && (
                            <img
                                onClick={(
                                    e: React.MouseEvent<HTMLImageElement>
                                ) => {
                                    avatarOnClick(e)
                                }}
                                src={profileData.data.avatar}
                                alt="avatar"
                                draggable="false"
                                className="outline-base-content/15 animate__animated rounded-full shadow-xs outline-1"
                            />
                        )}
                    </div>
                    <h1 className="mt-3 text-2xl first-letter:uppercase">
                        <strong>{profileData.data.name}</strong>
                    </h1>
                    <q className="text-base-content/50 text-sm">
                        {profileData.data.introduction}
                    </q>

                    <div
                        className="relative -left-24 mt-5 flex scroll-mt-20 flex-row gap-3"
                        ref={articleRef}
                    >
                        <aside className="sticky top-28 z-1 h-fit w-45">
                            <ul className="menu bg-base-100 rounded-box sticky top-0 w-full shadow-xl">
                                <li>
                                    <h2 className="menu-title">Contents</h2>
                                    <ul>
                                        <li>
                                            <a
                                                onClick={() =>
                                                    changeContent('archive')
                                                }
                                            >
                                                Archive
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                onClick={() =>
                                                    changeContent(
                                                        'introduction'
                                                    )
                                                }
                                            >
                                                Introduction
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                onClick={() =>
                                                    changeContent('timeline')
                                                }
                                            >
                                                TimeLine
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </aside>
                        <div className="flex max-w-200 flex-col gap-6">
                            <section
                                id="archive"
                                className="bg-base-100 flex flex-col items-start justify-start gap-8 rounded-md p-8 shadow-2xl transition-opacity ease-in-out"
                                style={{
                                    willChange: 'opacity, scale',
                                    ...(content === 'archive'
                                        ? { position: 'relative', opacity: '1' }
                                        : sectionStyle),
                                }}
                            >
                                <div className="text-base-content/50 w-full text-xs">
                                    <p className="before:content-['#Archive']"></p>
                                    <div className="divider my-1"></div>
                                </div>

                                {ABOUT_ITEMS_CONFIG.map((item) => (
                                    <DataItem
                                        key={item.key}
                                        name={item.name}
                                        icon={item.icon}
                                        question={item.question}
                                    >
                                        <div>
                                            {
                                                (profileData.data as any)[
                                                    item.key
                                                ]
                                            }
                                        </div>
                                    </DataItem>
                                ))}
                                <DataItem
                                    name="location"
                                    question="你来自哪里?"
                                    className="overflow-visible"
                                >
                                    <LocationComponent
                                        className="mt-3"
                                        location={profileData.data.location}
                                    />
                                </DataItem>

                                <DataItem
                                    name="health"
                                    question="你的健康状况怎么样?"
                                >
                                    <HealthStatus
                                        status={profileData.data.health}
                                        className="mt-2"
                                    />
                                </DataItem>

                                <DataItem
                                    name="halflife"
                                    icon="physic"
                                    question="你的半衰期是多少?"
                                >
                                    {
                                        <div>
                                            <BlockMath
                                                math={
                                                    profileData.data.halflife
                                                        ?.formula as string
                                                }
                                            />
                                            <p className="mx-auto block w-fit text-xs">
                                                {
                                                    profileData.data.halflife
                                                        ?.discription
                                                }
                                            </p>
                                        </div>
                                    }
                                </DataItem>

                                <DataItem
                                    name="materials"
                                    question="你是由什么构成的?"
                                    className="overflow-visible"
                                >
                                    <div className="flex w-full flex-row gap-8">
                                        <PieChartSvg
                                            materials={
                                                profileData.data.materials
                                            }
                                            className="relative aspect-square h-auto flex-1/2"
                                        />
                                        <div className="flex aspect-square h-auto flex-1/2 flex-col content-start justify-center gap-3 rounded-2xl text-sm">
                                            <Table2Col
                                                t1="ingredient"
                                                t2="proportion(%)"
                                                items={
                                                    profileData.data.materials
                                                }
                                            />
                                        </div>
                                    </div>
                                </DataItem>

                                <DataItem
                                    name="languages"
                                    question="你使用哪些语言?"
                                >
                                    <Table2Col
                                        t1="language"
                                        t2="level(0~+∞)"
                                        items={profileData.data.languages}
                                    />
                                </DataItem>

                                <div className="text-base-content/50 flex w-full flex-col gap-2 text-xs break-all">
                                    <div className="divider my-1"></div>
                                    <p className="before:mr-1 before:content-['MD5:']">
                                        {profileData.data.md5}
                                    </p>
                                    <p className="before:mr-1 before:content-['SHA256:']">
                                        {profileData.data.sha256}
                                    </p>
                                    <p className="before:mr-1 before:content-['SHA512:']">
                                        {profileData.data.sha512}
                                    </p>
                                </div>
                            </section>

                            <section
                                id="introduction"
                                className="bg-base-100 flex flex-col items-start justify-start rounded-md p-8 shadow-2xl transition-opacity ease-in-out"
                                style={{
                                    willChange: 'opacity, scale',
                                    ...(content === 'introduction'
                                        ? { position: 'relative', opacity: '1' }
                                        : sectionStyle),
                                }}
                            >
                                <div className="text-base-content/50 w-full text-xs">
                                    <p className="before:content-['#Introduction']"></p>
                                    <div className="divider my-1"></div>
                                </div>

                                <AriticleContene>
                                    <AboutIntroduction />
                                </AriticleContene>
                            </section>

                            <section
                                id="timeline"
                                className="bg-base-100 flex flex-col items-start justify-start rounded-md p-8 shadow-2xl transition-opacity ease-in-out"
                                style={{
                                    willChange: 'opacity, scale',
                                    ...(content === 'timeline'
                                        ? { position: 'relative', opacity: '1' }
                                        : sectionStyle),
                                }}
                            >
                                <div className="text-base-content/50 w-full text-xs">
                                    <p className="before:content-['#TimeLine']"></p>
                                    <div className="divider my-1"></div>
                                </div>
                                <TimeLine
                                    todoListItems={todoListData.subjects}
                                />
                            </section>
                        </div>
                    </div>
                </article>
            </div>
        </>
    )
}
