<script setup lang="ts">
const emits = defineEmits<{
  (e: 'success'): void
}>()
const {
  paymentMethods,
  getPaymentMethods,
  selectedPaymentMethod,
  setPaymentMethod,
} = useCheckout()
const { setDefaultPaymentMethod } = useUser()
const { pushSuccess } = useNotifications()
const isLoading = ref(true)
const { t: accountT } = useMessages('account')

const formData = reactive({
  paymentMethod: '',
})
useBreadcrumbs([
  {
    name: 'account',
    path: '/account',
  },
  {
    name: 'payment',
    path: '/account/payment',
  },
])
async function invokeSave(): Promise<void> {
  try {
    await setPaymentMethod({ id: formData.paymentMethod })
    await setDefaultPaymentMethod(formData.paymentMethod)
    emits('success')
    pushSuccess('paymentSetSuccessfully')
  } catch (error) {
    console.error('error set default payment method', error)
  }
}

onMounted(async () => {
  await getPaymentMethods()
  isLoading.value = false
})
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="m-auto mt-5 max-w-360 px-5 pb-30 md:mt-6">
    <div
      class="text-3.5 font-bold text-black md:text-6"
      v-text="accountT('$payment.title')"
    />
    <div
      class="m-auto mt-5 max-w-114 rounded-2.5 bg-white shadow-1.5xl md:mt-10"
    >
      <div
        class="h-12.5 max-w-180 flex items-center justify-center text-center rounded-tl-2.5 rounded-tr-2.5 bg-gray-800 p-5 text-base font-semibold leading-7 not-italic text-white"
      >
        <p v-text="accountT('$payment.preferred')" />
      </div>
      <form
        data-testid="account-payment"
        class="h-auto flex items-center rounded-bl-2.5 rounded-br-2.5 bg-white p-5 text-sm font-semibold leading-7 not-italic text-black decoration-none"
        @submit.prevent="invokeSave"
      >
        <div v-if="isLoading" class="w-60 h-24">
          <div
            class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5"
          >
            <div class="w-4 bg-gray-400 h-4 rounded-full" />
            <div class="flex flex-col space-y-3">
              <div class="w-36 bg-gray-400 h-6 rounded-md" />
              <div class="w-24 bg-gray-400 h-6 rounded-md" />
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col gap-5 w-full">
          <div v-for="paymentMethod in paymentMethods" :key="paymentMethod.id">
            <div
              v-if="paymentMethod.translated?.name !== 'PayPal'"
              class="mb-5 h-px w-full bg-gray-200"
            ></div>
            <div class="flex cursor-pointer items-center">
              <input
                :id="paymentMethod.id"
                v-model="formData.paymentMethod"
                :value="paymentMethod.id"
                :checked="selectedPaymentMethod?.id === paymentMethod.id"
                name="payment-method"
                type="radio"
                class="m-0 relative h-4.5 w-4.5 appearance-none rounded-full border-2 border-solid border-primary after:content-[''] checked:border-primary checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:bg-primary checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer"
              />
              <div class="ml-2 text-3.5 font-bold text-gray800">
                {{ paymentMethod.translated?.name }}
              </div>
            </div>
            <div
              v-if="paymentMethod.translated?.name === 'PayPal'"
              class="flex items-center gap-1 mt-5"
            >
              <img src="/svgs/paypal.svg" class="h-8 w-8" />
              <img src="/svgs/paypal1.svg" />
            </div>
            <div
              v-if="paymentMethod.translated?.name === 'PayPal'"
              class="mt-5 text-3.5 font-medium text-gray800"
              v-text="accountT('$payment.payByPaypal')"
            />
            <div
              v-if="
                paymentMethod.translated?.name ===
                'Credit card (masterCard, VISA, American Express)'
              "
              class="pl-5 ml-2 mt-5 text-3.5 font-medium text-gray-800"
              v-text="accountT('$payment.securePayment')"
            />
            <div
              v-if="paymentMethod.translated?.name === 'Payment in Advance'"
              class="mt-5 text-3.5 font-medium text-gray-800"
              v-text="accountT('$payment.bankTransfer')"
            />
            <div
              v-if="paymentMethod.translated?.name === 'Payment in Advance'"
              class="mt-5 text-3.5 font-medium text-gray-800"
              v-text="accountT('$payment.notice')"
            />
            <div
              v-if="paymentMethod.translated?.name === 'SOFORT (Klarna)'"
              class="mt-5 text-3.5 font-medium text-gray-800"
              v-text="accountT('$payment.toKlarna')"
            />
            <div
              v-if="paymentMethod.translated?.name === 'Invoice'"
              class="mt-5 text-3.5 font-medium text-gray-800"
              v-text="accountT('$payment.conveniently')"
            />
          </div>
          <button
            class="w-full mt-3 rounded-1.25 bg-primary duration-300 hover:opacity-50 h-10.5 border-0 flex justify-center items-center text-white text-3.5 md:font-bold font-medium cursor-pointer"
            type="submit"
            data-testid="account-payment-submit-button"
            v-text="accountT('$payment.save')"
          />
        </div>
      </form>
    </div>
  </div>
</template>
