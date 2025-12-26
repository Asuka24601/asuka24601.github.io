export interface PostInterface {
    title: string,
    author: string,
    creationDate: string,
    lastUpdateDate?: string,
    abstract?:string,
    cover?:string,
    length:number,
    keyWord?: string[]
}

export interface PostListInterface {
    creationDate:string,
    lastUpdateDate?: string,
    posts: PostInterface[]
}