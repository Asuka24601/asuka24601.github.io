import { isRouteErrorResponse } from 'react-router'
import CRTOverlay from '../components/effect/CRTOverlay'
import TextJitter from '../components/effect/textJitter'

export function PageError({ error }: { error: unknown }) {
    let message = 'Oops!'
    let details = 'An unexpected error occurred.'
    let stack: string | undefined
    let is404 = false

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error'
        details =
            error.status === 404
                ? 'The requested page could not be found.'
                : error.statusText || details
        is404 = error.status === 404
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message
        stack = error.stack
    }

    return (
        <main
            id="page-error"
            className="bg-base-100 flex h-screen w-screen items-center justify-center font-mono text-sm"
        >
            <div className="border-terminal m-4 w-full max-w-2xl">
                <CRTOverlay />
                <TextJitter>
                    <div className="border-neutral/30 bg-base-200 flex flex-col gap-6 border-2 border-double p-6 shadow-[0_0_20px_rgba(0,255,0,0.2)] lg:p-10">
                        {/* Header */}
                        <div className="border-neutral/30 flex items-end justify-between border-b-2 border-dashed pb-2">
                            <div>
                                <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_SYSTEM_ALERT']"></div>
                                <div
                                    className={`text-3xl font-black tracking-widest uppercase ${is404 ? 'text-warning' : 'text-red-500'}`}
                                >
                                    {is404 ? 'SIGNAL_LOST' : 'SYSTEM_FAILURE'}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-base-content text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['ERROR_CODE']"></div>
                                <div
                                    className={`text-xl font-bold ${is404 ? 'text-warning' : 'text-red-500'}`}
                                >
                                    {isRouteErrorResponse(error)
                                        ? error.status
                                        : '500'}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="py-2">
                            <div className="relative mb-6 text-center">
                                <div
                                    className={`text-9xl font-black opacity-10 select-none ${is404 ? 'text-warning' : 'text-red-500'}`}
                                >
                                    {isRouteErrorResponse(error)
                                        ? error.status
                                        : '!'}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-base-200/80 text-base-content px-4 text-lg font-bold tracking-widest uppercase backdrop-blur-sm">
                                        {is404 ? 'TARGET_NOT_FOUND' : message}
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`text-base-content/80 border-l-2 bg-white/5 p-4 text-xs ${is404 ? 'border-warning/50' : 'border-red-500/50'}`}
                            >
                                <p
                                    className={`mb-2 font-bold uppercase ${is404 ? 'text-warning' : 'text-red-400'}`}
                                >
                                    &gt;&gt; DIAGNOSTIC_REPORT:
                                </p>
                                <p className="font-mono">{details}</p>
                            </div>

                            {stack && (
                                <div className="bg-base-200/40 mt-4 overflow-x-auto border border-dashed border-white/20 p-2">
                                    <pre className="text-base-content/60 text-[10px]">
                                        <code>{stack}</code>
                                    </pre>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-neutral/30 text-base-content/40 flex items-center justify-between border-t border-dashed pt-4 text-[10px] uppercase">
                            <span className="animate-pulse">&gt; _</span>
                            <a
                                href="/"
                                className="group hover:text-primary flex items-center gap-2 transition-colors"
                            >
                                <span>[ INITIATE_RETURN_SEQUENCE ]</span>
                            </a>
                        </div>
                    </div>
                </TextJitter>
            </div>
        </main>
    )
}

// The top most error boundary for the app, rendered when your app throws an error
export default function Page404Error({ error }: { error: unknown }) {
    return <PageError error={error} />
}
