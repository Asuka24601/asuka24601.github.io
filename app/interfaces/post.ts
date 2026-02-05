/* eslint-disable @typescript-eslint/no-explicit-any */
export type MetaType = [
    { title: string },
    {
        name: string
        content: string
    },
    { property: string; content: string },
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
    routePath: string
    frontMatter: FrontMatter
    content: string
    exportName: string
    componentFilPath: string
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

export interface ParentContextType {
    handleRenderedAction: (data: boolean) => void
    handleMetaAction: (data: MetaType) => void
    handleFrontMatterAction: (data: FrontMatter) => void
}
