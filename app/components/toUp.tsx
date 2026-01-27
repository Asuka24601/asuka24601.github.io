import toUp from '../assets/toUp.webp'
import { useNavStore } from '../lib/store'

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

export default function ToUp() {
    const navShow = useNavStore((state) => state.navShow)

    return (
        <>
            <div className="sticky bottom-0 left-full z-10 h-48 w-fit bg-transparent drop-shadow-2xl drop-shadow-amber-950">
                <button
                    className={`${navShow ? 'cursor-pointer opacity-100' : 'cursor-none opacity-0'} absolute right-3 bottom-0 w-10 transition-opacity delay-500 duration-500 ease-in-out`}
                    onClick={() => {
                        scrollToTop()
                    }}
                >
                    <img
                        role="button"
                        tabIndex={0}
                        src={toUp}
                        alt="toUp"
                        className="aspect-auto h-auto w-10"
                        draggable="false"
                        onClick={(e) => {
                            const target = e.target as HTMLImageElement
                            if (!target.classList.contains('animate-jump')) {
                                target.classList.add('animate-jump')
                                setTimeout(() => {
                                    target.classList.remove('animate-jump')
                                }, 500)
                            }
                        }}
                    />
                </button>
            </div>
        </>
    )
}
