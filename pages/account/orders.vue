<script setup lang="ts">
import 'vue-toast-notification/dist/theme-sugar.css'

const { orders, loadOrders } = useCustomerOrders()
const { currency } = useSessionContext()
const router = useRouter()
const { t: accountT } = useMessages('account')

onMounted(async () => {
  loadOrders()
})
function getOrderDateFormat(orderdate: any) {
  return new Date(orderdate).toLocaleDateString('en-US')
}
const orderslist = ref(10)
function showMore() {
  orderslist.value = orders?.value.length
}
function less() {
  orderslist.value = 10
}
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
  <main>
    <LayoutBreadcrumbs />
    <div class="max-w-360 m-auto md:mt-6 mt-4 px-5 md:pb-30 pb-8">
      <h1
        class="text-black md:text-6 text-3.5 font-bold"
        v-text="accountT('$orders.title')"
      />
      <div class="max-w-360 md:mt-5 mt-10 m-auto">
        <div
          class="w-full border-l-0.5 border-solid border-r-0.5 border-t-0.5 border-gray-700 border-b-0"
        >
          <div
            class="py-5 md:pl-6 pl-5 flex flex-row justify-center items-center border-b-0.5 border-b-solid border-gray-800 gap-5"
          >
            <p
              class="w-1/6 md:block hidden text-3.5 font-medium text-gray-800"
              v-text="accountT('$orders.number')"
            />
            <p
              class="md:w-1/6 w-1/3 text-3.5 font-medium text-gray-800"
              v-text="accountT('$orders.date')"
            />
            <p
              class="md:w-1/6 w-1/3 md:block hidden text-3.5 font-medium text-gray-800"
              v-text="accountT('$orders.articles')"
            />
            <p
              class="md:w-1/6 w-1/3 text-3.5 font-medium text-gray-800 flex flex-row items-center"
            >
              {{ accountT('$orders.total')
              }}<span class="md:block hidden"
                >&nbsp;{{ accountT('$orders.amount') }}</span
              >
            </p>
            <p
              class="md:w-1/6 w-1/3 text-3.5 font-medium text-gray-800"
              v-text="accountT('$orders.status')"
            />
          </div>
          <div
            v-for="order in orders.slice(0, orderslist)"
            :key="order.id"
            class="md:pl-6 pl-5 py-4 flex flex-row justify-center items-center border-b-0.5 border-b-solid border-b-gray-800 cursor-pointer gap-5"
            @click="router.push(`/order/${order.id}`)"
          >
            <p
              class="w-1/6 md:block hidden text-3.5 font-medium text-gray-800 proportional-nums"
            >
              {{ order.orderNumber }}
            </p>
            <p
              class="md:w-1/6 w-1/3 text-3.5 font-medium text-gray-800 proportional-nums"
            >
              {{ getOrderDateFormat(order.orderDate) }}
            </p>
            <p
              class="w-1/6 md:block hidden text-3.5 font-medium text-gray-800 proportional-nums"
            >
              <OrderArticles :order-id="order?.id" />
            </p>
            <p
              class="md:w-1/6 w-1/3 text-3.5 font-medium text-gray-800 proportional-nums"
            >
              {{ currency?.name }} {{ order.amountTotal }}
            </p>
            <p
              class="md:w-1/6 w-1/3 text-3.5 font-medium text-gray-800 proportional-nums"
            >
              <OrderStatusTag :status="order.stateMachineState.name" />
            </p>
          </div>
        </div>
        <div v-if="orders.length > orderslist" class="mt-8" @click="showMore">
          <button
            class="md:w-113 w-full h-10.5 flex justify-center items-center rounded-1.25 bg-primary text-3.5 font-medium text-white border-none cursor-pointer"
            v-text="accountT('$orders.viewMore')"
          />
        </div>
        <div v-if="orders.length === orderslist" class="mt-8" @click="less">
          <button
            class="md:w-113 w-full h-10.5 flex justify-center items-center rounded-1.25 bg-primary text-3.5 font-medium text-white border-none cursor-pointer"
            v-text="accountT('$orders.less')"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
