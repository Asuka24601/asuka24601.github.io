import metaCode from './metaCode'

const frontMatter = {
    title: '加载失败',
    date: new Date().toISOString().split('T')[0],
}

/**
 * 生成错误页面的React组件代码字符串
 * @param slug - 文章标识符
 * @param error - 错误对象
 * @returns 包含错误信息的React组件代码字符串
 */
function errorPost(slug: string, error: Error): string {
    return `
{
  return React.createElement(
  'div',
  { className: 'max-w-3xl mx-auto px-4 py-8' },
  React.createElement(
    'div',
    { className: 'bg-red-50 border border-red-200 rounded-lg p-6' },
    [
      React.createElement(
        'h2',
        { 
          className: 'text-2xl font-bold text-red-700 mb-3',
          key: 'error-title'
        },
        '加载文章失败'
      ),
      React.createElement(
        'p',
        { 
          className: 'text-red-600 mb-2',
          key: 'error-message'
        },
        ['无法加载文章: ', React.createElement('strong', { key: 'slug' }, '${slug}')]
      ),
      React.createElement(
        'p',
        { 
          className: 'text-sm text-gray-600',
          key: 'error-detail'
        },
        '错误信息: ' + '${error instanceof Error ? error.message : String(error)}'
      ),
      React.createElement(
        'div',
        { 
          className: 'mt-4 text-sm text-gray-500',
          key: 'error-causes'
        },
        [
          React.createElement('p', { key: 'causes-title' }, '可能的原因:'),
          React.createElement(
            'ul',
            { 
              className: 'list-disc pl-5 mt-2',
              key: 'causes-list'
            },
            [
              React.createElement('li', { key: 'cause-1' }, 'Markdown文件不存在'),
              React.createElement('li', { key: 'cause-2' }, '文件路径错误'),
              React.createElement('li', { key: 'cause-3' }, '文件权限问题')
            ]
          )
        ]
      )
    ]
  )
)
}
`
}

/**
 * 生成虚拟错误模块的完整代码，包含元数据和错误组件
 * @param slug - 文章标识符
 * @param error - 错误对象
 * @returns 完整的模块代码字符串（包含React导入、元数据导出和默认导出组件）
 */
export function generateVirtualErrorModuleCode(
    slug: string,
    error: Error
): string {
    const sFrontMatter =
        'export const frontMatter = ' + JSON.stringify(frontMatter, null, 2)
    const sMeta = metaCode(frontMatter)
    const sErrorPost =
        'export default function ErrorPost()' + errorPost(slug, error)

    return `
  import React from 'react'

  ${sMeta}

  ${sFrontMatter}

  ${sErrorPost}
  `
}
