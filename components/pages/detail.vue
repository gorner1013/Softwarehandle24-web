<script setup lang="ts">
import { minLength } from '@vuelidate/validators'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type { OnApproveData } from '@paypal/paypal-js'
import { loadScript } from '@paypal/paypal-js'
import type { Product } from '@shopware-pwa/types'
import { useProductSearch } from '@shopware-pwa/composables-next'
import { getTranslatedProperty } from '@shopware-pwa/helpers-next'
import { useVuelidate } from '@vuelidate/core'
import { useModal } from '~/composables/useModal'
import { useCartNotification } from '~/composables/useCartNotification'
import { useMediaQuery } from '@vueuse/core'

const props = defineProps<{ product: Product }>()
const { t: pagesT } = useMessages('pages')
const $toast = useToast()
const { product } = toRefs(props)
const { search } = useProductSearch()
const { pushSuccess } = useNotifications()
const { codeErrorsNotification } = useCartNotification()
const shoppingCartModalView = useModal()
const isLargeScreen = useMediaQuery('(min-width: 1024px)')

const targetId = computed(() => {
 return isLargeScreen.value ? '#review' : '#reviewMobile'
})

const productResponse = await search(props.product.id, {
  criteria: {
    associations: {
      manufacturer: {},
    },
  },
})

const { productReviews, addReview, loadProductReviews } =
  useProductReviews(product)
await loadProductReviews()

const { paymentMethods, getPaymentMethods, createOrder } = useCheckout()
const { setPaymentMethod } = useSessionContext()
const { apiInstance } = useShopwareContext()
const { addToCart, quantity } = useAddToCart(product)

const tab = ref('Description')
async function addToCartProxy() {
  await addToCart()
  codeErrorsNotification()
  pushSuccess(`${props.product?.translated?.name} has been added to cart.`)
  shoppingCartModalView.open()
}
const loading = ref(true)
onMounted(() => {
  loading.value = false
})

const paypalMethod = computed(() => {
  return paymentMethods.value?.find(
    (method) => method.shortName === 'pay_pal_payment_handler',
  )
})
const isLoading = ref(true)
const route = useRoute()
const orderCreated = ref()
const { refreshCart } = useCart()
const redirectPaymentUrl = ref()
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
  paypal
    .Buttons({
      style: {
        label: 'buynow',
      },
      onError(err: any) {
        console.warn('[PayPal > App.vue][onError]', err)
      },
      createOrder: async () => {
        if (!paypalMethod.value) {
          return ''
        }
        // 1. set the payment method id in the context PATCH /context -> setPaymentMethod
        // 2. add product to cart -> addToCart
        // 3. create order -> /store-api/paypal/express/create-order
        await setPaymentMethod(paypalMethod.value)
        await addToCart()

        const response = await apiInstance.invoke.post<{ token: string }>(
          '/store-api/paypal/express/create-order?isPayPalExpressCheckout=1',
        )
        return response?.data?.token
      },

      // Finalize the transaction after payer approval
      // Will be called if the payment process is approved by paypal
      onApprove: async (data: OnApproveData) => {
        console.warn('onApprove', data)
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
    .render('#paypal-buttons')
}

const orderId = Array.isArray(route?.query?.order)
  ? route?.query?.order.shift()
  : route?.query?.order

watch(
  () => isLoading.value,
  (isLoading) => {
    if (!isLoading && !orderId) {
      renderPaypalButtons()
    }
  },
)

onMounted(async () => {
  if (!orderId) {
    await getPaymentMethods()
    isLoading.value = false
    return
  }
  isLoading.value = false
})

const initialState = {
  data: {
    title: '',
    content: '',
    points: undefined,
  },
}

const state = reactive(JSON.parse(JSON.stringify(initialState)))

const Istitle = computed(() => ({
  data: {
    title: {
      // required,
      minLength: minLength(5),
    },
  },
}))
const Iscontent = computed(() => ({
  data: {
    content: {
      // required,
      minLength: minLength(40),
    },
  },
}))

const $v = useVuelidate(Istitle, state)
const $c = useVuelidate(Iscontent, state)
async function invokeSubmit() {
  $v.value.$touch()
  const istitle = await $v.value.$validate()
  const iscontent = await $c.value.$validate()
  if (!istitle) {
    $toast.error('Please enter a title of at least 5 characters!', {
      position: 'top-right',
    })
    return
  }
  if (!iscontent) {
    $toast.error('Please enter a content of at least 40 characters!', {
      position: 'top-right',
    })
    return
  }
  if (istitle && iscontent) {
    loading.value = true
    await addReview(state.data)
    state.data = JSON.parse(JSON.stringify(initialState.data))
    await loadProductReviews()
    loading.value = false
    $toast.success('Create Review Successfully!', {
      position: 'top-right',
    })
  }
  loading.value = false
}

const reviewlist = ref(3)

function showMore() {
  reviewlist.value = productReviews?.value.length
}
function hidden() {
  reviewlist.value = 3
}

const terms = ref(false)
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
  <div class="w-full h-auto">
    <div class="w-full">
      <LayoutBreadcrumbs />
      <div class="max-w-360 mx-auto mt-6 px-5">
        <div class="max-w-360 ma mt-2.5">
          <h1 class="text-gray-800 text-8 font-medium leading-[132.4%]">
            {{ getTranslatedProperty(product, 'name') }}
          </h1>
          <a class="mt-1 flex hover:underline hover:text-primary" @click = " tab = 'Reviews'" :href="targetId">
            <div v-for="i in 5" :key="i">
              <i
                v-if="product.ratingAverage / 2 >= i"
                class="fa-solid fa-star fa-lg text-primary"
              ></i>
            </div>
            <div>
              <i
                v-if="product.ratingAverage % 2"
                class="fa-solid fa-star-half-stroke fa-lg text-primary"
              ></i>
            </div>
            <div v-if="product.ratingAverage % 2 === 0" class="flex">
              <div v-for="i in 5" :key="i">
                <i
                  v-if="product.ratingAverage / 2 < i"
                  class="fa-regular fa-star fa-lg text-primary"
                ></i>
              </div>
            </div>
            <div v-if="product.ratingAverage % 2 === 1" class="flex">
              <div v-for="i in 5" :key="i">
                <i
                  v-if="product.ratingAverage / 2 < i - 1"
                  class="fa-regular fa-star fa-lg text-primary"
                ></i>
              </div>
            </div>

            <p class="ml-4">
              ({{ productReviews?.length }} {{ pagesT('$detail.reviews') }})
            </p>
          </a>
          <div class="mt-7.5 flex flex-col lg:flex-row justify-between gap-5">
            <div class="lg:w-220 w-full flex flex-col">
              <div class="w-full text-center flex justify-center items-center">
                <img
                  :src="product.cover.media.url"
                  alt="product-image"
                  class="h-60 lg:h-90 xl:h-130 object-cover"
                />
              </div>
              <div class="w-full hidden lg:block" id="review">
                <div class="lg:mt-20 flex px-5 sm:px-12">
                  <div
                    class="px-3.75 pb-2.5 text-black text-4 leading-[normal] font-medium not-italic cursor-pointer"
                    :class="
                      tab === 'Description'
                        ? 'active   b-b-2 b-b-solid b-b-primary   '
                        : 'b-white'
                    "
                    @click="tab = 'Description'"
                    v-text="pagesT('$detail.descriptionTab')"
                  />
                  <div
                    class="px-3.75 pb-2.5 text-black text-4 leading-[normal] font-medium not-italic cursor-pointer"
                    :class="
                      tab === 'Reviews'
                        ? 'active b-b-2 b-b-solid b-b-primary  '
                        : 'b-white'
                    "
                    @click="tab = 'Reviews'"
                  >
                    {{ pagesT('$detail.reviewTab.title') }} ({{ productReviews?.length }})
                  </div>
                </div>
                <div class="w-full bg-gray-200 px-5 sm:px-12">
                  <div
                    v-if="tab === 'Description'"
                    class="text-black mb-12.5 prose max-w-220 py-10"
                    v-html="product.description"
                  ></div>
                  <div v-if="tab === 'Reviews'" class="pt-10 w-full">
                    <div v-if="productReviews?.length">
                      <div
                        v-for="review in productReviews.slice(0, reviewlist)"
                        :key="review.id"
                        class="b-rd-2.5 border b-solid b-gray-400 bg-white p-5 mb-5 w-full"
                      >
                        <div class="mt-1 flex">
                          <div v-for="i in 5" :key="i">
                            <i
                              v-if="review.points / 2 >= i"
                              class="fa-solid fa-star fa-lg text-primary"
                            ></i>
                          </div>
                          <div>
                            <i
                              v-if="review.points % 2"
                              class="fa-solid fa-star-half-stroke fa-lg text-primary"
                            ></i>
                          </div>
                          <div v-if="review.points % 2 === 0" class="flex">
                            <div v-for="i in 5" :key="i">
                              <i
                                v-if="review.points / 2 < i"
                                class="fa-regular fa-star fa-lg text-primary"
                              ></i>
                            </div>
                          </div>
                          <div v-if="review.points % 2 === 1" class="flex">
                            <div v-for="i in 5" :key="i">
                              <i
                                v-if="review.points / 2 < i - 1"
                                class="fa-regular fa-star fa-lg text-primary"
                              ></i>
                            </div>
                          </div>
                        </div>
                        <div class="mt-2.25 flex items-center">
                          <p
                            class="text-gray-800 text-3.5 not-italic font-bold leading-[132.4%] mr-3.25"
                            v-text="pagesT('$detail.reviewTab.blabla')"
                          />
                          <p
                            class="text-gray-500 text-center text-4 not-italic font-medium leading-[132.4%]"
                          >
                            {{ review.createdAt?.split('T')[0] }}
                          </p>
                        </div>
                        <p
                          class="text-gray-800 text-4 not-italic font-bold leading-[132.4%] mt-2"
                        >
                          {{ review.title }}
                        </p>
                        <p class="text-gray-800 text-3.5 font-medium">
                          {{ review.content }}
                        </p>
                      </div>
                      <div
                        v-if="productReviews.length > reviewlist"
                        class="text-gray-800 text-3.5 not-italic font-medium leading-[132.4%] my-5 ml-5 underline"
                        @click="showMore"
                        v-text="pagesT('$detail.reviewTab.showMore')"
                      />
                      <div
                        v-if="productReviews.length === reviewlist"
                        class="text-gray-800 text-3.5 not-italic font-medium leading-[132.4%] my-5 ml-5 underline"
                        @click="hidden"
                        v-text="pagesT('$detail.reviewTab.less')"
                      />
                    </div>
                    <div
                      class="text-gray-800 text-4 not-italic font-bold leading-[132.4%] mt-2"
                      v-text="pagesT('$detail.reviewTab.subTitle')"
                    />
                    <div class="mt-5 flex">
                      <div
                        class="w-12.5 h-12.5 border-rd-l-2.5 bg-primary flex justify-center items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M1 21L12 2L23 21H1ZM12 18C12.2833 18 12.521 17.904 12.713 17.712C12.905 17.52 13.0007 17.2827 13 17C13 16.7167 12.904 16.479 12.712 16.287C12.52 16.095 12.2827 15.9993 12 16C11.7167 16 11.479 16.096 11.287 16.288C11.095 16.48 10.9993 16.7173 11 17C11 17.2833 11.096 17.521 11.288 17.713C11.48 17.905 11.7173 18.0007 12 18ZM11 15H13V10H11V15Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <div
                        class="text-black text-3.5 not-italic font-medium leading-[132.4%] pl-5 bg-white flex items-center h-12.5 w-full border-rd-r-2.5"
                        v-text="pagesT('$detail.reviewTab.description')"
                      />
                    </div>
                    <div class="mt-5.25 text-black">
                      <select
                        v-model="state.data.points"
                        class="px-5 py-3.5 w-full text-black text-3.5 not-italic font-medium leading-[132.4%] border b-solid b-gray-700 bg-white appearance-none"
                      >
                        <option :value="10">
                          10 {{ pagesT('$detail.reviewTab.veryGood') }}
                        </option>
                        <option :value="9">9</option>
                        <option :value="8">8</option>
                        <option :value="7">7</option>
                        <option :value="6">6</option>
                        <option :value="5">5</option>
                        <option :value="4">4</option>
                        <option :value="3">3</option>
                        <option :value="2">2</option>
                        <option :value="1">
                          1 {{ pagesT('$detail.reviewTab.veryBad') }}
                        </option>
                      </select>
                    </div>
                    <div class="mt-5.25">
                      <input
                        v-model="state.data.title"
                        class="box-border pl-5.25 py-3.5 w-full text-black text-3.5 not-italic font-medium leading-[132.4%] border b-solid b-gray-700 bg-white"
                        :placeholder="`${pagesT('$detail.reviewTab.titlePlaceholder')}*`"
                      />
                    </div>
                    <div class="mt-5.25">
                      <textarea
                        v-model="state.data.content"
                        class="box-border pl-5.25 py-3.5 w-full text-black text-3.5 not-italic font-medium leading-[132.4%] border b-solid b-gray-700 bg-white"
                        :placeholder="`${pagesT('$detail.reviewTab.descriptionPlaceholder')}*`"
                      >
                      </textarea>
                    </div>
                    <div
                      class="mt-5.25 text-black text-3.5 not-italic font-medium leading-[132.4%]"
                      v-text="`${pagesT('$detail.reviewTab.fieldMarked')} * ${pagesT('$detail.reviewTab.mandatory')}`"
                    />
                    <div
                      class=" mt-5.25 text-black text-3.5 font-medium flex items-center gap-2"
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
                      <div
                        class=" text-black text-3.5 not-italic font-medium leading-[132.4%] flex"
                      >
                        {{ pagesT('$detail.reviewTab.haveRead') }} &nbsp;
                        <p
                          class="text-primary underline"
                          v-text="pagesT('$detail.reviewTab.privacyPolicy')"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        :disabled="terms === false"
                        type="button"
                        :class="{
                          grayscale: terms === false,
                          'opacity-50 cursor-not-allowed hover:bg-brand-primary':
                            terms === false,
                        }"
                        class="b-rd-6.5 bg-primary py-2.75 px-8 duration-300 hover:opacity-80 text-white text-right text-3.5 not-italic font-medium leading-[123%] b-none mt-8 duration-300 hover:opacity-80 mb-9.5"
                        @click="invokeSubmit"
                        v-text="pagesT('$detail.reviewTab.save')"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="mx-auto h-full lg:w-136.75 max-w-160 w-full p-5 lg:sticky top-0 rounded-2.5 z-1"
            >
              <div class="md:px-9.5 py-11">
                <div class="flex justify-between items-center">
                  <div
                    class="text-gray-800 text-center text-10 not-italic font-bold leading-[132.4%]"
                  >
                    €{{ product.calculatedPrice.unitPrice }}
                  </div>
                  <div class="stroke-1 stroke-gray-800">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="24"
                        cy="24"
                        r="23.5"
                        fill="white"
                        stroke="#333333"
                      />
                      <path
                        d="M24 33.35L22.55 32.03C17.4 27.36 14 24.27 14 20.5C14 17.41 16.42 15 19.5 15C21.24 15 22.91 15.81 24 17.08C25.09 15.81 26.76 15 28.5 15C31.58 15 34 17.41 34 20.5C34 24.27 30.6 27.36 25.45 32.03L24 33.35Z"
                        fill="#333333"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  class="mt-1.5 text-gray-800 text-3.5 font-medium leading-[132.4%]"
                  v-text="pagesT('$detail.dispatch.included')"
                />
                <div
                  class="mt-3.5 text-gray-800 text-4 font-bold leading-[132.4%] not-italic flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    fill="none"
                  >
                    <circle cx="4.5" cy="4.5" r="4.5" fill="#333333" />
                  </svg>
                  <p
                    class="ml-2.25"
                    v-text="pagesT('$detail.dispatch.description')"
                  />
                </div>
                <div
                  class="mt-5.5 xl:justify-between xl:items-center xl:flex max-xl:flex-col"
                >
                  <div class="flex items-center justify-between flex-1 w-full">
                    <div class="w-full">
                      <select
                        v-model="quantity"
                        class="w-full focus-visible:b-1 focus-visible:b-solid focus-visible:b-primary focus-visible:outline-none b-rd-1.25 border b-solid b-primary xl:w-32 h-12 position-relative bg-white text-black p-2 appearance-none"
                      >
                        <option :value="1">1</option>
                        <option :value="2">2</option>
                        <option :value="3">3</option>
                        <option :value="4">4</option>
                      </select>
                    </div>
                  </div>
                  <button
                    class="w-full ml-0 mt-5 b-rd-1.25 bg-primary h-12 flex justify-center items-center cursor-pointer xl:mt-0 xl:w-72 xl:ml-5 duration-300 border-none hover:opacity-80 text-white"
                    :disabled="loading"
                    @click="addToCartProxy"
                  >
                    <span
                      class="text-4 font-medium"
                      v-text="pagesT('$detail.dispatch.addCart')"
                    />
                  </button>
                </div>
                <div
                  id="paypal-buttons"
                  class="mt-7.5 paypal-buttons relative z-10"
                />
                <dl class="mt-3.5 grid grid-cols-2 gap-3">
                  <dt
                    class="w-47.5 text-black text-3.5 font-medium leading-[123%]"
                    v-text="pagesT('$detail.dispatch.articleNumber')"
                  />
                  <dd class="text-black text-3.5 font-normal leading-[123%]">
                    {{ product.productNumber }}
                  </dd>
                  <dt
                    class="w-47.5 text-black text-3.5 font-medium leading-[123%]"
                    v-text="pagesT('$detail.dispatch.manufacturerName')"
                  />
                  <dd class="text-black text-3.5 font-normal leading-[123%]">
                    {{ productResponse.product.manufacturer?.name }}
                  </dd>
                  <dt
                    class="w-47.5 text-black text-3.5 font-medium leading-[123%]"
                    v-text="pagesT('$detail.dispatch.manufacturerNumber')"
                  />
                  <dd class="text-black text-3.5 font-normal leading-[123%]">
                    {{ product.manufacturerNumber }}
                  </dd>
                </dl>
              </div>
            </div>
            <div class="w-full lg:hidden" id="reviewMobile">
              <div class="lg:mt-20 flex px-5 sm:px-12">
                <div
                  class="px-3.75 pb-2.5 text-black text-4 leading-[normal] font-medium not-italic cursor-pointer"
                  :class="
                    tab === 'Description'
                      ? 'active   b-b-2 b-b-solid b-b-primary   '
                      : 'b-white'
                  "
                  @click="tab = 'Description'"
                  v-text="pagesT('$detail.descriptionTab')"
                />
                <div
                  class="px-3.75 pb-2.5 text-black text-4 leading-[normal] font-medium not-italic cursor-pointer"
                  :class="
                    tab === 'Reviews'
                      ? 'active b-b-2 b-b-solid b-b-primary  '
                      : 'b-white'
                  "
                  @click="tab = 'Reviews'"
                >
                  {{ pagesT('$detail.reviewTab.title') }} ({{
                    productReviews?.length
                  }})
                </div>
              </div>
              <div class="w-full bg-gray-200 px-5 sm:px-12">
                <div
                  v-if="tab === 'Description'"
                  class="text-black mb-12.5 prose max-w-220 py-10"
                  v-html="product.description"
                ></div>
                <div v-if="tab === 'Reviews'" class="pt-10 w-full">
                  <div v-if="productReviews?.length">
                    <div
                      v-for="review in productReviews.slice(0, reviewlist)"
                      :key="review.id"
                      class="b-rd-2.5 border b-solid b-gray-400 bg-white p-5 mb-5 w-full"
                    >
                      <div class="mt-1 flex">
                        <div v-for="i in 5" :key="i">
                          <i
                            v-if="review.points / 2 >= i"
                            class="fa-solid fa-star fa-lg text-primary"
                          ></i>
                        </div>
                        <div>
                          <i
                            v-if="review.points % 2"
                            class="fa-solid fa-star-half-stroke fa-lg text-primary"
                          ></i>
                        </div>
                        <div v-if="review.points % 2 === 0" class="flex">
                          <div v-for="i in 5" :key="i">
                            <i
                              v-if="review.points / 2 < i"
                              class="fa-regular fa-star fa-lg text-primary"
                            ></i>
                          </div>
                        </div>

                        <div v-if="review.points % 2 === 1" class="flex">
                          <div v-for="i in 5" :key="i">
                            <i
                              v-if="review.points / 2 < i - 1"
                              class="fa-regular fa-star fa-lg text-primary"
                            ></i>
                          </div>
                        </div>
                      </div>
                      <div class="mt-2.25 flex items-center">
                        <p
                          class="text-gray-800 text-3.5 not-italic font-bold leading-[132.4%] mr-3.25"
                          v-text="pagesT('$detail.reviewTab.blabla')"
                        />
                        <p
                          class="text-gray-500 text-center text-4 not-italic font-medium leading-[132.4%]"
                        >
                          {{ review.createdAt?.split('T')[0] }}
                        </p>
                      </div>
                      <p
                        class="text-gray-800 text-4 not-italic font-bold leading-[132.4%] mt-2"
                      >
                        {{ review.title }}
                      </p>
                      <p class="text-gray-800 text-3.5 font-medium">
                        {{ review.content }}
                      </p>
                    </div>
                    <div
                      v-if="productReviews.length > reviewlist"
                      class="text-gray-800 text-3.5 not-italic font-medium leading-[132.4%] my-5 ml-5 underline"
                      @click="showMore"
                      v-text="pagesT('$detail.reviewTab.showMore')"
                    />
                    <div
                      v-if="productReviews.length === reviewlist"
                      class="text-gray-800 text-3.5 not-italic font-medium leading-[132.4%] my-5 ml-5 underline"
                      @click="hidden"
                      v-text="pagesT('$detail.reviewTab.less')"
                    />
                  </div>
                  <div
                    class="text-gray-800 text-4 not-italic font-bold leading-[132.4%] mt-2"
                    v-text="pagesT('$detail.reviewTab.subTitle')"
                  />
                  <div class="mt-5 flex">
                    <div
                      class="w-12.5 h-12.5 border-rd-l-2.5 bg-primary flex justify-center items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M1 21L12 2L23 21H1ZM12 18C12.2833 18 12.521 17.904 12.713 17.712C12.905 17.52 13.0007 17.2827 13 17C13 16.7167 12.904 16.479 12.712 16.287C12.52 16.095 12.2827 15.9993 12 16C11.7167 16 11.479 16.096 11.287 16.288C11.095 16.48 10.9993 16.7173 11 17C11 17.2833 11.096 17.521 11.288 17.713C11.48 17.905 11.7173 18.0007 12 18ZM11 15H13V10H11V15Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div
                      class="text-black text-3.5 not-italic font-medium leading-[132.4%] pl-5 bg-white flex items-center h-12.5 w-full border-rd-r-2.5"
                      v-text="pagesT('$detail.reviewTab.description')"
                    />
                  </div>
                  <div class="mt-5.25 text-black">
                    <select
                      v-model="state.data.points"
                      class="px-5 py-3.5 w-full text-black text-3.5 not-italic font-medium leading-[132.4%] border b-solid b-gray-700 bg-white appearance-none"
                    >
                      <option :value="10">
                        10 {{ pagesT('$detail.reviewTab.veryGood') }}
                      </option>
                      <option :value="9">9</option>
                      <option :value="8">8</option>
                      <option :value="7">7</option>
                      <option :value="6">6</option>
                      <option :value="5">5</option>
                      <option :value="4">4</option>
                      <option :value="3">3</option>
                      <option :value="2">2</option>
                      <option :value="1">
                        1 {{ pagesT('$detail.reviewTab.veryBad') }}
                      </option>
                    </select>
                  </div>
                  <div class="mt-5.25">
                    <input
                      v-model="state.data.title"
                      class="box-border pl-5.25 py-3.5 w-full text-black text-3.5 not-italic font-medium leading-[132.4%] border b-solid b-gray-700 bg-white"
                      :placeholder="`${pagesT('$detail.reviewTab.titlePlaceholder')}*`"
                    />
                  </div>
                  <div class="mt-5.25">
                    <textarea
                      v-model="state.data.content"
                      class="box-border pl-5.25 py-3.5 w-full text-black text-3.5 not-italic font-medium leading-[132.4%] border b-solid b-gray-700 bg-white"
                      :placeholder="`${pagesT('$detail.reviewTab.descriptionPlaceholder')}*`"
                    >
                    </textarea>
                  </div>
                  <div
                    class="mt-5.25 text-black text-3.5 not-italic font-medium leading-[132.4%]"
                    v-text="pagesT('$detail.reviewTab.mandatory')"
                  />
                  <div
                      class=" mt-5.25 text-black text-3.5 font-medium flex items-center gap-2"
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
                      <div
                        class=" text-black text-3.5 not-italic font-medium leading-[132.4%] flex"
                      >
                        {{ pagesT('$detail.reviewTab.haveRead') }} &nbsp;
                        <p
                          class="text-primary underline"
                          v-text="pagesT('$detail.reviewTab.privacyPolicy')"
                        />
                      </div>
                    </div>
                  <div>
                    <button
                      :disabled="terms === false"
                      type="button"
                      :class="{
                        grayscale: terms === false,
                        'opacity-50 cursor-not-allowed hover:bg-brand-primary':
                          terms === false,
                      }"
                      class="b-rd-6.5 bg-primary py-2.75 px-8 duration-300 hover:opacity-80 text-white text-right text-3.5 not-italic font-medium leading-[123%] b-none mt-8 duration-300 hover:opacity-80 mb-9.5"
                      @click="invokeSubmit"
                      v-text="pagesT('$detail.reviewTab.save')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Cart :controller="shoppingCartModalView" />
    </div>
  </div>
</template>

<style scoped>
.prose :where(h2):not(:where(.not-prose, .not-prose *)) {
  margin: 0 0 0.5em;
  font-size: 1.75em;
}

.prose :where(table):not(:where(.not-prose, .not-prose *)) {
  display: block;
  margin: 1em 0;
  border-radius: 0.625rem;
  overflow-x: auto;
  --un-shadow: 0px 2px 10px 0px var(--un-shadow-color, rgba(0, 0, 0, 0.15));
  box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow),
    var(--un-shadow);
  font-weight: 600;
}

select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
}
</style>
