/* eslint-disable react-refresh/only-export-components */
// app/routes/blog.$slug.tsx
import type { Route } from "./+types/blog.$slug";
import { mdRegistry } from "virtual:md-registry";

// 只在开发时使用
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!import.meta.env.DEV) {
    throw new Error("此路由仅用于开发模式");
  }

  console.log("loading markdown file:", params.slug);

  // 通过虚拟模块加载 Markdown 内容
  const slug = params.slug;
  const modulePath = await mdRegistry[slug];
  if (!modulePath) {
    return {
      PostContent: () => (
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="mb-3 text-2xl font-bold text-red-700">
              加载文章失败
            </h2>
            <p className="mb-2 text-red-600">
              无法加载文章: <strong>{slug}</strong>
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <p>可能的原因:</p>
              <ul className="mt-2 list-disc pl-5">
                <li>Markdown文件不存在</li>
                <li>文件路径错误</li>
                <li>文件权限问题</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      frontMatter: null,
      meta: null,
    };
  }

  const module = await modulePath();
  const { default: PostContent, frontMatter, meta } = module;
  return { PostContent, frontMatter, meta };
}

export default function DevBlogPostPage({ loaderData }: Route.ComponentProps) {
  const { PostContent } = loaderData;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-yellow-800">
          🚧 开发模式：使用虚拟模块加载 Markdown 内容
        </p>
        <p className="mt-1 text-sm text-yellow-600">
          生产构建时会替换为预编译的 TypeScript 组件
        </p>
      </div>
      <PostContent />
    </div>
  );
}
