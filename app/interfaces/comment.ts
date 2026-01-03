export interface CommentItemInterface {
    name: string
    avatar?: string | undefined
    time: string
    message: string
    from?: string | undefined
}

export interface CommentDataInterface {
    creationDate: string
    lastUpdateDate?: string | undefined
    comments: CommentItemInterface[]
}
