import { Outlet } from 'react-router'
import NavBar from '../components/navBar'
import Footer from '../components/footer'
import '../styles/baseLayout.css'
import {
    useEffect,
    useState,
    useRef,
    useLayoutEffect,
    lazy,
    Suspense,
} from 'react'
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

const HeaderBanner = lazy(() => import('../components/headBanner'))

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
    const totalHeightRef = useRef(0)
    const isBannerVisibleRef = useRef(true)

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
    }, [setProfileData])

    // 同步 showDown 状态与 isBannerLayout 变化
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

    // 优化：使用 ResizeObserver 监听文档高度变化，避免在 scroll 事件中频繁读取 scrollHeight 导致重排
    useEffect(() => {
        const updateHeight = () => {
            const scrollHeight = document.documentElement.scrollHeight
            const clientHeight = window.innerHeight
            totalHeightRef.current = scrollHeight - clientHeight
        }
        updateHeight()
        const observer = new ResizeObserver(updateHeight)
        observer.observe(document.documentElement)
        window.addEventListener('resize', updateHeight)
        return () => {
            observer.disconnect()
            window.removeEventListener('resize', updateHeight)
        }
    }, [])

    // 优化：使用 IntersectionObserver 监听 Banner 可见性，不可见时停止计算视差效果
    useEffect(() => {
        if (!elementRef.current) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                isBannerVisibleRef.current = entry.isIntersecting
            },
            { threshold: 0 }
        )
        observer.observe(elementRef.current)
        return () => observer.disconnect()
    }, [])

    // 3. 监听滚动 (仅处理视差效果，使用 requestAnimationFrame + 直接 DOM 操作优化性能)
    useEffect(() => {
        if (!bannerShow) return

        let ticking = false
        let lastPercent = -1

        const updatePercent = () => {
            // 在计算时实时获取最新的 scrollY
            const scrollTop = window.scrollY
            const totalHeight = totalHeightRef.current
            const totalPercent =
                totalHeight > 10
                    ? Math.min(scrollTop / (totalHeight - 10), 1)
                    : 0

            // 增加 10px 的容错范围
            if (scrollTop >= totalHeight - 10) {
                return
            }

            // 同步更新 CSS 变量，供样式计算使用
            wrapperRef.current?.style.setProperty(
                '--total-percent',
                `${totalPercent}`
            )

            // 优化：如果 Banner 不可见且已滚动到底部，直接跳过计算
            if (!isBannerVisibleRef.current && scrollTop > bannerHeight) {
                if (lastPercent !== 1) {
                    wrapperRef.current?.style.setProperty(
                        '--scroll-percent',
                        '1'
                    )
                    lastPercent = 1
                }
                return
            }

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
                                <Suspense
                                    fallback={
                                        <div className="h-full w-full animate-pulse bg-black" />
                                    }
                                >
                                    <HeaderBanner />
                                </Suspense>
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
                        className="relative z-9 mx-auto w-fit"
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

                <div className="sticky bottom-0 left-full z-10 h-48 w-fit bg-transparent drop-shadow-2xl drop-shadow-amber-950">
                    <button
                        className={`${showUp && navShow ? 'cursor-pointer opacity-100' : 'pointer-events-none opacity-0'} absolute right-3 bottom-0 w-10 transition-opacity delay-500 duration-500 ease-in-out`}
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
