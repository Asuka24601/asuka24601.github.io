import { type Config } from '@react-router/dev/config'
import { env } from 'process'
// import manifestjson from './app/contents/__manifest.json'

// function getPrerenderPaths() {
//     const blogPaths = manifestjson.routes.map((r) => `/posts/${r.path}`)
//     return ['/', '/posts', '/about', '/tags', '/comments', ...blogPaths]
// }

export default {
    ssr: false,
    prerender: env.NODE_ENV === 'production' ? true : false,
    // async prerender() {
    //     return getPrerenderPaths()
    // },
} satisfies Config
