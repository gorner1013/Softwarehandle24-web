<script setup lang="ts">
import type {
  CmsElementProductBox as ProductBox,
  CmsBlockImageFourColumn as ThreeImageColumn,
} from '@shopware-pwa/composables-next'

const { block } = defineProps<{ block: ThreeImageColumn }>()

const { getSlotContent } = useCmsBlock(block)

// Cast the contents to the correct type when calling getSlotContent
const left = getSlotContent('left') as ProductBox | null
const centerleft = getSlotContent('center') as ProductBox | null
const centerright = getSlotContent('center') as ProductBox | null
const right = getSlotContent('right') as ProductBox | null
const slidesPerView = ref(4);

// Function to handle window resize events
const handleResize = () => {
  let baseValue = window.innerWidth / 350;
  slidesPerView.value = Math.max(1, Math.min(baseValue, 4));
}

// Set up event listener on mount and clean up on unmount
onMounted(() => {
  handleResize(); // Call initially to set the correct value
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Expose slidesPerView as a computed property so it can be used in the template
const computedSlidesPerView = computed(() => slidesPerView.value);
</script>

<template>
  <Swiper :slides-per-view="computedSlidesPerView" :loop="true" :space-between="20">
    <SwiperSlide key="0">
      <div v-if="left" class="min-w-65 border-solid border-2 border-orange-600 rounded-3">
        <div
          class="bg-gradient-to-tl from-orange-50  to-orange-50 rounded-3 flex flex-col items-center p-6 md:p-8 gap-5 bg-opacity-70">
          <CmsElementProductBox :content="left" />
        </div>
      </div>
    </SwiperSlide>
    <SwiperSlide key="1">
      <div v-if="centerright" class="min-w-65 border-solid border-2 border-sky-600 rounded-3">
        <div
          class="bg-gradient-to-tl from-sky-50  to-sky-50 rounded-3 flex flex-col items-center p-6 md:p-8 gap-5 bg-opacity-70">
          <CmsElementProductBox :content="centerright" />
        </div>
      </div>
    </SwiperSlide>
    <SwiperSlide key="2">
      <div v-if="centerleft" class="min-w-65 border-solid border-2 border-purple-600 rounded-3">
        <div
          class="bg-gradient-to-tl from-purple-50  to-purple-50 rounded-3 flex flex-col items-center p-6 md:p-8 gap-5 bg-opacity-70">
          <CmsElementProductBox :content="centerleft" />
        </div>
      </div>
    </SwiperSlide>
    <SwiperSlide key="3">
      <div v-if="right" class="min-w-65 border-solid border-2 border-teal-600 rounded-3">
        <div
          class="bg-gradient-to-tl from-teal-50  to-teal-50 rounded-3 flex flex-col items-center p-6 md:p-8 gap-5 bg-opacity-70">
          <CmsElementProductBox :content="right" />
        </div>
      </div>
    </SwiperSlide>
    <div class="md:hidden">
      <ProductSwiperControls />
    </div>
  </Swiper>
</template>
<style scoped></style>
