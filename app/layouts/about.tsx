import { useEffect, useRef } from 'react'
import { useProfileDataStore } from '../lib/store'
import { Outlet, NavLink } from 'react-router'
import cover from '../assets/cover.webp'
import camera from '../assets/camera.webp'
import CRTOverlay from '../components/effect/CRTOverlay'
import TextJitter from '../components/effect/textJitter'
import Avatar from '../components/avater'
import SideNav from '../components/sideNav'
import CRTScreen from '../components/effect/CRTScreen'
import { TreeStructure } from '../components/floatMenu'

const navItems = [
    { name: 'Archive', path: 'about' },
    { name: 'Introduction', path: 'about/introduction' },
    { name: 'TimeLine', path: 'about/timeline' },
]

function NavList() {
    return (
        <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
                <li key={item.name}>
                    <NavLink
                        to={item.path}
                        end={item.path === 'about'}
                        className={({ isActive }) =>
                            `flex items-center truncate py-1 pr-1 transition-colors duration-200 ${
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:text-primary text-white/70 hover:bg-white/5'
                            }`
                        }
                    >
                        <TreeStructure level={2} />
                        {item.name}
                    </NavLink>
                </li>
            ))}
        </ul>
    )
}

export default function About() {
    const elementRef = useRef<HTMLImageElement>(null)
    const imgContentRef = useRef<HTMLDivElement>(null)

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
            if (element.classList.contains('animate__flip')) return
            element.classList.add('animate__flip')
            setTimeout(() => {
                element.classList.remove('animate__flip')
            }, 1000)
        }
    }

    const profileData = useProfileDataStore((state) => state.profileData)

    return (
        <>
            <div className="min-h-screen w-full font-mono text-sm">
                <div className="border-primary animate__animated animate__fadeIn relative h-[40vh] w-full overflow-hidden border-b-4 border-double bg-black">
                    <div
                        ref={imgContentRef}
                        className="animate__animated animate__fadeIn animate__slow pointer-events-none mx-auto aspect-square transition-all duration-500 select-none"
                        style={{
                            height: 'calc(100% - var(--navbar-height))',
                            translate: '0 var(--navbar-height)',
                        }}
                        draggable="false"
                    >
                        <img
                            src={cover}
                            alt="cover"
                            draggable="false"
                            className="pointer-events-none aspect-square h-full w-auto object-cover object-center opacity-80 select-none"
                        />
                        <img
                            ref={elementRef}
                            src={camera}
                            alt="camera"
                            draggable="false"
                            className="absolute top-[50%] left-1/2 h-full -translate-1/2 scale-[60.18%] object-cover drop-shadow-[0_30px_10px] drop-shadow-black select-none"
                            style={{
                                transform: `rotate(var(--rotate-angle))`,
                            }}
                        />
                    </div>
                    <CRTScreen />

                    <div className="text-secondary/25 absolute right-4 bottom-4 text-xs font-bold tracking-widest before:content-['CAM\_FEED\_01_[REC]']"></div>
                </div>

                <div className="border-terminal container mx-auto max-w-6xl overflow-visible! border-none!">
                    <CRTOverlay />
                    <TextJitter>
                        <div className="border-primary bg-modalBlack relative flex flex-col border-4 border-double">
                            {/* Profile Header */}
                            <div className="border-primary/30 flex flex-col items-center gap-6 border-b-2 border-dashed bg-black/20 p-6 lg:flex-row lg:p-8">
                                <div
                                    className="group shrink-0 cursor-pointer"
                                    onClick={avatarOnClick}
                                >
                                    <div className="border-primary/50 group-hover:border-primary border-2 border-dashed p-1 transition-colors">
                                        <div className="h-24 w-24 overflow-hidden bg-black">
                                            <Avatar
                                                src={profileData.data.avatar}
                                                className="animate__animated h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col gap-2 text-center lg:text-left">
                                    <div className="flex items-center justify-center gap-2 lg:justify-start">
                                        <h1 className="text-primary text-2xl font-black tracking-widest uppercase lg:text-3xl">
                                            {profileData.data.name}
                                        </h1>
                                        <span className="border border-white/20 px-1 text-[10px] text-white/30 before:content-['LV.99']"></span>
                                    </div>
                                    <div className="max-w-2xl font-mono text-xs leading-relaxed text-white/70 lg:text-sm">
                                        <span className="text-primary mr-2 before:content-['>>']"></span>
                                        {profileData.data.introduction}
                                        <span className="ml-1 animate-pulse after:content-['\_']"></span>
                                    </div>
                                </div>

                                <div className="hidden text-right text-[10px] tracking-widest text-white/30 uppercase lg:block">
                                    <div className="before:content-['ID:_']">
                                        {profileData.data.name
                                            .toUpperCase()
                                            .slice(0, 10)}
                                    </div>
                                    <div className="before:content-['LOC:_UNKNOWN']"></div>
                                    <div className="before:content-['STATUS:_ACTIVE']"></div>
                                </div>
                            </div>

                            {/* Content Split */}
                            <div className="flex min-h-[60vh] flex-col lg:flex-row">
                                {/* Sidebar (Desktop) */}
                                <aside className="border-primary/30 relative hidden w-64 shrink-0 border-r-2 border-dashed bg-black/10 lg:block">
                                    <div
                                        className="sticky left-0"
                                        style={{
                                            top: 'var(--navbar-height)',
                                        }}
                                    >
                                        <div className="border-b border-dashed border-white/10 p-4">
                                            <div className="mb-2 text-[10px] font-bold tracking-widest text-white/50 uppercase before:content-['\/\/_NAVIGATION']"></div>
                                            <NavList />
                                        </div>
                                        {/* Decorative filler */}
                                        <div className="p-4 font-mono text-[10px] leading-tight break-all text-white/20 opacity-50 select-none">
                                            0101010101001001010
                                            1010101010101010101
                                            0010110101010101010 ...
                                        </div>
                                    </div>
                                </aside>

                                {/* Main Content */}
                                <main className="flex-1 overflow-hidden p-4 lg:p-8">
                                    <Outlet />
                                </main>
                            </div>

                            {/* Footer Status Bar */}
                            <div className="border-primary/30 flex items-center justify-between border-t border-dashed bg-black/20 p-2 px-4 text-[10px] text-white/40 uppercase">
                                <span className="before:content-['ACCESS\_LEVEL:_ADMIN']"></span>
                                <span className="before:content-['SYS\_TIME:_']">
                                    {new Date().toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    </TextJitter>
                </div>
            </div>
            {/* Mobile Nav */}
            <SideNav>
                <NavList />
            </SideNav>
        </>
    )
}
