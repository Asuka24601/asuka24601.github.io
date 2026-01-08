/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PostInterface {
    frontMatter: FrontMatter
    meta: MetaType
    path: string
}

export interface PostListInterface {
    creationDate: string
    lastUpdateDate?: string
    posts: PostInterface[]
}

export type MetaType = [
    { title: string },
    {
        name: string
        content: string
    },
    { property: 'og:title'; content: string },
    { property: 'og:description'; content: string },
    { property: 'article:published_time'; content: string },
    { property: 'article:tag'; content: string },
]

export interface FrontMatter {
    title: string
    date: string
    author?: string
    tags?: string[]
    description?: string
    length?: number
    cover?: string
    [key: string]: any
}

export interface MarkdownFile {
    slug: string
    filePath: string
    frontMatter: FrontMatter
    content: string
}

export interface RouteComponent {
    componentName: string
    routePath: string
    filePath: string
    frontMatter: FrontMatter
}

export interface RouteManifest {
    routes: Array<{
        slug: string
        path: string
        component: string
        frontMatter: FrontMatter
    }>
    generatedAt: string
}
