<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const className = computed(() => {
  return props?.status === 'Open'
    ? 'w-fit px-4 py-1 rounded-full bg-green-300  text-3.5 font-medium  text-green-400'
    : 'w-fit px-4 py-1 rounded-full bg-[#E5D18A]  text-3.5 font-medium  text-[#9A6E19]'
})
</script>

<template>
  <div :class="className">{{ status }}</div>
</template>

<style scoped></style>
