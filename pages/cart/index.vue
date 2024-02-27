<script setup lang="ts">
import type {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData,
} from '@paypal/paypal-js'
import { loadScript } from '@paypal/paypal-js'
import { getSmallestThumbnailUrl } from '@shopware-pwa/helpers-next'
import type { LineItem, Price, Product } from '@shopware-pwa/types'

const { t: cartT } = useMessages('cart')

const {
  cart,
  cartItems,
  removeItem,
  changeProductQuantity,
  totalPrice,
  shippingTotal,
  subtotal,
  isEmpty,
} = useCart()

const router = useRouter()
const { paymentMethods, getPaymentMethods, createOrder } = useCheckout()
const price = computed(() => cart.value?.price as unknown as Price)

const changedSubtotal = computed(() => subtotal.value.toFixed(2))
const changedTotal = computed(() => totalPrice.value.toFixed(2))
const changedShippingTotal = computed(() => shippingTotal.value.toFixed(2))
const taxPrice = computed(
  () =>
    cart.value?.price?.calculatedTaxes[0].tax.toFixed(2) as unknown as Price,
)
const netPrice = computed(
  () => cart.value?.price?.netPrice.toFixed(2) as unknown as Price,
)

// const getOrderDateFormat = (orderdate: any) => {
//   return new Date(orderdate).toLocaleDateString("en-US");
// };

const isLoading = ref(false)
const isPaypalLoading = ref(true)
const route = useRoute()
async function removeCartItem(cartItem: LineItem) {
  isLoading.value = true
  await removeItem(cartItem)
  isLoading.value = false
}

async function selectitem(cartItem: LineItem) {
  isLoading.value = true
  const itemquantity = Number(cartItem.quantity)
  changeProductQuantity({ id: cartItem.id, quantity: itemquantity })
  isLoading.value = false
}
const paypalMethod = computed(() => {
  return paymentMethods.value?.find(
    (method) => method.shortName === 'pay_pal_payment_handler',
  )
})
const { setPaymentMethod } = useSessionContext()
const { apiInstance } = useShopwareContext()
const { refreshCart } = useCart()
const redirectPaymentUrl = ref()
const orderCreated = ref()

async function renderPaypalButtons() {
  const paypal = await loadScript({
    clientId:
      'AdpIomhLaiSJvmNExEkukW_NjVtQw7Xg_BRvWRWS5PyYHgSmsIQOOWUdBDk4rsoXD_QFb41xwAljYQjK',
    currency: 'EUR',
    locale: 'en_US',
  })
  if (!paypal || !paypal.Buttons) {
    return
  }
  paypal.Buttons({
    onError(err: any) {
      console.warn('[PayPal > App.vue][onError]', { err })
    },

    createOrder: async (
      _data: CreateOrderData,
      _actions: CreateOrderActions,
    ) => {
      if (!paypalMethod.value) {
        return ''
      }

      // 1. set the payment method id in the context PATCH /context -> setPaymentMethod
      // 2. add product to cart -> addToCart
      // 3. create order -> /store-api/paypal/express/create-order
      await setPaymentMethod(paypalMethod.value)
      // await addToCart()

      const response = await apiInstance.invoke.post<{ token: string }>(
        '/store-api/paypal/express/create-order?isPayPalExpressCheckout=1',
      )

      return response?.data?.token
    },

    // Finalize the transaction after payer approval
    // Will be called if the payment process is approved by paypal
    onApprove: async (data: OnApproveData, _actions: OnApproveActions) => {
      console.info('onApprove', { data, _actions })

      const response = await apiInstance.invoke.post(
        '/store-api/paypal/express/prepare-checkout?isPayPalExpressCheckout=1',
        { token: data.orderID },
      )
      console.log({ response })

      orderCreated.value = await createOrder()
      refreshCart()
      const handlePaymentResponse = await apiInstance.invoke.post(
        '/store-api/handle-payment',
        {
          orderId: orderCreated.value.id,
          successUrl: `${window.location.origin}/ExpressCheckout?order=${orderCreated.value.id}&success=true`,
        },
      )
      redirectPaymentUrl.value = handlePaymentResponse?.data?.redirectUrl
      //
    },
  })
}

const orderId = Array.isArray(route?.query?.order)
  ? route?.query?.order.shift()
  : route?.query?.order

watch(
  () => isPaypalLoading.value,
  (isPaypalLoading) => {
    if (!isPaypalLoading && !orderId) {
      renderPaypalButtons()
    }
  },
)
onMounted(async () => {
  if (!orderId) {
    await getPaymentMethods()
    isPaypalLoading.value = false
    return
  }
  isPaypalLoading.value = false
})

async function additem() {
  isLoading.value = true
  // const itemquantity = Number(cartItem.quantity);
  // changeProductQuantity({ id: cartItem.id, quantity: itemquantity });
  isLoading.value = false
}
useBreadcrumbs([
  {
    name: 'Shopping cart',
    path: '/cart',
  },
])
</script>

<template>
  <LayoutBreadcrumbs />
  <div v-if="!isEmpty" class="max-w-360 m-auto mt-5 px-5 flex flex-col gap-5">
    <div
      class="md:text-6 text-3.5 font-bold text-black"
      v-text="cartT('shoppingCart')"
    />
    <div class="flex justify-end">
      <div class="min-w-full md:min-w-112.5 xl:min-w-130">
        <div class="flex gap-0 md:gap-5">
          <button
            class="flex-1 mt-4 py-3.75 bg-gray-300 rounded text-3.5 font-medium border-none text-gray-800 flex items-center justify-center cursor-pointer"
          >
            <img src="/svgs/logos_paypal.svg" class="mr-2.5" />
            {{ cartT('payLater') }}
          </button>
          <div class="flex-0 md:flex-1"></div>
        </div>
        <div class="flex flex-col md:flex-row gap-0 md:gap-5">
          <button
            class="flex-1 mt-4 py-3.75 bg-gray-300 rounded text-3.5 font-medium border-none text-gray-800 flex items-center justify-center cursor-pointer"
          >
            {{ cartT('directTo') }}
            <img src="/svgs/logos_paypal.svg" class="ml-2.5" />
          </button>
          <button
            class="flex-1 mt-4 py-3.75 bg-primary rounded text-3.5 font-bold border-none cursor-pointer border-none duration-300 hover:opacity-80 text-white"
            @click="router.push('/checkout')"
          >
            {{ cartT('checkout') }}
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-col w-full">
      <div
        class="border-x-0.5 border-x-solid border-0.5 border-solid border-gray-700 text-gray-800 text-3.5 hidden md:flex items-center px-6 font-medium py-5.5"
      >
        <p class="flex-2/5.3" v-text="cartT('article')" />
        <p class="flex-1/5.3" v-text="cartT('amount')" />
        <p class="flex-1/5.3" v-text="cartT('unitPrice')" />
        <p class="flex-1/5.3" v-text="cartT('totalPrice')" />
        <div class="flex-0.3/5.3"></div>
      </div>
      <div class="hidden md:block">
        <div
          v-for="cartItem in cartItems"
          :key="cartItem.id"
          class="border-x-0.5 border-x-solid border-0.5 border-b-solid border-gray-700 text-gray-800 flex items-center px-6 py-5.5"
        >
          <div class="flex-2/5.3 flex items-center gap-5">
            <img
              class="logo w-full w-15 h-18"
              :src="getSmallestThumbnailUrl(cartItem.cover)"
            />
            <div class="flex flex-col p-5">
              <p class="text-4 font-medium">{{ cartItem.label }}</p>
              <p class="text-3.5 font-medium">
                {{ cartT('itemNumber') }}
                {{ (cartItem.payload as Product)?.productNumber }}
              </p>
            </div>
          </div>
          <div class="flex-1/5.3 text-3.5 font-medium">
            <select
              v-model="cartItem.quantity"
              :disabled="isLoading"
              class="cursor-pointer w-50 px-4 py-4 text-3.5 text-black bg-white border border-solid rounded border-primary outline-none appearance-none"
              @click="selectitem(cartItem)"
            >
              <option v-for="list in 7" :key="list.toFixed" :value="list">
                {{ list }}
              </option>
            </select>
          </div>
          <p class="flex-1/5.3 text-black text-3.5 font-medium p-5">
            EUR {{ cartItem.price?.unitPrice.toFixed(2) }}
          </p>
          <p class="flex-1/5.3 text-black text-3.5 font-medium p-5">
            EUR {{ cartItem.price?.totalPrice.toFixed(2) }}
          </p>
          <div
            class="flex-0.3/5.3 cursor-pointer"
            @click="removeCartItem(cartItem)"
          >
            <i
              class="fa-regular fa-trash-can text-gray-800 hover:text-primary cursor-pointer"
            ></i>
          </div>
        </div>
      </div>
      <div class="block md:hidden flex flex-col gap-5">
        <div
          v-for="cartItem in cartItems"
          :key="cartItem.id"
          class="flex border-0.5 border-solid border-0.5 border-solid border-gray-700 rounded text-gray-800 flex items-center px-6 py-5.5 gap-5"
        >
          <div class="flex-2/7">
            <img
              class="logo w-full"
              :src="getSmallestThumbnailUrl(cartItem.cover)"
            />
          </div>
          <div class="flex-5/7">
            <div class="flex gap-5">
              <div class="flex-1/1.2 flex flex-col">
                <p class="text-3.5 font-medium">{{ cartItem.label }}</p>
                <p class="text-3 font-medium">
                  {{ cartT('itemNumber') }}
                  {{ (cartItem.payload as Product)?.productNumber }}
                </p>
                <p class="text-3 font-medium" v-text="cartT('delivery')" />
              </div>
              <div
                class="flex cursor-pointer"
                @click="removeCartItem(cartItem)"
              >
                <i
                  class="fa-regular fa-trash-can text-gray-800 hover:text-primary cursor-pointer"
                ></i>
              </div>
            </div>
            <div class="flex gap-4 mt-2">
              <div class="flex-0.3/1">
                <select
                  v-model="cartItem.quantity"
                  :disabled="isLoading"
                  class="cursor-pointer w-16 pl-4 pr-6 py-2 text-3.5 text-black bg-white border border-solid rounded border-primary outline-none appearance-none"
                  @click="selectitem(cartItem)"
                >
                  <option v-for="list in 7" :key="list.toFixed" :value="list">
                    {{ list }}
                  </option>
                </select>
              </div>
              <div class="flex-0.7/1">
                <div
                  class="flex justify-between text-3 text-gray-500 font-medium"
                >
                  <p v-text="cartT('unit')" />
                  <p>EUR {{ cartItem.price?.unitPrice.toFixed(2) }}</p>
                </div>
                <div class="flex justify-between text-3.5 font-medium">
                  <p v-text="cartT('total')" />
                  <p>EUR {{ cartItem.price?.totalPrice.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="md:mt-10 mt-5 w-full gap-5 mb-5 flex flex-col text-black md:flex-row items-start justify-between"
    >
      <div class="flex w-full md:w-130">
        <input
          :placeholder="cartT('itemNumPlaceholder')"
          type="text"
          class="flex-1 px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 focus-visible:outline-none border-rd-l-2.5"
        />
        <button
          class="bg-primary border-none text-6 px-4 cursor-pointer border-none duration-300 hover:opacity-80 border-rd-r-2.5 text-white"
          type="button"
          @click="additem"
        >
          +
        </button>
      </div>
      <div class="w-full md:w-130">
        <div class="bg-gray-200 p-5 min-w-60 md:min-w-112.5 rounded-2.5">
          <h1 class="text-6 font-bold" v-text="cartT('summary')" />
          <div class="flex justify-between gap-10 mt-4">
            <p class="font-bold text-3.5" v-text="cartT('subTotal')" />
            <p class="text-3.5 font-bold">€ {{ changedSubtotal }}</p>
          </div>
          <div class="flex justify-between gap-10 mt-4 font-bold">
            <p class="text-3.5" v-text="cartT('shipping')" />
            <p class="text-3.5">€ {{ changedShippingTotal }}</p>
          </div>
          <div class="flex justify-between mt-4 gap-10 opacity-70">
            <p class="text-3.5 font-medium" v-text="cartT('totalVAT')" />
            <p class="text-3.5 font-medium">€ {{ netPrice }}</p>
          </div>
          <div class="flex justify-between mt-4 gap-10 opacity-70">
            <p class="text-3.5 font-medium">
              {{ cartT('plus') }} {{ price?.calculatedTaxes[0].taxRate }}%
              {{ cartT('vat') }}.:
            </p>
            <p class="text-3.5 font-medium">€ {{ taxPrice }}</p>
          </div>
          <hr class="mt-4" />
          <div class="flex justify-between mt-4 gap-10 mt-5.5">
            <p class="text-4 font-bold">{{ cartT('total') }}:</p>
            <p class="text-4 font-bold">€ {{ changedTotal }}</p>
          </div>
          <div class="flex items-center items-stretch mt-5.5">
            <input
              placeholder="Enter coupon code"
              type="text"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 focus-visible:outline-none border-rd-l-2.5"
            />
            <button
              class="bg-primary border-none text-6 px-4 cursor-pointer border-none duration-300 hover:opacity-80 border-rd-r-2.5"
            >
              <img src="/svgs/arrow-right.svg" />
            </button>
          </div>
        </div>
        <div class="flex w-full">
          <div class="w-full">
            <div class="flex gap-0 md:gap-5">
              <button
                class="flex-1 mt-4 py-3.75 bg-gray-300 rounded text-3.5 font-medium border-none text-gray-800 flex items-center justify-center cursor-pointer"
              >
                <img src="/svgs/logos_paypal.svg" class="mr-2.5" />
                {{ cartT('payLater') }}
              </button>
              <div class="flex-0 md:flex-1"></div>
            </div>
            <div
              class="flex-col md:flex-row flex gap-0 md:gap-5 cursor-pointer"
            >
              <button
                class="flex-1 mt-4 py-3.75 bg-gray-300 rounded text-3.5 font-medium border-none text-gray-800 flex items-center justify-center cursor-pointer"
                @click="router.push('/checkout/order')"
              >
                {{ cartT('directTo') }}
                <img src="/svgs/logos_paypal.svg" class="ml-2.5" />
              </button>
              <button
                class="flex-1 mt-4 py-3.75 bg-primary rounded text-3.5 font-bold border-none cursor-pointer border-none duration-300 hover:opacity-80 text-white"
                @click="router.push('/checkout')"
                v-text="cartT('checkout')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container mx-auto w-1/2 mb-24 mt-24 text-center">
    <h1
      class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
    >
      {{ cartT('yourCart') }}
      <span
        class="underline underline-offset-3 decoration-8 decoration-green-400 dark:decoration-green-600"
        >{{ cartT('isEmpty') }}
      </span>
    </h1>
    <div class="mt-12 text-center">
      <a
        href="/"
        class="inline-flex justify-center items-center py-2 px-4 text-base font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:ring-primary"
      >
        {{ cartT('backToHomepage') }}
        <div class="i-carbon-undo ml-2" />
      </a>
    </div>
  </div>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
}
</style>
