import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MenuItemStore } from '../../interfaces/menuItem'
import type { UseBoundStore, StoreApi } from 'zustand'

interface WINDOW {
    h: number
    w: number
    x: number
    y: number
    maxm: boolean
    minm: boolean
    zIndex: number
}

// 全局层级计数器，确保新点击的窗口总是拥有最高层级
let globalZIndex = 100

// 能拖动、改变大小、最大化、最小化
export default function WindowComp({
    children,
    childrenStore,
    initialX = 0,
    initialY = 0,
    initialW = 500,
    initialH = 400,
    minW = 300,
    minH = 200,
}: {
    children: React.ReactNode
    childrenStore: UseBoundStore<StoreApi<MenuItemStore>>
    initialX?: number
    initialY?: number
    initialW?: number
    initialH?: number
    minW?: number
    minH?: number
}) {
    const elementRef = useRef<HTMLDivElement>(null)
    const dragData = useRef({
        isDragging: false,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,
    })
    const resizeData = useRef({
        isResizing: false,
        startX: 0,
        startY: 0,
        initialW: 0,
        initialH: 0,
    })

    const [Window, setWindow] = useState<WINDOW>({
        h: initialH,
        w: initialW,
        x: initialX,
        y: initialY,
        maxm: false,
        minm: false,
        zIndex: globalZIndex,
    })

    const [isClosed, setIsClosed] = useState(!childrenStore.getState().open)
    const [isClosing, setIsClosing] = useState(false)
    const setMenuItemOpen = childrenStore((state) => state.setMenuItemState)
    const MenuOpen = childrenStore((state) => state.open)

    // 置顶逻辑 - 移动到 useEffect 之前以修复“声明之前已使用”错误
    const bringToFront = useCallback(() => {
        setWindow((prev) => ({
            ...prev,
            zIndex: ++globalZIndex,
        }))
    }, [])

    const handleClose = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation()
            setMenuItemOpen(false)
        },
        [setMenuItemOpen]
    )

    // 监听外部 Store 状态同步缩放动画与关闭状态
    useEffect(() => {
        if (MenuOpen) {
            setIsClosed(false)
            setIsClosing(false)
            bringToFront() // 重新打开时自动置顶
        } else if (!isClosed && !isClosing) {
            setIsClosing(true)
            const timer = setTimeout(() => setIsClosed(true), 300)
            return () => clearTimeout(timer)
        }
    }, [MenuOpen, isClosed, isClosing, bringToFront])

    const WindowStyle = useMemo<React.CSSProperties>(() => {
        if (Window.maxm) {
            return {
                width: '100%',
                height: '100%',
                left: '0px',
                top: '0px',
                zIndex: Window.zIndex,
            }
        }
        if (Window.minm) {
            return {
                width: '200px',
                height: '32px',
                left: `${Window.x}px`,
                top: `${Window.y}px`,
                zIndex: Window.zIndex,
            }
        }
        return {
            width: Window.w ? `${Window.w}px` : 'auto',
            height: Window.h ? `${Window.h}px` : 'auto',
            left: `${Window.x}px`,
            top: `${Window.y}px`,
            zIndex: Window.zIndex,
        }
    }, [Window])

    const toggleMinimize = () =>
        setWindow((prev) => ({ ...prev, minm: !prev.minm, maxm: false }))
    const toggleMaximize = () =>
        setWindow((prev) => ({ ...prev, maxm: !prev.maxm, minm: false }))

    const onMouseDownDrag = (e: React.MouseEvent) => {
        if (Window.maxm) return
        dragData.current = {
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY,
            initialX: Window.x,
            initialY: Window.y,
        }
    }

    const onMouseDownResize = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (Window.maxm || Window.minm) return
        bringToFront()
        resizeData.current = {
            isResizing: true,
            startX: e.clientX,
            startY: e.clientY,
            initialW: Window.w,
            initialH: Window.h,
        }
    }

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (dragData.current.isDragging) {
            const dx = e.clientX - dragData.current.startX
            const dy = e.clientY - dragData.current.startY
            setWindow((prev) => {
                // 获取当前窗口的实际渲染尺寸（考虑最小化状态）
                const currentW = prev.minm ? 200 : prev.w
                const currentH = prev.minm ? 32 : prev.h

                return {
                    ...prev,
                    // 限制 X 范围：[0, 浏览器宽度 - 窗口宽度]
                    x: Math.max(
                        0,
                        Math.min(
                            window.innerWidth - currentW,
                            dragData.current.initialX + dx
                        )
                    ),
                    // 限制 Y 范围：[0, 浏览器高度 - 窗口高度]
                    y: Math.max(
                        0,
                        Math.min(
                            window.innerHeight - currentH,
                            dragData.current.initialY + dy
                        )
                    ),
                }
            })
        }
        if (resizeData.current.isResizing) {
            const dx = e.clientX - resizeData.current.startX
            const dy = e.clientY - resizeData.current.startY
            setWindow((prev) => ({
                ...prev,
                w: Math.max(
                    minW,
                    Math.min(
                        window.innerWidth - prev.x,
                        resizeData.current.initialW + dx
                    )
                ),
                h: Math.max(
                    minH,
                    Math.min(
                        window.innerHeight - prev.y,
                        resizeData.current.initialH + dy
                    )
                ),
            }))
        }
    }, [])

    const handleMouseUp = useCallback(() => {
        dragData.current.isDragging = false
        resizeData.current.isResizing = false
    }, [])

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [handleMouseMove, handleMouseUp])

    if (isClosed) return null

    return (
        <div
            ref={elementRef}
            onMouseDown={bringToFront}
            style={WindowStyle}
            className={`bg-base-200 border-terminal absolute flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ease-in-out ${
                isClosing
                    ? 'pointer-events-none scale-95 opacity-0 blur-md'
                    : 'scale-100 opacity-100'
            } ${
                dragData.current.isDragging || resizeData.current.isResizing
                    ? 'transition-none'
                    : ''
            }`}
        >
            {/* Window Header / Title Bar */}
            <div
                onMouseDown={onMouseDownDrag}
                onDoubleClick={toggleMaximize}
                className="bg-primary/20 border-neutral/30 flex cursor-move items-center justify-between border-b border-dashed p-1 px-2 select-none"
            >
                <div className="flex items-center gap-2">
                    <div className="bg-primary h-2 w-2 animate-pulse"></div>
                    <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
                        System_Process_Window
                    </span>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={toggleMinimize}
                        className="hover:bg-primary/30 h-4 w-6 text-[10px] transition-colors"
                    >
                        -
                    </button>
                    <button
                        onClick={toggleMaximize}
                        className="hover:bg-primary/30 h-4 w-6 text-[10px] transition-colors"
                    >
                        {Window.maxm ? '⧉' : '□'}
                    </button>
                    <button
                        onClick={handleClose}
                        className="h-4 w-6 text-[10px] transition-colors hover:bg-red-500/50"
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div
                className={`relative flex-1 overflow-auto ${Window.minm ? 'hidden' : 'block'}`}
            >
                <main className="h-full w-full p-1">{children}</main>
            </div>

            {/* Resize Handle */}
            {!Window.maxm && !Window.minm && (
                <>
                    <div
                        onMouseDown={onMouseDownResize}
                        className="absolute right-0 bottom-0 z-20 h-4 w-4 cursor-nwse-resize"
                    >
                        <div className="bg-primary/30 absolute right-1 bottom-1 h-1 w-1"></div>
                        <div className="bg-primary/30 absolute right-2 bottom-1 h-1 w-1"></div>
                        <div className="bg-primary/30 absolute right-1 bottom-2 h-1 w-1"></div>
                    </div>
                </>
            )}

            {/* Footer decoration */}
            {!Window.minm && (
                <div className="border-neutral/20 flex justify-between border-t border-dashed px-2 py-0.5 text-[8px] uppercase opacity-30">
                    <span>Status: Active</span>
                    <span>Mem: 42MB</span>
                </div>
            )}
        </div>
    )
}
