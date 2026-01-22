/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'virtual:md-content/*' {
    function PostContent(): any
    function meta(): any
    const frontMatter: any

    export { meta, frontMatter, PostContent }
    export default PostContent
}

declare module 'virtual:md-registry' {
    export const mdRegistry: any
}

/// <reference types="vite/client" />

declare module 'virtual:svg-icons-register' {
    const content: any
    export default content
}
