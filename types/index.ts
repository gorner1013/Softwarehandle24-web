export * from './app'
export * from './content'
// export * from './i18n'
export * from './markdown'


declare module 'nuxt/schema' {
  interface RuntimeConfig {
    discordWebhook: string
    githubToken: string
    gitlabToken: string
  }
  interface PublicRuntimeConfig {
    siteUrl: string
    siteName: string
    siteDescription: string
    language: string
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
