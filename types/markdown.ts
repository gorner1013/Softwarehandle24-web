declare interface Attributes {
  title: string
  subtitle: string
}

export interface Markdown {
  attributes?: Attributes
  body: string
}
