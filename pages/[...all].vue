<script setup lang="ts">
import type { Category, Product, SeoUrl } from '@shopware-pwa/types'
import { getCategoryBreadcrumbs } from '@shopware-pwa/helpers-next'

const { resolvePath } = useNavigationSearch()
const router = useRouter()

const _seoResult = await resolvePath(router.currentRoute.value.path)

const seoResult: Ref<SeoUrl | null> = ref(_seoResult)
watch(
  () => router.currentRoute.value.path,
  async () => {
    const newSeoResult = await resolvePath(router.currentRoute.value.path)
    seoResult.value = newSeoResult
  },
)

const { routeName, foreignKey } = useNavigationContext(seoResult)

const data = ref(null as any)
let breadcrumbs
switch (routeName.value) {
  case 'frontend.navigation.page':
    const { search: categorySearch } = useCategorySearch()
    const categoryResponse = await categorySearch(foreignKey.value, {
      withCmsAssociations: true,
    })
    breadcrumbs = getCategoryBreadcrumbs(categoryResponse, {
      startIndex: 1,
    })
    useBreadcrumbs(breadcrumbs)
    const { category } = useCategory(ref(categoryResponse))

    data.value = category.value
    break
  case 'frontend.detail.page':
    const { search: productSearch } = useProductSearch()
    const productResponse = await productSearch(foreignKey.value, {
      withCmsAssociations: true,
    })
    breadcrumbs = getCategoryBreadcrumbs(productResponse.product.seoCategory, {
      startIndex: 1,
    })
    useBreadcrumbs(breadcrumbs)
    const { product } = useProduct(ref(productResponse.product))
    data.value = product.value
    break
}
</script>

<template>
  <PagesListing
    v-if="!!data && routeName === 'frontend.navigation.page'"
    :category="data as Category"
  />

  <PagesDetail
    v-if="!!data && routeName === 'frontend.detail.page'"
    :product="data as Product"
  />
</template>
