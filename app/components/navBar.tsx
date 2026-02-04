import { Link } from 'react-router'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { throttle } from 'lodash-es' // 防抖/节流
import { useNavStore, useSearchStore } from '../lib/store'
import SvgIcon from './SvgIcon'
import CRTOverlay from './effect/CRTOverlay'
import TextJitter from './effect/textJitter'
import ThemeSwitch from './themeSwitch'

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Posts', path: '/posts' },
    { name: 'About', path: '/about' },
    { name: 'Tags', path: '/tags' },
    { name: 'Comments', path: '/comments' },
]

export default function NavBar({
    className,
    siteName,
}: {
    className?: string | ''
    siteName: string | undefined
}) {
    const [scrolled, setScrolled] = useState(false)
    // const [scrollPercent, setScrollPercent] = useState(0) // Removed unused state
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)

    const navShow = useNavStore((state) => state.navShow)
    const resetNav = useNavStore((state) => state.resetNavShow)
    const searchShow = useSearchStore((state) => state.searchShow)
    const setSearchShow = useSearchStore((state) => state.setSearchShow)
    const resetSearch = useSearchStore((state) => state.resetSearchShow)

    const onSearchClick = () => {
        if (searchShow) return
        setSearchShow(true)
    }

    useLayoutEffect(() => {
        resetNav()
        resetSearch()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY
            requestAnimationFrame(() => {
                setScrolled(currentScroll > 20)
            })
        }

        // 使用节流优化性能
        const throttledScroll = throttle(handleScroll, 16) // ~60fps

        window.addEventListener('scroll', throttledScroll, { passive: true })
        handleScroll() // 初始化

        return () => {
            throttledScroll.cancel()
            window.removeEventListener('scroll', throttledScroll)
        }
    }, [])

    useEffect(() => {
        const element = elementRef.current
        if (!element) return
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (entry) {
                document.body.style.setProperty(
                    '--navbar-height',
                    entry.target.getBoundingClientRect().height + 'px'
                )
            }
        })
        observer.observe(element)
        return () => {
            observer.disconnect()
        }
    }, [elementRef])

    return (
        <div
            className={`${className || ''} fixed top-0 left-0 z-50 w-full font-mono text-sm transition-all duration-500 ${navShow ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
            ref={elementRef}
        >
            <div
                className={`border-neutral bg-base-200 relative w-full overflow-hidden border-b-4 border-double shadow-[0_4px_0px_0px_rgba(0,0,0,0.3)] transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}
            >
                <CRTOverlay />
                <TextJitter>
                    <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                to="/"
                                className="group text-primary hover:text-base-content flex items-center gap-2 transition-colors"
                            >
                                <span className="text-lg font-black tracking-widest uppercase before:content-['>_']">
                                    {siteName || 'SYSTEM'}
                                </span>
                                <span className="bg-primary hidden h-5 w-2.5 animate-pulse lg:block"></span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden items-center gap-8 lg:flex">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="group hover:text-primary text-base-content/70 relative text-xs font-bold tracking-widest uppercase transition-colors"
                                >
                                    <span className="absolute -left-3 opacity-0 transition-opacity group-hover:opacity-100 before:content-['[']"></span>
                                    {item.name}
                                    <span className="absolute -right-3 opacity-0 transition-opacity group-hover:opacity-100 after:content-[']']"></span>
                                </Link>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onSearchClick}
                                className="hover:text-primary text-base-content/70 transition-colors"
                                title="SEARCH_DATABASE"
                            >
                                <SvgIcon name="search" size={20} />
                            </button>

                            <ThemeSwitch />

                            <button
                                className="hover:text-primary text-base-content/70 transition-colors lg:hidden"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <SvgIcon name="menu" fill="white" size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        className={`bg-base-200/50 overflow-hidden border-t border-dashed border-white/10 transition-all duration-300 lg:hidden ${isMenuOpen ? 'max-h-64' : 'max-h-0'}`}
                    >
                        <ul className="flex flex-col gap-2 p-4">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="hover:text-primary text-base-content/70 block px-2 py-2 text-xs font-bold tracking-widest uppercase transition-colors hover:bg-white/5"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="text-primary/50 mr-2 select-none">{`>>`}</span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
