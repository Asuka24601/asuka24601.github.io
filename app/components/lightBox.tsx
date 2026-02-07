/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from 'react'
import { useNavStore, useLightBoxStore } from '../lib/store'
import CRTOverlay from './effect/CRTOverlay'
import TextJitter from './effect/textJitter'
import SvgIcon from './SvgIcon'

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
                document.body.style.paddingRight = `${scrollbarWidth > 30 ? 0 : scrollbarWidth}px`
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
            className={`bg-base-100/90 fixed inset-0 z-50 flex items-center justify-center text-sm backdrop-blur-sm transition-opacity duration-300 ${
                isLightboxVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeLightbox}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            <CRTOverlay />

            <div
                className="border-neutral bg-base-200 shadow-primary relative flex h-[max(90%,90vh)] w-[max(90%,90vw)] flex-col overflow-hidden border-4 border-double"
                onClick={(e) => e.stopPropagation()}
            >
                <TextJitter className="flex h-full w-full flex-col">
                    {/* Header */}
                    <div className="border-neutral/30 bg-base-200/20 flex shrink-0 items-center justify-between border-b-2 border-dashed p-2 px-4">
                        <div className="flex items-center gap-4">
                            <div className="text-primary font-bold tracking-widest uppercase before:content-['>_']">
                                IMAGE_ANALYSIS_UNIT
                            </div>
                            <div className="text-base-content/50 hidden text-[10px] lg:block">
                                TARGET: {lightboxSrc.split('/').pop()}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                className="group hover:text-primary text-base-content/70 flex items-center gap-2 transition-colors"
                                onClick={downloadImage}
                                title="DOWNLOAD_DATA"
                            >
                                <span className="hidden text-[10px] font-bold uppercase lg:block">
                                    [ SAVE ]
                                </span>
                                <SvgIcon name="download" size={20} />
                            </button>
                            <button
                                className="group hover:text-primary text-base-content/70 flex items-center gap-2 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    closeLightbox()
                                }}
                                title="TERMINATE_PROCESS"
                            >
                                <span className="hidden text-[10px] font-bold uppercase lg:block">
                                    [ EXIT ]
                                </span>
                                <SvgIcon name="close" size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Image Area */}
                    <div className="relative flex flex-1 items-center justify-center overflow-hidden">
                        {/* Grid Overlay */}
                        <div
                            className="pointer-events-none absolute inset-0 z-0 opacity-20"
                            style={{
                                backgroundImage: `linear-gradient(to right, var(--color-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px',
                            }}
                        ></div>

                        {isImageLoading && (
                            <div className="text-primary flex flex-col items-center gap-2">
                                <span className="loading loading-spinner loading-lg"></span>
                                <span className="animate-pulse text-xs uppercase">
                                    Acquiring Signal...
                                </span>
                            </div>
                        )}

                        <img
                            src={lightboxSrc}
                            alt="Lightbox Preview"
                            decoding="async"
                            draggable="false"
                            className={`relative z-10 max-h-full max-w-full object-contain shadow-2xl transition-opacity duration-300 ${
                                isImageLoading ? 'opacity-0' : 'opacity-100'
                            }`}
                            onLoad={() => setIsImageLoading(false)}
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                cursor:
                                    scale > 1
                                        ? isDragging
                                            ? 'grabbing'
                                            : 'grab'
                                        : 'zoom-in',
                                transition: isDragging
                                    ? 'none'
                                    : 'transform 0.1s ease-out',
                            }}
                            onWheel={onWheel}
                            onMouseDown={onMouseDown}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Footer / Status Bar */}
                    <div className="border-neutral/30 text-base-content/60 bg-base-200/20 flex shrink-0 items-center justify-between border-t border-dashed p-1 px-4 text-[10px] uppercase">
                        <div className="flex gap-4">
                            <span>ZOOM: {(scale * 100).toFixed(0)}%</span>
                            <span>
                                POS: X:{position.x.toFixed(0)} Y:
                                {position.y.toFixed(0)}
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <span
                                className={
                                    isImageLoading
                                        ? 'text-warning animate-pulse'
                                        : 'text-success'
                                }
                            >
                                STATUS: {isImageLoading ? 'LOADING' : 'STABLE'}
                            </span>
                        </div>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
