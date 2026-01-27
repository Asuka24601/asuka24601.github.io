/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { removeExtension } from '../lib/utils'
import ProgressiveImage from './progressiveImage'

// 提取文本内容的辅助函数
const extractText = (children: React.ReactNode): string => {
    if (typeof children === 'string') return children
    if (typeof children === 'number') return String(children)
    if (Array.isArray(children)) return children.map(extractText).join('')
    if (
        React.isValidElement(children) &&
        (children as React.ReactElement<any>).props.children
    ) {
        return extractText((children as React.ReactElement<any>).props.children)
    }
    return ''
}

// 生成ID的辅助函数
const generateId = (children: React.ReactNode) => {
    const text = extractText(children)
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
}

// 自定义MDX组件
const mdxComponents = {
    // 标题组件
    h1: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
        children?: React.ReactNode
    }) => {
        const id = props.id || generateId(children)
        return (
            <h1
                id={id}
                className="my-4 scroll-mt-24 text-3xl font-bold text-gray-900 dark:text-white"
                {...props}
            >
                {children}
            </h1>
        )
    },

    h2: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
        children?: React.ReactNode
    }) => {
        const id = props.id || generateId(children)
        return (
            <h2
                id={id}
                className="my-3 scroll-mt-24 text-2xl font-semibold text-gray-800 dark:text-gray-200"
                {...props}
            >
                {children}
            </h2>
        )
    },

    h3: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
        children?: React.ReactNode
    }) => {
        const id = props.id || generateId(children)
        return (
            <h3
                id={id}
                className="my-3 scroll-mt-24 text-xl font-semibold text-gray-800 dark:text-gray-200"
                {...props}
            >
                {children}
            </h3>
        )
    },

    h4: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
        children?: React.ReactNode
    }) => {
        const id = props.id || generateId(children)
        return (
            <h4
                id={id}
                className="my-2 scroll-mt-24 text-lg font-semibold text-gray-800 dark:text-gray-200"
                {...props}
            >
                {children}
            </h4>
        )
    },

    h5: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
        children?: React.ReactNode
    }) => {
        const id = props.id || generateId(children)
        return (
            <h5
                id={id}
                className="my-2 scroll-mt-24 text-base font-semibold text-gray-800 dark:text-gray-200"
                {...props}
            >
                {children}
            </h5>
        )
    },

    h6: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
        children?: React.ReactNode
    }) => {
        const id = props.id || generateId(children)
        return (
            <h6
                id={id}
                className="my-2 scroll-mt-24 text-sm font-semibold text-gray-800 dark:text-gray-200"
                {...props}
            >
                {children}
            </h6>
        )
    },

    // 段落
    p: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLParagraphElement> & {
        children?: React.ReactNode
    }) => (
        <section
            className="my-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
            {...props}
        >
            {children}
        </section>
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

    // 分割线
    hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
        <hr className="my-6 border-gray-200 dark:border-gray-700" {...props} />
    ),

    // 图片
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <>
            <figure className="mx-auto my-3 aspect-auto h-auto min-h-24 max-w-4xl min-w-24">
                <ProgressiveImage
                    src={props.src}
                    {...props}
                    useLightBox={true}
                    className="rounded"
                />
                {props.alt && (
                    <figcaption className="mt-1 text-center text-xs font-light text-gray-500 opacity-70 select-none dark:text-gray-400">
                        {removeExtension(props.alt)}
                    </figcaption>
                )}
            </figure>
        </>
    ),
}

export default mdxComponents
