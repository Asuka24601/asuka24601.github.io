export interface CommentItemInterface {
    name: string
    avatar: string | undefined
    time: string
    message: string
    from?: string | undefined
}

export interface CommentDataInterface {
    created_at: string
    updated_at?: string | undefined
    data: CommentItemInterface[]
}
