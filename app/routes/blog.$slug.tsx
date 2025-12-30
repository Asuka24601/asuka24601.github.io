/* eslint-disable react-refresh/only-export-components */
// app/routes/blog.$slug.tsx
import type { Route } from './+types/blog.$slug'
import { mdRegistry } from 'virtual:md-registry'
import AriticleHeader from '../components/articleHeader'
import AriticleFooter from '../components/articleFooter'
import AriticleContene from '../components/aritcleContent'
import ArticleError from '../components/articleError'

// 只在开发时使用
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    if (!import.meta.env.DEV) {
        throw new Error('此路由仅用于开发模式')
    }

    // 通过虚拟模块加载 Markdown 内容
    const { '*': slug } = params
    const modulePath = await mdRegistry[slug as string]

    if (!modulePath) {
        return {
            MDXContentComp: null,
            frontMatter: {
                title: '加载失败',
                date: new Date().toISOString().split('T')[0],
            },
            meta: [{ title: '文章加载失败 | 我的博客' }],
            slug: slug,
        }
    }

    const module = await modulePath()
    const { default: MDXContentComp, frontMatter, meta } = module
    return { MDXContentComp, frontMatter, meta, slug }
}

export default function DevBlogPostPage({ loaderData }: Route.ComponentProps) {
    const { MDXContentComp, frontMatter, slug } = loaderData

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-yellow-800">
                    🚧 开发模式：使用虚拟模块加载 Markdown 内容
                </p>
                <p className="mt-1 text-sm text-yellow-600">
                    生产构建时会替换为预编译的 TypeScript 组件
                </p>
            </div>

            {MDXContentComp ? (
                <article className="mx-auto max-w-3xl px-4 py-6">
                    <AriticleHeader {...frontMatter} />

                    <AriticleContene>
                        <MDXContentComp />
                    </AriticleContene>

                    <AriticleFooter />
                </article>
            ) : (
                <ArticleError slug={slug as string} />
            )}
        </div>
    )
}
