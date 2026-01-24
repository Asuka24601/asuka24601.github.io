/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    isRouteErrorResponse,
    Outlet,
    useLocation,
    useMatches,
} from 'react-router'
import type { Route } from './+types/postContent'
import AriticleContene, {
    AriticleFooter,
    AriticleHeader,
    ArticleError,
} from '../components/aritcleContent'
import type { FrontMatter } from '../interfaces/post'
import { useEffect, useLayoutEffect } from 'react'
import { useBannerStore } from '../lib/store'
import { create } from 'zustand'
import TOC from '../components/post/toc'

interface UseSlug {
    slug: string
    setSlug: (slug: string) => void
    resetSlug: () => void
}

function hasFrontMatter(obj: unknown): obj is { frontMatter: FrontMatter } {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'frontMatter' in obj &&
        !!(obj as Record<string, unknown>).frontMatter
    )
}

const useSlug = create<UseSlug>()((set) => ({
    slug: '',
    setSlug: (slug: string) => set({ slug }),
    resetSlug: () => set({ slug: '' }),
}))

export default function PostContent() {
    const location = useLocation()
    const matches = useMatches()

    // 获取当前路由链中包含 frontMatter 的 handle
    const match = matches.find(
        (m) => hasFrontMatter(m.handle) || hasFrontMatter(m.loaderData)
    )
    const frontMatter = match
        ? hasFrontMatter(match.handle)
            ? match.handle.frontMatter
            : hasFrontMatter(match.loaderData)
              ? match.loaderData.frontMatter
              : undefined
        : undefined

    const setBlurred = useBannerStore((state) => state.setBlurred)
    const resetBlurred = useBannerStore((state) => state.resetBlurred)
    const setImageUrl = useBannerStore((state) => state.setImageUrl)
    const resetImage = useBannerStore((state) => state.resetImage)
    const resetBannerRelative = useBannerStore(
        (state) => state.resetBannerRelative
    )
    const setBannerRelative = useBannerStore((state) => state.setBannerRelative)

    const handleAction = () => {
        window.scrollTo(0, 0)
        setBannerRelative(true)
        setBlurred(true)
    }

    const handleLoaderAction = () => {
        if (frontMatter) {
            setImageUrl(frontMatter.cover as string)
            useSlug.setState({ slug: frontMatter.slug as string })
        }
    }

    useEffect(() => {
        handleLoaderAction()
    }, [frontMatter])

    useLayoutEffect(() => {
        handleAction()
        return () => {
            resetImage()
            resetBannerRelative()
            resetBlurred()
        }
    }, [])

    return (
        <>
            <div className="fixed top-0 left-0 z-50 h-1 w-full bg-transparent">
                <div
                    className="bg-primary h-full transition-all duration-150 ease-out"
                    style={{ width: `calc(var(--total-percent)*100%)` }}
                />
            </div>
            <div className="mx-auto block h-full min-h-[inherit] max-w-full">
                {import.meta.env.DEV ? (
                    <div className="mx-auto mb-8 max-w-4xl rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <p className="text-yellow-800">
                            🚧 开发模式：使用虚拟模块加载 Markdown 内容
                        </p>
                        <p className="mt-1 text-sm text-yellow-600">
                            生产构建时会替换为预编译的 TypeScript 组件
                        </p>
                    </div>
                ) : null}

                {frontMatter ? (
                    <>
                        <AriticleHeader
                            title={frontMatter?.title as string}
                            author={frontMatter?.author as string}
                            date={frontMatter?.date as string}
                            description={frontMatter?.description as string}
                            className="absolute left-1/2"
                            style={{
                                top: `calc((var(--banner-height) / 2) * -1px)`,
                                translate: '-50% -50%',
                            }}
                        />
                    </>
                ) : null}

                <div className="w-full">
                    <article className="mx-auto max-w-5xl">
                        <div className="bg-base-100/80 relative max-w-5xl rounded-sm p-8 shadow-xl">
                            <AriticleContene id={location.pathname}>
                                <Outlet />
                            </AriticleContene>

                            <div className="divider"></div>

                            <AriticleFooter
                                tags={frontMatter?.tags as string[]}
                            />

                            <div className="absolute top-0 -right-4 h-full translate-x-full">
                                <TOC
                                    queryID={location.pathname}
                                    className="bg-base-100/80 sticky top-32 left-0 z-40 hidden h-fit w-64 rounded-sm p-4 shadow-xl transition-opacity duration-300 xl:block"
                                />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </>
    )
}

// error boundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    const location = useLocation()
    const slug = useSlug.getState().slug
    const setSlug = useSlug.getState().setSlug

    if (slug === '') {
        setSlug(location.pathname.slice(7))
    }
    if (isRouteErrorResponse(error)) {
        return (
            <>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <ArticleError slug={slug} />

                <p>{error.data}</p>
            </>
        )
    } else if (error instanceof Error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        )
    } else {
        return <h1>Unknown Error</h1>
    }
}
