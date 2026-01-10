/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MDXContent } from 'mdx/types'
import { mdxRender } from '../lib/mdxRender'
import type { Route } from './+types/___temp___'
import { MDXProvider } from '@mdx-js/react'
import mdxComponents from '../components/mdxComponent'

export async function clientLoader(): Promise<{ Article: MDXContent }> {
    const md = `
# title

hello
`
    const { default: Article } = await mdxRender(md)

    return { Article }
}

export default function Temp({ loaderData }: Route.ComponentProps) {
    const { Article } = loaderData

    return (
        <div>
            {
                <MDXProvider components={mdxComponents}>
                    <Article components={mdxComponents} />
                </MDXProvider>
            }
        </div>
    )
}
