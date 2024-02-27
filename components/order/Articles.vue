<script setup lang="ts">
const props = defineProps<{
  orderId: string
}>()
const orderId = props.orderId
const { loadOrderDetails, order } = useOrderDetails(orderId)
onMounted(async () => {
  loadOrderDetails()
})
const lineItems = computed(() => order.value?.lineItems || [])
</script>

<template>
  <div>{{ lineItems.length }}</div>
</template>

<style scoped></style>
