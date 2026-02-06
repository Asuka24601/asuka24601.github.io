/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { mdRegistry } from 'virtual:md-registry'
import type { Route } from './+types/posts.$dev'
import { redirect } from 'react-router'

// 只在开发时使用
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    if (!import.meta.env.DEV) {
        throw new Error('此路由仅用于开发模式')
    }

    // 通过虚拟模块加载 Markdown 内容
    const { '*': slug } = params
    const modulePath = mdRegistry[slug]

    if (!modulePath) {
        throw redirect(`/__dev__categories/${encodeURI(slug)}`)
    }
    throw redirect(`/__dev__posts/${encodeURI(slug)}`)
}

export default function DevSwitchablePage({
    loaderData,
}: Route.ComponentProps) {
    const _ = loaderData
    return null
}
