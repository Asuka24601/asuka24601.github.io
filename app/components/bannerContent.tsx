import { lazy, Suspense } from 'react'
import CRTOverlay from './effect/CRTOverlay'

const HeaderBanner = lazy(() => import('./headBanner'))

export default function BannerContent({
    children,
    ImgUrl,
    blurred = false,
    hiddenImg = false,
    wrapperRef = null,
}: {
    children: React.ReactNode
    ImgUrl?: string
    blurred?: boolean
    wrapperRef: React.RefObject<HTMLDivElement | null> | null
    hiddenImg?: boolean
}) {
    return (
        <>
            <div
                ref={wrapperRef ? wrapperRef : null}
                className="bg-base-100 relative flex h-dvh w-full flex-col"
                style={{
                    order: '1',
                }}
            >
                <CRTOverlay className="z-2!" />
                <div className={`relative h-full w-full overflow-hidden`}>
                    <Suspense
                        fallback={
                            <div className="bg-base-100 h-full w-full animate-pulse" />
                        }
                    >
                        {hiddenImg ? (
                            <div className="h-full w-full bg-transparent"></div>
                        ) : (
                            <div className="bg-base-100 h-full w-full">
                                <HeaderBanner
                                    ImgUrl={ImgUrl}
                                    blurred={blurred}
                                />
                            </div>
                        )}
                    </Suspense>

                    <div className="absolute top-0 left-0 h-full w-full">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}
