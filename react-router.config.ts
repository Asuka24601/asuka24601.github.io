import { type Config } from '@react-router/dev/config'
import { env } from 'process'
import manifestjson from './app/contents/__manifest.json'

function getPrerenderPaths() {
    const blogPaths: string[] = []
    const blogIndexSet = new Set<string>()

    for (const r of manifestjson.routes) {
        blogPaths.push(`/posts/${r.path}`)
        let base = '/posts'
        for (const p of r.prefix) {
            base += `/${p}`
            blogIndexSet.add(base)
        }
    }
    const blogIndex = Array.from(blogIndexSet)
    return [
        '/',
        '/posts',
        '/about',
        '/about/introduction',
        '/about/timeline',
        '/tags',
        '/comments',
        ...blogPaths,
        ...blogIndex,
    ]
}

const route =
    env.NODE_ENV === 'production'
        ? {
              ssr: false,
              async prerender() {
                  return getPrerenderPaths()
              },
          }
        : {
              ssr: false,
              prerender: false,
          }

export default { ...route } satisfies Config
