import { useNavStore } from '../lib/store'
import CRTOverlay from './effect/CRTOverlay'
import TextJitter from './effect/textJitter'

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

export default function ToUp() {
    const navShow = useNavStore((state) => state.navShow)

    return (
        <div className="sticky bottom-8 z-50 mr-8 ml-auto h-fit w-fit">
            <button
                className={`${
                    navShow
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-10 opacity-0'
                } border-primary group bg-modalBlack relative flex h-10 w-10 items-center justify-center overflow-hidden border-2 border-double shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}
                onClick={scrollToTop}
                title="ELEVATOR_UP"
            >
                <CRTOverlay />
                <TextJitter className="flex h-full w-full items-center justify-center">
                    <div className="border-primary mt-1 h-3 w-3 rotate-45 transform border-t-2 border-l-2 transition-colors group-hover:border-white"></div>
                </TextJitter>
            </button>
        </div>
    )
}
