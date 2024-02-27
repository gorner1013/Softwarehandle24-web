<script setup lang="ts">
import { getSmallestThumbnailUrl } from '@shopware-pwa/helpers-next'
import type { LineItem, Price, Product } from '@shopware-pwa/types'

const {
  cart,
  cartItems,
  removeItem,
  changeProductQuantity,
  totalPrice,
  shippingTotal,
  subtotal,
  refreshCart,
  isEmpty,
} = useCart()

const { t: checkoutT } = useMessages('checkout')

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
const { push } = useRouter()
const terms = ref(false)
const { isLoggedIn, isGuestSession } = useUser()
const isLoading = ref(false)
const isOrderLoading = reactive<{ [key: string]: boolean }>({})
onMounted(async () => {
  // getPaymentMethods();
  isLoading.value = false
})
const { user, userDefaultShippingAddress } = useUser()
const { createOrder } = useCheckout()

const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value)
const price = computed(() => cart.value?.price as unknown as Price)

async function removeCartItem(cartItem: LineItem) {
  isLoading.value = true
  await removeItem(cartItem)
  isLoading.value = false
}
useBreadcrumbs([
  {
    name: 'checkout',
    path: '/checkout',
  },
  {
    name: 'order',
    path: '/checkout/order',
  },
])

async function selectitem(cartItem: LineItem) {
  isLoading.value = true
  const itemquantity = Number(cartItem.quantity)
  changeProductQuantity({ id: cartItem.id, quantity: itemquantity })
  isLoading.value = false
}

const placeOrderTriggered = ref(false)
async function placeOrder() {
  placeOrderTriggered.value = true

  isOrderLoading.placeOrder = true
  const order = await createOrder()
  isOrderLoading.placeOrder = false
  await push(`/order/${order.id}`)
  refreshCart()
}

async function term() {
  try {
    if (!terms.value) {
      terms.value = true
    } else {
      terms.value = false
    }
    console.log(terms.value)
  } catch (error) {
    console.log('error', error)
  }
}
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="flex max-w-360 m-auto md:mt-6 mt-5 items-center gap-10 px-5">
    <h1
      class="text-black md:text-6 text-3.5 font-bold"
      v-text="checkoutT('$order.title')"
    />
  </div>
  <div class="max-w-240 flex items-center justify-center mx-auto mt-5 px-10">
    <div class="flex flex-col items-center justify-center">
      <div
        class="flex items-center w-14 h-14 justify-center rounded-full border border-solid border-gray-700 cursor-pointer bg-white text-gray-800"
      >
        <img src="/svgs/checked.svg" class="checked-icon w-8 h-8" />
      </div>
    </div>
    <div class="h-px w-full bg-gray-700"></div>
    <div
      class="flex flex-col items-center justify-center"
      @click="router.push('/checkout/payment')"
    >
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
        3
      </p>
    </div>
  </div>
  <div class="max-w-240 flex items-center justify-between mx-auto mt-5 px-5">
    <div class="flex flex-col items-center justify-center">
      <p
        class="text-center text-3.5 font-semibold gray-800"
        v-text="checkoutT('customerData')"
      />
    </div>
    <div class="flex flex-col items-center justify-center">
      <p
        class="text-center text-3.5 font-semibold gray-800"
        v-text="checkoutT('paymentMethod')"
      />
    </div>

    <div class="flex flex-col items-center justify-center">
      <p
        class="text-center text-3.5 font-semibold gray-800"
        v-text="checkoutT('finalizeOrder')"
      />
    </div>
  </div>
  <div v-if="!isEmpty" class="max-w-360 m-auto md:mt-10 mt-5 px-5 flex flex-col gap-5">
    <div class="flex flex-col w-full">
      <div
        class="border-x-0.5 border-x-solid border-0.5 border-solid border-gray-700 text-gray-800 text-3.5 hidden md:flex items-center px-6 font-medium py-5.5"
      >
        <p class="flex-2/5.3" v-text="checkoutT('$order.article')" />
        <p class="flex-1/5.3" v-text="checkoutT('$order.amount')" />
        <p class="flex-1/5.3" v-text="checkoutT('$order.unitPrice')" />
        <p class="flex-1/5.3" v-text="checkoutT('$order.totalPrice')" />
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
                {{ checkoutT('$order.itemNumber') }}
                {{ (cartItem.payload as Product)?.productNumber }}
              </p>
            </div>
          </div>
          <div class="flex-1/5.3 text-3.5 font-medium">
            <select
              v-model="cartItem.quantity"
              :disabled="isLoading"
              class="cursor-pointer w-50 px-6 py-4 text-3.5 text-black bg-white border border-solid rounded border-primary outline-none"
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
                  {{ checkoutT('$order.itemNumber') }}
                  {{ (cartItem.payload as Product)?.productNumber }}
                </p>
                <p class="text-3 font-medium">Delivery time 12 - 24 hours</p>
              </div>
              <div
                class="flex-0.2/1.2 cursor-pointer"
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
                  class="cursor-pointer w-20 pl-4 pr-6 py-2 text-3.5 text-black bg-white border border-solid rounded border-primary"
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
                  <p v-text="checkoutT('$order.unit')" />
                  <p>EUR {{ cartItem.price?.unitPrice.toFixed(2) }}</p>
                </div>
                <div class="flex justify-between text-3.5 font-medium">
                  <p v-text="checkoutT('$order.total')" />
                  <p>EUR {{ cartItem.price?.totalPrice.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="md:mt-10 mt-5 w-full gap-5 mb-5 flex flex-col md:flex-row items-start justify-between"
    >
      <div class="flex w-full md:w-130">
        <input
          :placeholder="checkoutT('$order.itemNumPlaceholder')"
          type="text"
          class="flex-1 px-5 py-4 border border-solid border-rd-l-2.5 border-gray-700 bg-white text-black text-3.5 focus-visible:outline-none"
        />
        <button
          class="bg-primary border-none text-6 px-4 duration-300 hover:opacity-80 border-rd-r-2.5 text-white"
        >
          +
        </button>
      </div>
      <div class="w-full md:w-130">
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
            <p class="text-4 font-bold">{{ checkoutT('$order.total') }}:</p>
            <p class="text-4 font-bold">€ {{ changedTotal }}</p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="md:mt-10 mt-5 w-full h-full gap-5 mb-5 flex flex-col min-w-full md:flex-row items-start justify-between"
    >
      <div class="w-full md:w-210">
        <div class="rounded-2.5 bg-white shadow-1.5xl p-5">
          <p
            class="gray-800 flex items-center text-left text-4 font-bold uppercase"
            v-text="checkoutT('$order.sectionOne.title')"
          />
          <div class="w-full gap-5">
            <div class="flex flex-col w-full md:flex-row mt-7.5 gap-5">
              <div
                class="color-black md:w-1/2 border border-solid rounded-1 border-gray-700"
              >
                <div class="flex flex-col gap-2.5 p-5">
                  <p class="text-gray-800 text-3.5 font-bold">
                    {{ userDefaultShippingAddress?.salutation?.displayName }}
                    {{ userDefaultShippingAddress?.firstName }}
                    {{ userDefaultShippingAddress?.lastName }}
                  </p>
                  <p class="text-3.5 font-bold text-gray-800">
                    {{ userDefaultShippingAddress?.street }}
                  </p>
                  <p class="text-gray-800 text-3.5 font-bold">
                    {{ userDefaultShippingAddress?.zipcode }}
                    {{ userDefaultShippingAddress?.city }}
                  </p>
                  <p class="text-3.5 font-bold text-gray-800">
                    {{ userDefaultShippingAddress?.country?.name }}
                  </p>
                </div>
              </div>
              <div
                class="color-black md:w-1/2 border border-solid rounded-1 border-gray-700"
              >
                <div class="flex flex-col gap-2.5 p-5">
                  <p
                    class="gray-800 text-3.5 font-bold"
                    v-text="checkoutT('$order.sectionOne.deliveryAddress')"
                  />
                  <p class="text-4 font-medium font-bold gray-800">
                    {{ user?.email }}
                  </p>
                  <p
                    class="gray-800 text-3.5 font-medium"
                    v-text="checkoutT('$order.sectionOne.intro')"
                  />
                </div>
              </div>
            </div>
            <div class="flex w-full mt-7.5 gap-5">
              <button
                class="w-full md:w-1/2 py-3.5 rounded-1 bg-gray-800 duration-300 hover:opacity-80 flex justify-center items-center text-white text-3.5 font-medium border-none cursor-pointer"
                @click="router.push('/account/addressEdit')"
                v-text="checkoutT('$order.sectionOne.btn')"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="w-full h-full md:w-130">
        <div class="rounded-2.5 bg-white shadow-1.5xl p-5">
          <p
            class="gray-800 flex items-center text-left text-4 font-bold uppercase"
            v-text="checkoutT('$order.sectionTwo.title')"
          />
          <div class="w-full flex flex-col justify-between gap-5 mt-7.5">
            <div class="flex flex-col gap-3">
              <p
                class="gray-800 text-4 font-medium"
                v-text="checkoutT('$order.sectionTwo.typePayment')"
              />
              <p
                class="text-4 font-bold gray-800"
                v-text="checkoutT('$order.sectionTwo.shipping')"
              />
            </div>
            <button
              class="w-full md:mt-40.5 lg:mt-30 py-3.5 rounded-1 duration-300 hover:opacity-80 bg-gray-800 flex justify-center items-center text-white text-3.5 font-medium border-none cursor-pointer"
              @click="router.push('/checkout/payment')"
              v-text="checkoutT('$order.sectionTwo.btn')"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="w-full">
      <div class="h-auto rounded-2.5 bg-white shadow-1.5xl p-5">
        <div
          class="gray-800 flex items-center text-left text-4 font-bold uppercase"
          v-text="checkoutT('$order.sectionThree.title')"
        />
        <div class="flex flex-col justify-between mt-7.5 gap-5">
          <div class="flex flex-col gap-2.5">
            <div class="gray-800 text-4 font-medium">
              {{ checkoutT('$order.sectionThree.note') }}
              <a href="" class="text-primary hover:underline">{{
                checkoutT('$order.sectionThree.recall')
              }}</a>
              {{ checkoutT('$order.sectionThree.whenOrder') }}
            </div>
            <div
              class="text-gray-800 text-3.5 font-medium flex items-center gap-2"
            >
              <div
                class="!min-w-4 !min-h-4 w-4 h-4 rounded-1 border border-solid border-gray-700 bg-white cursor-pointer"
                @click="term()"
              >
                <img
                  v-if="terms"
                  src="/svgs/checked.svg"
                  class="checked-icon"
                />
              </div>
              <div class="gray-800 text-4 font-medium">
                {{ checkoutT('$order.sectionThree.haveRead') }}
                <a href="" class="text-primary hover:underline">{{
                  checkoutT('$order.sectionThree.agb')
                }}</a>
                of
                {{ checkoutT('$order.sectionThree.agree') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      :disabled="!isUserSession || terms === false"
      type="button"
      :class="{
        grayscale: !isUserSession || terms === false,
        'opacity-50 cursor-not-allowed hover:bg-brand-primary':
          !isUserSession || terms === false,
        'animate-pulse': isOrderLoading.placeOrder,
      }"
      class="md:w-1/3 mt-5 mb-20 py-3.5 rounded-1 bg-primary flex justify-center duration-300 hover:opacity-80 items-center text-white text-3.5 font-medium border-none cursor-pointer"
      @click="placeOrder"
      v-text="checkoutT('$order.btn')"
    />
  </div>
  <div v-else class="container mx-auto w-1/2 mb-24 mt-24 text-center">
    <h1
      class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
    >
    There is nothing to checkout,
      <span
        class="underline underline-offset-3 decoration-8 decoration-green-400 dark:decoration-green-600"
        >the cart is empty
      </span>
    </h1>
    <div class="mt-12 text-center">
      <a
        href="/"
        class="inline-flex justify-center items-center py-2 px-4 text-base font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:ring-primary"
      >
        Back to homepage
        <div class="i-carbon-undo ml-2" />
      </a>
    </div>
  </div>
</template>

<style scoped></style>
