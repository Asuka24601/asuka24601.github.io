import type { TodoListItemInterface } from '../../interfaces/todo'
import { memo } from 'react'

export function TodoListItemComponent({
    subject,
    index,
}: {
    subject: TodoListItemInterface
    index?: number | undefined
}) {
    return (
        <>
            <div className="grid grid-cols-[auto_1fr] gap-1">
                {index ? (
                    <div className="text-base-100 text-3xl font-thin tabular-nums opacity-30">
                        <span className="bg-primary inline-block w-8 p-1">
                            {index.toString()}
                        </span>
                    </div>
                ) : null}

                <div className="flex flex-col justify-center overflow-hidden">
                    <div className="hover:bg-base-100 w-fit overflow-clip rounded-xl px-2 py-1 text-nowrap text-ellipsis transition duration-300 ease-in-out hover:absolute hover:shadow-sm">
                        {subject.task}
                    </div>
                </div>
            </div>

            <div>
                <p className="text-xs font-normal text-wrap break-all text-ellipsis opacity-60">
                    {subject.description}
                </p>
            </div>
        </>
    )
}

function TodoListComponent({
    todoListItems,
    className,
}: {
    todoListItems: TodoListItemInterface[]
    className?: string | undefined
}) {
    const list = todoListItems.filter((item) => !item.completed)
    return (
        <div className={className ? className : ''}>
            <ul className="list p-3">
                {list.map((subject, index) => (
                    <li
                        key={index}
                        className="list-row flex flex-col gap-2 px-0"
                    >
                        <TodoListItemComponent
                            subject={subject}
                            index={index + 1}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default memo(TodoListComponent)
