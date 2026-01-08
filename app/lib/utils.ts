export function timeToString(time: string) {
    const date = new Date(time)
    return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        dateTime: date.toLocaleString(),
    }
}

function getColorHslByWeight(weight: number) {
    // 保持色相一致，根据权重改变饱和度和亮度
    // 权重越高，颜色越鲜艳，亮度越低（显眼）
    const hue = 250
    const saturation = 30 + weight * 70 // 30% 到 100%
    const lightness = 90 - weight * 50 // 90% 到 40%

    return {
        hue: hue,
        saturation: saturation,
        lightness: lightness,
    }
}

export function getColorByWeight(weight: number) {
    const { hue, saturation, lightness } = getColorHslByWeight(weight)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function getFontSizeByWeight(weight: number) {
    // 设置字号 (10px 到 32px 之间)
    const minSize = 10
    const maxSize = 32
    const fontSize = minSize + (maxSize - minSize) * weight

    return `${fontSize}px`
}

export function getColorByBackground(hex: string) {
    // 去掉 # 号
    hex = hex.replace('#', '')

    // 转换为 RGB
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)

    // 计算亮度 (感知亮度公式)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // 如果亮度大于 0.7，说明背景是浅色，返回黑色文字；否则返回白色
    return luminance > 0.8 ? '#000000' : '#FFFFFF'
}

export function generateTagStyleByWeight(weight: number) {
    const { hue, saturation, lightness } = getColorHslByWeight(weight)
    const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    const fontSize = getFontSizeByWeight(weight)

    // 保持色相一致，根据权重改变饱和度和亮度
    // 权重越高，颜色越鲜艳，亮度越低（显眼）

    const textColor = lightness > 80 ? '#000000' : '#FFFFFF'

    const transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
    const border = `1px solid hsl(${hue}, ${saturation}%, ${lightness - 5}%)`

    return {
        backgroundColor: hsl,
        fontSize: fontSize,
        color: textColor,

        transition: transition,
        border: border,

        '--hover-bg': `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`,
    }
}
