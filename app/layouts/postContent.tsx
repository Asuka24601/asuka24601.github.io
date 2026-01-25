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
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useBannerStore } from '../lib/store'
import TOC from '../components/post/toc'
import { md5 } from '../lib/utils'
import SvgIcon from '../components/SvgIcon'

function hasFrontMatter(obj: unknown): obj is { frontMatter: FrontMatter } {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'frontMatter' in obj &&
        !!(obj as Record<string, unknown>).frontMatter
    )
}

export default function PostContent() {
    const location = useLocation()
    const matches = useMatches()
    const dialogRef = useRef<HTMLDialogElement>(null)

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
        window.scrollTo({
            top: 0,
            behavior: 'instant',
        })
        setBannerRelative(true)
        setBlurred(true)
    }

    const handleLoaderAction = () => {
        if (frontMatter) {
            setImageUrl(frontMatter.cover as string)
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
    }, [location.pathname])

    return (
        <>
            {/* Mobile TOC Drawer Trigger & Content */}
            <div className="xl:hidden">
                <button
                    className="bg-base-100/80 btn btn-circle fixed right-4 bottom-24 z-40 shadow-lg backdrop-blur-sm"
                    onClick={() => dialogRef.current?.showModal()}
                    aria-label="Open Table of Contents"
                >
                    <SvgIcon name="toc" size={24} />
                </button>

                <dialog
                    ref={dialogRef}
                    className="bg-base-100 fixed top-0 right-0 z-50 m-0 h-full w-3/4 max-w-xs p-0 shadow-2xl backdrop:bg-black/20 backdrop:backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === dialogRef.current) {
                            dialogRef.current.close()
                        }
                    }}
                >
                    <div className="h-full overflow-y-auto p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-lg font-bold">目录</span>
                            <form method="dialog">
                                <button className="btn btn-ghost btn-circle btn-sm">
                                    ✕
                                </button>
                            </form>
                        </div>
                        <div
                            onClick={(e) => {
                                if ((e.target as HTMLElement).closest('a')) {
                                    dialogRef.current?.close()
                                }
                            }}
                        >
                            <TOC
                                queryID={'path' + md5(location.pathname)}
                                className="w-full"
                            />
                        </div>
                    </div>
                </dialog>
            </div>

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
                            className="absolute left-1/2 w-full"
                            style={{
                                top: `calc((var(--banner-height) / 2) * -1px)`,
                                translate: '-50% -50%',
                            }}
                        />
                    </>
                ) : null}

                <div className="w-full">
                    <article className="mx-auto max-w-5xl min-w-200">
                        <div className="bg-base-100/80 relative max-w-5xl rounded-sm p-8 shadow-xl">
                            <AriticleContene
                                id={'path' + md5(location.pathname)}
                            >
                                <Outlet />
                            </AriticleContene>

                            <div className="divider"></div>

                            <AriticleFooter
                                tags={frontMatter?.tags as string[]}
                            />

                            <div className="absolute top-0 -right-4 h-full translate-x-full">
                                <TOC
                                    queryID={'path' + md5(location.pathname)}
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
    const slug = location.pathname.slice(7)

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
