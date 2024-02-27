<script setup lang="ts">
const { refreshSessionContext } = useSessionContext()
const { refreshCart } = useCart()

onMounted(refreshSessionContext)
onMounted(() => {
  refreshCart()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style src="./style.css" />
