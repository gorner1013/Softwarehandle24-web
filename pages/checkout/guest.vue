<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { email, minLength, required, requiredIf } from '@vuelidate/validators'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const props = defineProps<{
  customerGroupId?: string
}>()
// import { ClientApiError } from "@shopware-pwa/types";
useBreadcrumbs([
  {
    name: 'checkout',
    path: '/checkout',
  },
  {
    name: 'guest',
    path: '/checkout/guest',
  },
])
const $toast = useToast()
const { getSalutations } = useSalutations()
const { getStatesForCountry } = useCountries()
const { register, isLoggedIn } = useUser()

const router = useRouter()
const loading = ref<boolean>()
const doubleOptInBox = ref()
const showDoubleOptInBox = ref(false)
const customer = ref(false)
const { t: checkoutT } = useMessages('checkout')

// if (process.client && isLoggedIn.value) {
//   navigateTo({ path: "/account" });
// }

watch(isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    navigateTo({ path: '/account' })
  }
})

const initialState = {
  requestedGroupId: props.customerGroupId,
  salutationId: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmpassword: '',
  billingAddress: {
    company: '',
    vatId: '',
    phoneNumber: '',
    street: '',
    zipcode: '',
    city: '',
    countryId: '',
    countryStateId: '',
  },
  accountType: 'private',
}

const state = reactive(JSON.parse(JSON.stringify(initialState)))

const rules = computed(() => ({
  salutationId: {
    required,
  },
  firstName: {
    required,
  },
  lastName: {
    required,
  },
  email: {
    required,
    email,
  },
  password: {
    required: requiredIf(() => {
      return customer.value === true
    }),
    minLength: minLength(8),
  },
  billingAddress: {
    company: {
      required: requiredIf(() => {
        return state.accountType !== 'private'
      }),
    },
    phoneNumber: {
      required,
    },
    street: {
      required,
      minLength: minLength(3),
    },
    zipcode: {
      required,
    },
    city: {
      required,
    },
    countryId: {
      required,
    },
    countryStateId: {
      required: requiredIf(() => {
        return !!getStatesForCountry(state.billingAddress.countryId)?.length
      }),
    },
  },
}))

const $v = useVuelidate(rules, state)

async function invokeSubmit() {
  $v.value.$touch()
  const valid = await $v.value.$validate()
  if (valid) {
    try {
      loading.value = true
      const response = await register(state)
      if (response && response.active) {
        router.push('/checkout/payment')
        $toast.success('Register Successfully!', {
          position: 'top-right',
        })
      } else if (response && !response.active) {
        Object.assign(state, JSON.parse(JSON.stringify(initialState)))
        showDoubleOptInBox.value = true
        await nextTick()
        doubleOptInBox.value.scrollIntoView()
        $v.value.$reset()
      }
    } catch (error: any) {
      $toast.error(error.messages[0].detail, {
        position: 'top-right',
      })
    } finally {
      loading.value = false
    }
  } else {
    $toast.error('Please fill out correct information!', {
      position: 'top-right',
    })
  }
}
const isEmailValid = computed(() => {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (state.email.length === 0 || state.email.match(validRegex)) {
    return true
  }
  return false
})
const isPasswordMatch = computed(() => {
  if (
    state.confirmpassword.length === 0 ||
    state.password === state.confirmpassword
  )
    return true
  return false
})

async function createCustomer() {
  try {
    if (!customer.value) {
      customer.value = true
    } else {
      customer.value = false
      state.password = ''
    }
    console.log(customer.value)
  } catch (error) {
    console.log('error', error)
  }
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
  <LayoutBreadcrumbs />
  <div class="max-w-360 m-auto md:mt-6 mt-4 px-5">
    <div
      class="text-black md:text-6 text-3.5 font-bold"
      v-text="checkoutT('$guest.title')"
    />
    <div class="max-w-240 flex items-center justify-center mx-auto mt-5 px-10">
      <div class="flex flex-col items-center justify-center">
        <div
          class="flex items-center w-14 h-14 justify-center rounded-full bg-gray-800 text-white"
        >
          1
        </div>
      </div>
      <div class="h-px w-full bg-gray-700"></div>
      <div class="flex flex-col items-center justify-center">
        <div
          class="flex items-center w-14 h-14 justify-center rounded-full border border-solid border-gray-700 cursor-pointer bg-white text-gray-800"
        >
          2
        </div>
      </div>
      <div class="h-px w-full bg-gray-700"></div>
      <div class="flex flex-col items-center justify-center">
        <div
          class="flex items-center w-14 h-14 justify-center rounded-full border border-solid border-gray-700 cursor-pointer bg-white text-gray-800"
        >
          3
        </div>
      </div>
    </div>
    <div class="max-w-240 flex items-center justify-between mx-auto mt-5 px-5">
      <div class="flex flex-col items-center justify-center">
        <div
          class="text-center text-3.5 font-semibold text-gray-800"
          v-text="checkoutT('customerData')"
        />
      </div>
      <div class="flex flex-col items-center justify-center">
        <div
          class="text-center text-3.5 font-semibold text-gray-800"
          v-text="checkoutT('paymentMethod')"
        />
      </div>

      <div class="flex flex-col items-center justify-center">
        <div
          class="text-center text-3.5 font-semibold text-gray-800"
          v-text="checkoutT('finalizeOrder')"
        />
      </div>
    </div>
    <div class="flex md:mt-6 mt-5 pb-30">
      <div class="shadow-1.5xl flex-1 rounded-2.5 bg-white p-5">
        <div
          class="text-4 font-bold text-black"
          v-text="checkoutT('$guest.subTitle')"
        />
        <div class="flex items-center mt-6 gap-8">
          <div
            class="flex items-center gap-1 cursor-pointer"
            @click="state.accountType = 'private'"
          >
            <img
              :src="
                state.accountType === 'private'
                  ? '/svgs/radio-full.svg'
                  : '/svgs/radio-empty.svg'
              "
              class="w-4 h-4"
            />
            <div
              class="text-3.5 font-medium text-gray-800"
              v-text="checkoutT('$create.privateClient')"
            />
          </div>
          <div
            class="flex items-center gap-1 cursor-pointer"
            @click="state.accountType = 'business'"
          >
            <img
              :src="
                state.accountType === 'business'
                  ? '/svgs/radio-full.svg'
                  : '/svgs/radio-empty.svg'
              "
              class="w-4 h-4"
            />
            <div
              class="text-3.5 font-medium text-gray-800"
              v-text="checkoutT('$create.company')"
            />
          </div>
        </div>
        <div class="mt-10 flex flex-col gap-5">
          <div class="flex text-black text-3.5 font-medium w-full">
            <select
              id="salutation"
              v-model="state.salutationId"
              name="salutation"
              class="w-full px-5 py-4 text-3.5 border border-solid border-gray-700 bg-white text-black"
              @blur="state.salutationId.$touch()"
            >
              <option
                selected
                value=""
                v-text="checkoutT('$create.salutation')"
              />
              <option
                v-for="salutation in getSalutations"
                :key="salutation.id"
                :value="salutation.id"
              >
                {{ salutation.displayName }}
              </option>
            </select>
          </div>
          <div class="w-full flex text-black text-3.5 font-medium">
            <input
              id="first-name"
              v-model="state.firstName"
              name="first-name"
              type="text"
              autocomplete="fist-name"
              :placeholder="`${checkoutT('$create.firstName')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 proportional-nums"
            />
          </div>

          <div class="w-full flex text-black text-3.5 font-medium">
            <input
              id="last-name"
              v-model="state.lastName"
              name="last-name"
              type="text"
              autocomplete="last-name"
              :placeholder="`${checkoutT('$create.lastName')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 proportional-nums"
            />
          </div>

          <div class="w-full flex flex-col text-black text-3.5 font-medium">
            <input
              id="email-address"
              v-model="state.email"
              name="email"
              type="email"
              autocomplete="email"
              :placeholder="`${checkoutT('$create.email')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 proportional-nums"
            />
            <div
              v-if="!isEmailValid"
              class="mt-1 text-3 text-red-600"
              v-text="checkoutT('$create.emailValid')"
            />
          </div>
          <div
            class="text-gray-800 text-3.5 font-medium flex items-center gap-2"
            @click="createCustomer()"
          >
            <div
              class="!w-4 !h-4 rounded-1 border border-solid border-gray-700 bg-white cursor-pointer"
            >
              <img
                v-if="customer"
                src="/svgs/checked.svg"
                class="checked-icon"
              />
            </div>
            <div v-text="checkoutT('$create.createAccount')" />
          </div>
          <div
            v-if="customer"
            class="w-full flex text-black text-3.5 font-medium"
          >
            <input
              id="password"
              v-model="state.password"
              name="password"
              type="password"
              autocomplete="password"
              :placeholder="`${checkoutT('$create.pwd')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 proportional-nums"
            />
          </div>
          <div
            v-if="customer"
            class="w-full flex flex-col text-black text-3.5 font-medium"
          >
            <input
              v-model="state.confirmpassword"
              :placeholder="`${checkoutT('$create.confirmPwd')}*`"
              type="password"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 proportional-nums"
            />
            <div
              v-if="!isPasswordMatch"
              class="mt-1 text-3 text-red-600"
              v-text="checkoutT('$create.passwordMatch')"
            />
          </div>
          <div v-if="customer" class="w-full">
            <div class="flex flex-col gap-5 bg-gray-200 px-2 py-5">
              <li
                class="text-gray-800 text-3.5 proportional-nums"
                v-text="checkoutT('$create.pwdLength')"
              />
              <li
                class="text-gray-800 text-3.5 proportional-nums"
                v-text="checkoutT('$create.pwdLetter')"
              />
            </div>
          </div>
          <div v-if="state.accountType === 'business'">
            <span class="text-4 font-bold text-black">Company</span>
          </div>
          <div
            v-if="state.accountType === 'business'"
            class="w-full flex md:flex-row flex-col text-black text-3.5 font-medium gap-5"
          >
            <input
              id="company"
              v-model="state.billingAddress.company"
              name="company"
              type="text"
              autocomplete="company"
              placeholder="Company Name*"
              class="flex-1 px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5"
            />
            <input
              id="vatId"
              v-model="state.billingAddress.vatId"
              name="vatId"
              type="text"
              autocomplete="vatId"
              placeholder="VAT ID"
              class="flex-1 px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5"
            />
          </div>
          <div class="w-full flex text-black text-3.5 font-medium">
            <input
              id="phone-number"
              v-model="state.billingAddress.phoneNumber"
              name="phone-number"
              type="text"
              autocomplete="phone-number"
              :placeholder="`${checkoutT('$create.phone')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 proportional-nums"
            />
          </div>
          <div class="w-full flex text-black text-3.5 font-medium">
            <input
              id="street"
              v-model="state.billingAddress.street"
              name="street"
              type="text"
              autocomplete="street"
              :placeholder="`${checkoutT('$create.streetAddress')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 proportional-nums"
            />
          </div>
          <div class="w-full flex text-black text-3.5 font-medium">
            <input
              :placeholder="checkoutT('$create.additionalAddress')"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 proportional-nums"
            />
          </div>
          <div
            class="w-full flex md:flex-row flex-col text-black text-3.5 font-medium gap-5"
          >
            <input
              id="zipcode"
              v-model="state.billingAddress.zipcode"
              name="zipcode"
              type="text"
              autocomplete="zipcode"
              :placeholder="`${checkoutT('$create.postal')}*`"
              class="flex-1 px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 proportional-nums"
            />
            <input
              id="city"
              v-model="state.billingAddress.city"
              name="city"
              type="text"
              autocomplete="city"
              :placeholder="`${checkoutT('$create.city')}*`"
              class="flex-1 px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5 proportional-nums"
            />
          </div>
          <SharedCountryStateInput
            v-model:countryId="state.billingAddress.countryId"
            v-model:stateId="state.billingAddress.countryStateId"
            :country-id-validation="state.billingAddress.countryId"
            :state-id-validation="state.billingAddress.countryStateId"
            class="col-span-12 md:col-span-4"
          />
          <div
            class="text-3.5 font-medium text-black"
            v-text="checkoutT('$create.mandatory')"
          />
          <div
              class="text-gray-800 text-3.5 font-medium flex items-center gap-2 mt-2"
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
              <p class="text-black text-3.5 font-medium">
                {{ checkoutT('$create.haveRead') }}
                <NuxtLink class="text-primary text-3.5 font-medium underline">
                  {{ checkoutT('$create.privacyPolicy') }}</NuxtLink
                >.
              </p>
          </div>
        </div>
        <div class="md:mt-5 mt-8 flex justify-end">
          <button
            :disabled="terms === false"
            type="button"
            :class="{
              grayscale: terms === false,
              'opacity-50 cursor-not-allowed hover:bg-brand-primary':
                terms === false,
            }"
            class="md:w-1/2 w-full py-4 flex border-none duration-300 hover:opacity-80 justify-center items-center rounded-1 bg-primary text-white text-3.5 font-medium cursor-pointer"
            @click="invokeSubmit()"
          >
            <Spinner v-if="loading" />
            <div v-else>
              <p v-if="!customer" v-text="checkoutT('$create.orderAsGuest')" />
              <p
                v-if="customer"
                v-text="checkoutT('$create.orderAsCustomer')"
              />
            </div>
          </button>
        </div>
      </div>
      <div
        class="w-113 md:block hidden ml-5 rounded-2.5 bg-white shadow-1.5xl h-fit pb-5 sticky top-20 z--999"
      >
        <img
          class="w-full rounded-tr-2.5 rounded-tl-2.5"
          src="/svgs/customer.svg"
        />
        <div
          class="mt-5 text-gray-800 text-5 font-bold text-center"
          v-text="checkoutT('$create.benefits.title')"
        />
        <div class="mt-6 px-5 flex flex-col gap-5">
          <div class="flex items-center gap-2.5">
            <img class="w-6 h-6" src="/svgs/circle-check.svg" />
            <div
              class="text-gray-800 text-3.5 font-bold"
              v-text="checkoutT('$create.benefits.one')"
            />
          </div>
          <div class="flex items-center gap-2.5">
            <img class="w-6 h-6" src="/svgs/circle-check.svg" />
            <div
              class="text-gray-800 text-3.5 font-bold"
              v-text="checkoutT('$create.benefits.two')"
            />
          </div>
          <div class="flex items-center gap-2.5">
            <img class="w-6 h-6" src="/svgs/circle-check.svg" />
            <div
              class="text-gray-800 text-3.5 font-bold"
              v-text="checkoutT('$create.benefits.three')"
            />
          </div>
          <div class="flex items-center gap-2.5">
            <img class="w-6 h-6" src="/svgs/circle-check.svg" />
            <div
              class="text-gray-800 text-3.5 font-bold"
              v-text="checkoutT('$create.benefits.four')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-account {
}
</style>
