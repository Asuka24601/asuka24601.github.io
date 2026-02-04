/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import Ramiel from '../effect/ramiel'
import wallpaperLight from '../../assets/wallpaper_light.webp'
import ProgressiveImage from '../progressiveImage'
import Typewriter from '../post/typewriter'

/**
 * 主组件
 */
export default function PrologueComponent({
    className,
    style,
    children,
    fullText,
}: {
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
    fullText?: string
}) {
    const [inView, setInView] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)

    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!imgRef.current) return
            const { innerWidth, innerHeight } = window
            const x = (e.clientX / innerWidth - 0.5) * 2
            const y = (e.clientY / innerHeight - 0.5) * 2

            // 3D 晃动参数
            const rotateX = -y * 2 // 随鼠标垂直移动旋转 X 轴
            const rotateY = x * 2 // 随鼠标水平移动旋转 Y 轴
            const translateX = -x * 10
            const translateY = -y * 10

            imgRef.current.style.transform = `perspective(1000px) scale(1.1) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0)`
        }

        let rafId: number
        const onMouseMove = (e: MouseEvent) => {
            cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(() => handleMouseMove(e))
        }

        window.addEventListener('mousemove', onMouseMove)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            cancelAnimationFrame(rafId)
        }
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting)
            },
            { threshold: 0 }
        )
        if (containerRef.current) {
            observer.observe(containerRef.current)
        }
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!inView) return
        const interval = setInterval(() => {
            clearInterval(interval)
        }, 100)
        return () => {
            clearInterval(interval)
        }
    }, [inView])

    return (
        <div className={className} style={style} ref={containerRef}>
            <div className="absolute top-0 left-0 z-0 h-full w-full opacity-0 transition-opacity duration-300 dark:z-1 dark:opacity-100">
                <Ramiel />
            </div>
            <div
                ref={imgRef}
                className="absolute top-0 left-0 z-1 h-full w-full opacity-100 transition-opacity duration-300 dark:z-0 dark:opacity-0"
            >
                <ProgressiveImage
                    src={wallpaperLight}
                    alt="wallpaper"
                    className="absolute top-0 left-0"
                    draggable={false}
                />
            </div>
            <div className="absolute top-1/2 left-0 z-1 -translate-y-1/2">
                {children || (
                    <div className="bg-base-200/80 overflow-hidden p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8">
                        <p className="text-base-content border-neutral mb-2 border-b border-dashed pb-2 text-3xl text-shadow-2xs after:content-['_'] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                            {fullText}
                            <span className="animate__animated animate__flash animate__infinite animate__slow inline-block after:content-['_l']"></span>
                        </p>
                        <Typewriter as={'pre'} className="pl-2 text-[10px]">
                            {`#include<iostream>
using namespace std;
int main() {
    cout << "${fullText}";
    return 0;
}`}
                        </Typewriter>
                    </div>
                )}
            </div>
        </div>
    )
}
