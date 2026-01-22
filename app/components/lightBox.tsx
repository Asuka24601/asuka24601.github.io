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

    const timerRef = useRef<number | null>(null)
    const hasSrc = !!lightboxSrc

    useEffect(() => {
        if (hasSrc) {
            const scrollbarWidth =
                window.innerWidth - document.documentElement.clientWidth
            document.body.style.overflow = 'hidden'
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

    if (!lightboxSrc) return null

    return (
        <div
            className={`fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-300 ${
                isLightboxVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeLightbox}
        >
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
            />
        </div>
    )
}
