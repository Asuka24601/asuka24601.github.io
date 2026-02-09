/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import wallpaper from '../assets/wallpaper.webp'
import wallpaperLight from '../assets/wallpaper_light.webp'

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
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [currentImg, setCurrentImg] = useState(ImgUrl || wallpaper)

    useEffect(() => {
        let rafId: number

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return
            const { innerWidth, innerHeight } = window
            const x = (e.clientX / innerWidth - 0.5) * 2
            const y = (e.clientY / innerHeight - 0.5) * 2

            containerRef.current.style.setProperty('--banner-x', x.toFixed(4))
            containerRef.current.style.setProperty('--banner-y', y.toFixed(4))
        }

        const onMouseMove = (e: MouseEvent) => {
            cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(() => handleMouseMove(e))
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    window.addEventListener('mousemove', onMouseMove)
                } else {
                    window.removeEventListener('mousemove', onMouseMove)
                    cancelAnimationFrame(rafId)
                }
            },
            { threshold: 0 }
        )

        if (containerRef.current) observer.observe(containerRef.current)

        return () => {
            observer.disconnect()
            window.removeEventListener('mousemove', onMouseMove)
            cancelAnimationFrame(rafId)
        }
    }, [])

    useEffect(() => {
        setCurrentImg(ImgUrl || wallpaper)
        setIsLoaded(false)
    }, [ImgUrl])

    return (
        <div
            ref={containerRef}
            className={
                (className || '') +
                ' hover:animate-shine relative aspect-auto h-[min(100%,100dvh)] w-full overflow-hidden'
            }
        >
            <img
                ref={imgRef}
                src={currentImg}
                onLoad={() => setIsLoaded(true)}
                onError={() => setCurrentImg(wallpaper)}
                decoding="async"
                className={`h-full w-full object-cover object-top transition-transform duration-100 ease-out select-none ${ImgUrl ? '' : '-z-1 opacity-0 transition-opacity duration-300 dark:z-0 dark:opacity-100'}`}
                alt="banner"
                draggable="false"
                style={{
                    filter: isLoaded
                        ? blurred
                            ? `blur(calc(var(--scroll-percent, 0) * 50px)) brightness(70%)`
                            : `brightness(70%)`
                        : `blur(20px) brightness(70%)`,
                    transition: 'filter 0.5s ease-out, transform 0.1s ease-out',
                    transform:
                        'perspective(1000px) scale(1.1) rotateX(calc(var(--banner-y, 0) * -2deg)) rotateY(calc(var(--banner-x, 0) * 2deg)) translate3d(calc(var(--banner-x, 0) * -10px), calc(var(--banner-y, 0) * -10px), 0)',
                    willChange: 'transform, filter',
                }}
                loading="eager"
            />
            {ImgUrl ? null : (
                <img
                    src={wallpaperLight}
                    alt="bannerLight"
                    className="absolute top-0 left-0 z-0 h-full w-full object-cover object-right opacity-100 transition-transform duration-100 ease-out select-none dark:-z-1 dark:opacity-0"
                    draggable="false"
                    style={{
                        ...(blurred
                            ? {
                                  filter: `blur(calc(var(--scroll-percent, 0) * 50px)) brightness(70%)`,
                              }
                            : {
                                  filter: `brightness(70%)`,
                              }),
                        transform:
                            'perspective(1000px) scale(1.1) rotateX(calc(var(--banner-y, 0) * -2deg)) rotateY(calc(var(--banner-x, 0) * 2deg)) translate3d(calc(var(--banner-x, 0) * -10px), calc(var(--banner-y, 0) * -10px), 0)',
                        willChange: 'transform',
                    }}
                    loading="eager"
                />
            )}
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
