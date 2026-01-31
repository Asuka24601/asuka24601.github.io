/* eslint-disable react-refresh/only-export-components */
import {
    Outlet,
    Scripts,
    ScrollRestoration,
    Links,
    useNavigate,
} from 'react-router'
import type { Route } from './+types/root'
import { createHeart } from './lib/mouse'
import { useEffect } from 'react'
import 'virtual:svg-icons-register'

import animateStylesHref from 'animate.css/animate.min.css?url'
import katexStylesHref from 'katex/dist/katex.min.css?url'
import katexCustomStyleHref from './styles/katex.css?url'
import appStylesHref from './styles/style.css?url'
import { PageError } from './routes/errorPage'
import CRTScreen from './components/effect/CRTScreen'

export const links = () => [
    { rel: 'stylesheet', href: animateStylesHref },
    { rel: 'stylesheet', href: katexStylesHref },
    { rel: 'stylesheet', href: appStylesHref },
    { rel: 'stylesheet', href: katexCustomStyleHref },
]

export default function App() {
    const navigate = useNavigate()
    useEffect(() => {
        const redirect = sessionStorage.getItem('redirect')
        if (redirect) {
            sessionStorage.removeItem('redirect')
            navigate(redirect)
        }
    }, [navigate])

    useEffect(() => {
        // 注册事件监听器
        const cleanup = createHeart()
        return cleanup
    }, [])

    return (
        <>
            <Outlet />
        </>
    )
}

// The Layout component is a special export for the root route.
// It acts as your document's "app shell" for all route components, HydrateFallback, and ErrorBoundary
// For more information, see https://reactrouter.com/explanation/special-files#layout-export
export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Links />
            </head>
            <body className="relative min-w-xl scroll-smooth bg-black">
                <CRTScreen />
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

// The top most error boundary for the app, rendered when your app throws an error
// For more information, see https://reactrouter.com/start/framework/route-module#errorboundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    return <PageError error={error} />
}

export function HydrateFallback() {
    return (
        <div>
            <span className="loading loading-dots loading-xl absolute top-1/2 left-1/2 translate-1/2"></span>
        </div>
    )
}
