export interface TodoListItemInterface {
    name: string
    description?: string | undefined
    addTime: string
    completionTime?: string | undefined
    state: boolean | undefined
    from?: string | undefined
}

export interface TodoListDataInterface {
    creationDate: string
    lastUpdateDate?: string | undefined
    subjects: TodoListItemInterface[]
}
