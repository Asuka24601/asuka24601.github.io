/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from '@react-router/dev/routes'

import RouteManifest from './contents/__manifest.json'

const devRoutes = import.meta.env.DEV
    ? [route('/*', 'routes/posts.$dev.tsx')]
    : []

const devRoutesPosts = import.meta.env.DEV
    ? [
          ...prefix('__dev__posts', [
              index('routes/posts.$devIndex.tsx', {
                  id: `devPosts/index`,
              }),
              layout(
                  'layouts/postContent.tsx',
                  {
                      id: `posts/layout`,
                  },
                  [
                      route('/*', 'routes/posts.$devSlug.tsx', {
                          id: `posts/devSlug`,
                      }),
                  ]
              ),
          ]),
          ...prefix('__dev__categories', [
              index('routes/posts.$devIndex.tsx', {
                  id: `devCategories/index`,
              }),
              route('/*', 'routes/posts.$devCategory.tsx', {
                  id: `posts/devCategory`,
              }),
          ]),
      ]
    : []

// 对类似['000','foo','bar'] 结构的路径数组进行依次构建
// 在路径中的每个非叶子节点加上 index("posts.$category.tsx") 作为索引

type ManifestRoute = (typeof RouteManifest.routes)[number]

interface RouteNode {
    children: Record<string, RouteNode>
    leaves: ManifestRoute[]
}

function createRouteTree(routes: ManifestRoute[]): RouteNode {
    const root: RouteNode = { children: {}, leaves: [] }

    for (const item of routes) {
        let currentNode = root
        for (const p of item.prefix) {
            if (!currentNode.children[p]) {
                currentNode.children[p] = { children: {}, leaves: [] }
            }
            currentNode = currentNode.children[p]
        }
        currentNode.leaves.push(item)
    }
    return root
}

function generateRoutes(node: RouteNode, currentPath = 'posts'): any[] {
    const routes: any[] = []

    // 添加当前层级的索引节点 (Index Node)
    routes.push(
        index('routes/posts.$category.tsx', {
            id: `${currentPath}/category`,
        })
    )

    // 处理子目录 (Prefixes)
    for (const [segment, childNode] of Object.entries(node.children)) {
        routes.push(
            ...prefix(
                segment,
                generateRoutes(childNode, `${currentPath}/${segment}`)
            )
        )
    }

    // 处理叶子节点 (Leaves) - 仅叶子节点包裹 layout
    if (node.leaves.length > 0) {
        routes.push(
            layout(
                'layouts/postContent.tsx',
                {
                    id: `${currentPath}/layout`,
                },
                node.leaves.map((leaf) => {
                    // 从 slug 中提取文件名作为路径
                    const pathSegment = leaf.slug.split('/').pop() || leaf.slug
                    return route(pathSegment, leaf.component)
                })
            )
        )
    }

    return routes
}

const blogRoutes: RouteConfig = import.meta.env.PROD
    ? generateRoutes(createRouteTree(RouteManifest.routes))
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
            ...devRoutes,
            ...blogRoutes,
        ]),
        ...devRoutesPosts,
    ]),
    route('*', 'routes/errorPage.tsx'),
] satisfies RouteConfig
