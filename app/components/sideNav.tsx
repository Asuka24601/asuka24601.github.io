import { useRef, useEffect } from 'react'
import SvgIcon from './SvgIcon'
import CRTOverlay from './effect/CRTOverlay'
import TextJitter from './effect/textJitter'

export default function SideNav({
    children,
    className,
}: {
    children?: React.ReactNode
    className?: string
}) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    // 确保组件卸载时恢复滚动（防止路由跳转后页面仍被锁定）
    useEffect(() => {
        return () => {
            document.body.style.paddingRight = ''
            document.body.style.overflowY = ''
        }
    }, [])

    if (!children) return null

    return (
        <>
            <div className={`${className || 'lg:hidden'} contents`}>
                <div className="sticky right-0 bottom-0 flex h-0 w-full -translate-x-8 -translate-y-36 flex-row justify-end">
                    <button
                        className="border-neutral text-primary bg-base-200 right-8 bottom-24 z-40 flex h-12 w-12 items-center justify-center border-2 border-double shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:translate-y-1 hover:shadow-none"
                        title="OPEN_DIRECTORY"
                        onClick={() => {
                            const scrollbarWidth =
                                window.innerWidth -
                                document.documentElement.clientWidth
                            document.body.style.overflowY = 'hidden'

                            if (scrollbarWidth > 0) {
                                document.body.style.paddingRight = `${scrollbarWidth > 30 ? 0 : scrollbarWidth}px`
                            }
                            dialogRef.current?.showModal()
                        }}
                    >
                        <SvgIcon name="toc" size={24} />
                    </button>
                </div>

                <dialog
                    ref={dialogRef}
                    onClose={() => {
                        document.body.style.paddingRight = ''
                        document.body.style.overflowY = ''
                    }}
                    className="border-neutral bg-base-200 text-base-content backdrop:bg-base-100/50 fixed top-0 right-0 z-50 m-0 h-dvh max-h-dvh w-3/4 max-w-xs overflow-hidden border-l-4 border-double p-0 font-mono text-sm shadow-2xl outline-none backdrop:backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === dialogRef.current) {
                            dialogRef.current.close()
                        }
                    }}
                >
                    <style>{`
                        /* 1. 基础状态（关闭/退出时） */
                        dialog {
                            opacity: 0;
                            transform: translateX(100%);
                            transition:
                                opacity 0.3s ease-in,
                                transform 0.3s ease-in,
                                overlay 0.3s allow-discrete,
                                display 0.3s allow-discrete;
                        }
                        /* 2. 打开状态 */
                        dialog[open] {
                            opacity: 1;
                            transform: translateX(0);
                            transition:
                                opacity 0.3s ease-out,
                                transform 0.3s ease-out,
                                overlay 0.3s allow-discrete,
                                display 0.3s allow-discrete;
                        }
                        /* 3. 入场起始状态 (@starting-style) */
                        @starting-style {
                            dialog[open] {
                                opacity: 0;
                                transform: translateX(100%);
                            }
                        }
                        /* 4. 背景遮罩动画 */
                        dialog::backdrop {
                            background-color: rgb(0 0 0 / 0);
                            backdrop-filter: blur(0);
                            transition:
                                display 0.3s allow-discrete,
                                overlay 0.3s allow-discrete,
                                background-color 0.3s,
                                backdrop-filter 0.3s;
                        }
                        dialog[open]::backdrop {
                            background-color: rgb(0 0 0 / 0.2);
                            backdrop-filter: blur(4px);
                        }
                        @starting-style {
                            dialog[open]::backdrop {
                                background-color: rgb(0 0 0 / 0);
                                backdrop-filter: blur(0);
                            }
                        }
                    `}</style>
                    <CRTOverlay />
                    <TextJitter className="flex h-full flex-col">
                        <div className="flex h-full flex-col overflow-y-auto p-4">
                            <div className="border-neutral/30 mb-4 flex items-end justify-between border-b-2 border-dashed pb-2">
                                <div>
                                    <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_DIRECTORY']"></div>
                                    <div className="text-primary text-xl font-black tracking-widest uppercase after:content-['INDEX']"></div>
                                </div>
                                <button
                                    className="group hover:text-primary text-base-content/70 flex items-center gap-2 transition-colors"
                                    onClick={() => dialogRef.current?.close()}
                                >
                                    <span className="text-[10px] font-bold uppercase after:content-['[_CLOSE_]']"></span>
                                </button>
                            </div>
                            {children}
                        </div>

                        {/* Footer decoration */}
                        <div className="border-neutral/30 text-base-content/40 bg-base-200/20 mt-auto border-t border-dashed p-2 text-[10px] uppercase">
                            <span className="animate-pulse after:content-['>>_WAITING\_FOR\_INPUT']"></span>
                        </div>
                    </TextJitter>
                </dialog>
            </div>
        </>
    )
}
