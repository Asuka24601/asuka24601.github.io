/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef } from 'react'
import { useDiogramDataStore } from '../../lib/store'

export default function ElectrocarDiogram({
    className,
    amplitude = 150,
    maxPoints = 60,
}: {
    className?: string
    amplitude?: number // 振幅
    maxPoints?: number
}) {
    const currValue = useDiogramDataStore((state) => state.value)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const elemSize = useRef({ width: 0, height: 0 })

    useEffect(() => {
        if (!contentRef.current) return
        const w = contentRef.current.offsetWidth
        const h = contentRef.current.offsetHeight
        elemSize.current = { width: w / maxPoints, height: h / (amplitude * 2) }
    }, [contentRef, maxPoints, amplitude])

    // 合并所有动画相关数据到一个 ref，减少内存分配
    const animRef = useRef({
        points: new Float32Array(maxPoints),
        len: 1,
        latestValue: 0,
        hasNewData: false,
        lastUpdate: 0,
        animId: -1,
        width: 0,
        height: 0,
        step: 0,
        centerY: 0,
        dpr: 1,
    })

    // 只在 currValue 变化时更新最新值，无需触发重渲染
    useEffect(() => {
        animRef.current.latestValue = currValue
        animRef.current.hasNewData = true
    }, [currValue])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // 处理 Canvas 分辨率和参数缓存
        const rect = canvas.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(dpr, dpr)

        const width = rect.width
        const height = rect.height
        const centerY = height / 2
        const step = width / (maxPoints - 1)

        // 缓存参数，避免每帧重复计算
        const ref = animRef.current
        ref.width = width
        ref.height = height
        ref.centerY = centerY
        ref.step = step
        ref.dpr = dpr
        ref.points = new Float32Array(maxPoints)
        ref.len = 1
        ref.points[0] = 0
        ref.lastUpdate = Date.now()

        // 只设置一次的样式
        const gradient = ctx.createLinearGradient(0, 0, width, 0)
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0)')
        gradient.addColorStop(1, '#10b981')
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.shadowBlur = 4
        ctx.shadowColor = '#10b981'

        let running = true

        // 页面不可见时自动暂停动画，节省资源
        const handleVisibility = () => {
            running = !document.hidden
            if (running) render()
        }
        document.addEventListener('visibilitychange', handleVisibility)

        function render() {
            if (!running) return
            const elemSizeH = elemSize.current.height
            const now = Date.now()
            const elapsed = now - ref.lastUpdate

            // 数据每 1000ms 更新一次
            if (elapsed >= 1000) {
                const val = ref.hasNewData ? ref.latestValue : 0
                ref.hasNewData = false
                if (ref.len < maxPoints) {
                    ref.points[ref.len++] = val
                } else {
                    // 循环利用数组，避免分配新数组
                    for (let i = 1; i < maxPoints; ++i)
                        ref.points[i - 1] = ref.points[i]
                    ref.points[maxPoints - 1] = val
                }
                ref.lastUpdate = now - (elapsed % 1000)
            }

            if (!ctx) return
            // 清除并绘制
            ctx.globalCompositeOperation = 'copy'
            ctx.fillStyle = 'rgba(0,0,0,0)'
            ctx.fillRect(0, 0, ref.width, ref.height)
            ctx.globalCompositeOperation = 'source-over'

            ctx.beginPath()
            const progress = (now - ref.lastUpdate) / 1000
            const xOffset = progress * ref.step
            const len = ref.len
            const points = ref.points
            if (len > 0) {
                for (let i = 0; i < len; ++i) {
                    const x = i * ref.step - xOffset
                    const y = ref.centerY - points[i] * elemSizeH
                    if (i === 0) ctx.moveTo(x, y)
                    else ctx.lineTo(x, y)
                }
            }
            ctx.stroke()

            // 终点圆点
            if (len > 0) {
                const lastIndex = len - 1
                const lastVal = points[lastIndex]
                const x = lastIndex * ref.step - xOffset
                const y = ref.centerY - lastVal * elemSizeH
                ctx.beginPath()
                ctx.fillStyle = '#fff'
                ctx.arc(x, y, 3, 0, Math.PI * 2)
                ctx.fill()
            }
            ref.animId = requestAnimationFrame(render)
        }
        render()

        return () => {
            running = false
            if (ref.animId !== -1) cancelAnimationFrame(ref.animId)
            document.removeEventListener('visibilitychange', handleVisibility)
        }
    }, [maxPoints])

    return (
        <div
            className={className ? ` ${className}` : ''}
            style={{
                backgroundImage:
                    'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
            }}
            ref={contentRef}
        >
            <div
                className="h-full w-full"
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <canvas ref={canvasRef} className="h-full w-full"></canvas>
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(circle, transparent 60%, color-mix(in srgb, var(--color-base-content) 10%, transparent 100%) 100%)',
                    }}
                ></div>
            </div>
        </div>
    )
}
