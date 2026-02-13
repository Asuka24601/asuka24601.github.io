import CRTOverlay from './effect/CRTOverlay'
import TextJitter from './effect/textJitter'

export default function Dock({
    children,
    className,
}: {
    children?: React.ReactNode
    className?: string
}) {
    return (
        <footer
            className={`group fixed bottom-0 left-1/2 z-50 w-fit -translate-x-1/2 translate-y-[calc(100%-20px)] transition-all duration-500 ease-in-out hover:-translate-y-5 ${
                className || ''
            }`}
        >
            {/* 顶部指示条 / 触发区域 */}
            <div className="mx-auto mb-2 flex justify-center">
                <div className="bg-primary/20 group-hover:bg-primary/40 h-1.5 w-20 rounded-full transition-colors" />
            </div>

            {/* Dock 主体 */}
            <div className="border-terminal bg-base-200/90 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <CRTOverlay />
                <TextJitter className="border-none! p-2! lg:p-3!">
                    <div className="flex flex-col items-center gap-2">
                        {/* 装饰性页眉 */}
                        <div className="text-primary/40 flex w-full items-center justify-between px-2 text-[8px] font-bold tracking-widest uppercase">
                            <span>Quick_Launch_v1.0</span>
                            <span className="animate-pulse">● Ready</span>
                        </div>

                        <menu className="flex h-12 items-center gap-3 px-4">
                            {children}
                        </menu>
                    </div>
                </TextJitter>
            </div>
        </footer>
    )
}
