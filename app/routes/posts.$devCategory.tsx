/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { redirect } from 'react-router'
import type { Route } from './+types/posts.$devCategory'
import { searchService } from '../lib/search'
import { mdRegistry } from 'virtual:md-registry'
import PostCategory from '../components/post/category'
import { useMemo } from 'react'

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    if (!import.meta.env.DEV) {
        throw new Error('此路由仅用于开发模式')
    }
    const { '*': category } = params
    const modulePath = mdRegistry[category]
    if (modulePath) {
        throw redirect(`/posts/${encodeURI(category)}`)
    }
    return {
        category,
    }
}

export default function DevCategory({ loaderData }: Route.ComponentProps) {
    const { category } = loaderData
    let _category = category
    if (_category.endsWith('/')) {
        _category = _category.slice(0, -1)
    }
    _category = decodeURI(category)
    const posts = useMemo(
        () => searchService.search('', [], _category.split('/')),
        [_category]
    )
    return (
        <>
            <PostCategory posts={posts} category={category} />
        </>
    )
}
