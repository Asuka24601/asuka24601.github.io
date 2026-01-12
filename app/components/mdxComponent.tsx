import React from 'react'
import { removeExtension } from '../lib/utils'

// 自定义MDX组件
const mdxComponents = {
    // 标题组件
    h1: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
        children?: React.ReactNode
    }) => (
        <h1
            className="my-4 text-3xl font-bold text-gray-900 dark:text-white"
            {...props}
        >
            {children}
        </h1>
    ),

    h2: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
        children?: React.ReactNode
    }) => (
        <h2
            className="my-3 text-2xl font-semibold text-gray-800 dark:text-gray-200"
            {...props}
        >
            {children}
        </h2>
    ),

    // 段落
    p: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLParagraphElement> & {
        children?: React.ReactNode
    }) => (
        <p
            className="my-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
            {...props}
        >
            {children}
        </p>
    ),

    // 链接
    a: ({
        href,
        children,
        ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        children?: React.ReactNode
    }) => {
        const isInternal = href?.startsWith('/') || href?.startsWith('#')

        const commonProps = {
            href,
            className:
                'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline',
            ...props,
        }

        if (isInternal) {
            return <a {...commonProps}>{children}</a>
        }

        return (
            <a {...commonProps} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        )
    },

    // 内联代码
    code: ({
        className,
        children,
        ...props
    }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
        const isInline = !className?.includes('language-')

        if (isInline) {
            return (
                <code
                    className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    {...props}
                >
                    {children}
                </code>
            )
        }

        return (
            <pre className="my-3 overflow-auto rounded bg-gray-900 p-3 text-gray-100">
                <code className={className} {...props}>
                    {children}
                </code>
            </pre>
        )
    },

    // 引用
    blockquote: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLQuoteElement> & {
        children?: React.ReactNode
    }) => (
        <blockquote
            className="my-3 border-l-4 border-gray-300 pl-4 text-gray-600 italic dark:border-gray-600 dark:text-gray-400"
            {...props}
        >
            {children}
        </blockquote>
    ),

    // 列表
    ul: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLUListElement> & {
        children?: React.ReactNode
    }) => (
        <ul className="my-3 list-disc space-y-1 pl-5" {...props}>
            {children}
        </ul>
    ),

    ol: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLOListElement> & {
        children?: React.ReactNode
    }) => (
        <ol className="my-3 list-decimal space-y-1 pl-5" {...props}>
            {children}
        </ol>
    ),

    li: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLLIElement> & {
        children?: React.ReactNode
    }) => (
        <li className="my-1" {...props}>
            {children}
        </li>
    ),

    // 图片
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <>
            <img
                className={`m-auto my-3 h-auto max-w-4xl rounded`}
                loading="lazy"
                {...props}
            />
            {props.alt && (
                <span className="block text-center text-xs font-light text-gray-500 opacity-70 select-none dark:text-gray-400">
                    {removeExtension(props.alt)}
                </span>
            )}
        </>
    ),
}

export default mdxComponents
