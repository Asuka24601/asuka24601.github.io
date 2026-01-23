import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

interface Heading {
    id: string
    text: string
    level: number
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
                        level: parseInt(elem.tagName.substring(1)),
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

    if (headings.length === 0) return null

    return (
        <nav className={`${className ? className : ''}`} style={style}>
            <div className="mb-3 text-xs font-bold tracking-widest uppercase opacity-40 select-none">
                Contents
            </div>
            <ul className="border-base-content/10 space-y-1 border-l text-sm">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            className={`-ml-0.5 block truncate border-l-2 py-1 transition-all duration-200 ${
                                activeId === heading.id
                                    ? 'border-primary text-primary font-medium'
                                    : 'text-base-content/60 hover:text-base-content hover:border-base-content/30 border-transparent'
                            }`}
                            style={{
                                paddingLeft: `${(heading.level - 1) * 0.75 + 0.75}rem`,
                                fontSize:
                                    heading.level > 2 ? '0.85em' : '0.9em',
                            }}
                            onClick={(e) => {
                                e.preventDefault()
                                const element = document.getElementById(
                                    heading.id
                                )
                                if (element) {
                                    // 平滑滚动并留出顶部导航栏的空间
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
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
