import type { FrontMatter } from "../app/interfaces/post";

// React Router v7 meta函数
function meta(frontMatter: FrontMatter): string {
  return `{
  return [
    { title: '${frontMatter.title || "我的博客（开发模式）"}' },
    {
      name: "description",
      content: '${frontMatter.description || frontMatter.title}',
    },
  ];
}`;
}

// 主组件
function postContent(frontMatter: FrontMatter, MDXContent: string): string {
  return `{
return React.createElement(
    'article',
    { className: 'max-w-3xl mx-auto px-4 py-6' },
    React.createElement(
      'header',
      { className: 'mb-6 pb-4 border-b border-gray-200 dark:border-gray-700' },
      [
        React.createElement(
          'h1',
          { 
            key: 'title',
            className: 'text-3xl font-bold text-gray-900 dark:text-white mb-3'
          },
          '${frontMatter.title}'
        ),
        React.createElement(
          'div',
          { 
            key: 'meta',
            className: 'flex items-center text-gray-500 dark:text-gray-400 text-sm'
          },
          [
            React.createElement(
              'time',
              { 
                key: 'date',
                dateTime: '${frontMatter.date}'
              },
              '${new Date(frontMatter.date).toLocaleDateString("zh-CN")}'
            ),
            ${frontMatter.tags && frontMatter.tags.length > 0} && React.createElement(
              'div',
              { key: 'tags', className: 'ml-4 flex flex-wrap gap-2' },
              ${frontMatter.tags?.map((tag:string, index:number) => `React.createElement('span',{ key: ${index}, className: 'px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs'},'#' + '${tag}')`)}
            )
          ]
        ),
        \`${frontMatter.description}\` && React.createElement(
          'p',
          { 
            key: 'description',
            className: 'mt-4 text-gray-600 dark:text-gray-300'
          },
          '${frontMatter.description}'
        )
      ]
    ),
    // 文章内容
    React.createElement(
      'div',
      { className: 'prose dark:prose-invert max-w-none' },
      React.createElement(
        MDXProvider,
        { components: mdxComponents },
        \`${MDXContent}\`
      )
    ),
    React.createElement(
      'footer',
      { 
        className: 'mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500'
      },
      '开发模式 • 最后更新: ' + '${new Date().toLocaleTimeString()}'
    )
  )
  }`;
}

// 模块代码生成
export function generateVirtualModuleCode(
  slug: string,
  frontMatter: FrontMatter,
  mdxCode: string,
): string {
  const sFrontMatter =
    "export const frontMatter = " + JSON.stringify(frontMatter, null, 2);
  const sMeta = "export function meta()" + meta(frontMatter);
  const sPostContent =
    "export default function PostContent()" + postContent(frontMatter, mdxCode);

  return `
// =============================================
// 虚拟模块: ${slug}
// 生成时间: ${new Date().toISOString()}
// =============================================

import { MDXProvider } from "@mdx-js/react";
import React from "react";
import mdxComponents from "/app/components/mdxComponent.tsx";

// Front Matter数据
${sFrontMatter}

// React Router v7 meta函数
${sMeta}

// 主组件
${sPostContent}

`;
}
