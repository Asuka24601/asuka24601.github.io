export interface TodoListItemInterface {
    task: string
    description: string | undefined
    created_at: string
    completed_at: string | null
    completed: boolean
}

export interface TodoListDataInterface {
    created_at: string
    updated_at: string | undefined
    data: TodoListItemInterface[]
}
