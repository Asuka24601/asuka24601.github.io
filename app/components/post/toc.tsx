import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import FloatMenu, { TreeStructure } from '../floatMenu'

interface Heading {
    id: string
    text: string
    level: 1 | 2 | 3 | 4 | 5 | 6
}

export default function TOC({
    queryID,
    className,
    style,
}: {
    queryID: string
    className?: string
    style?: React.CSSProperties
}) {
    const [headings, setHeadings] = useState<Heading[]>([])
    const [activeId, setActiveId] = useState<string>('')
    const location = useLocation()

    useEffect(() => {
        // 使用 setTimeout 确保 DOM 已经渲染完成
        const timer = setTimeout(() => {
            const article = document.getElementById(queryID)
            if (!article) return

            const elements = article.querySelectorAll('h1, h2, h3, h4, h5, h6')
            const headingData: Heading[] = []

            elements.forEach((elem) => {
                if (elem.id) {
                    headingData.push({
                        id: elem.id,
                        text: elem.textContent || '',
                        level: parseInt(elem.tagName.substring(1)) as
                            | 1
                            | 2
                            | 3
                            | 4
                            | 5
                            | 6,
                    })
                }
            })

            setHeadings(headingData)

            // 设置 IntersectionObserver 来高亮当前标题
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId(entry.target.id)
                        }
                    })
                },
                {
                    // 调整根边距以在标题进入视口顶部附近时触发
                    rootMargin: '0px 0px -80% 0px',
                }
            )

            elements.forEach((elem) => observer.observe(elem))

            return () => observer.disconnect()
        }, 100)

        return () => clearTimeout(timer)
    }, [location.pathname, queryID]) // 当路由路径变化时重新扫描

    if (headings.length === 0)
        return (
            <FloatMenu className={className} style={style}>
                <li>
                    <TreeStructure level={1} />
                    <span className="after:content-['No_headings_found.']" />
                </li>
            </FloatMenu>
        )

    return (
        <FloatMenu className={className} style={style}>
            {headings.map((heading) => (
                <li key={heading.id}>
                    <a
                        href={`#${heading.id}`}
                        className={`flex items-center truncate py-1 pr-1 transition-colors duration-200 ${
                            activeId === heading.id
                                ? 'bg-primary/10 text-secondary'
                                : 'hover:text-warning text-white/70 hover:bg-white/5'
                        }`}
                        onClick={(e) => {
                            e.preventDefault()
                            const element = document.getElementById(heading.id)
                            if (element) {
                                const headerOffset = 100
                                const elementPosition =
                                    element.getBoundingClientRect().top
                                const offsetPosition =
                                    elementPosition +
                                    window.pageYOffset -
                                    headerOffset

                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth',
                                })
                                setActiveId(heading.id)
                            }
                        }}
                    >
                        {/* Tree Structure Visualization */}
                        <TreeStructure level={heading.level} />

                        {heading.text}
                    </a>
                </li>
            ))}
        </FloatMenu>
    )
}
