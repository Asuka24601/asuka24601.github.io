import { useEffect, useRef, useState } from 'react'
import { useNavStore } from '../lib/store'
import TextJitter from './effect/textJitter'
import '../styles/toUp.css'
import { throttle } from 'lodash-es'

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

export default function ToUp() {
    const navShow = useNavStore((state) => state.navShow)
    const elemRef = useRef<HTMLButtonElement>(null)
    const [isOnTop, setIsOnTop] = useState(true)

    useEffect(() => {
        const handleScroll = throttle(() => {
            if (window.scrollY <= 10) {
                setIsOnTop(true)
            } else {
                setIsOnTop(false)
            }
        }, 300)

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            handleScroll.cancel() // 清理 throttle 的内部定时器
        }
    }, [])

    // 计算是否应该显示
    const shouldShow = navShow && !isOnTop

    return (
        <div className="sticky right-0 bottom-0 z-50 flex h-0 w-full -translate-x-8 -translate-y-18 flex-row justify-end">
            <button
                aria-label="ELEVATOR_UP"
                ref={elemRef}
                className={`${
                    shouldShow ? 'to-up-visible' : 'to-up-hidden'
                } border-neutral group bg-base-200 relative flex h-12 w-12 items-center justify-center overflow-hidden border-2 border-double shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}
                onClick={scrollToTop}
                title="ELEVATOR_UP"
            >
                <TextJitter className="flex h-full w-full items-center justify-center p-0!">
                    <div className="border-primary/50 group-hover:border-primary mt-1 h-3 w-3 rotate-45 transform border-t-2 border-l-2 transition-colors"></div>
                </TextJitter>
            </button>
        </div>
    )
}
