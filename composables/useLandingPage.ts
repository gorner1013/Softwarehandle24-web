export const DEFAULT_LANDING_PAGE = '7f39f0bf6a03423bbcebc50b919db7d3' as const

export function useLandingPage(id: string = DEFAULT_LANDING_PAGE) {
  const { search } = useLandingSearch()

  const { data } = useAsyncData(`landing:${id}`, () =>
    search(id, { withCmsAssociations: true }),
  )

  return data
}
