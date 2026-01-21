/* eslint-disable @typescript-eslint/no-explicit-any */
import { compile } from '@mdx-js/mdx'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

// 将Markdown编译为React组件
export async function mdxRender(markdownContent: string) {
    return await run(
        await compile(markdownContent, {
            outputFormat: 'function-body',
            format: 'md',
            // development: true, // 开发模式
            // providerImportSource: '@mdx-js/react',
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeHighlight, rehypeKatex],
        }),
        {
            ...runtime,
            baseUrl: import.meta.url,
        }
    )
}

// 将Markdown编译为MDX
export async function mdxRenderStr(
    markdownContent: string,
    fullBody: boolean | undefined
) {
    const mdxCompiled = await compile(markdownContent, {
        outputFormat: fullBody ? 'function-body' : 'program',
        format: 'md',
        // development: true, // 开发模式
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeHighlight, rehypeKatex],
    })

    return mdxCompiled
}
