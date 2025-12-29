import React from 'react'

function ErrorPost() {
  return `{
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-red-700 mb-3">
          加载文章失败
        </h2>
        <p className="text-red-600 mb-2">
          无法加载文章: <strong>${slug}</strong>
        </p>
        <p className="text-sm text-gray-600">
          错误信息: ${error instanceof Error ? error.message : String(error)}
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>可能的原因:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Markdown文件不存在</li>
            <li>文件路径错误</li>
            <li>文件权限问题</li>
          </ul>
        </div>
      </div>
    </div>
  )
}`
}

const frontMatter = {
  title: '加载失败',
  date: new Date().toISOString().split('T')[0]
}

const meta = () => [
  { title: '文章加载失败 | 我的博客' }
]