/* eslint-disable react-refresh/only-export-components */
import type { Route } from './+types/posts.$category'
import { searchService } from '../lib/search'
import PostCategory from '../components/post/category'

export function clientLoader({ params }: Route.ClientLoaderArgs) {
    const { category } = params
    const posts = searchService.search('', [], [category])
    return {
        posts,
        category: location.pathname.substring(7),
    }
}

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
    const { posts, category } = loaderData
    return (
        <>
            <PostCategory posts={posts} category={category} />
        </>
    )
}
