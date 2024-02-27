export interface Toc {
  depth: number
  links: TocItem[]
  searchDepth: number
  title: string
}

export interface TocItem {
  children: TocItem[]
  depth: number
  id: string
  text: string
}

export interface FrontMatterItem {
  [key: string]: string
}

export interface ApiContent {
  status: number
  data: ApiContentItem[]
}

export interface ApiContentItem {
  frontmatter?: FrontMatterItem
  content?: string
}

export interface Document {
  _dir: string
  _draft: boolean
  _empty: boolean
  _extension: string
  _file: string
  _id: string
  _locale: string
  _partial: boolean
  _path: string
  _source: string
  _type: string
  body: any
  _slug: string
  _link: string
  title?: string
  [key: string]: any
}

export interface Guide {
  title?: string
  subtitle?: string
  excerpt?: any
  description?: string
  author: string
  picture?: string
  icon?: string
  draft?: boolean
  category?: string
  tags?: string[]
  readingTime?: {
    minutes?: number
  }
  date?: Date

  _id: string
  _path: string
  _locale: string
  _draft: boolean
  slug: string
  body: {
    children: any[]
    toc?: Toc
  }
}

export interface HeadContent {
  // _dir: string
  // _draft: boolean
  // _empty: boolean
  // _extension: string
  // _file: string
  // _id: string
  _link: string
  // _locale: string
  // _original: boolean
  // _partial: boolean
  // _path: string
  _slug: string
  _slugFallbackLocale: string
  _slugLocale: string
  subtitle?: string
  category?: string
  tags?: string[]
  tagsList?: string
  //
  publishedAt?: Date
  createdAt: Date
  updatedAt?: Date
  //
  legend?: string
  origin?: string
  // _source: string
  // _type: string
  // createdAt: string
  // description: string
  // title: string
  // body: {
  //   children: any[]
  //   toc: {
  //     depth: number
  //     links: TocItem[]
  //     searchDepth: number
  //     title: string
  //   }
  // }
}
