import type { FrontMatter } from '../app/interfaces/post'
import { mdxRenderStr } from '../app/lib/mdxRender'
import metaCode from './metaCode'

// MDX组件
async function mdxCode(mdxCode: string): Promise<string> {
    const mdxStr = (await mdxRenderStr(mdxCode, false)).value as string
    return `${mdxStr}`
}

// 模块代码生成
export async function generateMDXModuleCode(
    slug: string,
    frontMatter: FrontMatter,
    mdxContent: string,
    filePath: string
): Promise<string> {
    const sMDXCode = await mdxCode(mdxContent)
    const sFrontMatter =
        'export const frontMatter = ' + JSON.stringify(frontMatter, null, 2)
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

// React Router v7 meta函数
${sMeta}

`
}
