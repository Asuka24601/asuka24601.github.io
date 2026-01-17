import { useEffect, useLayoutEffect, useRef } from 'react'
import { useBannerStore, useProfileDataStore } from '../lib/store'
import cover from '../assets/cover.webp'
import camera from '../assets/camera.webp'
import gender from '../assets/icons/gender.svg'
import location from '../assets/icons/location.svg'
import birthday from '../assets/icons/birthday.svg'
import death from '../assets/icons/death.svg'
import sexualOrientation from '../assets/icons/sexual.svg'
import politicalOrientation from '../assets/icons/political.svg'
import pronouns from '../assets/icons/meh.svg'
import ancestor from '../assets/icons/resoruces.svg'
import marriage from '../assets/icons/wedding.svg'
import language from '../assets/icons/icons/languages.svg'

export default function About() {
    const elementRef = useRef<HTMLImageElement>(null)

    const resetImage = useBannerStore((state) => state.resetImage)
    const resetBannerRelative = useBannerStore(
        (state) => state.resetBannerRelative
    )
    const setBannerShow = useBannerStore((state) => state.setBannerShow)
    const resetBannerShow = useBannerStore((state) => state.resetBannerShow)
    const setBannerRelative = useBannerStore((state) => state.setBannerRelative)

    useLayoutEffect(() => {
        setBannerShow(false)
        setBannerRelative(false)
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
                            src={profileData.data.avatar}
                            alt="avatar"
                            draggable="false"
                            className="outline-base-content/15 rounded-full shadow-xs outline-1"
                        />
                    </div>
                    <h1 className="mt-3 text-2xl first-letter:uppercase">
                        <strong>{profileData.data.name}</strong>
                    </h1>
                    <section className="flex flex-col items-start justify-center gap-2">
                        <p className="self-center">
                            {profileData.data.introduction}
                        </p>
                        <br />
                        <div>
                            <img
                                src={gender}
                                alt="gender"
                                draggable="false"
                                className="aspect-square h-auto w-6"
                            />
                            <p>{profileData.data.gender}</p>
                        </div>

                        <div>
                            <img
                                src={location}
                                alt="location"
                                draggable="false"
                                className="aspect-square h-auto w-6"
                            />
                            <p>{profileData.data.location}</p>
                        </div>

                        <div>
                            <img
                                src={birthday}
                                alt="birthday"
                                draggable="false"
                                className="aspect-square h-auto w-6"
                            />
                            <p>{profileData.data.birthday}</p>
                        </div>

                        <div>
                            <img
                                src={death}
                                alt="death"
                                draggable="false"
                                className="aspect-square h-auto w-6"
                            />
                            <p>{profileData.data.death}</p>
                        </div>

                        <div>
                            <img
                                src={sexualOrientation}
                                alt="sexualOrientation"
                                draggable="false"
                                className="aspect-square h-auto w-6"
                            />
                            <p>{profileData.data.sexualOrientation}</p>
                        </div>

                        <div>
                            <img
                                src={politicalOrientation}
                                alt="politicalOrientation"
                                draggable="false"
                                className="aspect-square h-auto w-6"
                            />
                            <p>{profileData.data.politicalOrientation}</p>
                        </div>

                        <div>
                            <img
                                src={pronouns}
                                alt="pronouns"
                                draggable="false"
                                className="aspect-square h-auto w-6"
                            />
                            <p>{profileData.data.pronouns}</p>
                        </div>

                        <div>
                            <img
                                src={ancestor}
                                alt="ancestor"
                                draggable="false"
                                className="aspect-square h-auto w-6"
                            />
                            <p>{profileData.data.ancestor}</p>
                        </div>

                        <div>
                            <img
                                src={marriage}
                                alt="marriage"
                                draggable="false"
                                className="aspect-square h-auto w-6"
                            />
                            <p>{profileData.data.marriage}</p>
                        </div>

                        <div>
                            <img
                                src={language}
                                alt="language"
                                draggable="false"
                                className="aspect-square h-auto w-6"
                            />
                            <ul>
                                {profileData.data.languages?.map(
                                    (item, index) => (
                                        <li key={index}>
                                            {item.name}:{item.level}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </section>
                </article>
            </div>
        </>
    )
}
