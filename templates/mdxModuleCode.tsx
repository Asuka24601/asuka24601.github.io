import type { FrontMatter } from '../app/interfaces/post'
import { mdxRenderStr } from '../app/lib/mdxRender'
import metaCode from './metaCode'

/**
 * 将MDX代码字符串转换为包含React Router上下文处理的MDX组件代码
 * @param mdxCode - 原始的MDX代码字符串
 * @returns 处理后的MDX组件代码字符串，添加了React Router的上下文调用和副作用钩子
 */
async function mdxCode(mdxCode: string): Promise<string> {
    const mdxStr = (await mdxRenderStr(mdxCode, false)).value as string

    return mdxStr
}

/**
 * 生成完整的MDX模块代码，包括MDX组件、Front Matter数据和React Router v7的meta函数
 * @param slug - 文章的唯一标识符
 * @param frontMatter - 文章的Front Matter数据
 * @param mdxContent - 文章的MDX内容
 * @param filePath - 源文件的路径
 * @returns 完整的模块代码字符串，包含导入、MDX组件、Front Matter导出和meta函数
 */
export async function generateMDXModuleCode(
    slug: string,
    frontMatter: FrontMatter,
    mdxContent: string,
    filePath: string
): Promise<string> {
    const sMDXCode = await mdxCode(mdxContent)
    const sFrontMatter =
        'export const frontMatter = ' + JSON.stringify(frontMatter, null, 2)
    const sHandle = 'export const handle = { frontMatter }'
    const sMeta = metaCode(frontMatter)

    return `
// =============================================
// 源文件: ${filePath}
// 模块: ${slug}
// 生成时间: ${new Date().toISOString()}
// =============================================

// MDX组件
${sMDXCode}

// Front Matter数据
${sFrontMatter}

// React Router Handle
${sHandle}

// React Router v7 meta函数
${sMeta}

`
}
