import type { ReactNode } from 'react'
import mdxComponents from '../components/mdxComponent'
import { MDXProvider } from '@mdx-js/react'

export default function AriticleContene({ children }: { children: ReactNode }) {
    return (
        <div className="prose dark:prose-invert max-w-none">
            <MDXProvider components={mdxComponents}>{children}</MDXProvider>
        </div>
    )
}
