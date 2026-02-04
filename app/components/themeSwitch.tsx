import { useEffect } from 'react'
import { useThemeStore } from '../lib/store'
import SvgIcon from './SvgIcon'
import { flushSync } from 'react-dom'

const ThemeSwitch = () => {
    const theme = useThemeStore((state) => state.theme)
    const setTheme = useThemeStore((state) => state.setTheme)

    useEffect(() => {
        const localTheme = localStorage.getItem('theme')
        if (localTheme === 'dark' || localTheme === 'light') {
            setTheme(localTheme)
        } else {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = (e: MediaQueryListEvent) => {
                setTheme(e.matches ? 'dark' : 'light')
            }
            setTheme(mediaQuery.matches ? 'dark' : 'light')
            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }
    }, [setTheme])

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.dataset.theme = 'dark'
        } else {
            document.documentElement.dataset.theme = 'light'
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = (event: React.MouseEvent<HTMLInputElement>) => {
        const isDark = theme === 'dark'
        const nextTheme = isDark ? 'light' : 'dark'
        localStorage.setItem('theme', nextTheme)

        if (!document.startViewTransition) {
            setTheme(nextTheme)
            return
        }

        const x = event.clientX
        const y = event.clientY
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        )

        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setTheme(nextTheme)
            })
            document.documentElement.dataset.theme = nextTheme
        })

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ]
            document.documentElement.animate(
                {
                    clipPath: clipPath,
                },
                {
                    duration: 500,
                    easing: 'ease-in',
                    pseudoElement: '::view-transition-new(root)',
                }
            )
        })
    }

    return (
        <>
            <style>{`
                                    ::view-transition-old(root),
                                    ::view-transition-new(root) {
                                        animation: none;
                                        mix-blend-mode: normal;
                                    }
                                `}</style>
            <label className="swap swap-rotate hover:text-primary text-base-content/70 transition-colors">
                <input
                    type="checkbox"
                    className="theme-controller"
                    value="synthwave"
                    checked={theme === 'dark'}
                    onChange={() => {}}
                    onClick={toggleTheme}
                />
                <SvgIcon name="sun" className="swap-off" size={20} />
                <SvgIcon name="moon" className="swap-on" size={20} />
            </label>
        </>
    )
}

export default ThemeSwitch
