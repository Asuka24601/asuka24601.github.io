/* eslint-disable react-refresh/only-export-components */
import { Outlet, useLocation } from 'react-router'
import NavBar from '../components/navBar'
import Footer from '../components/footer'
import '../styles/baseLayout.css'
import HeaderBanner from '../components/headBanner'
import type { ProfileDataInterface } from '../interfaces/profile'
import fetchData from '../lib/fetchData'
import type { Route } from './+types/base'
import { useEffect, useState, useRef, useCallback } from 'react'

export async function clientLoader(): Promise<{
    profileData: ProfileDataInterface
}> {
    const profileFilePath = '/data/author.json'
    const loaderProfileData = await fetchData(profileFilePath, 'json')
    return {
        profileData: loaderProfileData,
    }
}

export default function BaseLayout({ loaderData }: Route.ComponentProps) {
    const { profileData } = loaderData
    const siteName = `${profileData.data.name}'Site`
    const location = useLocation()

    const [scrollPercent, setScrollPercent] = useState(0)
    const elementRef = useRef<HTMLDivElement>(null)
    const [bannerHeight, setBannerHeight] = useState(0)
    const [mTop, setMTop] = useState(false)

    const [showUp, setShowUp] = useState(true)
    const scrollDown = () => {
        setShowUp(false)
        window.scrollTo({
            top: bannerHeight / 2,
            behavior: 'smooth',
        })
    }

    // 1. 使用 ResizeObserver 获取精确高度（适配 auto 和窗口缩放）
    useEffect(() => {
        if (!elementRef.current) return

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // contentRect 提供了不含 padding 的高度
                setBannerHeight(entry.contentRect.height)
            }
        })

        observer.observe(elementRef.current)
        return () => observer.disconnect()
    }, [])

    // 2. 抽离计算逻辑，确保能获取最新的 bannerHeight
    const scrollAction = useCallback(() => {
        const scrollHeight = document.documentElement.scrollHeight // 内容总高度
        const clientHeight = window.innerHeight // 视口高度

        const scrollTop = window.scrollY
        if (scrollTop < 30) setShowUp(true)
        else setShowUp(false)

        if (scrollTop + clientHeight >= scrollHeight - 5) {
            // 防止重复触发
            return
        }

        const maxScroll = bannerHeight
        const percent = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0
        // const percent = scrollTop / maxScroll
        setScrollPercent(percent)
    }, [bannerHeight]) // 当高度变化时，重新生成滚动逻辑

    // 3. 监听滚动
    useEffect(() => {
        if (
            location.pathname != '/' &&
            !location.pathname.match(/^\/posts\/.+$/gm)
        )
            return
        window.addEventListener('scroll', scrollAction, { passive: true })
        return () => window.removeEventListener('scroll', scrollAction)
    }, [scrollAction, location])

    // Set scrollPercent to 1 if not on homepage or a post page, to hide the banner
    useEffect(() => {
        if (
            location.pathname != '/' &&
            !location.pathname.match(/^\/posts\/.+$/gm)
        ) {
            // Use a timeout to avoid synchronous setState in effect, which can cause cascading renders
            setTimeout(() => {
                setScrollPercent(1)
                setShowUp(false)
                setMTop(false)
            }, 0)
        } else
            setTimeout(() => {
                setScrollPercent(0)
                setShowUp(true)
                setMTop(true)
            }, 0)
    }, [location])

    return (
        <>
            <main className="relative">
                <header className="sticky top-0 z-10 h-18 overflow-visible">
                    <NavBar siteName={siteName} />
                </header>

                <div className="relative -top-18">
                    <div
                        ref={elementRef}
                        className="relative top-0 left-0 flex h-auto max-h-dvh w-full overflow-hidden"
                        style={
                            mTop
                                ? {}
                                : {
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                  }
                        }
                    >
                        <HeaderBanner />
                        <div
                            className={
                                'absolute bottom-5 left-0 flex w-full justify-center transition-all duration-300 ease-in-out' +
                                (showUp
                                    ? 'opacity-100'
                                    : 'pointer-events-none opacity-0')
                            }
                        >
                            <button
                                className="btn btn-circle btn-ghost animate-bounce"
                                onClick={scrollDown}
                            >
                                <p>Click</p>
                            </button>
                        </div>
                    </div>

                    <section
                        className="relative z-9 mx-auto max-w-400 px-6 py-6"
                        style={
                            mTop
                                ? {
                                      marginTop: `calc(-${scrollPercent * bannerHeight}px + calc(var(--spacing) * 18))`,
                                  }
                                : {
                                      top: `calc(var(--spacing) * 18)`,
                                      minHeight: `${bannerHeight}px`,
                                      //   top: `calc(-${scrollPercent * bannerHeight}px + calc(var(--spacing) * 18))`,
                                  }
                        }
                    >
                        <Outlet />
                    </section>
                </div>
            </main>

            <footer className="relative">
                <Footer profileData={profileData} />
            </footer>
        </>
    )
}
