import { useMemo, useState } from 'react'
import todoListData from '../assets/data/todos.json'
import CRTOverlay from '../components/effect/CRTOverlay'
import type { TodoListItemInterface } from '../interfaces/todo'
import { timeToString } from '../lib/utils'

function TimelineItem({
    completed,
    task,
    description,
    created_at,
    completed_at,
    index,
    isLast,
}: { index: number; isLast: boolean } & TodoListItemInterface) {
    const date = completed && completed_at ? completed_at : created_at
    const dateStr = timeToString(date).date

    return (
        <div
            className="grid transition-all duration-500 ease-in-out"
            style={{
                gridTemplateRows: completed
                    ? 'var(--rows-completed)'
                    : 'var(--rows-pending)',
                opacity: completed
                    ? 'var(--opacity-completed)'
                    : 'var(--opacity-pending)',
            }}
        >
            <div className="min-h-0 overflow-x-visible">
                <div
                    className={`group relative border-l border-dashed border-white/20 pl-8 ${isLast ? 'pb-2' : 'pb-8'}`}
                >
                    {/* Node */}
                    <div
                        className={`absolute top-1.5 -left-1.25 h-2.5 w-2.5 border transition-all duration-300 group-hover:scale-125 ${
                            completed
                                ? 'bg-success border-success group-hover:bg-success'
                                : 'border-primary group-hover:bg-primary bg-black'
                        }`}
                    ></div>

                    {/* Content */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-white/50">
                            <span className="text-secondary/50 before:content-['['] after:content-[']']">
                                {dateStr}
                            </span>
                            <span
                                className={`uppercase before:content-['STATUS:_'] ${completed ? 'text-success' : 'text-warning'}`}
                            >
                                {completed ? 'COMPLETE' : 'PENDING'}
                            </span>
                            <span className="hidden text-white/20 before:content-['|'] sm:inline"></span>
                            <span className="text-[10px] tracking-wider text-white/30 uppercase before:content-['OP\_ID:_']">
                                {(index + 1).toString().padStart(3, '0')}
                            </span>
                        </div>

                        <div className="group-hover:text-primary text-sm font-bold text-white/90 transition-colors">
                            <span className="text-primary/50 select- mr-2 before:content-['>>']"></span>
                            {task}
                        </div>

                        {description && (
                            <div className="ml-1 border-l-2 border-white/5 py-1 pl-6 text-xs text-white/60">
                                {description}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function TimeLine() {
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

    // 优化：只生成一次完整的列表，后续筛选不再触发重绘
    const items = useMemo(() => {
        return todoListData.data.map((item, index) => (
            <TimelineItem
                index={index}
                {...item}
                key={index}
                isLast={index === todoListData.data.length - 1}
            />
        ))
    }, [])

    return (
        <div className="h-full w-full">
            <CRTOverlay />
            <div className="mb-8 border-b border-dashed border-white/20 pb-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_SYSTEM\_OPERATIONS\_LOG']"></div>
                        <h2 className="text-primary text-xl font-black tracking-widest uppercase before:content-['TRACKING\_ALL\_TASKS\_AND\_EVENTS.TXT']"></h2>
                    </div>

                    <div className="flex gap-4 text-[10px] font-bold tracking-widest uppercase">
                        <button
                            onClick={() => setFilter('all')}
                            className={`hover:text-secondary transition-colors ${filter === 'all' ? 'text-secondary' : 'text-white/40'}`}
                        >
                            <span className="before:content-['[_ALL_]']"></span>
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`hover:text-success transition-colors ${filter === 'completed' ? 'text-success' : 'text-white/40'}`}
                        >
                            <span className="before:content-['[_COMPLETED_]']"></span>
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`hover:text-warning transition-colors ${filter === 'pending' ? 'text-warning' : 'text-white/40'}`}
                        >
                            <span className="before:content-['[_PENDING_]']"></span>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="flex flex-col pl-2"
                style={
                    {
                        '--rows-completed':
                            filter === 'pending' ? '0fr' : '1fr',
                        '--opacity-completed': filter === 'pending' ? '0' : '1',
                        '--rows-pending':
                            filter === 'completed' ? '0fr' : '1fr',
                        '--opacity-pending': filter === 'completed' ? '0' : '1',
                    } as React.CSSProperties
                }
            >
                {items}
            </div>

            <div className="text-base-100 mt-4 text-[10px] opacity-50">
                <span className="uppercase before:content-['>>_END_OF_STREAM']"></span>
                <span className="ml-1 animate-pulse before:content-['\_']"></span>
            </div>
        </div>
    )
}
