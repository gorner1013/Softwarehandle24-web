import { getStoreNavigation } from '@shopware-pwa/api-client'
import apiContext from '../apiBuilder'

export default defineEventHandler(async () => {
  const response = await getStoreNavigation(
    {
      requestActiveId: 'main-navigation',
      requestRootId: 'main-navigation',
      depth: 2,
      buildTree: true,
      searchCriteria: undefined,
    },
    apiContext,
  )
  return response
})
