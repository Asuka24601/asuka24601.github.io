import { useEffect, useState } from 'react'
import errorImg from '../assets/errorImg.webp'

const ProgressiveImage = ({
    placeholderSrc,
    src,
    className,
    alt,
    lazy = true,
}: {
    placeholderSrc?: string
    src: string
    className?: string
    alt?: string
    lazy?: boolean
}) => {
    const [imgSrc, setImgSrc] = useState(placeholderSrc || src)
    const [isBlur, setIsBlur] = useState(true)

    useEffect(() => {
        const img = new Image()
        img.src = src
        img.onload = () => {
            setImgSrc(src) // 替换为高清图
            setIsBlur(false) // 取消模糊
        }
        img.onerror = () => {
            setImgSrc(errorImg) // 替换为占位图
            setIsBlur(false) // 取消模糊
        }
        return () => {
            img.onload = null
            img.onerror = null
        }
    }, [src])

    return (
        <img
            decoding="async"
            alt={alt || 'img'}
            className={(isBlur && 'skeleton') + ' w-full ' + (className || '')}
            src={imgSrc}
            loading={lazy ? 'lazy' : 'eager'}
            style={{
                filter: isBlur ? 'blur(10px)' : 'none',
                transition: 'filter 0.5s linear',
            }}
        />
    )
}

export default ProgressiveImage
