import { Link } from 'react-router'
// import { Sun, Moon, Search, Menu } from './icons'
import '../styles/navBar.css'
import { useEffect, useLayoutEffect, useState } from 'react'
import { throttle } from 'lodash-es' // 防抖/节流
import { useNavStore, useSearchStore } from '../lib/store'
import SvgIcon from './SvgIcon'

export default function NavBar({
    className,
    siteName,
}: {
    className?: string | ''
    siteName: string | undefined
}) {
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Posts', path: '/posts' },
        { name: 'About', path: '/about' },
        { name: 'Tags', path: '/tags' },
        { name: 'Comments', path: '/comments' },
    ]

    const [scrolled, setScrolled] = useState(false)
    const [scrollPercent, setScrollPercent] = useState(0)
    const [isMenuOpen, setIsMenuOpen] = useState(true)
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
        const calculateScrollPercent = () => {
            const scrollTop = window.scrollY
            const windowHeight = window.innerHeight
            const docHeight = document.documentElement.scrollHeight
            const maxScroll = Math.min((docHeight - windowHeight) / 2, 800)

            return maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0
        }

        const handleScroll = () => {
            const currentScroll = window.scrollY
            requestAnimationFrame(() => {
                setScrolled(currentScroll > 50)
                setScrollPercent(calculateScrollPercent())
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

    return (
        <div
            className={`${className} transition-opacity duration-300 ${navShow ? 'opacity-100' : 'pointer-events-none -z-50 opacity-0'}`}
        >
            <div
                className={`navbar__progress`}
                style={{
                    padding: `${Math.min(scrollPercent * 2, 0.5) * 2}rem`,
                }}
            >
                <nav
                    className={`navbar text-primary-content navbar--base ${scrolled ? 'navbar--compact shadow-sm' : ''}`}
                    style={{
                        borderRadius: `${Math.min(scrollPercent * 2, 0.5) * 0.5}rem`,
                        background: `color-mix(in srgb,color-mix(in srgb,
                         var(--color-primary), white) ${Math.min(scrollPercent * 2, 0.5) * 180}%,transparent)`,
                        willChange: 'border-radius, background, box-shadow',
                    }}
                >
                    <div className="navbar-start w-auto">
                        <Link to="/" className="btn btn-ghost text-xl">
                            <p className="first-letter:capitalize">
                                {siteName || 'Blog'}
                            </p>
                        </Link>
                    </div>
                    <div className="navbar-center flex-1">
                        <button
                            title="menu"
                            tabIndex={1}
                            type="button"
                            className="btn btn-ghost btn-circle"
                            onClick={() => {
                                setIsMenuOpen(!isMenuOpen)
                            }}
                        >
                            <SvgIcon
                                name="menu"
                                fill="none"
                                stroke="currentColor"
                            />
                        </button>
                        <ul
                            className={`menu menu-horizontal transition-opacity delay-75 ${isMenuOpen ? '' : 'menu-anim--hidden'}`}
                        >
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        className="btn btn-ghost"
                                        to={item.path}
                                    >
                                        <p>{item.name}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="navbar-end w-auto px-4">
                        <button
                            className="btn btn-ghost btn-circle"
                            title="search"
                            onClick={() => {
                                onSearchClick()
                            }}
                        >
                            <SvgIcon
                                name="search"
                                fill="none"
                                stroke="currentColor"
                            />
                        </button>

                        <label className="swap swap-rotate">
                            {/* this hidden checkbox controls the state */}
                            <input
                                type="checkbox"
                                className="theme-controller"
                                value="synthwave"
                            />
                            <SvgIcon name="sun" className="swap-off" />
                            <SvgIcon name="moon" className="swap-on" />
                        </label>
                    </div>
                </nav>
            </div>
        </div>
    )
}
