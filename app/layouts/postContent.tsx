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
import CommentsComponent from '../components/comments'

function hasFrontMatter(obj: unknown): obj is { frontMatter: FrontMatter } {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'frontMatter' in obj &&
        !!(obj as Record<string, unknown>).frontMatter
    )
}

const handleAction = () => {
    window.scrollTo({
        top: 0,
        behavior: 'instant',
    })
    // 设置页面的title
    document.title = location.pathname.startsWith('/__dev__')
        ? 'posts/' + location.pathname.slice(1).split('/').slice(1).join('/')
        : location.pathname.slice(1)
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

    useLayoutEffect(() => {
        handleAction()
        return () => {
            document.title = `Asuka24601's Blog`
        }
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
                <div className="border-neutral border-t-4 border-double"></div>

                <div
                    ref={elementRef}
                    className="fixed left-0 z-50 h-1 w-full bg-transparent"
                >
                    <div
                        className="bg-success h-full w-full origin-left transition-transform duration-150 ease-out"
                        style={{
                            transform: `scaleX(var(--total-percent))`,
                        }}
                    />
                </div>

                <div className="relative block h-full min-h-[inherit] w-full overflow-visible">
                    <div className="relative z-2 mx-auto max-w-5xl overflow-visible">
                        <article className="border-terminal bg-base-200 animate__animated animate__fadeIn animate__slow relative will-change-transform">
                            <CRTOverlay />
                            <TextJitter>
                                <AriticleContene
                                    id={'article-' + md5(location.pathname)}
                                >
                                    <Outlet />
                                </AriticleContene>

                                <div className="border-neutral/20 w-full border-b-2 border-dashed"></div>

                                <AriticleFooter
                                    tags={frontMatter?.tags as string[]}
                                    time={frontMatter?.date as string}
                                />
                                <div className="border-neutral/20 w-full border-b-2 border-dashed"></div>
                                <CommentsComponent mapping={'title'} />
                            </TextJitter>
                        </article>

                        <div className="border-terminal bg-base-200! absolute! top-0 right-0 hidden h-full translate-x-[calc(100%-4px)] overflow-visible! border-t-0! border-b-0! 2xl:block">
                            <CRTOverlay />
                            <div className="sticky left-0 z-40 h-fit w-fit p-4">
                                <TOC
                                    queryID={
                                        'article-' + md5(location.pathname)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile TOC Drawer Trigger & Content */}
            <SideNav className="2xl:hidden!">
                <TOC
                    queryID={'article-' + md5(location.pathname)}
                    className="w-full"
                />
            </SideNav>
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
