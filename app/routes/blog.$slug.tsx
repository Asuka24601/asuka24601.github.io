/* eslint-disable react-refresh/only-export-components */
// src/routes/blog.$slug.tsx
// import { useParams, useLoaderData } from 'react-router-dom'
import type { Route } from './+types/blog.$slug'
// import PostContent from 'virtual:md-content/hello'

// 只在开发时使用
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!import.meta.env.DEV) {
    throw new Error('此路由仅用于开发模式')
  }
  
    console.log("loading markdown file: ",params.slug);


  // 通过虚拟模块加载 Markdown 内容
  const PostContent = await import(`virtual:md-content/${params.slug}`);
  const module = PostContent;
  console.log(module);
  return module;
}

export default function DevBlogPostPage({ loaderData }: Route.ComponentProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const module = loaderData
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          🚧 开发模式：使用虚拟模块加载 Markdown 内容
        </p>
        <p className="text-sm text-yellow-600 mt-1">
          生产构建时会替换为预编译的 TypeScript 组件
        </p>
      </div>
      
        <PostContent/>
    </div>
  )
}