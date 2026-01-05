import type { ReactNode } from 'react'
import mdxComponents from '../components/mdxComponent'
import { MDXProvider } from '@mdx-js/react'

export default function AriticleContene({
    children,
    className,
}: {
    children: ReactNode
    className?: string | undefined
}) {
    return (
        <div className={'prose dark:prose-invert max-w-none ' + className}>
            <MDXProvider components={mdxComponents}>{children}</MDXProvider>
        </div>
    )
}
