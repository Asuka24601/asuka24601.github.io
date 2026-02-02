/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { searchService } from '../lib/search'
import { useSearchStore } from '../lib/store'
import { timeToString } from '../lib/utils'
import SvgIcon from './SvgIcon'
import CRTOverlay from './effect/CRTOverlay'
import TextJitter from './effect/textJitter'

// --- 辅助组件：高亮匹配文本 ---
const HighlightText = ({
    text,
    highlight,
}: {
    text: string | undefined
    highlight: string
}) => {
    if (!text) return null
    if (!highlight.trim()) {
        return <span>{text}</span>
    }

    // 1. 将搜索词拆分为单词，并转义正则特殊字符
    const terms = highlight
        .split(/\s+/)
        .filter((t) => t.trim().length > 0)
        .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

    if (terms.length === 0) return <span>{text}</span>

    // 2. 构建正则：全局匹配任意关键词
    const pattern = `(${terms.join('|')})`
    const splitRegex = new RegExp(pattern, 'gi')
    const matchRegex = new RegExp(`^${pattern}$`, 'i')

    // 3. 分割并渲染
    const parts = text.split(splitRegex)

    return (
        <span>
            {parts.map((part, i) =>
                matchRegex.test(part) ? (
                    <span
                        key={i}
                        className="bg-warning px-0.5 font-bold text-black text-shadow-none"
                    >
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    )
}

// --- 辅助组件：匹配度进度条 ---
const MatchScore = ({ score }: { score: number | undefined }) => {
    if (score === undefined) return null

    // 归一化分数：假设 100 分为满分（完全匹配标题），最高限制为 100%
    const percentage = Math.min(Math.round(score), 100)
    // 进度条长度（字符数）
    const barLength = 10
    const filledLength = Math.round((percentage / 100) * barLength)
    const emptyLength = barLength - filledLength

    return (
        <div className="flex items-center gap-2 font-mono text-[10px] opacity-80">
            <span className="text-base-content/40">MATCH:</span>
            <span className="flex">
                <span className="text-success">{'|'.repeat(filledLength)}</span>
                <span className="text-base-content/10">
                    {'.'.repeat(emptyLength)}
                </span>
            </span>
            <span
                className={
                    percentage > 80 ? 'text-success' : 'text-base-content/60'
                }
            >
                {percentage}%
            </span>
        </div>
    )
}

export default function Search() {
    const searchShow = useSearchStore((state) => state.searchShow)
    const resetSearch = useSearchStore((state) => state.resetSearchShow)
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    // 使用 useMemo 实现实时搜索
    const results = useMemo(() => {
        if (!query.trim()) return []
        return searchService.search(query)
    }, [query])

    // 当搜索结果变化时，重置选中项
    useEffect(() => {
        setSelectedIndex(-1)
    }, [results])

    // 自动滚动到选中项
    useEffect(() => {
        if (selectedIndex >= 0 && listRef.current) {
            const selectedElement = listRef.current.children[
                selectedIndex
            ] as HTMLElement
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' })
            }
        }
    }, [selectedIndex])

    // Close on Escape and focus input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') resetSearch()
        }
        if (searchShow) {
            const scrollbarWidth =
                window.innerWidth - document.documentElement.clientWidth
            document.body.style.overflow = 'hidden'
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`
            }

            window.addEventListener('keydown', handleKeyDown)
            setQuery('') // 重置搜索词
            setTimeout(() => inputRef.current?.focus(), 100)
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
        }
    }, [searchShow, resetSearch])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (results.length === 0) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex((prev) => {
                    const next = prev + 1
                    return next >= results.length ? 0 : next
                })
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex((prev) => {
                    const next = prev - 1
                    return next < 0 ? results.length - 1 : next
                })
                break
            case 'Enter': {
                e.preventDefault()
                // 如果没有选中项，默认选择第一项
                const targetIndex = selectedIndex === -1 ? 0 : selectedIndex
                if (results[targetIndex]) {
                    navigate('posts/' + results[targetIndex].path)
                    resetSearch()
                }
                break
            }
        }
    }

    if (!searchShow) return null

    return (
        <div className="bg-base-100/80 fixed inset-0 z-50 flex items-start justify-center pt-[15vh] font-mono text-sm backdrop-blur-sm">
            <style>{`
                @keyframes crt-turn-on {
                    0% {
                        transform: scaleY(0.005) scaleX(0);
                        opacity: 0;
                        filter: brightness(3);
                    }
                    60% {
                        transform: scaleY(0.005) scaleX(1);
                        opacity: 1;
                        filter: brightness(3);
                    }
                    100% {
                        transform: scaleY(1) scaleX(1);
                        opacity: 1;
                        filter: brightness(1);
                    }
                }
            `}</style>
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={resetSearch}></div>

            <div
                className="relative w-full max-w-2xl p-4"
                style={{
                    animation:
                        'crt-turn-on 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                }}
            >
                <div className="border-terminal bg-base-200/50">
                    {/* CRT Overlay */}
                    <CRTOverlay />

                    <TextJitter>
                        {/* Header */}
                        <div className="border-neutral/30 bg-base-300/20 flex items-end justify-between border-b-2 border-dashed p-4">
                            <div>
                                <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_SYSTEM\_QUERY']"></div>
                                <div className="text-primary flex items-center gap-2">
                                    <SvgIcon name="search" size={24} />
                                    <div className="text-xl font-black tracking-widest uppercase before:content-['DATABASE\_SEARCH']"></div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-base-content text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['STATUS']"></div>
                                <div className="text-primary animate-pulse text-xs opacity-70">
                                    {query
                                        ? `FOUND_${results.length}_MATCHES`
                                        : 'WAITING_INPUT...'}
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            {/* Input Form */}
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col gap-2"
                            >
                                <label className="text-base-content/50 text-[10px] uppercase before:content-['Enter_Keywords:']"></label>
                                <div className="border-neutral/50 focus-within:border-neutral bg-base-200/20 flex items-center gap-3 border-b-2 p-3 transition-colors">
                                    <span className="text-primary font-bold before:content-['>']"></span>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        className="text-base-content placeholder:text-base-content/20 w-full bg-transparent text-lg font-bold outline-none"
                                        placeholder="TYPE_HERE..."
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        onKeyDown={handleInputKeyDown}
                                        autoComplete="off"
                                    />
                                    <span className="bg-primary h-5 w-2 animate-pulse"></span>
                                </div>
                            </form>

                            {/* Results List */}
                            {(query || results.length > 0) && (
                                <div className="scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent mt-4 max-h-[50vh] overflow-y-auto pr-2">
                                    {results.length > 0 ? (
                                        <div
                                            className="flex flex-col gap-2"
                                            ref={listRef}
                                        >
                                            {results.map((post, index) => (
                                                <Link
                                                    key={post.slug}
                                                    to={'posts/' + post.path}
                                                    onClick={resetSearch}
                                                    onMouseEnter={() =>
                                                        setSelectedIndex(index)
                                                    }
                                                    className={`group border border-dashed p-3 transition-all ${
                                                        index === selectedIndex
                                                            ? 'border-neutral bg-primary/10'
                                                            : 'hover:border-neutral hover:bg-primary/10 border-white/10 bg-white/5'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="group-hover:text-primary text-base-content font-bold">
                                                            <span className="mr-2 opacity-50 transition-all group-hover:mr-3 group-hover:opacity-100">{`>>`}</span>
                                                            <HighlightText
                                                                text={
                                                                    post
                                                                        .frontMatter
                                                                        .title
                                                                }
                                                                highlight={
                                                                    query
                                                                }
                                                            />
                                                        </div>
                                                        <div className="text-base-content/40 font-mono text-[10px]">
                                                            <span className="hidden sm:inline">
                                                                [
                                                                {
                                                                    timeToString(
                                                                        post
                                                                            .frontMatter
                                                                            .date
                                                                    ).date
                                                                }
                                                                ]
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* 匹配度显示 */}
                                                    {post.score &&
                                                        post.score > 0 && (
                                                            <MatchScore
                                                                score={
                                                                    post.score
                                                                }
                                                            />
                                                        )}

                                                    {post.frontMatter
                                                        .description && (
                                                        <div className="text-base-content/60 mt-1 line-clamp-1 pl-6 text-xs">
                                                            <HighlightText
                                                                text={
                                                                    post
                                                                        .frontMatter
                                                                        .description
                                                                }
                                                                highlight={
                                                                    query
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="mt-2 flex gap-2 pl-6">
                                                        {post.frontMatter.tags?.map(
                                                            (tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="text-secondary text-[10px] opacity-70"
                                                                >
                                                                    #
                                                                    <HighlightText
                                                                        text={
                                                                            tag
                                                                        }
                                                                        highlight={
                                                                            query
                                                                        }
                                                                    />
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-base-content/30 flex flex-col items-center justify-center border border-dashed border-white/5 py-8">
                                            <div className="text-4xl font-black opacity-20">
                                                0
                                            </div>
                                            <div className="mt-2 text-xs tracking-widest uppercase">
                                                &lt; NO_DATA_FOUND /&gt;
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-4 flex items-center justify-between border-t border-dashed border-white/10 pt-2">
                                <div className="text-base-content/40 text-[10px] before:content-['PRESS_[ESC]_TO_CANCEL']"></div>
                            </div>
                        </div>
                    </TextJitter>
                </div>
            </div>
        </div>
    )
}
