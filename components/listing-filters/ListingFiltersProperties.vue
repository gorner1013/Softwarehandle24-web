<script setup lang="ts">
import type { ListingFilter } from '@shopware-pwa/types'
import { inject, ref } from 'vue'
import { getTranslatedProperty } from '@shopware-pwa/helpers-next'

defineProps<{
  filter: ListingFilter
}>()

const emits = defineEmits<{
  (e: 'select-value', value: { code: string; value: unknown }): void
}>()
const selectedOptionIds = inject<string[]>('selectedOptionIds')
const isFilterVisible = ref<boolean>(false)
function toggle() {
  isFilterVisible.value = !isFilterVisible.value
}
</script>

<template>
  <div class="border-none py-3 px-3">
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
      <div v-show="isFilterVisible" id="filter-section-0" class="pt-3">
        <div class="space-y-4">
          <div
            v-for="option in filter.options || filter.entities"
            :key="`${option.id}-${selectedOptionIds?.includes(option.id)}`"
            class="flex items-center p-2"
            @click="
              emits('select-value', { code: filter.code, value: option.id })
            "
          >
            <div
              class="text-gray-800 text-3.5 font-bold flex items-center gap-2"
            >
              <div
                class="!w-4 !h-4 rounded-1 border border-solid border-gray-700 bg-white cursor-pointer"
              >
                <img
                  v-if="selectedOptionIds?.includes(option.id)"
                  src="/svgs/checked.svg"
                  class="checked-icon"
                />
              </div>
            </div>

            <div v-if="option.media?.url">
              <img
                class="ml-2 h-4 w-4"
                loading="lazy"
                :src="option.media.url"
                :alt="option.media.translated?.alt || ''"
                :class="{
                  'border-primary border-2': selectedOptionIds?.includes(
                    option.id,
                  ),
                }"
              />
            </div>
            <div
              v-else-if="option.colorHexCode"
              class="ml-2 h-4 w-4"
              :style="`background-color: ${option.colorHexCode}`"
              :class="{
                'border-primary border-2': selectedOptionIds?.includes(
                  option.id,
                ),
              }"
            />
            <label
              for="filter-color-0"
              class="ml-3 text-gray-600 cursor-pointer"
            >
              {{ getTranslatedProperty(option, 'name') }}
            </label>
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
