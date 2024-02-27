<script setup lang="ts">
import type { Product } from '@shopware-pwa/types'
import { getProductUrl } from '@shopware-pwa/helpers-next'

const { product } = defineProps<{ product: Product }>()
const isLoading = ref(false)
const router = useRouter()
const { t: global } = useMessages('global')
async function getCategory(child: any) {
  isLoading.value = true
  await router.push(getProductUrl(child))
  // window.location.reload();
  await new Promise((resolve) => setTimeout(resolve, 1000))
  isLoading.value = false
}
</script>

<template>
  <div class="w-30 h-41 cursor-pointer duration-500 hover:opacity-80 flex items-center justify-center"
    @click="getCategory(product)">
    <img :src="product.cover.media.url" alt="product-image" class="w-full " />
  </div>
  <div class="mt-1 flex items-center justify-center">
    <div v-for="i in 5" :key="i">
      <i v-if="product.ratingAverage / 2 >= i" class="fa-solid fa-star fa-md text-primary"></i>
    </div>
    <div>
      <i v-if="product.ratingAverage % 2" class="fa-solid fa-star-half-stroke fa-lg text-primary"></i>
    </div>
    <div v-if="!product.ratingAverage % 2" class="flex">
      <div v-for="i in 5" :key="i">
        <i v-if="product.ratingAverage / 2 < i" class="fa-regular fa-star fa-md text-primary"></i>
      </div>
    </div>

    <div v-if="product.ratingAverage % 2" class="flex">
      <div v-for="i in 5" :key="i">
        <i v-if="product.ratingAverage / 2 < i - 1" class="fa-regular fa-star fa-md text-primary"></i>
      </div>
    </div>
  </div>
  <div>
    <h3 class="text-black text-left text-4 font-medium cursor-pointer hover:underline" @click="getCategory(product)">
      {{ product.name }}
    </h3>
    <div class="flex text-left gap-2 mt-3">
      <p class="text-black text-3.5 font-medium text-left cursor-pointer hover:underline" @click="getCategory(product)">
        EUR {{ product.calculatedPrice.unitPrice }}
      </p>
      <p class="text-3.5 font-medium text-gray-700">
        - {{ global('incl') }} {{ product.calculatedPrice.calculatedTaxes[0].taxRate }}%
        {{ global('vat') }}
      </p>
    </div>
  </div>
  <!-- </div> -->
</template>
<style lang="postcss" module>
.description {
  font-family: Raleway;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  hyphens: auto;
}

.description>*:not(p:first-of-type) {
  display: none;
}

.description p {
  @apply text-sm md:text-base;

  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  line-height: 1.45;
}

.description p:has(strong) {
  @apply hidden;
}

.description p:has(span) {
  @apply hidden;
}

.description.active {
  text-align: left;
}

.description ul {
  margin: 0 !important;
  padding: 0 !important;
}

.description li,
.description p,
.description div {
  margin: 0;
  padding: 0;
  font-family: Raleway;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
}
</style>
