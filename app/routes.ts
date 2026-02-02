import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from '@react-router/dev/routes'

import RouteManifest from './contents/__manifest.json'

const devRoutes = import.meta.env.DEV
    ? [route('/*', 'routes/posts.$slug.tsx')]
    : []

const blogRoutes: ReturnType<typeof route>[] = import.meta.env.PROD
    ? RouteManifest.routes.map((r) => route(r.path, r.component))
    : []

export default [
    layout('layouts/base.tsx', [
        index('routes/home.tsx'),
        route('comments', 'routes/comments.tsx'),
        ...prefix('tags', [
            index('routes/tags.index.tsx'),
            route(':tag', 'routes/tags.$tag.tsx'),
        ]),
        ...prefix('about', [
            layout('layouts/about.tsx', [
                index('routes/about.archive.tsx'),
                route('introduction', 'routes/about.introduction.tsx'),
                route('timeline', 'routes/about.timeline.tsx'),
            ]),
        ]),
        ...prefix('posts', [
            index('routes/posts.index.tsx'),
            layout('layouts/postContent.tsx', [...devRoutes, ...blogRoutes]),
        ]),
    ]),
    route('*', 'routes/errorPage.tsx'),
] satisfies RouteConfig
