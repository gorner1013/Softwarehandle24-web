<script setup lang="ts">
import type { Price } from '@shopware-pwa/types'

import 'vue-toast-notification/dist/theme-sugar.css'

const emits = defineEmits<{
  (e: 'success'): void
}>()
const { t: checkoutT } = useMessages('checkout')

const { cart, totalPrice, shippingTotal, subtotal } = useCart()
// import { ClientApiError } from "@shopware-pwa/types";
useBreadcrumbs([
  {
    name: 'checkout',
    path: '/checkout',
  },
  {
    name: 'payment',
    path: '/checkout/payment',
  },
])

const { logout } = useUser()
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

const router = useRouter()

const price = computed(() => cart.value?.price as unknown as Price)
const {
  paymentMethods,
  getPaymentMethods,
  selectedPaymentMethod,
  setPaymentMethod,
} = useCheckout()
const { setDefaultPaymentMethod } = useUser()
const { pushSuccess } = useNotifications()
const isLoading = ref(true)
onMounted(async () => {
  getPaymentMethods()
  isLoading.value = false
})

const paymentMethodType = ref(selectedPaymentMethod.value?.id)
async function paymentStatus(id: string) {
  try {
    if (paymentMethodType.value !== id) {
      paymentMethodType.value = id
    } else {
      return
    }
    await setPaymentMethod({ id: paymentMethodType.value })
    await setDefaultPaymentMethod(paymentMethodType.value)
    emits('success')
    pushSuccess('paymentSetSuccessfully')
  } catch (error) {
    console.log('error', error)
  }
}

const deliveryaddresstype = ref(true)
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="max-w-360 m-auto md:mt-6 mt-4 px-5">
    <h1
      class="text-black md:text-6 text-3.5 font-bold"
      v-text="checkoutT('$payment.title')"
    />
    <div class="max-w-240 flex items-center justify-center mx-auto mt-5 px-10">
      <div class="flex flex-col items-center justify-center">
        <div
          class="flex items-center w-14 h-14 justify-center rounded-full border border-solid border-gray-700 cursor-pointer bg-white text-gray-800"
        >
          <img src="/svgs/checked.svg" class="checked-icon w-8 h-8" />
        </div>
      </div>
      <div class="h-px w-full bg-gray-700"></div>
      <div class="flex flex-col items-center justify-center">
        <p
          class="flex items-center w-14 h-14 justify-center rounded-full bg-gray-800 text-white"
        >
          2
        </p>
      </div>
      <div class="h-px w-full bg-gray-700"></div>
      <div class="flex flex-col items-center justify-center">
        <p
          class="flex items-center w-14 h-14 justify-center rounded-full border border-solid border-gray-700 cursor-pointer bg-white text-gray-800"
        >
          3
        </p>
      </div>
    </div>
    <div class="max-w-240 flex items-center justify-between mx-auto mt-5 px-5">
      <div class="flex flex-col items-center justify-center">
        <p
          class="text-center text-3.5 font-semibold text-gray-800"
          v-text="checkoutT('customerData')"
        />
      </div>
      <div class="flex flex-col items-center justify-center">
        <p
          class="text-center text-3.5 font-semibold text-gray-800"
          v-text="checkoutT('paymentMethod')"
        />
      </div>

      <div class="flex flex-col items-center justify-center">
        <p
          class="text-center text-3.5 font-semibold text-gray-800"
          v-text="checkoutT('finalizeOrder')"
        />
      </div>
    </div>
    <div class="flex md:mt-6 mt-5 pb-30 justify-between">
      <div class="w-full flex-col flex md:flex-row justify-between gap-5">
        <div class="shadow-1.5xl flex-1 rounded-2.5 bg-white p-5 md:max-w220">
          <p
            class="text-4 font-bold text-black"
            v-text="checkoutT('$payment.chooseMethod')"
          />
          <div class="flex flex-col gap-5 w-full mt-10">
            <div
              v-for="paymentMethod in paymentMethods"
              :key="paymentMethod.id"
              class="flex flex-col gap-5 w-full"
            >
              <div
                class="text-gray-800 text-3.5 font-bold flex items-center gap-2"
                @click="paymentStatus(paymentMethod.id)"
              >
                <div
                  class="!w-4 !h-4 rounded-1 border border-solid border-gray-700 bg-white cursor-pointer"
                >
                  <img
                    v-if="paymentMethodType === paymentMethod.id"
                    src="/svgs/checked.svg"
                    class="checked-icon"
                  />
                </div>
                <div>
                  {{ paymentMethod.translated?.name }}
                </div>
              </div>
              <div
                v-if="
                  paymentMethod.translated?.name ===
                  'Credit card (MasterCard, VISA, American Express)'
                "
                class="flex flex-col gap-5"
              >
                <p
                  class="text-3.5 font-medium text-gray800"
                  v-text="checkoutT('$payment.secure')"
                />
                <div
                  class="flex flex-col md:flex-row md:items-center justify-between gap-2.5"
                >
                  <p
                    class="text-3.5 font-medium text-gray-800"
                    v-text="`${checkoutT('$payment.cardHolder')}*`"
                  />
                  <div class="md:-100">
                    <input
                      id="Cardholder"
                      name="name"
                      type="text"
                      required
                      placeholder="Marco Weidl"
                      class="w-[calc(100%-40px)] px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                    />
                  </div>
                </div>
                <div
                  class="flex flex-col md:flex-row md:items-center justify-between gap-2.5"
                >
                  <p
                    class="text-3.5 font-medium text-gray-800"
                    v-text="`${checkoutT('$payment.cardNumber')}*`"
                  />
                  <div class="md:w-100">
                    <input
                      id="Card"
                      name="Card"
                      type="number"
                      required
                      placeholder="1234  1234  1234  1234 "
                      class="w-[calc(100%-40px)] px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                    />
                  </div>
                </div>
                <div
                  class="flex flex-col md:flex-row md:items-center justify-between gap-2.5"
                >
                  <p
                    class="text-3.5 font-medium text-gray-800"
                    v-text="`${checkoutT('$payment.validPeriod')}*`"
                  />
                  <div class="md:w-100">
                    <input
                      id="date"
                      name="Valid"
                      type="date"
                      required
                      :placeholder="checkoutT('$payment.period')"
                      class="w-[calc(100%-40px)] px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                    />
                  </div>
                </div>
                <div
                  class="flex flex-col md:flex-row md:items-center justify-between gap-2.5"
                >
                  <p
                    class="text-3.5 font-medium text-gray-800"
                    v-text="`${checkoutT('$payment.cvc')}*`"
                  />
                  <div class="md:w-100">
                    <input
                      id="CVC"
                      name="CVC"
                      type="text"
                      required
                      :placeholder="checkoutT('$payment.checkDigit')"
                      class="w-[calc(100%-40px)] px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                    />
                  </div>
                </div>
              </div>

              <div
                v-if="paymentMethod.translated?.name === 'PayPal'"
                class="flex flex-col gap-5"
              >
                <div class="flex items-center gap-1">
                  <img src="/svgs/paypal.svg" class="h-8 w-8" />
                  <img src="/svgs/paypal1.svg" />
                </div>
                <p
                  class="text-3.5 font-medium text-gray800"
                  v-text="checkoutT('$payment.payByPaypal')"
                />
              </div>

              <div
                v-if="paymentMethod.translated?.name === 'Payment in Advance'"
                class="flex flex-col gap-5"
              >
                <p
                  class="text-3.5 font-medium text-gray800"
                  v-text="checkoutT('$payment.bankTransfer')"
                />
                <p
                  class="text-3.5 font-medium text-gray800"
                  v-text="checkoutT('$payment.notice')"
                />
              </div>

              <p
                v-if="paymentMethod.translated?.name === 'SOFORT (Klarna)'"
                class="text-3.5 font-medium text-gray800"
                v-text="checkoutT('$payment.toKlarna')"
              />

              <p
                v-if="paymentMethod.translated?.name === 'Invoice'"
                class="text-3.5 font-medium text-gray800"
                v-text="checkoutT('$payment.conveniently')"
              />
              <div class="h-px w-full bg-gray-200"></div>
            </div>
            <div class="shadow-1.5xl flex-1 rounded-2.5 bg-white p-5">
              <div class="flex cursor-pointer items-center gap-1">
                <img
                  :src="
                    deliveryaddresstype
                      ? '/svgs/radio-full.svg'
                      : '/svgs/radio-empty.svg'
                  "
                  class="h-4 w-4"
                />
                <p
                  class="ml-2 text-3.5 font-medium text-gray-800"
                  v-text="checkoutT('$payment.standardShipping')"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="md:min-w-80 lg:min-w-112.5">
          <div class="bg-gray-200 p-5 rounded-2.5">
            <h1 class="text-6 font-bold" v-text="checkoutT('summary')" />
            <div class="flex justify-between gap-10 mt-4">
              <p class="font-bold text-3.5" v-text="checkoutT('subTotal')" />
              <p class="text-3.5 font-bold">€ {{ changedSubtotal }}</p>
            </div>
            <div class="flex justify-between gap-10 mt-4 font-bold">
              <p class="text-3.5" v-text="checkoutT('shipping')" />
              <p class="text-3.5">€ {{ changedShippingTotal }}</p>
            </div>
            <div class="flex justify-between mt-4 gap-10 opacity-70">
              <p class="text-3.5 font-medium" v-text="checkoutT('totalVAT')" />
              <p class="text-3.5 font-medium">€ {{ netPrice }}</p>
            </div>
            <div class="flex justify-between mt-4 gap-10 opacity-70">
              <p class="text-3.5 font-medium">
                {{ checkoutT('plus') }} {{ price?.calculatedTaxes[0].taxRate }}%
                {{ checkoutT('vat') }}.:
              </p>
              <p class="text-3.5 font-medium">€ {{ taxPrice }}</p>
            </div>
            <hr class="mt-4" />
            <div class="flex justify-between mt-4 gap-10 mt-5.5">
              <p class="text-4 font-bold" v-text="checkoutT('total')" />
              <p class="text-4 font-bold">€ {{ changedTotal }}</p>
            </div>
          </div>
          <button
            class="mt-10 flex items-center mb-5 justify-center w-full border-none duration-300 hover:opacity-80 text-center py-3.5 rounded-1 bg-primary text-3.5 font-bold cursor-pointer text-white"
            @click="router.push('/checkout/order')"
            v-text="checkoutT('$payment.continue')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-account {
}
</style>
