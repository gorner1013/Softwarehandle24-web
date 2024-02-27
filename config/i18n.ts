export const locales = [
  {
    code: 'de',
    iso: 'de-DE',
    isCatchallLocale: true,
  },
  {
    code: 'en',
    iso: 'en-US',
  },
] as const

export const localeCodes = locales.map((locale) => locale.code)

export function localeToISO(code: string) {
  const locale = locales.find((locale) => locale.code === code)
  return locale ? locale.iso : undefined
}
