import {
    lazy,
    Suspense,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import SvgIcon from './SvgIcon'
import { max } from 'lodash-es'

const HeaderBanner = lazy(() => import('./headBanner'))

export default function BannerContent({
    children,
    ImgUrl,
    wrapperRef,
    blurred = false,
    hiddenImg = false,
}: {
    children: React.ReactNode
    ImgUrl?: string
    blurred?: boolean
    wrapperRef: React.RefObject<HTMLDivElement | null>
    hiddenImg?: boolean
}) {
    const [bannerHeight, setBannerHeight] = useState(0)
    const [showDown, setShowDown] = useState(true)

    // const wrapperRef = useRef<HTMLDivElement>(null)
    const elementRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)
    const totalHeightRef = useRef(0)
    const isBannerVisibleRef = useRef(true)

    const scrollDown = () => {
        setShowDown(false)
        window.scrollTo({
            top: bannerHeight / 2 - 8,
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
    }, [wrapperRef])

    // 2. 使用 IntersectionObserver 优化 showDown 显示逻辑
    useEffect(() => {
        if (!sentinelRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowDown(entry.isIntersecting)
            },
            { threshold: 0 }
        )

        observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [])

    // 3. 监听滚动 (仅处理视差效果，使用 requestAnimationFrame + 直接 DOM 操作优化性能)
    useEffect(() => {
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
    }, [bannerHeight, wrapperRef])

    // 使用 useLayoutEffect 在浏览器绘制前重置状态，防止内容位置跳动
    useLayoutEffect(() => {
        wrapperRef.current?.style.setProperty('--scroll-percent', '0')
        wrapperRef.current?.style.setProperty('--total-percent', '0')
    }, [wrapperRef])

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

    return (
        <>
            <div className="relative flex h-dvh w-full flex-col bg-black">
                <div className="pointer-events-none absolute inset-0" />
                <div
                    className={`relative h-full w-full overflow-hidden`}
                    ref={elementRef}
                >
                    <div
                        ref={sentinelRef}
                        className="pointer-events-none absolute top-0 left-0 h-20 w-full bg-transparent"
                    />
                    <Suspense
                        fallback={
                            <div className="h-full w-full animate-pulse bg-black" />
                        }
                    >
                        {hiddenImg ? (
                            <div className="h-full w-full bg-transparent"></div>
                        ) : (
                            <HeaderBanner ImgUrl={ImgUrl} blurred={blurred} />
                        )}
                    </Suspense>

                    <div className="absolute top-0 left-0 h-full w-full">
                        {children}
                    </div>

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
                </div>
            </div>
        </>
    )
}
