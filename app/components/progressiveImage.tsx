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
    const [imgSrc, setImgSrc] = useState(placeholderSrc || src || errorImg)
    const [isBlur, setIsBlur] = useState(true)
    const imgRef = useRef<HTMLImageElement>(null)

    const setLightboxSrc = useLightBoxStore((state) => state.setLightboxSrc)
    const setIsImageLoading = useLightBoxStore(
        (state) => state.setIsImageLoading
    )
    const setNavShow = useNavStore((state) => state.setNavShow)

    useEffect(() => {
        // 当 src 变化时，重置为占位图并开启模糊，避免显示旧图
        setImgSrc(placeholderSrc || src || errorImg)
        setIsBlur(true)

        if (!src) {
            const timer = setTimeout(() => {
                setIsBlur(false)
            }, 500)
            return () => clearTimeout(timer)
        }

        let observer: IntersectionObserver
        let mounted = true

        const loadHighRes = () => {
            const img = new Image()
            img.src = src
            img.onload = () => {
                if (mounted) {
                    setImgSrc(src) // 替换为高清图
                    setIsBlur(false) // 取消模糊
                }
            }
            img.onerror = () => {
                if (mounted) {
                    setImgSrc(placeholderSrc || errorImg) // 替换为占位图
                    setIsBlur(false) // 取消模糊
                }
            }
        }

        // 如果开启懒加载且支持 IntersectionObserver，则等待进入视口再加载
        if (lazy && typeof IntersectionObserver !== 'undefined') {
            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadHighRes()
                        observer.disconnect()
                    }
                })
            })
            if (imgRef.current) observer.observe(imgRef.current)
        } else {
            loadHighRes()
        }

        return () => {
            mounted = false
            if (observer) observer.disconnect()
        }
    }, [src, placeholderSrc, lazy])

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
