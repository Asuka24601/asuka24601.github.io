import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css' // 记得引入样式

interface LatexProps {
    formula: string
    displayMode?: boolean // true 为块级，false 为行内
    throwOnError?: boolean
}

export default function Latex({
    formula,
    displayMode = false,
    throwOnError = false,
}: LatexProps) {
    // 使用 useMemo 在渲染阶段生成 HTML
    // 因为 katex.renderToString 是同步的，且不依赖浏览器 DOM，所以 SSR 安全
    const html = useMemo(() => {
        if (!formula) return ''
        try {
            return katex.renderToString(formula, {
                displayMode,
                throwOnError,
                strict: false,
            })
        } catch (error) {
            console.error('KaTeX error:', error)
            return formula // 出错时回退到原始文本
        }
    }, [formula, displayMode, throwOnError])

    return (
        <span
            // KaTeX 生成的 HTML 结构已经包含了必要的类名
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}
