/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { removeExtension } from '../lib/utils'
import ProgressiveImage from './progressiveImage'
import Typewriter from './post/typewriter'

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

// 自定义MDX组件 - 复古终端风格
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
            <Typewriter
                as="h1"
                id={id}
                className="border-neutral/30 text-primary mt-8 mb-6 scroll-mt-24 border-b-2 border-dashed pb-2 text-2xl font-black tracking-widest uppercase before:mr-2 before:content-['#']"
                {...props}
            >
                {children}
            </Typewriter>
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
            <Typewriter
                as="h2"
                id={id}
                className="border-secondary/30 text-secondary mt-6 mb-4 scroll-mt-24 border-b border-dashed pb-1 text-xl font-bold tracking-wide uppercase before:mr-2 before:content-['##']"
                {...props}
            >
                {children}
            </Typewriter>
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
            <Typewriter
                as="h3"
                id={id}
                className="text-accent mt-5 mb-3 scroll-mt-24 text-lg font-bold uppercase before:mr-2 before:content-['###']"
                {...props}
            >
                {children}
            </Typewriter>
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
            <Typewriter
                as="h4"
                id={id}
                className="text-base-content/90 mt-4 mb-2 scroll-mt-24 text-base font-bold uppercase before:mr-2 before:content-['####']"
                {...props}
            >
                {children}
            </Typewriter>
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
            <Typewriter
                as="h5"
                id={id}
                className="text-base-content/80 mt-4 mb-2 scroll-mt-24 text-sm font-bold uppercase before:mr-2 before:content-['#####']"
                {...props}
            >
                {children}
            </Typewriter>
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
            <Typewriter
                as="h6"
                id={id}
                className="text-base-content/70 mt-4 mb-2 scroll-mt-24 text-xs font-bold uppercase before:mr-2 before:content-['######']"
                {...props}
            >
                {children}
            </Typewriter>
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
            className="text-base-content/90 my-3 font-mono text-sm leading-relaxed"
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
                'text-accent hover:text-base-content hover:bg-accent/20 transition-colors underline decoration-dashed underline-offset-4 break-all',
            ...props,
        }

        if (isInternal) {
            return <a {...commonProps}>{children}</a>
        }

        return (
            <a {...commonProps} target="_blank" rel="noopener noreferrer">
                {children} <span className="text-[10px] opacity-50">↗</span>
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
                    className="text-warning mx-1 border border-white/10 bg-white/10 px-1.5 py-0.5 font-mono text-xs"
                    {...props}
                >
                    {children}
                </code>
            )
        }

        return (
            <code className={`${className} font-mono text-sm`} {...props}>
                {children}
            </code>
        )
    },

    // 代码块容器
    pre: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLPreElement> & {
        children?: React.ReactNode
    }) => (
        <div className="bg-base-200/40 border-neutral/20 relative my-4 border border-dashed p-4">
            <div className="text-base-content/30 bg-base-300/60 border-neutral/20 absolute top-0 right-0 border-b border-l border-dashed px-2 py-1 text-[10px] uppercase before:content-['CODE\_BLOCK']"></div>
            <pre
                className="scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent text-base-content overflow-x-auto"
                {...props}
            >
                {children}
            </pre>
        </div>
    ),

    span: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLElement> & {
        children?: React.ReactNode
    }) => {
        // 拦截 KaTeX 的块公式
        if (props.className?.includes('katex-display')) {
            return (
                <div className="bg-base-200/40 border-neutral/20 relative my-4 border border-dashed p-4">
                    <div className="text-base-content/30 bg-base-300/60 border-neutral/20 absolute top-0 right-0 border-b border-l border-dashed px-2 py-1 text-[10px] uppercase before:content-['MATH\_BLOCK']"></div>

                    <pre className="scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent text-base-content overflow-x-auto">
                        <span {...props}>{children}</span>
                    </pre>
                </div>
            )
        } else return <span {...props}>{children}</span>
    },

    // 引用
    blockquote: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLQuoteElement> & {
        children?: React.ReactNode
    }) => (
        <blockquote
            className="border-neutral/50 text-base-content/70 my-4 border-l-4 bg-white/5 p-4 text-sm italic"
            {...props}
        >
            <span className="text-primary/50 mr-2 font-bold before:content-['“']"></span>
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
        <ul
            className="marker:text-primary text-base-content/90 my-4 list-disc space-y-1 pl-5 font-mono text-sm"
            {...props}
        >
            {children}
        </ul>
    ),

    ol: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLOListElement> & {
        children?: React.ReactNode
    }) => (
        <ol
            className="marker:text-primary text-base-content/90 my-4 list-decimal space-y-1 pl-5 font-mono text-sm marker:font-bold"
            {...props}
        >
            {children}
        </ol>
    ),

    li: ({
        children,
        ...props
    }: React.HTMLAttributes<HTMLLIElement> & {
        children?: React.ReactNode
    }) => (
        <li className="my-1 pl-1" {...props}>
            {children}
        </li>
    ),

    // 分割线
    hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
        <hr
            className="my-8 border-t-2 border-dashed border-white/20"
            {...props}
        />
    ),

    // 图片
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <figure className="bg-base-200/20 border-neutral/20 mx-auto my-6 max-w-4xl border border-dashed p-2">
            <div className="relative overflow-hidden">
                <ProgressiveImage
                    src={props.src}
                    {...props}
                    useLightBox={true}
                    className="opacity-90 transition-opacity hover:opacity-100"
                />
            </div>
            {props.alt && (
                <figcaption className="text-base-content/70 border-neutral/10 mt-2 border-t border-dashed pt-2 text-center font-mono text-[10px] before:content-['\/\/_']">
                    {removeExtension(props.alt)}
                </figcaption>
            )}
        </figure>
    ),

    // 表格
    table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
        <div className="my-6 w-full overflow-x-auto border border-dashed border-white/20">
            <table className="w-full text-left font-mono text-sm" {...props} />
        </div>
    ),
    thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <thead
            className="text-primary border-b border-dashed border-white/20 bg-white/5 uppercase"
            {...props}
        />
    ),
    tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <tbody className="divide-y divide-dashed divide-white/10" {...props} />
    ),
    tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
        <tr className="transition-colors hover:bg-white/5" {...props} />
    ),
    th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
        <th className="px-4 py-2 font-bold tracking-wider" {...props} />
    ),
    td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
        <td className="text-base-content/80 px-4 py-2" {...props} />
    ),
}

export default mdxComponents
