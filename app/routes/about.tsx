import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useBannerStore, useProfileDataStore } from '../lib/store'
import cover from '../assets/cover.webp'
import camera from '../assets/camera.webp'
import AriticleContene from '../components/aritcleContent'
import AboutIntroduction from '../contents/pages/about'
import TimeLine from '../components/about/timeLine'
import DataItem from '../components/about/dataItem'

export default function About() {
    const elementRef = useRef<HTMLImageElement>(null)

    const [content, setContent] = useState('archive')

    const changeContent = (target: string) => {
        setContent(target)
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
        if (!elementRef.current) return

        let ticking = false

        const handleMouseMove = (event: MouseEvent) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (!elementRef.current) return
                    const rect = elementRef.current.getBoundingClientRect()
                    const centerX = rect.left + rect.width / 2
                    const centerY = rect.top + rect.height / 2

                    const angle =
                        Math.atan2(
                            centerY - event.clientY,
                            centerX - event.clientX
                        ) *
                            (180 / Math.PI) +
                        90

                    elementRef.current.style.setProperty(
                        '--rotate-angle',
                        `${angle}deg`
                    )
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => {
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
                        <img
                            onClick={avatarOnClick}
                            src={profileData.data.avatar}
                            alt="avatar"
                            draggable="false"
                            className="outline-base-content/15 animate__animated rounded-full shadow-xs outline-1"
                        />
                    </div>
                    <h1 className="mt-3 text-2xl first-letter:uppercase">
                        <strong>{profileData.data.name}</strong>
                    </h1>
                    <q className="text-base-content/50 text-sm">
                        {profileData.data.introduction}
                    </q>
                    <br />

                    <div className="relative -left-24 flex flex-row gap-3">
                        <aside className="sticky top-28 h-fit w-45">
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
                                className="bg-base-100 flex flex-col items-start justify-start gap-8 rounded-md p-8 shadow-2xl"
                                style={{
                                    ...(content === 'archive'
                                        ? { order: 1 }
                                        : { order: 2 }),
                                }}
                            >
                                <div className="text-base-content/50 w-full text-xs">
                                    <p className="before:content-['#Archive']"></p>
                                    <div className="divider my-1"></div>
                                </div>
                                <DataItem
                                    name="location"
                                    question="你来自哪里?"
                                >
                                    <text>{profileData.data.location}</text>
                                </DataItem>
                                <DataItem
                                    name="species"
                                    icon="dna"
                                    question="你是什么物种?"
                                >
                                    <text>{profileData.data.species}</text>
                                </DataItem>
                                <DataItem
                                    name="race"
                                    question="你是什么种族?"
                                    icon="skull"
                                >
                                    <text>{profileData.data.race}</text>
                                </DataItem>
                                <DataItem
                                    name="gender"
                                    question="你是GG还是MM?"
                                >
                                    <text>{profileData.data.gender}</text>
                                </DataItem>

                                <DataItem
                                    name="birthday"
                                    question="你多少岁了?"
                                >
                                    <text>{profileData.data.birthday}</text>
                                </DataItem>
                                <DataItem name="death" question="你什么时候死?">
                                    <text>{profileData.data.death}</text>
                                </DataItem>
                                <DataItem
                                    name="sexual orientation"
                                    icon="sexual"
                                    question="你喜欢GG还是MM?"
                                >
                                    <text>
                                        {profileData.data.sexualOrientation}
                                    </text>
                                </DataItem>
                                <DataItem
                                    name="political orientation"
                                    icon="political"
                                    question="你是左还是右?"
                                >
                                    <text>
                                        {profileData.data.politicalOrientation}
                                    </text>
                                </DataItem>
                                <DataItem
                                    name="religion"
                                    question="你信仰宗教吗?"
                                >
                                    <text>{profileData.data.religion}</text>
                                </DataItem>
                                <DataItem
                                    name="pronouns"
                                    icon="meh"
                                    question="你希望别人怎么称呼你?"
                                >
                                    <text>{profileData.data.pronouns}</text>
                                </DataItem>
                                <DataItem
                                    name="ancestor"
                                    icon="human"
                                    question="你的祖先是谁?"
                                >
                                    <text>{profileData.data.ancestor}</text>
                                </DataItem>
                                <DataItem
                                    name="marriage"
                                    icon="wedding"
                                    question="你结婚了吗?"
                                >
                                    <text>{profileData.data.marriage}</text>
                                </DataItem>

                                <DataItem
                                    name="materials"
                                    question="你是由什么构成的?"
                                >
                                    <text>{profileData.data.materials}</text>
                                </DataItem>

                                <DataItem
                                    name="halflife"
                                    question="你的半衰期是多少?"
                                    icon="physic"
                                >
                                    <text>{profileData.data.halflife}</text>
                                </DataItem>
                                <DataItem
                                    name="physical form"
                                    icon="physic"
                                    question="你是什么样子?"
                                >
                                    <text>{profileData.data.physicalForm}</text>
                                </DataItem>
                                <DataItem
                                    name="health"
                                    question="你的健康状况怎么样?"
                                >
                                    <text>{profileData.data.health}</text>
                                </DataItem>
                                <DataItem
                                    name="blood type"
                                    icon="blood"
                                    question="你是什么血型?"
                                >
                                    <text>{profileData.data.bloodType}</text>
                                </DataItem>

                                <DataItem
                                    name="allergen"
                                    question="你有对什么东西过敏吗?"
                                >
                                    <text>{profileData.data.allergen}</text>
                                </DataItem>
                                <DataItem
                                    name="languages"
                                    question="你使用哪些语言?"
                                >
                                    <table className="border-base-content/15 **:border-base-content/10 mt-2 border-collapse border">
                                        <thead
                                            className="text-base-100 border-b"
                                            style={{
                                                background: `color-mix(in srgb,color-mix(in srgb,var(--color-primary), white) 90%,transparent)`,
                                            }}
                                        >
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="border-r p-3"
                                                >
                                                    language
                                                </th>
                                                <th scope="col" className="p-3">
                                                    level
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-base-100 text-base-content">
                                            {profileData.data.languages?.map(
                                                (item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="even:bg-base-200 border-b last-of-type:border-b-0"
                                                    >
                                                        <th
                                                            scope="row"
                                                            className="border-r p-2"
                                                        >
                                                            {item.name}
                                                        </th>
                                                        <td className="p-2 text-center">
                                                            {item.level}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
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
                                className="bg-base-100 flex flex-col items-start justify-start rounded-md p-8 shadow-2xl"
                                style={{
                                    ...(content === 'introduction'
                                        ? { order: 1 }
                                        : { order: 2 }),
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
                                className="bg-base-100 flex flex-col items-start justify-start rounded-md p-8 shadow-2xl"
                                style={{
                                    ...(content === 'timeline'
                                        ? { order: 1 }
                                        : { order: 2 }),
                                }}
                            >
                                <div className="text-base-content/50 w-full text-xs">
                                    <p className="before:content-['#TimeLine']"></p>
                                    <div className="divider my-1"></div>
                                </div>
                                <TimeLine />
                            </section>
                        </div>
                    </div>
                </article>
            </div>
        </>
    )
}
