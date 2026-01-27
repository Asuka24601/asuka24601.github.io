import { useEffect, useRef } from 'react'
import { useProfileDataStore } from '../lib/store'
import { Outlet, NavLink } from 'react-router'
import cover from '../assets/cover.webp'
import camera from '../assets/camera.webp'
import CRTScreen from '../components/effect/CRTScreen'
import Avatar from '../components/avater'
import SideNav from '../components/sideNav'

const navItems = [
    { name: 'Archive', path: 'about' },
    { name: 'Introduction', path: 'about/introduction' },
    { name: 'TimeLine', path: 'about/timeline' },
]

export default function About() {
    const elementRef = useRef<HTMLImageElement>(null)

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
                <div className="relative h-full w-full overflow-hidden bg-black">
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
                <article className="relative -top-25 mx-auto flex max-w-400 flex-col items-center justify-center">
                    <div
                        className="avatar h-50 w-50"
                        onClick={(e: React.MouseEvent<HTMLImageElement>) => {
                            avatarOnClick(e)
                        }}
                    >
                        <Avatar
                            src={profileData.data.avatar}
                            className="outline-base-content/15 animate__animated rounded-full shadow-xs outline-1"
                        />
                    </div>
                    <h1 className="mt-3 text-2xl first-letter:uppercase">
                        <strong>{profileData.data.name}</strong>
                    </h1>
                    <q className="text-base-content/50 text-sm">
                        {profileData.data.introduction}
                    </q>

                    <div className="relative mt-5 scroll-mt-20">
                        <main className="min-w-200">
                            <section
                                className="border-terminal flex w-full flex-col items-start justify-start gap-5"
                                style={{
                                    padding: 'calc(var(--spacing)*8)',
                                }}
                            >
                                <CRTScreen />
                                <Outlet />
                            </section>
                        </main>
                        <SideNav navItems={navItems} />
                        <aside className="absolute top-0 left-0 z-1 hidden h-full w-45 -translate-x-45 pr-3 xl:block">
                            <menu className="menu bg-base-100 rounded-box sticky top-28 hidden h-fit w-full shadow-xl xl:block">
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
                            </menu>
                        </aside>
                    </div>
                </article>
            </div>
        </>
    )
}
