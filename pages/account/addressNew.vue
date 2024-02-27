<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import type { ClientApiError, CustomerAddress } from '@shopware-pwa/types'
import { required, requiredIf } from '@vuelidate/validators'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const props = withDefaults(
  defineProps<{
    address?: CustomerAddress
  }>(),
  {
    title: 'Account address',
    address: undefined,
  },
)
const { getSalutations } = useSalutations()
const { getStatesForCountry } = useCountries()
const { refreshSessionContext } = useSessionContext()
const deliveryaddresstype = ref(false)
const billingaddresstype = ref(false)
const $toast = useToast()
const errors = ref()
const { t: accountT } = useMessages('account')
const {
  createCustomerAddress,
  updateCustomerAddress,
  errorMessageBuilder,
  loadCustomerAddresses,
  setDefaultCustomerShippingAddress,
  setDefaultCustomerBillingAddress,
} = useAddress()
const initialState = reactive<CustomerAddress>({
  countryId: props.address?.countryId ?? '',
  countryStateId: props.address?.countryStateId ?? '',
  salutationId: props.address?.salutationId ?? '',
  firstName: props.address?.firstName ?? '',
  lastName: props.address?.lastName ?? '',
  zipcode: props.address?.zipcode ?? '',
  city: props.address?.city ?? '',
  street: props.address?.street ?? '',
  id: props.address?.id ?? '',
  company: props.address?.company ?? '',
  vatId: props.address?.vatId ?? '',
  phoneNumber: props.address?.phoneNumber ?? '',
  additionalAddressLine1: props.address?.additionalAddressLine1 ?? '',
})

const initialAddresstype = {
  accountType: 'private',
}

const state = reactive(JSON.parse(JSON.stringify(initialState)))
const accountState = reactive(JSON.parse(JSON.stringify(initialAddresstype)))

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
  company: {
    required: requiredIf(() => {
      return accountState.accountType === 'company'
    }),
  },
  street: {
    required,
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
      return !!getStatesForCountry(state.countryId)?.length
    }),
  },
  phoneNumber: {
    required,
  },
}))

const $v = useVuelidate(rules, state)
const { t } = useI18n()
async function onClickSave() {
  $v.value.$touch()
  const valid = await $v.value.$validate()
  if (valid) {
    try {
      const saveAddress = state.id
        ? updateCustomerAddress
        : createCustomerAddress
      const setAddress = await saveAddress(state)
      if (deliveryaddresstype.value) {
        await setDefaultCustomerShippingAddress(setAddress.id)
      }
      if (billingaddresstype.value) {
        await setDefaultCustomerBillingAddress(setAddress.id)
      }
      refreshSessionContext()
      loadCustomerAddresses()
      $toast.success('Address Add Successfully!', {
        position: 'top-right',
      })
    } catch (e) {
      const errors = e as ClientApiError
      errors?.messages?.forEach((element) => {
        $toast.success(errorMessageBuilder(element) || t('messages.error'), {
          position: 'top-right',
        })
      })
    }
  } else {
    errors.value = $v.value.$errors
    let errorMsg: any
    switch (errors.value[0].$property) {
      case 'salutationId':
        errorMsg = 'salutation'
        break
      case 'firstName':
        errorMsg = 'firstname'
        break
      case 'lastName':
        errorMsg = 'lastname'
        break
      case 'company':
        errorMsg = 'company'
        break
      case 'street':
        errorMsg = 'street'
        break
      case 'zipcode':
        errorMsg = 'postal'
        break
      case 'city':
        errorMsg = 'city'
        break
      case 'countryId':
        errorMsg = 'country'
        break
      case 'countryStateId':
        errorMsg = 'countrystate'
        break
      case 'phoneNumber':
        errorMsg = 'phonenumber'
        break
    }
    $toast.error(`Please fill out ${errorMsg} information!`, {
      position: 'top-right',
    })
  }
}
useBreadcrumbs([
  {
    name: 'account',
    path: '/account',
  },
  {
    name: 'address',
    path: '/account/address',
  },
  {
    name: 'new',
    path: '/account/addressNew',
  },
])
async function deliveryadressStatus() {
  try {
    if (!deliveryaddresstype.value) {
      deliveryaddresstype.value = true
    } else {
      deliveryaddresstype.value = false
    }
    console.log(deliveryaddresstype.value)
  } catch (error) {
    console.log('error', error)
  }
}
async function billingadressStatus() {
  try {
    if (!billingaddresstype.value) {
      billingaddresstype.value = true
    } else {
      billingaddresstype.value = false
    }
    console.log(billingaddresstype.value)
  } catch (error) {
    console.log('error', error)
  }
}
</script>

<template>
  <LayoutBreadcrumbs />
  <main class="max-w-360 m-auto md:pt-6 pt-4 pb-30 px-5">
    <h1
      class="md:text-6 text-3.5 font-bold text-black"
      v-text="accountT('$addressEdit.title')"
    />
    <div class="md:w-116 w-full m-auto md:mt-10 mt-5 rounded-2.5 shadow-1.5xl">
      <p
        class="w-full py-5 flex justify-center items-center rounded-tr-2.5 rounded-tl-2.5 bg-gray-800 text-4 font-bold text-white"
      >
        Create New Address
      </p>
      <div class="w-full p-5">
        <div class="w-full flex flex-col gap-5">
          <div class="flex flex-row items-center gap-3">
            <div
              class="flex md:flex-row flex-col md:items-center items-start md:gap-8 gap-5"
            >
              <div
                class="flex items-center gap-1 cursor-pointer"
                @click="accountState.accountType = 'private'"
              >
                <img
                  :src="
                    accountState.accountType === 'private'
                      ? '/svgs/radio-full.svg'
                      : '/svgs/radio-empty.svg'
                  "
                  class="w-4 h-4"
                />
                <p
                  class="text-3.5 font-medium text-gray-800"
                  v-text="accountT('$addressEdit.privateClient')"
                />
              </div>
              <div
                class="flex items-center gap-1 cursor-pointer"
                @click="accountState.accountType = 'company'"
              >
                <img
                  :src="
                    accountState.accountType === 'company'
                      ? '/svgs/radio-full.svg'
                      : '/svgs/radio-empty.svg'
                  "
                  class="w-4 h-4"
                />
                <p
                  class="text-3.5 font-medium text-gray-800"
                  v-text="accountT('$addressEdit.company')"
                />
              </div>
            </div>
          </div>
          <div class="w-full">
            <select
              id="salutation"
              v-model="state.salutationId"
              name="salutation"
              class="w-full px-5 py-4 text-3.5 border border-solid border-gray-700 bg-white text-black"
              @blur="state.salutationId.$touch()"
            >
              <option selected value="">
                {{ accountT('$addressEdit.salutation') }}
              </option>
              <option
                v-for="salutation in getSalutations"
                :key="salutation.id"
                :value="salutation.id"
              >
                {{ salutation.displayName }}
              </option>
            </select>
          </div>
          <div class="w-full">
            <input
              id="first-name"
              v-model="state.firstName"
              name="first-name"
              type="text"
              autocomplete="fist-name"
              :placeholder="`${accountT('$addressEdit.placeholder.firstName')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5"
            />
          </div>
          <div class="w-full">
            <input
              id="last-name"
              v-model="state.lastName"
              name="last-name"
              type="text"
              autocomplete="last-name"
              :placeholder="`${accountT('$addressEdit.placeholder.lastName')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5"
            />
          </div>
          <div v-if="accountState.accountType === 'company'">
            <span
              class="text-4 font-bold text-black"
              >Company</span
            >
          </div>
          <div v-if="accountState.accountType === 'company'"
            class="w-full flex md:flex-row flex-col text-black text-3.5 font-medium gap-5"
          >
            <input
            id="company"
              name="company"
              type="text"
              autocomplete="company"
              v-model="state.company"
              placeholder="Company Name*"
              :placeholder="`${accountT('$addressEdit.placeholder.companyName')}*`"
              class="flex-1 px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5"
            />
            <input
            id="vatId"
              name="vatId"
              type="text"
              autocomplete="vatId"
              v-model="state.vatId"
              :placeholder="`${accountT('$addressEdit.placeholder.vatId')}`"
              class="flex-1 px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5"
            />
          </div>
          <div class="w-full">
            <input
              id="street-number"
              v-model="state.street"
              name="street-number"
              type="text"
              autocomplete="street-number"
              :placeholder="`${accountT('$addressEdit.placeholder.streetNum')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5"
            />
          </div>
          <div class="w-full">
            <input
              id="additional-address"
              v-model="state.additionalAddressLine1"
              name="additional-address"
              type="text"
              autocomplete="additional-address"
              :placeholder="`${accountT('$addressEdit.placeholder.additionalAddress')}`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5"
            />
          </div>
          <div
            class="w-full flex md:flex-row flex-col md:justify-between justify-start items-center gap-5"
          >
            <div class="md:w-1/3 w-full">
              <input
                id="postal"
                v-model="state.zipcode"
                name="postal"
                type="text"
                autocomplete="postal"
                :placeholder="`${accountT('$addressEdit.placeholder.postal')}*`"
                class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5"
              />
            </div>
            <div class="md:w-2/3 w-full">
              <input
                id="city"
                v-model="state.city"
                name="city"
                type="text"
                autocomplete="city"
                :placeholder="`${accountT('$addressEdit.placeholder.city')}*`"
                class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5"
              />
            </div>
          </div>
          <SharedCountryStateInput
            v-model:countryId="state.countryId"
            v-model:stateId="state.countryStateId"
            :country-id-validation="state.countryId"
            :state-id-validation="state.countryStateId"
            class="col-span-12 md:col-span-4"
          />
          <div class="w-full">
            <input
              id="phone-number"
              v-model="state.phoneNumber"
              name="phone-number"
              type="text"
              autocomplete="phone-number"
              :placeholder="`${accountT('$addressEdit.placeholder.phone')}*`"
              class="w-full px-5 py-4 border border-solid border-gray-700 bg-white text-black text-3.5"
            />
          </div>
          <div
            class="text-gray-800 text-3.5 font-medium flex items-center gap-2"
          >
            <div
              class="!w-4 !h-4 rounded-1 border border-solid border-gray-700 bg-white cursor-pointer"
              @click="deliveryadressStatus"
            >
              <img
                v-if="deliveryaddresstype"
                src="/svgs/checked.svg"
                class="checked-icon"
              />
            </div>
            <p v-text="accountT('$addressEdit.deliveryAddress')" />
          </div>
          <div
            class="text-gray-800 text-3.5 font-medium flex items-center gap-2"
          >
            <div
              class="!w-4 !h-4 rounded-1 border border-solid border-gray-700 bg-white cursor-pointer"
              @click="billingadressStatus"
            >
              <img
                v-if="billingaddresstype"
                src="/svgs/checked.svg"
                class="checked-icon"
              />
            </div>
            <p v-text="accountT('$addressEdit.billingAddress')" />
          </div>
          <p
            class="text-gray-800 text-3.5 font-medium"
            v-text="`*${accountT('$addressEdit.notice')}`"
          />
        </div>
        <div class="w-full mt-8">
          <button
            class="w-full py-4 flex justify-center items-center rounded-1 border-none bg-primary text-white text-3.5 font-medium cursor-pointer duration-300 hover:opacity-50"
            @click="onClickSave"
            v-text="accountT('$addressEdit.save')"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
