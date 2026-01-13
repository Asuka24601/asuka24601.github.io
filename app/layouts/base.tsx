/* eslint-disable react-refresh/only-export-components */
import { Outlet, useLocation } from 'react-router'
import NavBar from '../components/navBar'
import Footer from '../components/footer'
import '../styles/baseLayout.css'
import HeaderBanner from '../components/headBanner'
import type { ProfileDataInterface } from '../interfaces/profile'
import fetchData from '../lib/fetchData'
import type { Route } from './+types/base'
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { EiArrowDown } from '../components/icons'

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

    const wrapperRef = useRef<HTMLDivElement>(null)
    const elementRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)
    const [bannerHeight, setBannerHeight] = useState(0)

    // 直接根据 location 计算布局模式，确保首屏渲染即正确，避免闪烁
    const isBannerLayout =
        location.pathname === '/' ||
        !!location.pathname.match(/^\/posts\/.+$/gm)

    const [showUp, setShowUp] = useState(isBannerLayout)
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
                // 同步更新 CSS 变量，供样式计算使用
                wrapperRef.current?.style.setProperty(
                    '--banner-height',
                    `${entry.contentRect.height}`
                )
            }
        })

        observer.observe(elementRef.current)
        return () => observer.disconnect()
    }, [])

    // 2. 使用 IntersectionObserver 优化 showUp 显示逻辑
    useEffect(() => {
        if (!isBannerLayout || !sentinelRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowUp(entry.isIntersecting)
            },
            { threshold: 0 }
        )

        observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [isBannerLayout])

    // 3. 监听滚动 (仅处理视差效果，使用 requestAnimationFrame + 直接 DOM 操作优化性能)
    useEffect(() => {
        if (!isBannerLayout) return

        let ticking = false
        let lastPercent = -1

        const updatePercent = () => {
            // 关键修改：在计算时实时获取最新的 scrollY，而不是使用事件触发时的旧值
            const scrollTop = window.scrollY
            const scrollHeight = document.documentElement.scrollHeight // 内容总高度
            const clientHeight = window.innerHeight // 视口高度

            // 增加 5px 的容错范围
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                return
            }
            const maxScroll = bannerHeight

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
    }, [isBannerLayout, bannerHeight])

    // 使用 useLayoutEffect 在浏览器绘制前重置状态，防止内容位置跳动
    useLayoutEffect(() => {
        if (!isBannerLayout) {
            wrapperRef.current?.style.setProperty('--scroll-percent', '1')
        } else {
            wrapperRef.current?.style.setProperty('--scroll-percent', '0')
        }
    }, [isBannerLayout])

    // 同步 showUp 状态与 isBannerLayout 变化
    useEffect(() => {
        setShowUp(isBannerLayout)
    }, [isBannerLayout])

    return (
        <>
            <main className="relative">
                <header className="sticky top-0 z-2 h-18">
                    <NavBar siteName={siteName} />
                </header>

                <div className="relative -top-18 z-0" ref={wrapperRef}>
                    <div
                        ref={elementRef}
                        className={`top-0 left-0 flex h-auto max-h-[calc(100dvh+50px)] w-full overflow-hidden select-none`}
                        style={{
                            ...(isBannerLayout
                                ? {
                                      position: 'relative',
                                      background: `color-mix(in srgb, black calc(max(0.125 - var(--scroll-percent, 0), 0) * 800%) , white)`,
                                  }
                                : {
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      background: `linear-gradient(to top,white ,white 50%,black 50%,black)`,
                                  }),
                        }}
                    >
                        {isBannerLayout && (
                            <div
                                ref={sentinelRef}
                                className="pointer-events-none absolute top-0 left-0 h-7.5 w-full bg-transparent"
                            />
                        )}
                        <HeaderBanner />
                        <div
                            className={
                                'absolute bottom-20 left-0 flex w-full justify-center transition-all duration-300 ease-in-out' +
                                (showUp
                                    ? 'opacity-100'
                                    : 'pointer-events-none opacity-0')
                            }
                        >
                            <button
                                className="btn btn-circle btn-ghost text-base-100 animate-bounce bg-transparent opacity-50"
                                onClick={scrollDown}
                            >
                                <EiArrowDown width={40} height={40} />
                            </button>
                        </div>
                    </div>

                    <section
                        className="relative z-9 mx-auto max-w-400 px-6 py-6"
                        style={{
                            ...(isBannerLayout
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
            </main>

            <footer className="relative z-1">
                <Footer profileData={profileData} />
            </footer>
        </>
    )
}
