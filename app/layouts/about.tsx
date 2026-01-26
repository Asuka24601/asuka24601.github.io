import { useEffect, useLayoutEffect, useRef } from 'react'
import { useBannerStore, useProfileDataStore } from '../lib/store'
import { Outlet, NavLink } from 'react-router'
import cover from '../assets/cover.webp'
import camera from '../assets/camera.webp'

const navItems = [
    { name: 'Archive', path: 'about' },
    { name: 'Introduction', path: 'about/introduction' },
    { name: 'TimeLine', path: 'about/timeline' },
]

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
        const handleAction = () => {
            setBannerShow(false)
            setBannerRelative(false)
        }

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

                    <div className="relative -left-24 mt-5 flex scroll-mt-20 flex-row gap-3">
                        <aside className="sticky top-28 z-1 h-fit w-45">
                            <ul className="menu bg-base-100 rounded-box sticky top-0 w-full shadow-xl">
                                <li>
                                    <h2 className="menu-title">Contents</h2>
                                    <ul>
                                        {navItems.map((item) => (
                                            <li key={item.name}>
                                                <NavLink to={item.path}>
                                                    {item.name}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </aside>
                        <div className="flex w-200 flex-col gap-6 *:w-full">
                            <section className="bg-base-100 flex flex-col items-start justify-start gap-5 rounded-md p-8 shadow-2xl transition-opacity ease-in-out">
                                <Outlet />
                            </section>
                        </div>
                    </div>
                </article>
            </div>
        </>
    )
}
