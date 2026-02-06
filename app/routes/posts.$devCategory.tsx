/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { redirect } from 'react-router'
import type { Route } from './+types/posts.$devCategory'
import { searchService } from '../lib/search'
import { mdRegistry } from 'virtual:md-registry'
import PostCategory from '../components/post/category'

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    if (!import.meta.env.DEV) {
        throw new Error('此路由仅用于开发模式')
    }
    const { '*': category } = params
    const modulePath = mdRegistry[category]
    if (modulePath) {
        throw redirect(`/posts/${encodeURI(category)}`)
    }
    const posts = searchService.search('', [], category.split('/'))
    return {
        posts,
        category,
    }
}

export default function DevCategory({ loaderData }: Route.ComponentProps) {
    const { posts, category } = loaderData
    return (
        <>
            <PostCategory posts={posts} category={category} />
        </>
    )
}
