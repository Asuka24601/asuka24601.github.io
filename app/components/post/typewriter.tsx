/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'

// 共享 IntersectionObserver 实例以优化性能
let sharedObserver: IntersectionObserver | null = null
const observerCallbacks = new Map<Element, () => void>()

const getObserver = () => {
    if (!sharedObserver && typeof IntersectionObserver !== 'undefined') {
        sharedObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const callback = observerCallbacks.get(entry.target)
                        if (callback) {
                            callback()
                            unobserve(entry.target)
                        }
                    }
                })
            },
            { threshold: 0.1 }
        )
    }
    return sharedObserver
}

const observe = (element: Element, callback: () => void) => {
    const observer = getObserver()
    if (observer) {
        observerCallbacks.set(element, callback)
        observer.observe(element)
    } else {
        callback()
    }
}

const unobserve = (element: Element) => {
    observerCallbacks.delete(element)
    if (sharedObserver) {
        sharedObserver.unobserve(element)
        if (observerCallbacks.size === 0) {
            sharedObserver.disconnect()
            sharedObserver = null
        }
    }
}

// 打字机效果组件
const Typewriter = ({
    as: Component = 'div',
    children,
    className,
    ...props
}: {
    as?: any
    children?: React.ReactNode
    className?: string
    [key: string]: any
}) => {
    const [displayLength, setDisplayLength] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const domRef = useRef<HTMLElement>(null)

    const isString = typeof children === 'string'
    const fullText = isString ? children : ''

    useEffect(() => {
        const element = domRef.current
        if (!element) return

        observe(element, () => setIsVisible(true))
        return () => unobserve(element)
    }, [])

    useEffect(() => {
        if (!isVisible || !isString || isDone) return

        let rafId: number
        let lastTime: number | undefined
        const interval = 30 // 30ms 间隔，比 15ms 更平滑且易读

        const animate = (time: number) => {
            if (lastTime === undefined) {
                lastTime = time
            }
            const delta = time - lastTime

            if (delta >= interval) {
                setDisplayLength((prev) => {
                    if (prev >= fullText.length) {
                        setIsDone(true)
                        return prev
                    }
                    return prev + 1
                })
                lastTime = time
            }

            rafId = requestAnimationFrame(animate)
        }

        rafId = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(rafId)
    }, [isVisible, isString, fullText, isDone])

    if (!isString) {
        return (
            <Component
                ref={domRef}
                className={`${className || ''} transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                {...props}
            >
                {children}
            </Component>
        )
    }

    return (
        <Component
            ref={domRef}
            className={`${className || ''} min-h-[1em]`}
            {...props}
        >
            {/* 已打印的可见部分 */}
            <span>{fullText.slice(0, displayLength)}</span>
            {/* 光标 */}
            {isVisible && !isDone && (
                <span className="text-primary bg-primary/50 ml-0.5 inline-block h-[1em] w-[0.5em] animate-pulse align-middle"></span>
            )}
            {/* 未打印的隐藏部分（保留占位，确保 SEO 和 TOC 能读取到完整内容） */}
            <span className="opacity-0">{fullText.slice(displayLength)}</span>
        </Component>
    )
}

export default Typewriter
