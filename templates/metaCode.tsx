import type { FrontMatter } from '../app/interfaces/post'

function metaCode(frontMatter: FrontMatter): string {
    const tagEntries = (frontMatter.tags || [])
        .map(
            (tag: string) => `  { property: 'article:tag', content: '${tag}' },`
        )
        .join('\n')

    return `export function meta() {
  return [
    { title: '${frontMatter.title || '我的博客（开发模式）'}' },
    {
      name: "description",
      content: '${frontMatter.description || frontMatter.title}',
    },
    { property: 'og:title', content: '${frontMatter.title}' },
  { property: 'og:description', content: '${frontMatter.description || frontMatter.title}' },
  { property: 'article:published_time', content: '${frontMatter.date}' },
${tagEntries}
  ];
}`
}

export default metaCode
