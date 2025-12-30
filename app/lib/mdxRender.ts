/* eslint-disable @typescript-eslint/no-explicit-any */
import { compile } from '@mdx-js/mdx'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

// 将Markdown编译为React组件
export async function mdxRender(markdownContent: string) {
    return run((await mdxRenderStr(markdownContent, true)).value, runtime)
}

// 将Markdown编译为MDX
export async function mdxRenderStr(
    markdownContent: string,
    fullBody: boolean | undefined
) {
    const mdxCompiled = await compile(markdownContent, {
        outputFormat: fullBody ? 'function-body' : null,
        // development: true, // 开发模式
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
    })

    return mdxCompiled
}
