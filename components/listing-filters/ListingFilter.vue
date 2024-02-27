<script setup lang="ts">
import type { ListingFilter } from '@shopware-pwa/types'
import ListingFiltersPrice from './ListingFiltersPrice.vue'
import ListingFiltersProperties from './ListingFiltersProperties.vue'
import ListingFiltersRating from './ListingFiltersRating.vue'

const props = defineProps<{
  filter: ListingFilter
  selectedFilters: {
    [key: string]: object
  }
}>()

const emit = defineEmits<{
  (
    e: 'selectFilterValue',
    { code, value }: { code: string, value: string },
  ): void
}>()

function cmsMap() {
  const map: {
    [key: string]: object
  } = {
    manufacturer: ListingFiltersProperties,
    properties: ListingFiltersProperties,
    price: ListingFiltersPrice,
    rating: ListingFiltersRating,
  }

  return map[props.filter?.code]
}
</script>

<template>
  <div>
    <component
      :is="cmsMap()"
      :filter="filter"
      :selected-filters="selectedFilters"
      @select-value="emit('selectFilterValue', $event)"
    />
  </div>
</template>
