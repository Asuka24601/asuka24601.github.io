/* eslint-disable react-hooks/immutability */
import { useEffect, useRef, useState } from 'react'

interface material {
    name: string
    value: number
    color: string
}

/**
 *
 * @param materials 饼图的各个部分
 * @returns 饼图组件
 */
export function Pie({
    materials,
    className,
}: {
    materials: material[] | undefined
    className?: string
}) {
    const pieRef = useRef<HTMLCanvasElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    // 仅存储当前激活的 material，位置通过 ref 直接操作 DOM 更新，避免频繁重渲染
    const [activeMaterial, setActiveMaterial] = useState<material | null>(null)
    const [selectedMaterial, setSelectedMaterial] = useState<material | null>(
        null
    )

    useEffect(() => {
        const canvas = pieRef.current
        if (!canvas || !materials) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // 设置 Canvas 内部尺寸以匹配 CSS 尺寸，防止模糊和变形
        const rect = canvas.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)

        const width = rect.width
        const height = rect.height
        const maxRadius = Math.min(width, height) / 2
        const radius = maxRadius * 0.9 // 默认半径缩小，为选中放大留出空间
        const centerX = width / 2
        const centerY = height / 2

        ctx.clearRect(0, 0, width, height) // 重绘前清空画布

        let startAngle = -0.5 * Math.PI // 从 12 点钟方向开始
        materials.forEach((material) => {
            const endAngle = startAngle + (material.value / 100) * 2 * Math.PI
            const isSelected = selectedMaterial?.name === material.name
            const currentRadius = isSelected ? maxRadius : radius

            ctx.beginPath()
            ctx.moveTo(centerX, centerY) // 移动到圆心以绘制扇形
            ctx.arc(
                centerX,
                centerY,
                currentRadius,
                startAngle,
                endAngle,
                false
            )
            ctx.closePath()
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1
            ctx.lineCap = 'round'
            ctx.stroke()
            ctx.fillStyle = material.color
            ctx.fill()

            startAngle = endAngle
        })

        // 加上黑色外边框
    }, [materials, selectedMaterial])

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = pieRef.current
        if (!canvas || !materials) return

        const rect = canvas.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const maxRadius = Math.min(rect.width, rect.height) / 2

        const x = e.clientX - rect.left - centerX
        const y = e.clientY - rect.top - centerY
        const distance = Math.sqrt(x * x + y * y)

        // 直接操作 DOM 更新位置，不触发 React 重渲染
        if (tooltipRef.current) {
            tooltipRef.current.style.top = `${e.clientY - rect.top + 10}px`
            tooltipRef.current.style.left = `${e.clientX - rect.left + 10}px`
        }

        if (distance > maxRadius) {
            if (activeMaterial) setActiveMaterial(null)
            if (tooltipRef.current) tooltipRef.current.style.opacity = '0'
            return
        }

        let angle = Math.atan2(y, x) + 0.5 * Math.PI
        if (angle < 0) angle += 2 * Math.PI

        let currentAngle = 0
        let found = null
        for (const material of materials) {
            const sliceAngle = (material.value / 100) * 2 * Math.PI
            if (angle >= currentAngle && angle < currentAngle + sliceAngle) {
                const isSelected = selectedMaterial?.name === material.name
                const currentRadius = isSelected ? maxRadius : maxRadius * 0.9
                if (distance <= currentRadius) {
                    found = material
                }
                break
            }
            currentAngle += sliceAngle
        }

        if (found) {
            if (activeMaterial?.name !== found.name) {
                setActiveMaterial(found)
            }
            if (tooltipRef.current) tooltipRef.current.style.opacity = '1'
        } else {
            if (activeMaterial) setActiveMaterial(null)
            if (tooltipRef.current) tooltipRef.current.style.opacity = '0'
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = pieRef.current
        if (!canvas || !materials) return

        const rect = canvas.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const maxRadius = Math.min(rect.width, rect.height) / 2

        const x = e.clientX - rect.left - centerX
        const y = e.clientY - rect.top - centerY
        const distance = Math.sqrt(x * x + y * y)

        if (distance > maxRadius) {
            setSelectedMaterial(null)
            return
        }

        let angle = Math.atan2(y, x) + 0.5 * Math.PI
        if (angle < 0) angle += 2 * Math.PI

        let currentAngle = 0
        for (const material of materials) {
            const sliceAngle = (material.value / 100) * 2 * Math.PI
            if (angle >= currentAngle && angle < currentAngle + sliceAngle) {
                const isSelected = selectedMaterial?.name === material.name
                const currentRadius = isSelected ? maxRadius : maxRadius * 0.9
                if (distance <= currentRadius) {
                    setSelectedMaterial(isSelected ? null : material)
                }
                return
            }
            currentAngle += sliceAngle
        }
        setSelectedMaterial(null)
    }

    return (
        <>
            {materials && (
                <div className={`relative ${className || ''}`}>
                    <div className="h-full w-full overflow-visible">
                        <canvas
                            ref={pieRef}
                            className="relative h-full w-full"
                            onMouseMove={handleMouseMove}
                            onClick={handleClick}
                            onMouseLeave={() => {
                                if (tooltipRef.current)
                                    tooltipRef.current.style.opacity = '0'
                                setActiveMaterial(null)
                            }}
                        ></canvas>
                    </div>

                    <div
                        ref={tooltipRef}
                        className="bg-base-content/75 text-base-content pointer-events-none absolute z-9999 rounded-sm p-[4px_8px] text-xs transition-opacity duration-150"
                        style={{ opacity: 0, top: 0, left: 0 }}
                    >
                        {activeMaterial && (
                            <p className="text-nowrap">
                                {activeMaterial.name}: {activeMaterial.value}%
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

/**
 *
 * @param materials 饼图的各个部分
 * @returns 饼图组件（Svg形式）
 */
export function PieChartSvg({
    materials,
    className,
    size = 300,
}: {
    materials: material[] | undefined
    size?: number
    className?: string
}) {
    const [hoveredIndex, setHoveredIndex] = useState(-1)
    const pieRef = useRef<HTMLDivElement>(null)
    const sizeRef = useRef(size)

    useEffect(() => {
        // 获取元素的高宽，用于甚至svg的大小
        const element = pieRef.current
        if (!element || !className) return
        const rect = element.getBoundingClientRect()
        sizeRef.current = Math.min(rect.width, rect.height)
    }, [className])

    if (!materials) return null

    // 1. 基础参数
    const radius = sizeRef.current / 2.3
    const center = sizeRef.current / 2
    const total = materials.reduce((sum, item) => sum + item.value, 0)

    // 2. 辅助函数：将极坐标转换为直角坐标
    const getCoordinates = (angleInDegrees: number) => {
        // 减去 90 度让饼图从正上方（12点钟方向）开始
        const radians = ((angleInDegrees - 90) * Math.PI) / 180.0
        return {
            x: center + radius * Math.cos(radians),
            y: center + radius * Math.sin(radians),
        }
    }

    let cumulativeAngle = 0

    return (
        <div
            ref={pieRef}
            className={className || ''}
            style={{
                position: 'relative',
            }}
        >
            <svg viewBox={`0 0 ${sizeRef.current} ${sizeRef.current}`}>
                {materials.map((item, index) => {
                    // 计算当前切片的角度
                    const sliceAngle = (item.value / total) * 360
                    const startAngle = cumulativeAngle
                    const endAngle = cumulativeAngle + sliceAngle

                    // 获取起点和终点坐标
                    const start = getCoordinates(startAngle)
                    const end = getCoordinates(endAngle)

                    // 如果角度大于 180 度，large-arc-flag 必须为 1
                    const largeArcFlag = sliceAngle > 180 ? 1 : 0

                    // 构建 SVG 路径指令
                    // M: 移到圆心 | L: 画线到起点 | A: 画圆弧到终点 | Z: 闭合回到圆心
                    const pathData = [
                        `M ${center} ${center}`,
                        `L ${start.x} ${start.y}`,
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
                        'Z',
                    ].join(' ')

                    cumulativeAngle += sliceAngle

                    const isHovered = hoveredIndex === index

                    return (
                        <path
                            key={index}
                            d={pathData}
                            fill={item.color}
                            stroke="#fff"
                            strokeWidth="2"
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                transform: isHovered
                                    ? 'scale(1.05)'
                                    : 'scale(1)',
                                transformOrigin: 'center',
                                filter: isHovered
                                    ? 'drop-shadow(0 0 8px rgba(0,0,0,0.2))'
                                    : 'none',
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(-1)}
                        />
                    )
                })}
            </svg>

            {/* 简单的悬停信息显示 */}
            {hoveredIndex !== -1 && (
                <div
                    className="text-xs text-nowrap"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        textAlign: 'center',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    }}
                >
                    <strong>{materials[hoveredIndex].name}</strong>
                    <div>
                        (
                        {(
                            (materials[hoveredIndex].value / total) *
                            100
                        ).toFixed(1)}
                        %)
                    </div>
                </div>
            )}
        </div>
    )
}

export function PieChartSvgClassic({
    materials,
    className,
}: {
    materials: material[] | undefined
    size?: number
    className?: string
}) {
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1)
    if (!materials) return null
    // 使用固定坐标系，通过 CSS 缩放适应容器
    const viewBoxSize = 200
    const center = viewBoxSize / 2
    const radius = center * 0.8
    const total = materials.reduce((sum, item) => sum + item.value, 0)

    const getCoordinates = (angleInDegrees: number) => {
        const radians = ((angleInDegrees - 90) * Math.PI) / 180.0
        return {
            x: center + radius * Math.cos(radians),
            y: center + radius * Math.sin(radians),
        }
    }

    let cumulativeAngle = 0

    return (
        <div className={`h-full w-full ${className || ''}`}>
            <svg
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                className="h-full w-full overflow-visible"
            >
                <defs>
                    {materials.map((item, i) => (
                        <pattern
                            key={i}
                            id={`p-${i}`}
                            x="0"
                            y="0"
                            width={i % 4 === 2 ? 6 : 4}
                            height={i % 4 === 2 ? 6 : 4}
                            patternUnits="userSpaceOnUse"
                        >
                            {i % 4 === 0 && (
                                <circle
                                    cx="1"
                                    cy="1"
                                    r="1"
                                    fill={item.color}
                                    className="opacity-50"
                                />
                            )}
                            {i % 4 === 1 && (
                                <path
                                    d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"
                                    stroke={item.color}
                                    strokeWidth="1"
                                    className="opacity-50"
                                />
                            )}
                            {i % 4 === 2 && (
                                <path
                                    d="M 6 0 L 0 0 0 6"
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth="1"
                                    className="opacity-50"
                                />
                            )}
                            {i % 4 === 3 && (
                                <path
                                    d="M 2 0 L 2 4"
                                    stroke={item.color}
                                    strokeWidth="1"
                                    className="opacity-50"
                                />
                            )}
                        </pattern>
                    ))}
                </defs>

                {materials.map((item, index) => {
                    const sliceAngle = (item.value / total) * 360
                    const startAngle = cumulativeAngle
                    const endAngle = cumulativeAngle + sliceAngle
                    const start = getCoordinates(startAngle)
                    const end = getCoordinates(endAngle)
                    const largeArcFlag = sliceAngle > 180 ? 1 : 0
                    const pathData = [
                        `M ${center} ${center}`,
                        `L ${start.x} ${start.y}`,
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
                        'Z',
                    ].join(' ')
                    cumulativeAngle += sliceAngle
                    const isHovered = hoveredIndex === index
                    const pattern = `url(#p-${index})`

                    return (
                        <g
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(-1)}
                            style={{
                                color: item.color,
                                transformOrigin: `${center}px ${center}px`,
                                transform: isHovered
                                    ? 'scale(1.05)'
                                    : 'scale(1)',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer',
                            }}
                        >
                            <path
                                d={pathData}
                                fill={pattern}
                                stroke="currentColor"
                                strokeWidth="1"
                            />
                        </g>
                    )
                })}
            </svg>
            {/* Tooltip */}
            {hoveredIndex !== -1 && (
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="bg-base-300/90 border-neutral/50 border px-2 py-1 shadow-lg backdrop-blur-sm">
                        <div className="text-primary text-xs font-bold uppercase">
                            {materials[hoveredIndex].name}
                        </div>
                        <div className="text-primary/80 text-[10px]">
                            {(
                                (materials[hoveredIndex].value / total) *
                                100
                            ).toFixed(1)}
                            %
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
