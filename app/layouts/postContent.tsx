/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { isRouteErrorResponse, Outlet } from 'react-router'
import type { Route } from './+types/postContent'
import AriticleContene, {
    AriticleFooter,
    AriticleHeader,
    ArticleError,
} from '../components/aritcleContent'
import type {
    FrontMatter,
    MetaType,
    ParentContextType,
} from '../interfaces/post'
import { useState, useEffect } from 'react'
import { useImageStore } from '../lib/store'

export default function PostContent() {
    const [frontMatter, setFrontMatter] = useState<FrontMatter>()
    const [meta, setMeta] = useState<MetaType>()
    const [rendered, setRendered] = useState<boolean>(false)
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
    const [isLightboxVisible, setIsLightboxVisible] = useState(false)

    const handleFrontMatterAction = (data: FrontMatter) => {
        setFrontMatter(data)
    }

    const handleMetaAction = (data: MetaType) => {
        setMeta(data)
    }

    const handleRenderedAction = (data: boolean) => {
        setRendered(data)
    }

    // 构造符合接口的对象
    const contextValue: ParentContextType = {
        handleRenderedAction,
        handleMetaAction,
        handleFrontMatterAction,
    }

    const setImageUrl = useImageStore((state) => state.setImageUrl)
    const resetImage = useImageStore((state) => state.resetImage)
    const handleImgAction = () => {
        if (rendered) setImageUrl(frontMatter?.cover as string)
        else resetImage()
    }

    useEffect(() => {
        handleImgAction()
    }, [rendered])

    useEffect(() => {
        if (lightboxSrc) {
            // 确保 DOM 挂载后下一帧才添加 opacity-100，触发 transition
            requestAnimationFrame(() => setIsLightboxVisible(true))
        }
    }, [lightboxSrc])

    const closeLightbox = () => {
        setIsLightboxVisible(false)
        // 等待 300ms 动画结束后再卸载组件
        setTimeout(() => setLightboxSrc(null), 300)
    }

    return (
        <>
            {lightboxSrc && (
                <div
                    className={`fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-300 ${
                        isLightboxVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={closeLightbox}
                >
                    <img
                        src={lightboxSrc}
                        alt="Lightbox Preview"
                        className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
                    />
                </div>
            )}
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

                <article
                    className="bg-base-100-custom mx-auto h-full max-w-5xl rounded-sm p-8 shadow-xl"
                    onClick={(e) => {
                        const target = e.target as HTMLElement
                        if (target.tagName === 'IMG') {
                            e.preventDefault() // 防止链接跳转（如果图片被包裹在链接中）
                            const img = target as HTMLImageElement
                            setLightboxSrc(img.src)
                        }
                    }}
                >
                    {rendered ? (
                        <AriticleHeader
                            frontMatter={frontMatter as FrontMatter}
                        />
                    ) : null}

                    <AriticleContene>
                        <Outlet context={contextValue} />
                    </AriticleContene>

                    <AriticleFooter />
                </article>
            </div>
        </>
    )
}

// error boundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    if (isRouteErrorResponse(error)) {
        return (
            <>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <ArticleError slug={error.data} />

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
