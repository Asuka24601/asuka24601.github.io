export interface TagItemInterface {
    name: string
    count: number
}

export interface TagDataInterface {
    generatedAt: string
    tags: TagItemInterface[]
    total: number
}
