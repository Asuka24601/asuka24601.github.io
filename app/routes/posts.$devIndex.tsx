/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import type { Route } from './+types/posts.$dev'
import { redirect } from 'react-router'

// 只在开发时使用
export async function clientLoader() {
    if (!import.meta.env.DEV) {
        throw new Error('此路由仅用于开发模式')
    }
    throw redirect(`/posts`)
}

export default function DevSwitchablePage({
    loaderData,
}: Route.ComponentProps) {
    const _ = loaderData
    return null
}
