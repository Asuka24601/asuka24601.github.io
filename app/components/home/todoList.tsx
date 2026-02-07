import type { TodoListItemInterface } from '../../interfaces/todo'
import { memo } from 'react'
import CRTOverlay from '../effect/CRTOverlay'
import TextJitter from '../effect/textJitter'

export function TodoListItemComponent({
    subject,
    index,
}: {
    subject: TodoListItemInterface
    index: number
}) {
    const isCompleted = subject.completed
    // Fake PID generation
    const pid = 1000 + index

    return (
        <div
            className={`group border-neutral/50 hover:bg-primary/20 flex flex-col gap-1 border-b border-dashed p-2 transition-colors last-of-type:border-none ${isCompleted ? 'opacity-50' : ''}`}
        >
            <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-base-content/30 shrink-0 text-xs select-none">
                        {pid}
                    </span>
                    <span
                        className={`shrink-0 text-[10px] font-bold uppercase ${isCompleted ? "text-red-500 before:content-['KILLED']" : "text-success animate-pulse before:content-['RUNNING']"}`}
                    ></span>
                    <span
                        className={`truncate text-sm font-bold ${isCompleted ? 'text-base-content/40 line-through' : 'text-secondary'}`}
                    >
                        {subject.task}
                    </span>
                </div>
                <div
                    className={`text-base-content/30 shrink-0 text-[10px] ${isCompleted ? "before:content-['PRI:_0']" : "before:content-['PRI:_20']"}`}
                ></div>
            </div>
            {subject.description && (
                <div className="text-base-content/60 pl-10 text-[10px]">
                    <span className="text-primary/40 mr-1 before:content-['>>']"></span>
                    {subject.description}
                </div>
            )}
        </div>
    )
}

function TodoListComponent({
    todoListItems,
    className,
}: {
    todoListItems: TodoListItemInterface[]
    className?: string | undefined
}) {
    return (
        <div className={`w-full text-sm ${className || ''}`}>
            <div className="border-terminal">
                <CRTOverlay />
                <TextJitter>
                    {/* Header */}
                    <div className="border-neutral/30 mb-2 flex items-end justify-between border-b-2 border-dashed pb-2">
                        <div>
                            <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_SYSTEM\_TASKS']"></div>
                            <div className="text-primary text-xl font-black tracking-widest uppercase before:content-['PROCESS\_LIST']"></div>
                        </div>
                        <div className="text-right">
                            <div className="text-base-content text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['ACTIVE\_THREADS']"></div>
                            <div className="text-warning text-xs opacity-70 after:content-['_TOTAL']">
                                {todoListItems.length}
                            </div>
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-1 py-2">
                        {todoListItems.map((subject, index) => (
                            <TodoListItemComponent
                                key={index}
                                subject={subject}
                                index={index}
                            />
                        ))}
                    </div>

                    <div className="text-base-content mt-4 text-[10px] opacity-50">
                        <span className="uppercase before:content-['>>_AWAITING_INSTRUCTION']"></span>
                        <span className="ml-1 animate-pulse before:content-['\_']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}

export default memo(TodoListComponent)
