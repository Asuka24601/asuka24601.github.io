/* eslint-disable react-refresh/only-export-components */
import { searchService } from '../lib/search'
import PostCategory from '../components/post/category'
import { useLocation } from 'react-router'
import { useMemo } from 'react'

export default function CategoryPage() {
    const { pathname } = useLocation()
    let category = pathname.substring(7)
    if (category.endsWith('/')) {
        category = category.slice(0, -1)
    }
    category = decodeURI(category)

    const posts = useMemo(
        () => searchService.search('', [], category.split('/')),
        [category]
    )
    return (
        <>
            <PostCategory posts={posts} category={category} />
        </>
    )
}
