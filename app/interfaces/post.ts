/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PostInterface {
    title: string,
    author: string,
    creationDate: string,
    lastUpdateDate?: string,
    abstract?:string,
    cover?:string,
    length:number,
    keyWord?: string[]
}

export interface PostListInterface {
    creationDate:string,
    lastUpdateDate?: string,
    posts: PostInterface[]
}

export interface FrontMatter {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  [key: string]: any;
}

export interface MarkdownFile {
  slug: string;
  filePath: string;
  frontMatter: FrontMatter;
  content: string;
}