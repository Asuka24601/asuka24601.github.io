import { useRef, useEffect } from 'react'
import SvgIcon from './SvgIcon'
import { NavLink } from 'react-router'

interface NavItem {
    name: string
    path: string
}

export default function SideNav({
    navItems,
    children,
}: {
    navItems?: NavItem[]
    children?: React.ReactNode
}) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    // 确保组件卸载时恢复滚动（防止路由跳转后页面仍被锁定）
    useEffect(() => {
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    if (!navItems && !children) return null

    return (
        <>
            <div className="xl:hidden">
                <button
                    className="bg-base-100/80 btn btn-circle fixed right-4 bottom-24 z-40 shadow-lg backdrop-blur-sm"
                    onClick={() => {
                        document.body.style.overflow = 'hidden'
                        dialogRef.current?.showModal()
                    }}
                >
                    <SvgIcon name="toc" size={24} />
                </button>
                <dialog
                    ref={dialogRef}
                    onClose={() => {
                        document.body.style.overflow = ''
                    }}
                    className="bg-base-100 fixed top-0 right-0 z-50 m-0 h-dvh max-h-dvh w-3/4 max-w-xs p-0 shadow-2xl"
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
                            transform: translateX(-100%);
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
                                transform: translateX(-100%);
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
                    <div className="h-full overflow-y-auto p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-lg font-bold">Contents</span>
                            <button
                                className="btn btn-ghost btn-circle btn-sm"
                                onClick={() => dialogRef.current?.close()}
                            >
                                ✕
                            </button>
                        </div>

                        {navItems ? (
                            <ul className="menu w-full p-0">
                                {navItems.map((item) => (
                                    <li key={item.name}>
                                        <NavLink
                                            to={item.path}
                                            onClick={() =>
                                                dialogRef.current?.close()
                                            }
                                        >
                                            {item.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        ) : children ? (
                            children
                        ) : null}
                    </div>
                </dialog>
            </div>
        </>
    )
}
