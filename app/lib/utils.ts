import { createElement } from 'react'

/**
 * 将时间字符串转换为包含日期、时间及完整日期时间的对象
 * @param time - ISO格式的时间字符串
 * @returns 包含格式化日期、时间及完整日期时间的对象
 */
export function timeToString(time: string) {
    const date = new Date(time)
    return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        dateTime: date.toLocaleString(),
    }
}

/**
 * 根据权重值计算HSL颜色分量（色相固定，饱和度和亮度随权重变化）
 * @param weight - 权重值（0-1之间）
 * @returns 包含HSL分量的对象
 */
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

/**
 * 根据权重值生成HSL颜色字符串
 * @param weight - 权重值（0-1之间）
 * @returns HSL颜色字符串
 */
export function getColorByWeight(weight: number) {
    const { hue, saturation, lightness } = getColorHslByWeight(weight)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

/**
 * 根据权重值计算字体大小
 * @param weight - 权重值（0-1之间）
 * @returns 字体大小字符串（单位：px）
 */
export function getFontSizeByWeight(weight: number) {
    // 设置字号 (10px 到 32px 之间)
    const minSize = 10
    const maxSize = 32
    const fontSize = minSize + (maxSize - minSize) * weight

    return `${fontSize}px`
}

/**
 * 根据背景色计算适合的前景文字颜色（黑色或白色）
 * @param hex - 十六进制颜色值（带或不带#）
 * @returns 前景色十六进制值（#000000或#FFFFFF）
 */
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

/**
 * 根据权重值生成标签的完整样式对象
 * @param weight - 权重值（0-1之间）
 * @returns 包含标签所有样式属性的对象
 */
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

/**
 *
 * @param filename - 文件名
 * @returns 不带扩展名的文件名
 */
export function removeExtension(filename: string) {
    return filename.replace(/\.[^/.]+$/, '')
}

/**
 *
 * @param text 未分段的文本
 * @returns 多个段落（每段2字符缩进）
 */
export function generateParagraph(text: string) {
    if (!text) return null
    return text
        .split('\n')
        .map((paragraph, index) =>
            createElement(
                'p',
                { key: index, className: 'pl-8 -indent-8' },
                paragraph
            )
        )
}

/**
 *
 * @param str 字符串
 * @returns 字符串的MD5
 */
export function md5(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
    }
    return hash.toString()
}
