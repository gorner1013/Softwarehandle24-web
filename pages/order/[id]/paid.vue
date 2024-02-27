<script lang="ts">
export default {
  name: 'CheckoutSuccessPaidPage',
}
const { t: orderT } = useMessages('order')
</script>

<template>
  <div class="container mx-auto w-1/2 mb-24 mt-24 text-center">
    <h1
      class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
    >
      {{ orderT('$paid.title') }}
      <span
        class="underline underline-offset-3 decoration-8 decoration-green-400 dark:decoration-green-600"
        >{{ orderT('$paid.payState') }}</span
      >
    </h1>
    <p
      class="text-lg font-normal text-gray-400 lg:text-xl dark:text-gray-500"
      v-text="orderT('$paid.description')"
    />
    <div class="mt-12 text-center">
      <a
        href="/account"
        class="inline-flex justify-center items-center py-2 px-4 text-base font-medium text-center text-white bg-brand-primary rounded-lg hover:bg-gray-500 focus:ring-4 focus:ring-brand-primary dark:focus:ring-brand-primary"
      >
        {{ orderT('$paid.backBtn') }}
        <div class="i-carbon-undo ml-2" />
      </a>
    </div>
  </div>
</template>
