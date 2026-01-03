export interface TagItemInterface {
    name: string
    count: number
}

export interface TagDataInterface {
    creationDate: string
    lastUpdateDate?: string | undefined
    total: number
    tags: TagItemInterface[]
}
