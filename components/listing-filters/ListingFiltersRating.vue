<script setup lang="ts">
import type {
  AggregationFilterEntity,
  EntitiesAggregation,
  ListingFilter,
  MaxAggregation,
  PriceAggregation,
} from '@shopware-pwa/types'
import { computed, ref } from 'vue'

const props = defineProps<{
  filter: ListingFilter
  selectedFilters: {
    [key: string]:
      | EntitiesAggregation<AggregationFilterEntity>
      | PriceAggregation
      | MaxAggregation
      | number
    rating: number
  }
}>()

const emits = defineEmits<{
  (e: 'selectValue', value: { code: string; value: unknown }): void
}>()

const isHoverActive = ref(false)
const hoveredIndex = ref(0)
const displayedScore = computed(() =>
  isHoverActive.value ? hoveredIndex.value : props.selectedFilters?.rating || 0,
)

function hoverRating(key: number) {
  hoveredIndex.value = key
  isHoverActive.value = true
}
function onChangeRating() {
  const newValue =
    props.selectedFilters?.rating !== hoveredIndex.value
      ? hoveredIndex.value
      : undefined
  emits('selectValue', { code: props.filter?.code, value: newValue })
}

const isFilterVisible = ref<boolean>(false)
function toggle() {
  isFilterVisible.value = !isFilterVisible.value
}
</script>

<template>
  <div class="py-3 px-3">
    <h3 class="-my-3 flow-root">
      <button
        type="button"
        class="flex w-full items-center justify-between bg-white py-2 text-base text-gray-500 hover:text-gray-400 border-none"
        @click="toggle"
      >
        <span class="font-medium text-gray-900 text-left">{{
          filter.label
        }}</span>
        <div class="ml-6 flex items-center">
          <span
            :class="[
              !isFilterVisible
                ? 'i-carbon-chevron-down'
                : 'i-carbon-chevron-up',
            ]"
          >
          </span>
        </div>
      </button>
    </h3>
    <transition name="fade" mode="out-in">
      <div v-show="isFilterVisible">
        <div class="space-y-6 mt-4">
          <div class="flex">
            <div
              v-for="i in 5"
              :key="i"
              class="h-6 w-6 c-yellow-500"
              :class="{
                'i-carbon-star-filled': displayedScore >= i,
                'i-carbon-star': displayedScore < i,
              }"
              @mouseleave="isHoverActive = false"
              @click="onChangeRating()"
              @mouseover="hoverRating(i)"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
  <div class="h-px my-5 w-full bg-gray-400"></div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
