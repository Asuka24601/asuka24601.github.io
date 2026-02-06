import { Link } from 'react-router'
import { useState } from 'react'
import type { RouteManifestItem } from '../../interfaces/post'
import TextJitter from '../effect/textJitter'
import CRTOverlay from '../effect/CRTOverlay'

// RouteManifestItem {
//     slug: string
//     prefix: string[]
//     path: string
//     component: string
//     frontMatter: FrontMatter
// }

type Post = RouteManifestItem & { score?: number }

type RenderItem =
    | { type: 'dir'; name: string; children: RenderItem[] }
    | { type: 'file'; post: Post }

interface TreeNode {
    children: Map<string, TreeNode>
    files: Post[]
}

function buildRenderTree(posts: Post[]): RenderItem[] {
    const root: TreeNode = {
        children: new Map(),
        files: [],
    }

    for (const post of posts) {
        let current = root
        for (const part of post.prefix) {
            if (!current.children.has(part)) {
                current.children.set(part, {
                    children: new Map(),
                    files: [],
                })
            }
            current = current.children.get(part)!
        }
        current.files.push(post)
    }

    function getItems(node: TreeNode): RenderItem[] {
        const items: RenderItem[] = []

        // Dirs
        const sortedDirs = Array.from(node.children.entries()).sort((a, b) =>
            a[0].localeCompare(b[0])
        )
        for (const [name, childNode] of sortedDirs) {
            items.push({
                type: 'dir',
                name,
                children: getItems(childNode),
            })
        }

        // Files
        const sortedFiles = node.files.sort((a, b) =>
            (a.frontMatter.title || '').localeCompare(b.frontMatter.title || '')
        )
        for (const file of sortedFiles) {
            items.push({ type: 'file', post: file })
        }

        return items
    }

    return getItems(root)
}

function countDirectories(items: RenderItem[]): number {
    let count = 0
    for (const item of items) {
        if (item.type === 'dir') {
            count += 1 + countDirectories(item.children)
        }
    }
    return count
}

const TreeItem = ({
    item,
    prefix,
    isLast,
}: {
    item: RenderItem
    prefix: string
    isLast: boolean
}) => {
    const [isOpen, setIsOpen] = useState(true)
    const connector = isLast ? '└── ' : '├── '
    const childPrefix = prefix + (isLast ? '    ' : '│   ')

    if (item.type === 'file') {
        return (
            <div className="flex flex-col">
                <div className="flex items-center">
                    <span className="text-base-content/50 font-mono whitespace-pre">
                        {prefix}
                        {connector}
                    </span>
                    <Link
                        to={'/posts/' + item.post.path}
                        className="hover:text-primary transition-colors hover:underline"
                    >
                        {item.post.frontMatter.title}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center">
                <span className="text-base-content/50 font-mono whitespace-pre">
                    {prefix}
                    {connector}
                </span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-secondary hover:text-secondary/80 flex cursor-pointer items-center font-bold transition-colors"
                    type="button"
                >
                    {item.name}
                    <span className="ml-2 font-mono text-xs opacity-50">
                        {isOpen ? '[-]' : '[+]'}
                    </span>
                </button>
            </div>
            {isOpen && (
                <TreeRenderer items={item.children} prefix={childPrefix} />
            )}
        </div>
    )
}

const TreeRenderer = ({
    items,
    prefix = '',
}: {
    items: RenderItem[]
    prefix?: string
}) => {
    return (
        <>
            {items.map((item, index) => (
                <TreeItem
                    key={item.type === 'dir' ? item.name : item.post.slug}
                    item={item}
                    prefix={prefix}
                    isLast={index === items.length - 1}
                />
            ))}
        </>
    )
}

export default function PostCategory({
    category,
    posts,
}: {
    posts: Post[]
    category: string
}) {
    const treeItems = buildRenderTree(posts)
    const directoryCount = countDirectories(treeItems)
    const fileCount = posts.length
    const prefix = category.replace(/[/+]$/gm, '').split('/')

    return (
        <>
            <div className="mx-auto min-h-screen w-full">
                <div className="border-terminal mx-auto grid min-h-[inherit] max-w-6xl overflow-visible! border-none! p-4 lg:p-6">
                    <div className="min-h-full w-full pt-(--navbar-height) transition-transform duration-500">
                        <CRTOverlay />
                        <TextJitter className="border-neutral! bg-base-200 relative min-h-full overflow-hidden border-4 border-double">
                            <h1 className="uppercase">
                                ~/posts/
                                {prefix.map((p) => (
                                    <span key={p}>{p}/</span>
                                ))}
                            </h1>

                            {posts.length > 0 ? (
                                <div className="text-lg">
                                    <div className="text-secondary mb-2 font-bold">
                                        .
                                    </div>
                                    <TreeRenderer items={treeItems} />
                                    <div className="text-base-content/50 mt-2 font-mono text-base">
                                        <br />
                                        {directoryCount} director
                                        {directoryCount !== 1
                                            ? 'ies'
                                            : 'y'}, {fileCount} file
                                        {fileCount !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-base-content/30 col-span-full flex flex-col items-center justify-center border border-dashed border-white/5 py-16">
                                    <div className="mb-4 text-6xl font-black opacity-10">
                                        404
                                    </div>
                                </div>
                            )}
                        </TextJitter>
                    </div>
                </div>
            </div>
        </>
    )
}
