import { useEffect, useRef } from 'react'
import wallpaper from '../assets/wallpaper.webp'

export default function HeaderBanner({
    className,
    ImgUrl,
    blurred,
}: {
    className?: string | undefined
    ImgUrl?: string
    blurred?: boolean
}) {
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
        if (!imgRef.current) return
        const img = new Image()
        img.src = ImgUrl || wallpaper
        img.onload = () => {
            imgRef.current?.setAttribute('src', img.src)
        }
        img.onerror = () => {
            imgRef.current?.setAttribute('src', wallpaper)
        }
        return () => {
            img.onload = null
            img.onerror = null
        }
    }, [ImgUrl])

    return (
        <div
            className={
                (className || '') +
                ' hover:animate-shine black-mask relative aspect-auto h-[min(100%,100dvh)] w-full overflow-hidden'
            }
        >
            <img
                ref={imgRef}
                src={ImgUrl ? ImgUrl : wallpaper}
                className="h-full w-full object-cover object-top transition-transform duration-100 ease-out select-none"
                alt="banner"
                draggable="false"
                style={{
                    ...(blurred
                        ? {
                              filter: `blur(calc(var(--scroll-percent, 0) * 50px)) brightness(70%)`,
                          }
                        : {
                              filter: `brightness(70%)`,
                          }),
                    willChange: 'transform',
                }}
            />
            <div
                className="shine-layer pointer-events-none absolute top-0 left-0 z-10 h-full w-1/2"
                style={{
                    background:
                        'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)',
                    transform: 'skewX(-25deg) translate3d(-200%, 0, 0)',
                }}
            />
        </div>
    )
}
