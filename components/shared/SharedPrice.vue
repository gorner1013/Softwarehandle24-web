<script setup lang="ts">
const props = defineProps<{
  value: number | undefined
}>()
const { getFormattedPrice } = usePrice()
const getPrice = computed<string>(() => getFormattedPrice(props.value))
</script>

<template>
  <p class="flex gap-1">
    <slot name="beforePrice" />
    <span>{{ getPrice }}</span>
    <slot name="afterPrice" />
  </p>
</template>
