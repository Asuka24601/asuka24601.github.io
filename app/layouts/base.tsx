/* eslint-disable react-refresh/only-export-components */
import { Outlet } from 'react-router'
import NavBar from '../components/navBar'
import Footer from '../components/footer'
import '../styles/baseLayout.css'
import HeaderBanner from '../components/headBanner'
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import {
    useBannerStore,
    useProfileDataStore,
    useSearchStore,
    useNavStore,
} from '../lib/store'
import SvgIcon from '../components/SvgIcon'
import Search from '../components/search'
import toUp from '../assets/toUp.webp'
import LightBox from '../components/lightBox'
import { max } from 'lodash-es'
import profileData from '../assets/data/author.json'

export default function BaseLayout() {
    const siteName = `${profileData.data.name}'Site`

    const navShow = useNavStore((state) => state.navShow)
    const searchShow = useSearchStore((state) => state.searchShow)
    const bannerRelative = useBannerStore((state) => state.bannerRelative)
    const bannerShow = useBannerStore((state) => state.bannerShow)

    const setProfileData = useProfileDataStore((state) => state.setProfileData)

    const wrapperRef = useRef<HTMLDivElement>(null)
    const elementRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)

    const [bannerHeight, setBannerHeight] = useState(0)
    const [showDown, setShowDown] = useState(bannerRelative)
    const [showUp, setShowUp] = useState(false)

    const scrollDown = () => {
        setShowDown(false)
        window.scrollTo({
            top: bannerHeight / 2 - 8,
            behavior: 'smooth',
        })
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        setProfileData(profileData)
    }, [setProfileData, profileData])

    // 同步 showUp 状态与 isBannerLayout 变化
    useEffect(() => {
        setShowDown(bannerRelative)
    }, [bannerRelative])

    // 1. 使用 ResizeObserver 获取精确高度（适配 auto 和窗口缩放）
    useEffect(() => {
        if (!elementRef.current) return

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // contentRect 提供了不含 padding 的高度
                setBannerHeight(entry.contentRect.height)
                // 同步更新 CSS 变量，供样式计算使用
                wrapperRef.current?.style.setProperty(
                    '--banner-height',
                    `${entry.contentRect.height}`
                )
            }
        })

        observer.observe(elementRef.current)
        return () => observer.disconnect()
    })

    // 2. 使用 IntersectionObserver 优化 showUp 和 showDown 显示逻辑
    useEffect(() => {
        if (!sentinelRef.current) return

        let callback: IntersectionObserverCallback

        if (!bannerRelative || !bannerShow) {
            callback = ([entry]) => {
                setShowUp(!entry.isIntersecting)
            }
        } else {
            callback = ([entry]) => {
                setShowUp(!entry.isIntersecting)
                setShowDown(entry.isIntersecting)
            }
        }

        const observer = new IntersectionObserver(callback, { threshold: 0 })

        observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [bannerRelative, bannerShow])

    // 3. 监听滚动 (仅处理视差效果，使用 requestAnimationFrame + 直接 DOM 操作优化性能)
    useEffect(() => {
        if (!bannerShow) return

        let ticking = false
        let lastPercent = -1

        const updatePercent = () => {
            // 在计算时实时获取最新的 scrollY
            const scrollTop = window.scrollY
            const scrollHeight = document.documentElement.scrollHeight // 内容总高度
            const clientHeight = window.innerHeight // 视口高度
            const totalHeight = scrollHeight - clientHeight
            const totalPercent =
                totalHeight > 10 ? scrollTop / (totalHeight - 10) : 0

            // 增加 5px 的容错范围
            if (scrollTop >= totalHeight - 10) {
                return
            }
            wrapperRef.current?.style.setProperty(
                '--total-percent',
                `${totalPercent}`
            )

            const maxScroll = max([0, bannerHeight])

            // 1. 限制范围在 0-1 之间，防止顶部回弹出现负数，并设置“终点区域”（>1 时恒为 1）
            const percent =
                maxScroll > 0
                    ? Math.min(Math.max(scrollTop / maxScroll, 0), 1)
                    : 0

            // 2. 只有当值真正发生变化时才更新 DOM，避免在底部（percent=1）时重复写入导致闪烁
            if (percent !== lastPercent) {
                wrapperRef.current?.style.setProperty(
                    '--scroll-percent',
                    `${percent}`
                )
                lastPercent = percent
            }
        }

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updatePercent()
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        // 初始化时执行一次，确保刷新后（如果停留在页面中间）位置正确
        updatePercent()

        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [bannerHeight, bannerShow])

    // 使用 useLayoutEffect 在浏览器绘制前重置状态，防止内容位置跳动
    useLayoutEffect(() => {
        wrapperRef.current?.style.setProperty('--scroll-percent', '0')
        wrapperRef.current?.style.setProperty('--total-percent', '0')
    }, [])

    return (
        <>
            <main className="relative">
                <header className="sticky top-0 z-3 w-full">
                    <NavBar siteName={siteName} />
                </header>

                <div className="relative -top-18 z-2" ref={wrapperRef}>
                    <div
                        ref={elementRef}
                        className={`top-0 left-0 w-full overflow-hidden select-none ${bannerShow ? 'h-dvh bg-[color-mix(in_srgb,black_calc(max(0.125-var(--scroll-percent,0),0)*800%),white)]' : ''}`}
                        style={{
                            ...(bannerRelative && bannerShow
                                ? {
                                      position: 'relative',
                                  }
                                : {
                                      position: 'absolute',
                                  }),
                        }}
                    >
                        <div
                            ref={sentinelRef}
                            className="pointer-events-none absolute top-0 left-0 h-20 w-full bg-transparent"
                        />
                        {bannerShow && (
                            <>
                                <HeaderBanner />
                                <button
                                    onClick={scrollDown}
                                    className={
                                        'btn btn-ghost absolute bottom-0 left-0 z-10 flex h-20 w-full justify-center border-0 bg-transparent shadow-none transition-all duration-300 ease-in-out' +
                                        (showDown
                                            ? ' opacity-100'
                                            : ' pointer-events-none opacity-0')
                                    }
                                >
                                    <div className="text-base-100 animate-bounce bg-transparent opacity-50">
                                        <SvgIcon name="arrowDown" size={40} />
                                    </div>
                                </button>
                            </>
                        )}
                    </div>

                    <section
                        className="relative z-9"
                        style={{
                            ...(bannerRelative
                                ? {
                                      marginTop: `calc(calc(var(--scroll-percent, 0) * var(--banner-height, 0) * -1px) + calc(var(--spacing) * 18))`,
                                  }
                                : {
                                      top: `calc(var(--spacing) * 18)`,
                                      minHeight: `${bannerHeight}px`,
                                  }),
                        }}
                    >
                        <Outlet />
                    </section>
                </div>

                <div className="sticky bottom-0 left-full z-10 h-48 w-80 bg-transparent drop-shadow-2xl drop-shadow-amber-950">
                    <button
                        className={`${showUp && navShow ? 'cursor-pointer opacity-100' : 'pointer-events-none opacity-0'} absolute right-3 bottom-0 transition-opacity delay-500 duration-500 ease-in-out`}
                        onClick={() => {
                            scrollToTop()
                        }}
                    >
                        <img
                            role="button"
                            tabIndex={0}
                            src={toUp}
                            alt="toUp"
                            className="aspect-auto h-auto w-10"
                            draggable="false"
                            onClick={(e) => {
                                const target = e.target as HTMLImageElement
                                if (
                                    !target.classList.contains('animate-jump')
                                ) {
                                    target.classList.add('animate-jump')
                                    setTimeout(() => {
                                        target.classList.remove('animate-jump')
                                    }, 500)
                                }
                            }}
                        />
                    </button>
                </div>
            </main>

            <footer className="relative z-0">
                <Footer
                    name={profileData.data.name}
                    discription={profileData.data.discription}
                    socialMedia={profileData.data.socialMedia}
                />
            </footer>

            {searchShow && <Search />}
            <LightBox />
        </>
    )
}
