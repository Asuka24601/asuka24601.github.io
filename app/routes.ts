import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from '@react-router/dev/routes'

const devRoutes = import.meta.env.DEV
    ? [route('/*', 'routes/blog.$slug.tsx')]
    : []

const blogRoutes: ReturnType<typeof route>[] = import.meta.env.PROD
    ? [route('/*', 'routes/404.tsx')]
    : []

export default [
    layout('layouts/base.tsx', [
        index('routes/home.tsx'),
        route('comments', 'routes/comments.tsx'),
        route('tags', 'routes/tags.tsx'),
        route('about', 'routes/about.tsx'),
        route('___temp___', 'contents/___temp___.tsx'),
        ...prefix('posts', [
            index('routes/postIndex.tsx'),
            layout('layouts/postContent.tsx', [...devRoutes, ...blogRoutes]),
        ]),
    ]),
] satisfies RouteConfig
