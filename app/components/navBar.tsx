import { Link } from 'react-router'
import { Sun, Moon, Search, Menu } from './icons'
import '../styles/navBar.css'
import { useEffect, useState } from 'react'
import { throttle } from 'lodash' // 防抖/节流

export default function NavBar({
    className,
    siteName,
}: {
    className?: string | undefined
    siteName: string | undefined
}) {
    const listItems = [
        ['Home', '/'],
        // Other items
        ['Posts', '/posts'],
        ['About', '/about'],
        ['___temp___', '/___temp___'],
        ['Tags', '/tags'],
        ['Comments', '/comments'],
    ].map((item) => (
        <li key={item[0]}>
            {/* Use Link for navigation */}

            <Link className="btn btn-ghost" to={item[1]}>
                {item[0]}
            </Link>
        </li>
    ))

    const [scrolled, setScrolled] = useState(false)
    const [scrollPercent, setScrollPercent] = useState(0)
    const [isMenuOpen, setIsMenuOpen] = useState(true)

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
        <div className={`${className}`}>
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
                            <Menu
                                className="h-5 w-5"
                                stroke="currentColor"
                                fill="none"
                            />
                        </button>
                        <ul
                            tabIndex={0}
                            className={`menu menu-horizontal menu-anim z-1 ${isMenuOpen ? '' : 'menu-anim--hidden'}`}
                        >
                            {listItems}
                        </ul>
                    </div>

                    <div className="navbar-end w-auto px-4">
                        <button className="btn btn-ghost btn-circle">
                            <Search
                                stroke="currentColor"
                                fill="none"
                                className="h-5 w-5"
                            />
                        </button>

                        <label className="swap swap-rotate">
                            {/* this hidden checkbox controls the state */}
                            <input
                                type="checkbox"
                                className="theme-controller"
                                value="synthwave"
                            />

                            {/* sun icon */}
                            <Sun className="swap-off" />

                            {/* moon icon */}
                            <Moon className="swap-on" />
                        </label>
                    </div>
                </nav>
            </div>
        </div>
    )
}
