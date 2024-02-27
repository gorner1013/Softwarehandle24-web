<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

// import { ClientApiError } from "@shopware-pwa/types";
useBreadcrumbs([
  {
    name: 'account',
    path: '/account',
  },
  {
    name: 'profile',
    path: '/account/profile',
  },
])
const { t: accountT } = useMessages('account')
const $toast = useToast()
const { user, refreshUser, updatePersonalInfo, updateEmail } = useUser()
const { updatePassword } = useCustomerPassword()
const errorMessages = ref<string[]>([])
const { getSalutations } = useSalutations()
const isSuccess = ref(false)
const updated = ref(false)
const isUpdating = ref(false)
const loadingData = ref(false)
const isSavingName = ref(false)
const isSavingMail = ref(false)
const isSavingPassword = ref(false)

const state = reactive({
  salutationId: '',
  firstName: '',
  lastName: '',
  email: '',
  emailConfirmation: '',
  emailConfirmPassword: '',
  passwordConfirmPassword: '',
  newPassword: '',
  confirmPassword: '',
  title: '',
  newEmail: '',
  newEmailConfirm: '',
  newPasswordConfirm: '',
})

const isEmailValid = computed(() => {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (state.newEmail.length === 0 || state.newEmail.match(validRegex)) {
    return true
  }
  return false
})
const isNewPasswordMatch = computed(() => {
  if (
    state.newPasswordConfirm.length === 0 ||
    state.newPasswordConfirm === state.newPassword
  )
    return true
  return false
})

const isConfirmEmailMatch = computed(
  () =>
    state.newEmailConfirm.length === 0 ||
    state.newEmail === state.newEmailConfirm,
)
const salutation = computed(() =>
  getSalutations && getSalutations.value && getSalutations.value.length
    ? getSalutations.value.findLast((e) => e.id === user.value?.salutationId)
        ?.displayName || ''
    : '',
)

const rules = computed(() => ({
  firstName: {
    required,
  },
  lastName: {
    required,
  },
}))

const $v = useVuelidate(rules, state)

async function invokeUpdatePersonalInfo(): Promise<void> {
  isSuccess.value = false
  isSavingName.value = true
  try {
    loadingData.value = true
    updated.value = false
    $v.value.$touch()
    isUpdating.value = true
    await updatePersonalInfo({
      firstName: state.firstName,
      lastName: state.lastName,
      salutationId: state.salutationId,
      title: state.title,
    })
    isSuccess.value = true
    isUpdating.value = false
    $toast.success('Update Successfully!', {
      position: 'top-right',
    })
    refreshUser()
  } catch (err) {
    const e = err as any /* as ClientApiError */
    $toast.error('Update Failed!', {
      position: 'top-right',
    })
    errorMessages.value = e.messages.map((m: any) => m.detail)
  } finally {
    loadingData.value = false
    isSavingName.value = false
  }
}

async function invokeUpdateEmailAddress(): Promise<void> {
  isSavingMail.value = true
  try {
    $v.value.$touch()
    await updateEmail({
      email: state.newEmail,
      emailConfirmation: state.newEmailConfirm,
      password: state.emailConfirmPassword,
    })
    $toast.success('Update Successfully!', {
      position: 'top-right',
    })
    refreshUser()
  } catch (err) {
    const e = err as any
    $toast.error(e.messages[0].detail, {
      position: 'top-right',
    })
    errorMessages.value = e.messages.map((m: any) => m.detail)
  } finally {
    isSavingMail.value = false
  }
}

async function invokeUpdatePassword(): Promise<void> {
  isSavingPassword.value = true
  try {
    $v.value.$touch()
    const updateResult = await updatePassword({
      newPassword: state.newPassword,
      newPasswordConfirm: state.newPasswordConfirm,
      password: state.passwordConfirmPassword,
    })
    if (!updateResult) {
      $toast.error('Update Failed!', {
        position: 'top-right',
      })
    } else {
      $toast.success('Update Successfully!', {
        position: 'top-right',
      })
      refreshUser()
    }
  } catch (err) {
    const e = err as any
    $toast.error(e.messages[0].detail, {
      position: 'top-right',
    })
  } finally {
    isSavingPassword.value = false
  }
}

onBeforeMount(async () => {
  loadingData.value = true
  await refreshUser()
  state.firstName = user.value?.firstName || ''
  state.lastName = user.value?.lastName || ''
  state.email = user.value?.email || ''
  state.salutationId = user.value?.salutationId || ''
  state.title = user.value?.title || ''
  loadingData.value = false
})
</script>

<template>
  <div>
    <LayoutBreadcrumbs />
    <div class="max-w-360 m-auto md:mt-6 mt-5 px-5 pb-30">
      <h1
        class="md:text-6 text-3.5 font-bold text-black"
        v-text="accountT('$profile.title')"
      />
      <div class="md:mt-10 mt-5 grid md:grid-cols-3 grid-cols-1 gap-5">
        <div class="w-full h-120 rounded-2.5 bg-white shadow-1.5xl">
          <p
            class="h-16 flex items-center justify-center text-center bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 text-white text-4 font-bold uppercase"
            v-text="accountT('$profile.name.title')"
          />
          <div class="h-104 p-5 flex flex-col justify-end">
            <div class="flex flex-col gap-5">
              <p class="text-4 font-bold text-gray-800">
                {{ salutation }} {{ user?.firstName }} {{ user?.lastName }}
              </p>
              <div class="w-full">
                <select
                  id="salutation"
                  v-model="state.salutationId"
                  name="salutation"
                  class="w-full px-5 py-4 text-3.5 font-medium border border-solid border-gray-700 bg-white text-black"
                  @blur="$v.salutationId.$touch()"
                >
                  <option
                    selected
                    value=""
                    class="text-3.5 font-medium text-black"
                    v-text="accountT('$profile.name.salutation')"
                  />
                  <option
                    v-for="salutationItem in getSalutations"
                    :key="salutationItem.id"
                    :value="salutationItem.id"
                    class="text-3.5 font-medium text-black"
                  >
                    {{ salutationItem.displayName }}
                  </option>
                </select>
              </div>
              <div class="w-full">
                <input
                  id="first-name"
                  v-model="state.firstName"
                  name="first-name"
                  autocomplete="first-name"
                  required
                  :disabled="loadingData"
                  type="text"
                  :placeholder="accountT('$profile.name.firstName')"
                  class="w-full px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                />
              </div>
              <div class="w-full">
                <input
                  id="last-name"
                  v-model="state.lastName"
                  name="last-name"
                  autocomplete="last-name"
                  required
                  :disabled="loadingData"
                  type="text"
                  :placeholder="accountT('$profile.name.lastName')"
                  class="w-full px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                />
              </div>
              <div class="w-full">
                <div
                  class="text-3.5 font-medium text-gray-800"
                  v-text="`${accountT('$profile.fieldMarked')} * ${accountT('$profile.mandatory')}`"
                />
              </div>
            </div>
            <button
              class="flex items-center justify-center border-none duration-300 hover:opacity-80 text-center py-3.5 rounded-1 bg-primary text-3.5 font-bold cursor-pointer text-white mt-8"
              @click="invokeUpdatePersonalInfo"
            >
              <Spinner v-if="isSavingName" />
              <span v-else v-text="accountT('$profile.save')" />
            </button>
          </div>
        </div>
        <div class="w-full h-120 rounded-2.5 bg-white shadow-1.5xl">
          <p
            class="h-16 flex items-center justify-center text-center bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 text-white text-4 font-bold uppercase"
            v-text="accountT('$profile.email.title')"
          />
          <div class="h-104 p-5 flex flex-col justify-end">
            <div class="flex flex-col gap-5">
              <p class="text-4 font-bold text-gray-800">{{ user?.email }}</p>
              <div class="w-full">
                <input
                  id="email"
                  v-model="state.newEmail"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  :placeholder="`${accountT('$profile.email.newAddress')}*`"
                  :disabled="loadingData"
                  class="w-full px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                />
                <div
                  v-if="!isEmailValid"
                  class="absolute text-3 text-red-600"
                  v-text="accountT('$profile.email.emailValid')"
                />
              </div>
              <div class="w-full">
                <input
                  id="email-confirm"
                  v-model="state.newEmailConfirm"
                  name="email-confirm"
                  type="email"
                  autocomplete="email-confirm"
                  required
                  :placeholder="`${accountT('$profile.email.confirmAddress')}*`"
                  :disabled="loadingData"
                  class="w-full px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                />
                <div
                  v-if="!isConfirmEmailMatch"
                  class="absolute text-3 text-red-600"
                  v-text="accountT('$profile.email.confirmEmailMatch')"
                />
              </div>
              <div class="w-full">
                <input
                  id="email-confirm-password"
                  v-model="state.emailConfirmPassword"
                  name="email-cofirm-password"
                  type="password"
                  required
                  :placeholder="`${accountT('$profile.email.currentPwd')}*`"
                  :disabled="loadingData"
                  class="w-full px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                />
              </div>
              <div class="w-full">
                <div
                  class="text-3.5 font-medium text-gray-800"
                  v-text="`${accountT('$profile.fieldMarked')} * ${accountT('$profile.mandatory')}`"
                />
              </div>
            </div>
            <button
              class="flex items-center justify-center text-center border-none duration-300 hover:opacity-80 py-3.5 rounded-1 bg-primary text-3.5 font-bold cursor-pointer text-white mt-8"
              @click="invokeUpdateEmailAddress"
            >
              <Spinner v-if="isSavingMail" />
              <span v-else v-text="accountT('$profile.save')" />
            </button>
          </div>
        </div>
        <div class="w-full md:h-120 rounded-2.5 bg-white shadow-1.5xl">
          <p
            class="h-16 flex items-center justify-center text-center bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 text-white text-4 font-bold uppercase"
            v-text="accountT('$profile.password.title')"
          />
          <div class="md:h-104 p-5 flex flex-col justify-end">
            <div class="flex flex-col gap-5">
              <div class="hidden text-4 font-bold text-gray-800"></div>
              <div class="w-full">
                <input
                  id="new-password"
                  v-model="state.newPassword"
                  name="new-password"
                  type="password"
                  required
                  :placeholder="`${accountT('$profile.password.newPwd')}*`"
                  :disabled="loadingData"
                  class="w-full px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                />
              </div>
              <div class="w-full">
                <input
                  id="confirm-password"
                  v-model="state.newPasswordConfirm"
                  name="confirm-password"
                  type="password"
                  required
                  :placeholder="`${accountT('$profile.password.confirmPwd')}*`"
                  :disabled="loadingData"
                  class="w-full px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                />
                <p
                  v-if="!isNewPasswordMatch"
                  class="absolute text-3 text-red-600"
                  v-text="accountT('$profile.password.newPasswordMatch')"
                />
              </div>
              <div class="w-full">
                <input
                  id="password-confirm-password"
                  v-model="state.passwordConfirmPassword"
                  name="password-confirm-password"
                  type="password"
                  required
                  :placeholder="`${accountT('$profile.password.currentPwd')}*`"
                  :disabled="loadingData"
                  class="w-full px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                />
              </div>
              <div class="w-full">
                <div
                  class="text-3.5 font-medium text-gray-800"
                  v-text="`${accountT('$profile.fieldMarked')} * ${accountT('$profile.mandatory')}`"
                />
              </div>
            </div>
            <button
              class="flex items-center justify-center text-center border-none duration-300 hover:opacity-80 py-3.5 rounded-1 bg-primary text-3.5 font-bold cursor-pointer text-white mt-8"
              @click="invokeUpdatePassword"
            >
              <Spinner v-if="isSavingPassword" />
              <span v-else v-text="accountT('$profile.save')" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
