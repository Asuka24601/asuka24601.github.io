/* eslint-disable @typescript-eslint/no-explicit-any */
import FlexSearch from 'flexsearch'
import RouteManifest from '../contents/__manifest.json'

export type Post = (typeof RouteManifest.routes)[0]

export class SearchService {
    private index: any
    private posts: Post[]

    constructor() {
        this.posts = RouteManifest.routes

        // 初始化 FlexSearch Document 索引
        // tokenize: 'full' 模式可以匹配任意子串，适合中英文混合搜索
        this.index = new FlexSearch.Document({
            document: {
                id: 'slug',
                index: ['title', 'description', 'tags', 'prefix'],
                store: false, // 不需要存储内容，直接通过 slug 映射回 posts
            },
            tokenize: 'full',
            context: true,
            cache: true,
            resolution: 9, // 提高评分分辨率，使排序更准确
        })

        this.initializeIndex()
    }

    private initializeIndex() {
        this.posts.forEach((post) => {
            this.index.add({
                slug: post.slug,
                title: post.frontMatter.title,
                description: post.frontMatter.description || '',
                tags: post.frontMatter.tags || [],
                prefix: post.prefix,
            })
        })
    }

    /**
     * 计算搜索结果的得分
     * 评分规则：字段权重 / (排名 + 1)
     */
    private calculateScores(searchResults: any[]): Map<string, number> {
        const scores = new Map<string, number>()
        // 权重配置：标题 > Prefix >标签 > 描述
        const fieldWeights: Record<string, number> = {
            title: 10,
            prefix: 5,
            tags: 5,
            description: 2,
        }

        searchResults.forEach((fieldResult: any) => {
            const weight = fieldWeights[fieldResult.field] || 1
            // fieldResult.result 是按相关度排序的 slug 数组
            fieldResult.result.forEach((slug: string, index: number) => {
                // 排名越靠前(index越小)，得分越高
                const score = (weight * 10) / (index + 1)
                scores.set(slug, (scores.get(slug) || 0) + score)
            })
        })
        return scores
    }

    /**
     * 执行搜索
     * @param query 搜索关键词
     * @param tags 选中的标签列表
     * @param prefix 前缀（类别）列表
     * @returns 过滤后的文章列表
     */
    public search(
        query: string = '',
        tags: string[] = [],
        prefix: string[] = []
    ): (Post & { score?: number })[] {
        let results: (Post & { score?: number })[] = this.posts
        let scoreMap = new Map<string, number>()

        // 1. 关键词搜索 (FlexSearch)
        if (query) {
            // 预处理：去除首尾空格
            const cleanQuery = query.trim()

            // 尝试支持多关键词的"模糊"匹配（非连续匹配）
            // 例如输入 "react hook" 可以匹配 "React Custom Hook"
            // 策略：如果 query 包含空格，则拆分搜索并取交集
            const terms = cleanQuery.split(/\s+/).filter((t) => t.length > 0)

            if (terms.length > 1) {
                // 多词搜索：计算每个词的得分，然后取交集并累加得分
                const termMaps = terms.map((term) => {
                    const searchResults = this.index.search(term, {
                        limit: 100,
                        bool: 'or',
                    })
                    return this.calculateScores(searchResults)
                })

                // 取所有词结果的交集 (slugs)
                const firstMap = termMaps[0]
                const intersectionSlugs = new Set(firstMap.keys())

                for (let i = 1; i < termMaps.length; i++) {
                    const currentKeys = new Set(termMaps[i].keys())
                    for (const slug of intersectionSlugs) {
                        if (!currentKeys.has(slug)) {
                            intersectionSlugs.delete(slug)
                        }
                    }
                }

                // 为交集中的文章累加得分
                intersectionSlugs.forEach((slug) => {
                    let totalScore = 0
                    termMaps.forEach((map) => {
                        totalScore += map.get(slug) || 0
                    })
                    scoreMap.set(slug, totalScore)
                })
            } else {
                // 单词搜索
                const searchResults = this.index.search(cleanQuery, {
                    limit: 100,
                    bool: 'or', // 任意字段匹配即可
                })
                scoreMap = this.calculateScores(searchResults)
            }

            // 过滤并根据得分排序 (降序)
            results = this.posts
                .filter((post) => scoreMap.has(post.slug))
                .map((post) => ({ ...post, score: scoreMap.get(post.slug) }))
                .sort((a, b) => {
                    const scoreA = a.score || 0
                    const scoreB = b.score || 0
                    return scoreB - scoreA
                })
        }

        // 2. 标签过滤 (AND 逻辑)
        if (tags.length > 0) {
            results = results.filter((post) => {
                const postTags = post.frontMatter.tags || []
                return tags.every((tag) => postTags.includes(tag))
            })
        }

        // 3. 前缀过滤 (前缀匹配)
        if (prefix.length > 0) {
            results = results.filter((post) => {
                const target = post.prefix
                if (!Array.isArray(target) || target.length < prefix.length)
                    return false
                return Array.from(
                    { length: target.length - prefix.length + 1 },
                    (_, i) => i
                ).some((start) =>
                    prefix.every((val, idx) => val === target[start + idx])
                )
            })
        }

        return results
    }

    /**
     * 获取所有唯一的标签
     */
    public getAllTags(): string[] {
        const tags = new Set<string>()
        this.posts.forEach((post) => {
            post.frontMatter.tags?.forEach((tag) => tags.add(tag))
        })
        return Array.from(tags).sort()
    }

    /**
     * 获取所有文章
     */
    public getPosts(): Post[] {
        return this.posts
    }
}

// 导出单例供应用使用
export const searchService = new SearchService()
