<script setup lang="ts">
const router = useRouter()
const newsletter = ref(false)
const { t: accountT } = useMessages('account')
const {
  user,
  loadSalutation,
  userDefaultPaymentMethod,
  userDefaultShippingAddress,
} = useUser()
const {
  isNewsletterSubscriber,
  newsletterUnsubscribe,
  newsletterSubscribe,
  getNewsletterStatus,
} = useNewsletter()
useBreadcrumbs([
  {
    name: 'account',
    path: '/account',
  },
])
async function updateNewsletterStatus() {
  try {
    if (!newsletter.value) {
      await newsletterSubscribe({
        email: user.value?.email || '',
        option: 'subscribe',
      })
      console.log('newsletter.messages.newsletterSubscribed')
      // pushSuccess(t("newsletter.messages.newsletterSubscribed"));
    } else {
      await newsletterUnsubscribe(user.value?.email || '')
      console.log('newsletter.messages.newsletterUnsubscribed')
      // pushSuccess(t("newsletter.messages.newsletterUnsubscribed"));
    }
  } catch (error) {
    console.log('error', error)
    // pushError(t("messages.error"));
  } finally {
    getNewsletterStatus().then(() => {
      newsletter.value = isNewsletterSubscriber.value
    })
  }
}
onBeforeMount(async () => {
  getNewsletterStatus().then(() => {
    newsletter.value = isNewsletterSubscriber.value
  })
  if (user?.value?.salutationId) {
    await loadSalutation(user.value.salutationId)
  }
})

const { orders, loadOrders } = useCustomerOrders()
onMounted(async () => {
  loadOrders()
})

function getOrderDateFormat(orderdate: any) {
  return new Date(orderdate).toLocaleDateString('en-US')
}
</script>

<template>
  <main>
    <LayoutBreadcrumbs />
    <div class="max-w-360 m-auto md:mt-6 mt-5 px-5 pb-30">
      <div
        class="md:text-6 text-3.5 font-bold text-black"
        v-text="accountT('$account.overview')"
      />
      <div class="md:mt-10 mt-5">
        <h1 class="md:text-8 text-4 font-bold text-black">
          {{ accountT('$account.welcome') }}, {{ user?.firstName }}
        </h1>
        <p
          class="mt-5 text-3.5 font-medium text-black"
          v-text="accountT('$account.description')"
        />
        <div
          class="md:mt-10 mt-5 grid lg:grid-cols-3 grid-cols-1 gap-5 justify-center items-center"
        >
          <div class="h-67 rounded-2.5 bg-white shadow-1.5xl">
            <p
              class="bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 h-16 flex items-center text-center justify-center text-white text-4 font-bold uppercase"
              v-text="accountT('$account.personalData')"
            />
            <div class="p-5 h-52 flex flex-col justify-between">
              <div class="flex flex-col">
                <p class="text-gray-800 text-4 font-medium">
                  {{ user?.firstName }} {{ user?.lastName }}
                </p>
                <p class="mt-5 text-3.5 font-medium text-gray-800">
                  {{ user?.email }}
                </p>
              </div>
              <button
                class="w-full py-3.5 rounded-1 bg-primary flex justify-center items-center text-white text-3.5 font-medium border-none cursor-pointer border-none duration-300 hover:opacity-80"
                @click="router.push('/account/profile')"
                v-text="accountT('$account.changePersonal')"
              />
            </div>
          </div>
          <div class="h-67 rounded-2.5 bg-white shadow-1.5xl">
            <p
              class="bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 h-16 flex items-center text-center justify-center text-white text-4 font-bold uppercase"
              v-text="accountT('$account.paymentMethod')"
            />
            <div class="p-5 h-52 flex flex-col justify-between">
              <div class="flex flex-col">
                <p class="text-gray-800 text-4 font-medium">
                  {{ userDefaultPaymentMethod?.name }}
                </p>
                <p class="mt5 text-3.5 font-medium text-gray-800">
                  {{ userDefaultPaymentMethod?.description }}
                </p>
              </div>
              <button
                class="w-full py-3.5 rounded-1 bg-primary flex justify-center items-center text-white text-3.5 font-medium border-none cursor-pointer border-none duration-300 hover:opacity-80"
                @click="router.push('/account/payment')"
                v-text="accountT('$account.changePayment')"
              />
            </div>
          </div>
          <div class="h-67 rounded-2.5 bg-white shadow-1.5xl">
            <p
              class="bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 h-16 flex items-center text-center justify-center text-white text-4 font-bold uppercase"
              v-text="accountT('$account.invoiceAddress')"
            />
            <div class="p-5 h-52 flex flex-col justify-between">
              <div class="flex flex-col gap1">
                <p class="text-gray-800 text-4 font-medium">
                  {{ userDefaultShippingAddress?.firstName }}
                  {{ userDefaultShippingAddress?.lastName }}
                </p>
                <p class="text-3.5 font-bold text-gray-800">
                  {{ userDefaultShippingAddress?.street }}
                </p>
                <p class="text-3.5 font-bold text-gray-800">
                  {{ userDefaultShippingAddress?.zipcode }}
                </p>
                <p class="text-3.5 font-bold text-gray-800">
                  {{ userDefaultShippingAddress?.city }}
                </p>
              </div>
              <button
                class="w-full py-3.5 rounded-1 border-none duration-300 hover:opacity-80 bg-primary flex justify-center items-center text-white text-3.5 font-medium border-none cursor-pointer"
                @click="router.push('/account/address')"
                v-text="accountT('$account.changeAddress')"
              />
            </div>
          </div>
          <div class="h-67 rounded-2.5 bg-white shadow-1.5xl">
            <p
              class="bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 h-16 flex items-center text-center justify-center text-white text-4 font-bold uppercase"
            >
              YOUR ORDERS
            </p>
            <div class="p5 h52 flex flex-col justify-between">
              <div
                v-for="order in orders.reverse().slice(0, 2)"
                :key="order.id"
                class="flex justify-between items-center"
              >
                <p class="text-gray-800 text-3.5 font-medium">
                  Date:
                  {{ getOrderDateFormat(order.orderDate) }}
                  &nbsp;&nbsp;Total: € {{ order.amountTotal }}
                </p>
                <div
                  :class="
                    order.stateMachineState.name === 'Open'
                      ? 'w-fit px-3 py-1 rounded-full bg-green-300 text-3 font-medium text-green-400'
                      : 'w-fit px-3 py-1 rounded-full bg-[#E5D18A]  text-3 font-medium  text-[#9A6E19]'
                  "
                >
                  {{ order.stateMachineState.name }}
                </div>
              </div>
              <button
                class="w-full py-3.5 rounded-1 border-none duration-300 hover:opacity-80 bg-primary flex justify-center items-center text-white text-3.5 font-medium border-none cursor-pointer"
                @click="router.push('/account/orders')"
              >
                View all orders
              </button>
            </div>
          </div>
        </div>
        <!-- <div class="md:mt-10 mt-5 flex justify-center items-center gap-5">
          <div class="h-67 rounded-2.5 bg-white shadow-1.5xl">
            <p
              class="bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 h-16 flex items-center text-center justify-center text-white text-4 font-bold uppercase"
            >
              YOUR ORDERS
            </p>
            <div class="p5 h52 flex flex-col justify-between">
              <div
                class="flex justify-between items-center"
                v-for="order in orders.reverse().slice(0, 2)"
                :key="order.id"
              >
                <p class="text-gray-800 text-3.5 font-medium">
                  Date:
                  {{ getOrderDateFormat(order.orderDate) }}
                  Total: € {{ order.amountTotal }}
                </p>
                <div
                  :class="
                    order.stateMachineState.name === 'Open'
                      ? 'w-fit px-3 py-1 rounded-full bg-green-300 text-3 font-medium text-green-400'
                      : 'w-fit px-3 py-1 rounded-full bg-[#E5D18A]  text-3 font-medium  text-[#9A6E19]'
                  "
                >
                  {{ order.stateMachineState.name }}
                </div>
              </div>
              <button
                class="w-full py-3.5 rounded-1 border-none duration-300 hover:opacity-80 bg-primary flex justify-center items-center text-white text-3.5 font-medium border-none cursor-pointer"
                @click="router.push('/account/orders')"
              >
                View all orders
              </button>
            </div>
          </div>
        </div> -->
        <h1
          class="mt-8 text-gray-800 text-5 font-bold uppercase"
          v-text="accountT('$account.setting')"
        />
        <div
          class="mt-5 text-gray-800 text-3.5 font-medium flex items-center gap-2"
        >
          <div
            class="!min-w-4 !min-h-4 w-4 h-4 rounded-1 border border-solid border-gray-700 bg-white cursor-pointer"
            @click="updateNewsletterStatus"
          >
            <img
              v-if="newsletter"
              src="/svgs/checked.svg"
              class="checked-icon"
            />
          </div>
          <p v-text="accountT('$account.settingDescription')" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
