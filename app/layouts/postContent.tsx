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
import { useLayoutEffect, useRef } from 'react'
import TOC from '../components/post/toc'
import { md5 } from '../lib/utils'
import SideNav from '../components/sideNav'
import BannerContent from '../components/bannerContent'
import TextJitter from '../components/effect/textJitter'
import CRTOverlay from '../components/effect/CRTOverlay'
import { PageError } from '../routes/errorPage'

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
    const wrapperRef = useRef<HTMLDivElement>(null)
    const elementRef = useRef<HTMLDivElement>(null)

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

    const handleAction = () => {
        window.scrollTo({
            top: 0,
            behavior: 'instant',
        })
    }

    useLayoutEffect(() => {
        handleAction()
        return () => {}
    }, [location.pathname])

    return (
        <>
            <div ref={wrapperRef} className="contents">
                <BannerContent
                    ImgUrl={frontMatter?.cover as string}
                    blurred={true}
                    wrapperRef={wrapperRef}
                >
                    <AriticleHeader
                        title={frontMatter?.title as string}
                        author={frontMatter?.author as string}
                        date={frontMatter?.date as string}
                        description={frontMatter?.description as string}
                        className="relative top-1/2 -translate-y-1/2"
                    />
                </BannerContent>
                <div className="border-primary border-t-4 border-double"></div>

                <div
                    ref={elementRef}
                    className="fixed left-0 z-50 h-1 w-full bg-transparent"
                    style={{
                        top: `var(--navbar-height)`,
                    }}
                >
                    <div
                        className="bg-success h-full w-full origin-left transition-transform duration-150 ease-out"
                        style={{
                            transform: `scaleX(var(--total-percent))`,
                        }}
                    />
                </div>

                {/* Mobile TOC Drawer Trigger & Content */}
                <SideNav className="2xl:hidden!">
                    <TOC
                        queryID={'article-' + md5(location.pathname)}
                        className="w-full"
                    />
                </SideNav>

                <div
                    className="relative will-change-transform"
                    style={{
                        transform:
                            'translateY(calc(var(--scroll-percent) * -25vw))',
                    }}
                >
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

                        <div className="w-full">
                            <article
                                className="border-terminal mx-auto max-w-6xl"
                                style={{
                                    overflow: 'visible',
                                }}
                            >
                                <CRTOverlay />
                                <TextJitter>
                                    <AriticleContene
                                        id={'article-' + md5(location.pathname)}
                                    >
                                        <Outlet />
                                    </AriticleContene>

                                    <div className="divider"></div>

                                    <AriticleFooter
                                        tags={frontMatter?.tags as string[]}
                                    />
                                </TextJitter>

                                <div
                                    className="absolute top-0 right-0 hidden h-full translate-x-full pl-3 2xl:block"
                                    style={{
                                        transform:
                                            'translateY(calc(var(--scroll-percent) * 25vw))',
                                    }}
                                >
                                    <div className="sticky top-32 left-0 z-40 h-fit w-fit">
                                        <TOC
                                            queryID={
                                                'article-' +
                                                md5(location.pathname)
                                            }
                                        />
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
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
        return <ArticleError slug={slug} />
    } else if (error instanceof Error) {
        return <PageError error={error} />
    } else {
        return <h1>Unknown Error</h1>
    }
}
