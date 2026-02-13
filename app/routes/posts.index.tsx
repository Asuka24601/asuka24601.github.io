/* eslint-disable react-hooks/set-state-in-effect */
import { NavLink, useNavigation } from 'react-router'
import { timeToString } from '../lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import ProgressiveImage from '../components/progressiveImage'
import RouteManifest from '../contents/__manifest.json'
import AllTags from '../contents/tags.json'
import CRTOverlay from '../components/effect/CRTOverlay'
import TextJitter from '../components/effect/textJitter'
import { searchService } from '../lib/search'
import { TagItemComponent } from '../components/home/tagsComponent'

const AsciiProgressBar = () => {
    const [percent, setPercent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setPercent((p) => (p >= 100 ? 0 : p + 5))
        }, 50)
        return () => clearInterval(timer)
    }, [])

    const totalChars = 24
    const filledChars = Math.floor((percent / 100) * totalChars)
    const emptyChars = totalChars - filledChars
    const bar = '|'.repeat(filledChars) + '.'.repeat(emptyChars)

    return (
        <div className="text-base-content/50 flex flex-col items-center gap-1 text-xs">
            <div className="animate-pulse text-[10px] tracking-widest uppercase">
                &gt;&gt; BUFFERING_DATA_STREAM
            </div>
            <div className="flex items-center gap-2">
                <span className="text-primary">[{bar}]</span>
                <span className="text-base-content/70 w-8 text-right">
                    {percent}%
                </span>
            </div>
        </div>
    )
}

const { generatedAt: lastUpdateDate } = RouteManifest

// --- 获取所有tag并排序
const allTags = AllTags.tags
    .sort((a, b) => a.count - b.count)
    .map((tag) => tag.name)

export default function PostIndex() {
    const navigation = useNavigation()

    // --- 状态管理 ---
    // 搜索框输入的文本
    const [searchQuery, setSearchQuery] = useState('')
    // 当前选中的标签列表
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    // --- 分页/懒加载状态 ---
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 10
    const observerTarget = useRef<HTMLDivElement>(null)

    // 根据搜索词和标签过滤文章
    const filteredPosts = useMemo(() => {
        return searchService.search(searchQuery, selectedTags)
    }, [searchQuery, selectedTags])

    // 当筛选条件变化时重置分页
    useEffect(() => {
        setPage(1)
    }, [searchQuery, selectedTags])

    // 计算当前可见的文章列表 (懒加载切片)
    const visiblePosts = useMemo(() => {
        return filteredPosts.slice(0, page * PAGE_SIZE)
    }, [filteredPosts, page])

    const hasMore = visiblePosts.length < filteredPosts.length

    // 滚动监听加载更多
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1)
                }
            },
            { threshold: 0.1 }
        )

        if (observerTarget.current) observer.observe(observerTarget.current)
        return () => observer.disconnect()
    }, [hasMore])

    // 监听导航状态，在开始加载新内容时（内容变更前）立即滚动到顶部
    useEffect(() => {
        if (navigation.state === 'loading') {
            window.scrollTo({
                top: 0,
                behavior: 'instant',
            })
        }
    }, [navigation.state])

    return (
        <div className="mx-auto w-full max-w-6xl text-sm">
            <div
                className="border-terminal transition-all duration-500"
                style={{
                    border: 'none',
                    background: 'none',
                    padding: '0',
                }}
            >
                <CRTOverlay />
                <TextJitter className="min-h-screen">
                    <div className="border-neutral bg-base-200 relative flex min-h-full flex-col overflow-hidden border-4 border-double">
                        {/* Header */}
                        <div className="border-neutral/30 bg-base-200/20 flex items-end justify-between border-b-2 border-dashed p-4">
                            <div>
                                <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_DATABASE_ACCESS']"></div>
                                {/* 动态显示 SQL 查询语句，增加终端沉浸感 */}
                                <div className="text-primary text-xl font-black tracking-widest break-all uppercase after:animate-pulse after:content-['_\_']">
                                    <span className="text-base-content/50 mr-2">{`>`}</span>
                                    SELECT * FROM POSTS
                                    {searchQuery && (
                                        <span className="text-secondary">{` WHERE CONTENT LIKE '%${searchQuery}%'`}</span>
                                    )}
                                    {selectedTags.length > 0 && (
                                        <span className="text-warning">{` ${searchQuery ? 'AND' : 'WHERE'} TAGS IN [${selectedTags.join(',')}]`}</span>
                                    )}
                                </div>
                            </div>
                            <div className="hidden text-right sm:block">
                                <div className="text-base-content text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['LAST\_UPDATE']">
                                    {' '}
                                </div>
                                <div className="text-warning text-xs">
                                    {
                                        timeToString(lastUpdateDate as string)
                                            .dateTime
                                    }
                                </div>
                            </div>
                        </div>

                        {/* --- 筛选控制面板 --- */}
                        <div className="border-neutral/10 bg-base-content/5 border-b border-dashed p-4 text-xs backdrop-blur-sm">
                            {/* 文本搜索输入 */}
                            <div className="mb-4 flex items-center gap-2">
                                <span className="text-secondary font-bold whitespace-nowrap">{`>> QUERY_INPUT:`}</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="border-neutral/30 focus:border-neutral text-base-content placeholder-base-content/50 w-full border-b bg-transparent px-2 py-1 focus:outline-none"
                                    placeholder="输入关键词搜索..."
                                    autoComplete="off"
                                />
                            </div>

                            {/* 标签过滤器 */}
                            <div className="flex flex-wrap items-start gap-2">
                                <span className="text-warning mt-1 font-bold whitespace-nowrap">{`>> FILTER_TAGS:`}</span>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map((tag) => {
                                        const isSelected =
                                            selectedTags.includes(tag)
                                        return (
                                            <button
                                                key={tag}
                                                onClick={() => {
                                                    setSelectedTags((prev) =>
                                                        isSelected
                                                            ? prev.filter(
                                                                  (t) =>
                                                                      t !== tag
                                                              )
                                                            : [...prev, tag]
                                                    )
                                                }}
                                                className={`border px-2 py-0.5 text-[10px] transition-all duration-300 ${
                                                    isSelected
                                                        ? 'border-secondary bg-secondary text-black shadow-[0_0_10px_var(--color-secondary)]'
                                                        : 'hover:border-secondary hover:text-secondary text-base-content/60 border-neutral/20'
                                                }`}
                                            >
                                                {isSelected ? '[x]' : '[ ]'} #
                                                {tag}
                                            </button>
                                        )
                                    })}
                                    {/* 清除按钮 */}
                                    {selectedTags.length > 0 && (
                                        <button
                                            onClick={() => setSelectedTags([])}
                                            className="border border-red-500/50 px-2 py-0.5 text-[10px] text-red-400 transition-colors hover:bg-red-500/10"
                                        >
                                            [CLEAR_TAGS]
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex min-h-[50vh] flex-col">
                            {/* 如果没有结果，显示提示 */}
                            {filteredPosts.length === 0 && (
                                <div className="text-base-content/30 flex h-32 items-center justify-center">
                                    <span className="tracking-widest uppercase">
                                        &lt; NO_DATA_FOUND /&gt;
                                    </span>
                                </div>
                            )}

                            {visiblePosts.map((item) => (
                                <div
                                    key={item.frontMatter.title}
                                    className="group border-neutral/10 hover:bg-primary/5 relative border-b border-dashed p-4 transition-all"
                                >
                                    {/* Hover Indicator */}
                                    <div className="bg-primary absolute top-0 bottom-0 left-0 w-1 opacity-0 transition-opacity group-hover:opacity-100"></div>

                                    <div className="flex gap-6">
                                        {/* Content */}
                                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                                            {/* Meta Header */}
                                            <div className="text-base-content/50 flex items-center gap-3 text-[10px]">
                                                <span className="text-primary">
                                                    [
                                                    {
                                                        timeToString(
                                                            item.frontMatter
                                                                .date
                                                        ).date
                                                    }
                                                    ]
                                                </span>
                                                <span className="bg-neutral/20 h-3 w-px"></span>
                                                <span className="uppercase before:content-['AUTH:_']">
                                                    {item.frontMatter.author}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h2 className="group-hover:text-primary text-base-content text-xl font-bold tracking-wide transition-colors">
                                                <NavLink
                                                    to={item.path}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span className="text-primary/50 -ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100">{`>`}</span>
                                                    {item.frontMatter.title}
                                                </NavLink>
                                            </h2>

                                            {/* Description */}
                                            <p className="text-base-content/70 line-clamp-2 text-xs leading-relaxed">
                                                {item.frontMatter.description}
                                            </p>

                                            {/* Footer: Tags */}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {item.frontMatter.tags?.map(
                                                    (tag) => (
                                                        <TagItemComponent
                                                            key={tag}
                                                            tag={{ name: tag }}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Image (Optional) */}
                                        {item.frontMatter.cover && (
                                            <div className="hidden w-32 shrink-0 sm:block">
                                                <div className="group-hover:border-neutral/30 bg-base-300/40 border border-white/10 p-1 transition-colors">
                                                    <div className="relative aspect-video w-full overflow-hidden grayscale transition-all duration-500 group-hover:grayscale-0">
                                                        <ProgressiveImage
                                                            src={
                                                                item.frontMatter
                                                                    .cover
                                                            }
                                                            alt={
                                                                item.frontMatter
                                                                    .title
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,2px_100%] opacity-20"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* 加载更多占位符 / 观察目标 */}
                            {hasMore && (
                                <div
                                    ref={observerTarget}
                                    className="flex justify-center p-8"
                                >
                                    <AsciiProgressBar />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-neutral/30 text-base-content/40 bg-base-300/20 flex items-center justify-between border-t border-dashed p-2 px-4 text-[10px] uppercase">
                            <span className="before:content-['LOADED:_']">
                                {visiblePosts.length}{' '}
                                <span className="opacity-50">
                                    / {filteredPosts.length}
                                </span>
                            </span>
                            <span className="animate-pulse after:content-['\_END\_OF\_STREAM']"></span>
                        </div>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
