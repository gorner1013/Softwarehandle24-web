<script setup lang="ts">
import type { ComputedRef, UnwrapNestedRefs } from 'vue'
import { computed, provide, reactive } from 'vue'
import ListingFilter from './ListingFilter.vue'

const {
  filtersToQuery,
  getCurrentFilters,
  getCurrentSortingOrder,
  getInitialFilters,
  search,
} = useListing({
  listingType: 'productSearchListing',
})

const route = useRoute()
const router = useRouter()
const { t: searchT } = useMessages('search')
// @ToDo: clean up the "any" inside searchSelectedFilters

const searchSelectedFilters: UnwrapNestedRefs<{
  [key: string]: any
}> = reactive<{
  manufacturer: Set<any>
  properties: Set<any>
  'min-price': number | undefined
  'max-price': number | undefined
  rating: number | undefined
}>({
  manufacturer: new Set(),
  properties: new Set(),
  'min-price': undefined,
  'max-price': undefined,
  rating: undefined,
})

const searchCriteriaForRequest: ComputedRef<{
  [code: string]: string | string[] | number | number[] | boolean | undefined
}> = computed(() => ({
  // turn Set to array and then into string with | separator
  manufacturer: [...searchSelectedFilters.manufacturer]?.join('|'),
  // turn Set to array and then into string with | separator
  properties: [...searchSelectedFilters.properties]?.join('|'),
  'min-price': searchSelectedFilters['min-price'],
  'max-price': searchSelectedFilters['max-price'],
  order: getCurrentSortingOrder.value,
  rating: searchSelectedFilters.rating,
}))

for (const param in route.query) {
  if (param in searchSelectedFilters) {
    if (
      searchSelectedFilters[param] &&
      typeof searchSelectedFilters[param] === 'object'
    ) {
      ;(route.query[param] as unknown as string)
        .split('|')
        .forEach((element) => {
          searchSelectedFilters[param].add(element)
        })
    } else {
      searchSelectedFilters[param] = route.query[param]
    }
  }
}

async function onOptionSelectToggle({
  code,
  value,
}: {
  code: string
  value: string
}) {
  if (!['properties', 'manufacturer'].includes(code)) {
    searchSelectedFilters[code] = value
  } else {
    if (searchSelectedFilters[code]?.has(value)) {
      searchSelectedFilters[code]?.delete(value)
    } else {
      searchSelectedFilters[code]?.add(value)
    }
  }

  await search({
    ...route.query,
    ...searchCriteriaForRequest.value,
  })
  await router.push({
    query: {
      query: route.query.query,
      ...filtersToQuery(searchCriteriaForRequest.value),
    },
  })
}

async function invokeCleanFilters() {
  searchSelectedFilters.manufacturer.clear()
  searchSelectedFilters.properties.clear()
  searchSelectedFilters['min-price'] = undefined
  searchSelectedFilters['max-price'] = undefined
  searchSelectedFilters.rating = undefined

  console.log(filtersToQuery(searchCriteriaForRequest.value))

  await search({
    query: route.query.query as string,
    ...filtersToQuery(searchCriteriaForRequest.value),
  })

  await router.push({
    query: {
      query: route.query.query,
      ...filtersToQuery(searchCriteriaForRequest.value),
    },
  })
}

const selectedOptionIds = computed(() => [
  ...searchSelectedFilters.properties,
  ...searchSelectedFilters.manufacturer,
])
const showResetFiltersButton = computed<boolean>(() => {
  if (
    selectedOptionIds.value.length !== 0 ||
    searchSelectedFilters['max-price'] ||
    searchSelectedFilters['min-price'] ||
    searchSelectedFilters.rating ||
    searchSelectedFilters['shipping-free']
  ) {
    return true
  }

  return false
})
provide('selectedOptionIds', selectedOptionIds)
</script>

<template>
  <div class="flex flex-wrap gap-5 w-full">
    <div
      v-if="getInitialFilters.length"
      class="flex justify-between w-full flex-col"
    >
      <div
        v-for="filter in getInitialFilters"
        :key="`${filter?.id || filter?.code}`"
        class="w-full"
      >
        <ListingFilter
          class="relative"
          :selected-filters="getCurrentFilters"
          :filter="filter"
          @select-filter-value="onOptionSelectToggle"
        />
      </div>
      <div v-if="showResetFiltersButton" class="mx-auto mt-4 mb-2">
        <button
          class="w-full justify-center py-2 px-6 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          type="button"
          @click="invokeCleanFilters"
        >
        {{ searchT('resetFilters') }}
          <span
            class="w-6 h-6 i-carbon-close-filled inline-block align-middle ml-2"
          ></span>
        </button>
      </div>
    </div>
  </div>
</template>
