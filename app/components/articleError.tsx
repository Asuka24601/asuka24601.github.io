export default function ArticleError({ slug }: { slug: string }) {
    return (
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
    )
}
