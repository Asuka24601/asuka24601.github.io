interface SvgIconProps {
    name: string // 图标文件名
    fill?: string // 颜色
    size?: number | string // 大小
    className?: string // 类名
    stroke?: string // 描边颜色
    fillRule?: 'nonzero' | 'evenodd' | 'inherit' // 填充规则
    clipRule?: 'nonzero' | 'evenodd' | 'inherit' // 剪裁规则
}

export default function SvgIcon({
    name,
    fill = 'currentColor',
    size = 24,
    className,
    stroke,
    fillRule,
    clipRule,
}: SvgIconProps) {
    return (
        <svg
            aria-hidden="true"
            style={{ width: size, height: size, fill: fill }}
            className={className}
            stroke={stroke}
        >
            {/* 这里的 #icon- 对应 vite.config.ts 中的 symbolId 配置 */}
            <use
                xlinkHref={`#icon-${name}`}
                fill={fill}
                fillRule={fillRule}
                clipRule={clipRule}
            />
        </svg>
    )
}
