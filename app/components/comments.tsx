import Giscus from '@giscus/react'
import { Suspense } from 'react'
import { useThemeStore } from '../lib/store'

const LightTheme = 'fro'
const DarkTheme = 'noborder_dark'

const CommentsComponent = ({
    mapping,
    term,
}: {
    mapping: 'pathname' | 'title' | 'url' | 'specific'
    term?: string
}) => {
    const theme = useThemeStore((state) => state.theme)

    if (!mapping) return null
    if (mapping === 'specific' && !term) return null

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Giscus
                id="giscus-frame"
                repo="Asuka24601/asuka24601.github.io"
                repoId="R_kgDORIhstg"
                category="Announcements"
                categoryId="DIC_kwDORIhsts4C2FKC"
                mapping={mapping}
                term={mapping === 'specific' ? term : undefined}
                strict={mapping === 'specific' ? '1' : '0'}
                reactionsEnabled="1"
                emitMetadata="0"
                input-position="bottom"
                lang="zh-CN"
                loading="lazy"
                theme={theme === 'dark' ? DarkTheme : LightTheme}
            />
        </Suspense>
    )
}

export default CommentsComponent
