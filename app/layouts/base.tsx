/* eslint-disable react-refresh/only-export-components */
import { Outlet } from 'react-router'
import NavBar from '../components/navBar'
import Footer from '../components/footer'
import '../styles/baseLayout.css'
import HeaderBanner from '../components/headBanner'
import type { ProfileDataInterface } from '../interfaces/profile'
import fetchData from '../lib/fetchData'
import type { Route } from './+types/base'
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { EiArrowDown } from '../components/icons'
import { useBannerStore, useProfileDataStore } from '../lib/store'

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

    const wrapperRef = useRef<HTMLDivElement>(null)
    const elementRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)
    const [bannerHeight, setBannerHeight] = useState(0)
    const bannerRelative = useBannerStore((state) => state.bannerRelative)
    const bannerShow = useBannerStore((state) => state.bannerShow)
    const [showUp, setShowUp] = useState(bannerRelative)
    const setProfileData = useProfileDataStore((state) => state.setProfileData)

    const scrollDown = () => {
        setShowUp(false)
        window.scrollTo({
            top: bannerHeight / 2 - 8,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        setProfileData(profileData)
    }, [setProfileData, profileData])

    // 同步 showUp 状态与 isBannerLayout 变化
    useEffect(() => {
        setShowUp(bannerRelative)
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

    // 2. 使用 IntersectionObserver 优化 showUp 显示逻辑
    useEffect(() => {
        if (!bannerRelative || !sentinelRef.current || !bannerShow) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowUp(entry.isIntersecting)
            },
            { threshold: 0 }
        )

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
    }, [bannerHeight, bannerShow])

    // 使用 useLayoutEffect 在浏览器绘制前重置状态，防止内容位置跳动
    useLayoutEffect(() => {
        wrapperRef.current?.style.setProperty('--scroll-percent', '0')
    })

    return (
        <>
            <main className="relative">
                <header className="sticky top-0 z-2 w-full">
                    <NavBar siteName={siteName} />
                </header>

                <div className="relative -top-18 z-0" ref={wrapperRef}>
                    {bannerShow && (
                        <div
                            ref={elementRef}
                            className={`top-0 left-0 h-dvh w-full overflow-hidden select-none`}
                            style={{
                                background: `color-mix(in srgb, black calc(max(0.125 - var(--scroll-percent, 0), 0) * 800%) , white)`,

                                ...(bannerRelative
                                    ? {
                                          position: 'relative',
                                      }
                                    : {
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                      }),
                            }}
                        >
                            {bannerRelative && (
                                <div
                                    ref={sentinelRef}
                                    className="pointer-events-none absolute top-0 left-0 h-7.5 w-full bg-transparent"
                                />
                            )}
                            <HeaderBanner />
                            <button
                                onClick={scrollDown}
                                className={
                                    'btn btn-ghost absolute bottom-0 left-0 z-10 flex h-20 w-full justify-center border-0 bg-transparent shadow-none transition-all duration-300 ease-in-out' +
                                    (showUp
                                        ? ' opacity-100'
                                        : ' pointer-events-none opacity-0')
                                }
                            >
                                <div className="text-base-100 animate-bounce bg-transparent opacity-50">
                                    <EiArrowDown width={40} height={40} />
                                </div>
                            </button>
                        </div>
                    )}
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
            </main>

            <footer className="relative z-1">
                <Footer
                    name={profileData.data.name}
                    discription={profileData.data.discription}
                    socialMedia={profileData.data.socialMedia}
                />
            </footer>
        </>
    )
}
