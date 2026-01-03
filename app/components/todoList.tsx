import type {
    TodoListDataInterface,
    TodoListItemInterface,
} from '../interfaces/todo'

export function TodoListItemComponent({
    subject,
    index,
}: {
    subject: TodoListItemInterface
    index?: number | undefined
}) {
    return (
        <>
            {index ? (
                <div className="text-3xl font-thin tabular-nums opacity-30">
                    {index}
                </div>
            ) : null}
            <div className="list-col-grow overflow-x-hidden">
                <h1 className="text-xs">{subject.name}</h1>
                <p className="overflow-hidden text-xs font-semibold text-nowrap text-ellipsis opacity-60">
                    {subject.description}
                </p>
            </div>
        </>
    )
}

export default function TodoListComponent({
    todoListData,
    className,
}: {
    todoListData: TodoListDataInterface
    className?: string | undefined
}) {
    const list = todoListData.subjects
    return (
        <div className={className}>
            <ul className="list">
                {list.map((subject, index) => (
                    <li key={index} className="list-row">
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
