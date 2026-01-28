import { type Config } from '@react-router/dev/config'
import { env } from 'process'
import manifestjson from './app/contents/__manifest.json'

function getPrerenderPaths() {
    const blogPaths = manifestjson.routes.map((r) => `/posts/${r.path}`)
    return [
        '/',
        '/posts',
        '/about',
        '/about/introduction',
        '/about/timeline',
        '/tags',
        '/comments',
        ...blogPaths,
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
