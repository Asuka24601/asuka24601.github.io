import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from '@react-router/dev/routes'

// import type { RouteManifest } from './contents/__manifest.json'

// 动态导入生成的路由
const generatedRoutes = import.meta.glob('./contents/*.tsx', {
    eager: false,
})

const devRoutes = import.meta.env.DEV
    ? [route('/*', 'routes/blog.$slug.tsx')]
    : []

const blogRoutes: ReturnType<typeof route>[] = import.meta.env.PROD
    ? Object.keys(generatedRoutes).reduce(
          (acc: ReturnType<typeof route>[], filePath) => {
              const slug = filePath.match(/blog\.(.+)\.tsx$/)?.[1]
              console.log(slug)
              if (!slug) return acc
              acc.push(route(slug, filePath))
              return acc
          },
          []
      )
    : []

export default [
    layout('layouts/base.tsx', [
        index('routes/home.tsx'),
        route('about', 'routes/about.tsx'),
        route('___temp___', 'contents/___temp___.tsx'),
        ...prefix('post', [
            index('routes/postIndex.tsx'),
            layout('layouts/postContent.tsx', [...devRoutes, ...blogRoutes]),
        ]),
    ]),
] satisfies RouteConfig
