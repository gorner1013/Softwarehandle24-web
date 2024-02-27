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
    name: 'Register',
    path: '/register',
  },
])
const $toast = useToast()
const terms = ref(false)
const { getSalutations } = useSalutations()
const { getStatesForCountry } = useCountries()
const { register, isLoggedIn } = useUser()

const router = useRouter()
const loading = ref<boolean>()
const doubleOptInBox = ref()
const showDoubleOptInBox = ref(false)
const { t: registerT } = useMessages('register')

if (process.client && isLoggedIn.value) {
  navigateTo({ path: '/account' })
}

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
    minLength: minLength(3),
  },
  lastName: {
    required,
    minLength: minLength(3),
  },
  email: {
    required,
    email,
  },
  password: {
    required,
    minLength: minLength(8),
  },
  billingAddress: {
    company: {
      required: requiredIf(() => {
        return state.accountType !== 'private'
      }),
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
        router.push('/')
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
    <h1 class="text-black md:text-6 text-3.5 font-bold" v-text="registerT('register')" />
    <div class="flex md:mt-6 mt-5 gap-1">
      <p class="text-gray-800 text-4 font-medium" v-text="registerT('$login.question')" />
      <NuxtLink to="/login" class="text-primary text-4 font-medium decoration-none hover:underline hover:opacity-60">
        {{ registerT('$login.loginHere') }}
      </NuxtLink>
    </div>
    <div class="flex md:mt-6 mt-5 pb-30">
      <div class="shadow-1.5xl flex-1 rounded-2.5 bg-white p-5">
        <p class="text-4 font-bold text-black">
          {{ registerT('$createAccount.title') }}
        </p>
        <div class="flex items-center mt-6 gap-8">
          <div class="flex items-center gap-1 cursor-pointer" @click="state.accountType = 'private'">
            <img :src="state.accountType === 'private'
              ? '/svgs/radio-full.svg'
              : '/svgs/radio-empty.svg'
              " class="w-4 h-4" />
            <p class="text-3.5 font-medium text-gray-800" v-text="registerT('$createAccount.privateClient')" />
          </div>
          <div class="flex items-center gap-1 cursor-pointer" @click="state.accountType = 'business'">
            <img :src="state.accountType === 'business'
              ? '/svgs/radio-full.svg'
              : '/svgs/radio-empty.svg'
              " class="w-4 h-4" />
            <p class="text-3.5 font-medium text-gray-800" v-text="registerT('$createAccount.company')" />
          </div>
        </div>
        <div class="mt-10 flex flex-col gap-5">
          <div class="flex text-black text-3.5 font-medium w-full">
            <select id="salutation" v-model="state.salutationId" name="salutation"
              class="w-full px-5 py-4 text-3.5 border border-solid border-gray-700 bg-white text-black"
              @blur="state.salutationId.$touch()">
              <option selected value="">
                {{ registerT('$createAccount.salutation') }}
              </option>
              <option v-for="salutation in getSalutations" :key="salutation.id" :value="salutation.id">
                {{ salutation.displayName }}
              </option>
            </select>
          </div>
          <div class="w-full flex text-black text-3.5 font-medium">
            <input id="first-name" v-model="state.firstName" name="first-name" type="text" autocomplete="fist-name"
              :placeholder="`${registerT('$createAccount.placeholder.firstName')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5" />
          </div>

          <div class="w-full flex text-black text-3.5 font-medium">
            <input id="last-name" v-model="state.lastName" name="last-name" type="text" autocomplete="last-name"
              :placeholder="`${registerT('$createAccount.placeholder.lastName')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5" />
          </div>
          <div class="w-full flex flex-col text-black text-3.5 font-medium">
            <input id="email-address" v-model="state.email" name="email" type="email" autocomplete="email"
              :placeholder="`${registerT('$createAccount.placeholder.email')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5" />
            <div v-if="!isEmailValid" class="mt-1 text-3 text-red-600" v-text="registerT('$createAccount.emailValid')" />
          </div>
          <div class="w-full flex text-black text-3.5 font-medium">
            <input id="password" v-model="state.password" name="password" type="password" autocomplete="password"
              :placeholder="`${registerT('$createAccount.placeholder.pwd')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5" />
          </div>
          <div class="w-full flex flex-col text-black text-3.5 font-medium">
            <input v-model="state.confirmpassword" :placeholder="`${registerT('$createAccount.placeholder.confirmPwd')}*`"
              type="password" class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5" />
            <p v-if="!isPasswordMatch" class="mt-1 text-3 text-red-600" v-text="registerT('$createAccount.pwdMatch')" />
          </div>
          <div class="w-full">
            <div class="flex flex-col gap-5 bg-gray-200 px-4 py-5">
              <li class="text-gray-800 text-3.5" v-text="registerT('$createAccount.pwdLength')" />
              <li class="text-gray-800 text-3.5" v-text="registerT('$createAccount.pwdLetter')" />
            </div>
          </div>
          <div v-if="state.accountType === 'business'">
            <span class="text-4 font-bold text-black">Company</span>
          </div>
          <div v-if="state.accountType === 'business'"
            class="w-full flex md:flex-row flex-col text-black text-3.5 font-medium gap-5">
            <input id="company" name="company" type="text" autocomplete="company" v-model="state.billingAddress.company"
              placeholder="Company Name*"
              class="flex-1 px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5" />
            <input id="vatId" name="vatId" type="text" autocomplete="vatId" v-model="state.billingAddress.vatId"
              placeholder="VAT ID"
              class="flex-1 px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5" />
          </div>
          <div class="w-full flex text-black text-3.5 font-medium">
            <input id="street" v-model="state.billingAddress.street" name="street" type="text" autocomplete="street"
              :placeholder="`${registerT('$createAccount.placeholder.streetAddress')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5" />
          </div>
          <div class="w-full flex text-black text-3.5 font-medium">
            <input :placeholder="`${registerT('$createAccount.placeholder.additionalAddress')}`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5" />
          </div>
          <div class="w-full flex md:flex-row flex-col text-black text-3.5 font-medium gap-5">
            <input id="zipcode" v-model="state.billingAddress.zipcode" name="zipcode" type="text" autocomplete="zipcode"
              :placeholder="`${registerT('$createAccount.placeholder.code')}*`"
              class="flex-1 px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5" />
            <input id="city" v-model="state.billingAddress.city" name="city" type="text" autocomplete="city"
              :placeholder="`${registerT('$createAccount.placeholder.city')}*`"
              class="flex-1 px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5" />
          </div>
          <SharedCountryStateInput v-model:countryId="state.billingAddress.countryId"
            v-model:stateId="state.billingAddress.countryStateId" :country-id-validation="state.billingAddress.countryId"
            :state-id-validation="state.billingAddress.countryStateId" class="col-span-12 md:col-span-4" />
          <p class="text-3.5 font-medium text-black" v-text="registerT('$createAccount.mandatory')" />
          <div class="text-gray-800 text-3.5 font-medium flex items-center gap-2 mt-1">
            <div class="!min-w-4 !min-h-4 w-4 h-4 rounded-1 border border-solid border-gray-700 bg-white cursor-pointer"
              @click="term()">
              <img v-if="terms" src="/svgs/checked.svg" class="checked-icon" />
            </div>
            <p class="text-black text-3.5 font-medium">
              {{ registerT('$createAccount.haveRead') }}
              <NuxtLink :to="'/privacy'" class="text-primary text-3.5 font-medium underline cursor-pointer">
                {{ registerT('$createAccount.privacyPolicy') }}</NuxtLink>.
            </p>
          </div>
        </div>
        <div class="md:mt-5 mt-8 flex justify-end">
          <button :disabled="terms === false" type="button" :class="{
            grayscale: terms === false,
            'opacity-50 cursor-not-allowed hover:bg-brand-primary':
              terms === false,
          }"
            class="md:w-1/2 w-full py-4 flex justify-center border-none duration-300 hover:opacity-80 items-center rounded-1 bg-primary text-white text-3.5 font-medium cursor-pointer duration-300 hover:opacity-80"
            @click="invokeSubmit()">
            <Spinner v-if="loading" />
            <span v-else>{{ registerT('$createAccount.title') }}</span>
          </button>
        </div>
      </div>
      <div class="w-113 ml-5 hidden md:block rounded-2.5 bg-white shadow-1.5xl h-fit pb-5 sticky top-20 z--999">
        <img class="w-full rounded-tr-2.5 rounded-tl-2.5" src="/images/benefits.png" />
        <div class="mt-5 text-gray-800 text-5 font-bold text-center" v-text="registerT('$customerBenefits.title')" />
        <div class="mt-6 px5 flex flex-col gap-5">
          <div class="flex items-center gap-2.5">
            <img class="w-6 h-6" src="/svgs/circle-check.svg" />
            <div class="text-gray-800 text-3.5 font-bold" v-text="registerT('$customerBenefits.content.one')" />
          </div>
          <div class="flex items-center gap2.5">
            <img class="w-6 h-6" src="/svgs/circle-check.svg" />
            <div class="text-gray-800 text-3.5 font-bold" v-text="registerT('$customerBenefits.content.two')" />
          </div>
          <div class="flex items-center gap-2.5">
            <img class="w-6 h-6" src="/svgs/circle-check.svg" />
            <div class="text-gray-800 text-3.5 font-bold" v-text="registerT('$customerBenefits.content.three')" />
          </div>
          <div class="flex items-center gap-2.5">
            <img class="w-6 h-6" src="/svgs/circle-check.svg" />
            <div class="text-gray-800 text-3.5 font-bold" v-text="registerT('$customerBenefits.content.four')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-account {}
</style>
