import SvgIcon from '../SvgIcon'
import type { TodoListItemInterface } from '../../interfaces/todo'
import { timeToString } from '../../lib/utils'

function Icon({ state }: { state: boolean }) {
    return (
        <SvgIcon
            name={state ? 'done' : 'circle'}
            className="h-5 w-5 text-[color-mix(in_srgb,var(--color-primary),white)]"
            size={20}
            fillRule="evenodd"
            clipRule="evenodd"
            fill="color-mix(in srgb,var(--color-primary),white)"
        />
    )
}

function TimelineItem({
    completed,
    task,
    description,
    created_at,
    completed_at,
    index,
}: { index: number } & TodoListItemInterface) {
    return (
        <>
            <li key={index}>
                {index !== 0 && <hr />}

                <div className="timeline-middle">
                    <Icon state={completed as boolean} />
                </div>
                <div
                    className={`mb-10 ${index % 2 === 0 ? 'timeline-start md:text-end' : 'timeline-end'}`}
                >
                    <time className="font-mono italic">
                        {completed && completed_at
                            ? timeToString(completed_at).date
                            : timeToString(created_at).date}
                    </time>
                    <div className="text-lg font-black">{task}</div>
                    {description}
                </div>
                <hr />
            </li>
        </>
    )
}

export default function TimeLineComponent({
    todoListItems,
}: {
    todoListItems: TodoListItemInterface[]
}) {
    const todoList = todoListItems
    return (
        <>
            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical *:last:*:last:hidden">
                {todoList.map((item, index) => {
                    return <TimelineItem index={index} {...item} key={index} />
                })}
            </ul>
        </>
    )
}
