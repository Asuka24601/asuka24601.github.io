import { useEffect, useMemo, useRef, useState } from 'react'

interface LineDataPoint {
    label: string
    value: number
}

interface LineChartProps {
    data: LineDataPoint[]
    className?: string
    lineColor?: string
}

export default function LineChart({
    data,
    className,
    lineColor = '#3b82f6',
}: LineChartProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    // 监听容器尺寸变化，实现响应式
    useEffect(() => {
        if (!containerRef.current) return
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect) {
                    setWidth(entry.contentRect.width)
                    setHeight(entry.contentRect.height)
                }
            }
        })
        resizeObserver.observe(containerRef.current)
        return () => resizeObserver.disconnect()
    }, [])

    // 计算点坐标
    const { points } = useMemo(() => {
        if (!data || data.length === 0 || width === 0 || height === 0) {
            return { points: [] }
        }

        // 预留内边距用于显示坐标轴或防止点贴边
        const padding = { top: 20, right: 20, bottom: 20, left: 20 }
        const chartWidth = width - padding.left - padding.right
        const chartHeight = height - padding.top - padding.bottom

        const values = data.map((d) => d.value)
        const min = Math.min(...values)
        const max = Math.max(...values)
        const range = max - min || 1 // 防止除以0

        const points = data.map((d, i) => {
            const x =
                padding.left +
                (i / (data.length > 1 ? data.length - 1 : 1)) * chartWidth
            // SVG Y轴向下，所以用 1 减去比例
            const y =
                padding.top +
                chartHeight -
                ((d.value - min) / range) * chartHeight
            return { x, y, ...d }
        })

        return { points }
    }, [data, width, height])

    if (!data || data.length === 0) return null

    const pathD =
        points.length > 0
            ? `M ${points[0].x} ${points[0].y} ` +
              points
                  .slice(1)
                  .map((p) => `L ${p.x} ${p.y}`)
                  .join(' ')
            : ''

    return (
        <div ref={containerRef} className={`relative ${className || ''}`}>
            <svg width="100%" height="100%" className="overflow-visible">
                <path
                    d={pathD}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={hoveredIndex === i ? 6 : 4}
                        fill="#fff"
                        stroke={lineColor}
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    />
                ))}
            </svg>

            {/* Tooltip */}
            {hoveredIndex !== null && points[hoveredIndex] && (
                <div
                    className="bg-base-content/75 text-base-content pointer-events-none absolute z-10 rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg"
                    style={{
                        left: points[hoveredIndex].x,
                        top: points[hoveredIndex].y - 8,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <div className="font-bold">
                        {points[hoveredIndex].label}
                    </div>
                    <div>{points[hoveredIndex].value}</div>
                </div>
            )}
        </div>
    )
}
