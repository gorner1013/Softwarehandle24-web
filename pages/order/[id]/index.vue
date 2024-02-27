<script setup lang="ts">
import type { Product } from '@shopware-pwa/types'
import { getSmallestThumbnailUrl } from '@shopware-pwa/helpers-next'
import { watchDebounced } from '@vueuse/core'

const router = useRouter()
const route = useRoute()
const orderId = route.params.id
const { loadOrderDetails, order, subtotal } = useOrderDetails(orderId as string)
const { paymentUrl, handlePayment, paymentMethod } = useOrderPayment(ref(order))
onMounted(async () => {
  const SUCCESS_PAYMENT_URL = `${window?.location?.origin}/order/${orderId}/paid`
  const FAILURE_PAYMENT_URL = `${window?.location?.origin}/order/${orderId}/unpaid`

  await loadOrderDetails()
  handlePayment(SUCCESS_PAYMENT_URL, FAILURE_PAYMENT_URL)
})
const lineItems = computed(() => order.value?.lineItems || [])
function getOrderDateFormat(orderdate: any) {
  return new Date(orderdate).toLocaleDateString('en-US')
}
function getOrderDateTimeFormat(orderdate: any) {
  return `${new Date(orderdate).toLocaleDateString('en-US')} - ${
    new Date(orderdate).toTimeString().split(' ')[0]
  }`
}
const { t: cartT } = useMessages('cart')
const { t: orderT } = useMessages('order')
watchDebounced(
  paymentUrl,
  (paymentUrl) => {
    if (typeof paymentUrl !== 'string') {
      return
    }
    try {
      URL(paymentUrl as string)
      window.location.href = paymentUrl
    } catch (error) {
      console.error('err, redirect', error)
    }
  },
  { debounce: 5000 },
)
useBreadcrumbs([
  {
    name: 'account',
    path: '/account',
  },
  {
    name: 'orders',
    path: '/account/orders',
  },
])
</script>

<template>
  <!-- <ClientOnly> -->
  <div v-if="order?.orderNumber">
    <LayoutBreadcrumbs />
    <div
      class="md:flex hidden max-w-360 m-auto md:mt-6 mt-5 items-center gap-10 px-5"
    >
      <div
        class="md:flex hidden flex-row items-center gap-1 cursor-pointer"
        @click="router.push('/account/orders')"
      >
        <img src="/images/back.svg" />
        <div
          class="text-3.5 font-medium text-gray-800"
          v-text="orderT('back')"
        />
      </div>
      <div class="text-6 font-bold text-black">
        {{ orderT('info') }} - {{ orderT('number') }} {{ order?.orderNumber }}
      </div>
    </div>
    <div class="max-w-360 m-auto md:mt-10 mt-5 px-5 flex flex-col gap-5">
      <div class="flex flex-row items-center gap-2.5">
        <div class="text-4 font-bold text-black" v-text="orderT('date')" />
        <div class="text-4 font-medium text-black">
          {{ getOrderDateFormat(order?.orderDate) }}
        </div>
      </div>
      <div class="flex flex-row items-center gap-2.5">
        <div class="text-4 font-bold text-black" v-text="orderT('history')" />
        <div class="text-4 font-medium text-black">
          {{ getOrderDateTimeFormat(order?.orderDate) }}
        </div>
        <OrderStatusTag :status="order?.stateMachineState?.name" />
      </div>
      <div class="flex flex-row items-center gap-2.5">
        <div
          class="text-4 font-bold text-black"
          v-text="orderT('paymentMethod')"
        />
        <div class="text-4 font-medium text-black">
          {{ paymentMethod?.name }}
        </div>
      </div>
      <div class="hidden md:flex flex-col w-full">
        <div
          class="border-x-0.5 border-x-solid border-t-0.5 border-t-solid border-gray-700 text-gray-800 text-3.5 flex items-center px-6 font-medium py-5.5"
        >
          <div class="flex-2/5" v-text="cartT('article')" />
          <div class="flex-1/5" v-text="cartT('amount')" />
          <div class="flex-1/5" v-text="cartT('unitPrice')" />
          <div class="flex-1/5" v-text="cartT('totalPrice')" />
        </div>
        <div
          v-for="lineItem in lineItems"
          :key="lineItem.identifier"
          class="border-x-0.5 border-x-solid border-0.5 border-solid border-gray-700 text-gray-800 flex items-center px-6 py-5.5"
        >
          <div class="flex-2/5 flex items-center gap-5">
            <img
              class="logo w-full w-15 h-18"
              :src="getSmallestThumbnailUrl(lineItem.cover)"
            />
            <div>
              <div class="text-4 font-medium pr-3">{{ lineItem.label }}</div>
              <div class="text-3.5 font-normal">
                {{ cartT('itemNumber') }}
                {{ (lineItem.payload as Product)?.productNumber }}
              </div>
            </div>
          </div>
          <div class="flex-1/5 text-3.5 font-medium">
            {{ lineItem.quantity }}
          </div>
          <div class="flex-1/5 text-black text-3.5 font-medium">
            EUR {{ lineItem.unitPrice }}
          </div>
          <div class="flex-1/5 text-black text-3.5 font-medium">
            EUR {{ lineItem.totalPrice }}
          </div>
        </div>
      </div>
      <div
        v-for="lineItem in lineItems"
        :key="lineItem.identifier"
        class="flex md:hidden flex-col w-full"
      >
        <div
          class="border-0.5 border-solid border-0.5 border-solid border-gray-700 rounded text-gray-800 flex items-center px-6 py-5.5 justify-between gap-5"
        >
          <div class="flex-1/3.5">
            <img
              class="logo w-full"
              :src="getSmallestThumbnailUrl(lineItem.cover)"
            />
          </div>
          <div class="flex-2.5/3.5">
            <div class="text-4 font-medium">{{ lineItem.label }}</div>
            <div class="text-3.5 font-normal">
              {{ cartT('itemNumber') }}
              {{ (lineItem.payload as Product)?.productNumber }}
            </div>
            <div class="flex justify-between">
              <div v-text="cartT('amount')" />
              <div>{{ lineItem.quantity }}</div>
            </div>
            <div class="flex justify-between">
              <div v-text="cartT('unitPrice1')" />
              <div>EUR {{ lineItem.unitPrice }}</div>
            </div>
            <div class="flex justify-between">
              <div v-text="cartT('totalPrice1')" />
              <div>EUR {{ lineItem.totalPrice }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end text-black pb-30">
        <div
          class="w-full md:w-112.5 bg-gray-200 p-5 rounded-2.5 min-w-60 md:min-w-112.5"
        >
          <h1 class="text-6 font-bold" v-text="cartT('summary')" />
          <div class="flex justify-between gap-10 mt-4">
            <p class="font-bold text-3.5" v-text="cartT('subTotal')" />
            <p class="text-3.5 font-bold">€ {{ subtotal }}</p>
          </div>
          <div class="flex justify-between gap-10 mt-4 font-bold">
            <p class="text-3.5" v-text="cartT('shipping')" />
            <p class="text-3.5">€ {{ order?.shippingTotal }}</p>
          </div>
          <div class="flex justify-between mt-4 gap-10 opacity-70">
            <p class="text-3.5 font-medium" v-text="cartT('totalVAT')" />
            <p class="text-3.5 font-medium">€ {{ order?.price?.netPrice }}</p>
          </div>
          <div class="flex justify-between mt-4 gap-10 opacity-70">
            <p class="text-3.5 font-medium">
              {{ cartT('plus') }}
              {{ order?.price?.calculatedTaxes[0].taxRate }}%
              {{ cartT('vat') }}.:
            </p>
            <p class="text-3.5 font-medium">
              € {{ order?.price?.calculatedTaxes[0].tax }}
            </p>
          </div>
          <hr class="mt-4" />
          <div class="flex justify-between mt-4 gap-10 mt-5.5">
            <p class="text-4 font-bold">{{ cartT('total') }}:</p>
            <p class="text-4 font-bold">€ {{ order?.price.totalPrice }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- </ClientOnly> -->
</template>

<style scoped></style>
