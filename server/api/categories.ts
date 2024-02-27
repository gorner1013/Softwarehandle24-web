import { getCategories } from '@shopware-pwa/api-client'
import apiContext from '../apiBuilder'

export default defineEventHandler(async () => {
  const response = await getCategories(undefined, apiContext)
  return response
})
