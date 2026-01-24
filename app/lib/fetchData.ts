/**
 * 异步获取指定路径的数据，支持JSON和文本格式
 * @param path - 请求的URL路径
 * @param type - 期望的响应类型：'json' 或 'text'
 * @returns 解析后的数据，失败时返回null
 */
export default async function fetchData(path: string, type: 'json' | 'text') {
    try {
        const res = await fetch(path)
        if (!res.ok) return null
        if (type === 'json') return res.json()
        else if (type === 'text') return res.text()
        else return null
    } catch (err) {
        console.error(err)
        return null
    }
}

// TODO
export function fetchPostTotalNumber() {
    return 18
}

// TODO
export function fetchCommentTotalNumber() {
    return 3
}

// TODO
export function fetchTagTotalNumber() {
    return 6
}
