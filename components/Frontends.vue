<script setup lang="ts">
defineProps<{
  template: string
}>()
const { t: frontendsT } = useMessages('frontends')
const { currency, selectedPaymentMethod } = useSessionContext()
const { isLoggedIn } = useUser()
</script>

<template>
  <div>
    <img class="logo" src="/shopware-frontends-logo.png" />
  </div>
  <h1>{{ template }}</h1>
  <div class="example">
    <p>
      {{ frontendsT('currency') }} <strong>{{ currency?.name }} ({{ currency?.symbol }})</strong>
    </p>
    <p>
      {{ frontendsT('defaultPaymentMethod') }} <strong>{{ selectedPaymentMethod?.name }}</strong>
    </p>
    <p>
      {{ frontendsT('isLoggedIn') }} <strong>{{ isLoggedIn }}</strong>
    </p>
  </div>
</template>

<style scoped>
.logo {
  max-width: 100%;
}
.example {
  width: 500px;
  margin: 0 auto;
  text-align: left;
  padding: 10px 20px;
  border-radius: 10px;
}
</style>
