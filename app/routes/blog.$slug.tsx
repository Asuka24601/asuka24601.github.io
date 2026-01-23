/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// app/routes/blog.$slug.tsx
import type { Route } from './+types/blog.$slug'
import { mdRegistry } from 'virtual:md-registry'
import { ArticleError } from '../components/aritcleContent'
import { useEffect } from 'react' // 保留 import 以防其他地方需要，或者也可以移除

// 只在开发时使用
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    if (!import.meta.env.DEV) {
        throw new Error('此路由仅用于开发模式')
    }

    // 通过虚拟模块加载 Markdown 内容
    const { '*': slug } = params
    const modulePath = await mdRegistry[slug as string]

    if (!modulePath) {
        return {
            MDXContentComp: null,
            frontMatter: {
                title: '加载失败',
                date: new Date().toISOString().split('T')[0],
            },
            meta: [{ title: '文章加载失败 | 我的博客' }],
            slug: slug,
        }
    }

    const VirtualModule = await modulePath()
    const { default: MDXContentComp, frontMatter, meta, handle } = VirtualModule
    return { MDXContentComp, slug, frontMatter, meta, handle }
}

export default function DevBlogPostPage({ loaderData }: Route.ComponentProps) {
    const { MDXContentComp, slug } = loaderData

    return (
        <>
            {MDXContentComp ? (
                <MDXContentComp />
            ) : (
                <ArticleError slug={slug as string} />
            )}
        </>
    )
}

export const meta = ({ loaderData }: Route.MetaArgs) => {
    // 虚拟模块的 meta 通常是一个函数，需要执行它
    if (loaderData?.meta && typeof loaderData.meta === 'function') {
        return loaderData.meta()
    }
    return loaderData?.meta || []
}
