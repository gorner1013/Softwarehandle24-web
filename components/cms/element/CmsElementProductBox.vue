<script setup lang="ts">
import type { CmsElementProductBox } from '@shopware-pwa/composables-next'
import ProductCard from '../../product/ProductCard.vue'

const props = defineProps<{
  content: CmsElementProductBox
}>()

const product = computed(() => props.content.data?.product || {})
</script>

<template>
  <ProductCard :product="product" />
</template>
