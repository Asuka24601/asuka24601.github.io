/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from 'react'
import errorImg from '../assets/errorImg.webp'
import { useLightBoxStore, useNavStore } from '../lib/store'

const ProgressiveImage = ({
    placeholderSrc,
    src,
    className,
    alt,
    lazy = true,
    useLightBox = false,
    draggable = true,
}: {
    placeholderSrc?: string
    src: string | undefined
    className?: string
    alt?: string
    lazy?: boolean
    useLightBox?: boolean
    draggable?: boolean | 'true' | 'false'
}) => {
    const [imgSrc, setImgSrc] = useState(
        lazy ? placeholderSrc || errorImg : src || errorImg
    )
    const [isBlur, setIsBlur] = useState(true)
    const imgRef = useRef<HTMLImageElement>(null)

    const setLightboxSrc = useLightBoxStore((state) => state.setLightboxSrc)
    const setIsImageLoading = useLightBoxStore(
        (state) => state.setIsImageLoading
    )
    const setNavShow = useNavStore((state) => state.setNavShow)

    useEffect(() => {
        setIsBlur(true)

        if (!lazy) {
            setImgSrc(src || errorImg)
            return
        }

        // 懒加载模式：重置为占位图
        setImgSrc(placeholderSrc || errorImg)

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setImgSrc(src || errorImg)
                    observer.disconnect()
                }
            },
            { threshold: 0 }
        )

        if (imgRef.current) observer.observe(imgRef.current)

        return () => observer.disconnect()
    }, [src, placeholderSrc, lazy])

    const handleLoad = () => {
        if (imgSrc === (src || errorImg)) setIsBlur(false)
    }

    const handleError = () => {
        setImgSrc(placeholderSrc || errorImg)
        setIsBlur(false)
    }

    return (
        <img
            ref={imgRef}
            decoding="async"
            alt={alt || 'img'}
            className={
                (isBlur ? 'skeleton ' : '') +
                (useLightBox ? ' cursor-zoom-in ' : '') +
                ' w-full ' +
                (className || '')
            }
            onClick={
                useLightBox
                    ? (e) => {
                          const target = e.target as HTMLElement
                          if (target.tagName === 'IMG') {
                              e.preventDefault() // 防止链接跳转（如果图片被包裹在链接中）
                              const img = target as HTMLImageElement
                              setLightboxSrc(img.src)
                              setIsImageLoading(true)
                              setNavShow(false)
                          }
                      }
                    : undefined
            }
            src={imgSrc}
            onLoad={handleLoad}
            onError={handleError}
            loading={lazy ? 'lazy' : 'eager'}
            style={{
                filter: isBlur ? 'blur(10px)' : 'none',
                transition: 'filter 0.5s linear',
            }}
            draggable={draggable}
        />
    )
}

export default ProgressiveImage
