<script setup lang="ts">
const route = useRoute()
const orderId = String(route.params.orderId)

const { order, loadOrderDetails } = useOrderDetails(orderId)

onMounted(loadOrderDetails)
</script>

<template>
  <pre class="text-slate-900 text-xs">{{ order }}</pre>
</template>
