/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from 'react'
import { useNavStore, useLightBoxStore } from '../lib/store'

export default function LightBox() {
    const [isLightboxVisible, setIsLightboxVisible] = useState(false)
    const isImageLoading = useLightBoxStore((state) => state.isImageLoading)
    const setIsImageLoading = useLightBoxStore(
        (state) => state.setIsImageLoading
    )
    const resetNav = useNavStore((state) => state.resetNavShow)
    const lightboxSrc = useLightBoxStore((state) => state.lightboxSrc)
    const setLightboxSrc = useLightBoxStore((state) => state.setLightboxSrc)
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef({ x: 0, y: 0 })

    const timerRef = useRef<number | null>(null)
    const hasSrc = !!lightboxSrc

    useEffect(() => {
        if (hasSrc) {
            const scrollbarWidth =
                window.innerWidth - document.documentElement.clientWidth
            document.body.style.overflow = 'hidden'
            setScale(1)
            setPosition({ x: 0, y: 0 })
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`
            }

            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }

            // 确保 DOM 挂载后下一帧才添加 opacity-100，触发 transition
            requestAnimationFrame(() => {
                setIsLightboxVisible(true)
            })
        }
        return () => {
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
        }
    }, [hasSrc])

    const closeLightbox = () => {
        setIsLightboxVisible(false)
        // 等待 300ms 动画结束后再卸载组件
        resetNav()

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => {
            setLightboxSrc(null)
            timerRef.current = null
        }, 300)
    }

    const downloadImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!lightboxSrc) return
        const link = document.createElement('a')
        link.href = lightboxSrc
        link.download = lightboxSrc.split('/').pop() || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const onWheel = (e: React.WheelEvent) => {
        e.stopPropagation()
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        const newScale = Math.min(Math.max(1, scale * delta), 5)
        setScale(newScale)
        if (newScale <= 1) setPosition({ x: 0, y: 0 })
    }

    const onMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            e.preventDefault()
            setIsDragging(true)
            dragStart.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            }
        }
    }

    const onMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            e.preventDefault()
            setPosition({
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y,
            })
        }
    }

    const onMouseUp = () => {
        setIsDragging(false)
    }

    if (!lightboxSrc) return null

    return (
        <div
            className={`fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-300 ${
                isLightboxVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeLightbox}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button
                    className="btn btn-ghost btn-circle text-white"
                    onClick={downloadImage}
                    title="Download"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 9.75v8.25m0 0-3-3m3 3 3-3m-3-12.75v8.25"
                        />
                    </svg>
                </button>
                <button
                    className="btn btn-ghost btn-circle text-white"
                    onClick={(e) => {
                        e.stopPropagation()
                        closeLightbox()
                    }}
                    title="Close"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
            {isImageLoading && (
                <span className="loading loading-spinner loading-lg absolute text-white"></span>
            )}
            <img
                src={lightboxSrc}
                alt="Lightbox Preview"
                decoding="async"
                draggable="false"
                className={`max-h-full max-w-full rounded-md object-contain shadow-2xl transition-opacity duration-300 ${
                    isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setIsImageLoading(false)}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    cursor:
                        scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'auto',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
                onWheel={onWheel}
                onMouseDown={onMouseDown}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    )
}
