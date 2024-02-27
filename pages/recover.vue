<script setup lang="ts">
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const emits = defineEmits<{
  (e: 'success'): void
  (e: 'close'): void
}>()
const $toast = useToast()
const { resetPassword, errors } = useCustomerPassword()
const { apiInstance } = useShopwareContext()
const isSuccess = ref(false)
const isLoading = ref(false)
const formData = ref({
  email: '',
  storefrontUrl: apiInstance.config.endpoint,
})

const recoverPasswordErrors = computed(() =>
  errors.resetPassword?.map(({ detail }) => detail).toString(),
)
const { t: recoverT } = useMessages('recover')

async function invokeRecover(): Promise<void> {
  try {
    isLoading.value = true
    const emailSent = await resetPassword(formData.value)

    if (emailSent) {
      isSuccess.value = true
      emits('success')
      $toast.success('Send Successfully!', {
        duration: 3000,
        position: 'top-right',
      })
      isLoading.value = false
    } else {
      $toast.error(`${recoverPasswordErrors.value}`, {
        duration: 3000,
        position: 'top-right',
      })
    }
    isLoading.value = false
  } catch (error) {
    console.error('error resend email', error)
  }
}
const isEmailValid = computed(() => {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (formData.value.email.match(validRegex)) {
    return true
  }
  return false
})
</script>

<template>
  <div class="md:flex hidden flex-row max-w-360 m-auto mt-6 px-5 gap-1">
    <img src="/images/home-icon.png" alt="home-icon" class="w-4 h-4" />
    <p
      class="text-gray-700 text-3.5 font-medium"
      v-text="recoverT('recover')"
    />
  </div>
  <div class="max-w-360 m-auto md:mt-6 mt-5 px-5 pb-30">
    <h1
      class="text-black md:text-6 text-3.5 font-bold"
      v-text="recoverT('forgotPwd')"
    />
    <div class="max-w-114 m-auto md:mt-10 mt-5">
      <div class="p-5 rounded-2.5 bg-white shadow-1.5xl">
        <p
          class="text-4 font-bold text-black text-center"
          v-text="recoverT('restorePwd')"
        />
        <div>
          <input
            v-model="formData.email"
            class="w-full mt-6 border border-solid border-gray-700 bg-white px-6 py-4 text-gray-600 text-3.5 font-medium"
            :placeholder="recoverT('emailPlaceholder')"
            name="email"
            type="email"
            autocomplete="email"
            required
          />
          <div
            v-if="!isEmailValid && formData.email.length > 0"
            class="mt-1 text-3 text-red-600"
            v-text="recoverT('emailValid')"
          />
        </div>
        <p
          class="mt-5 text-3.5 font-medium text-gray-800"
          v-text="recoverT('submit')"
        />
        <button
          class="w-full mt-8 rounded-1.25 border-none duration-300 hover:opacity-80 bg-primary h-10.5 flex justify-center items-center text-white text-3.5 md:font-bold font-medium cursor-pointer duration-300 hover:opacity-80"
          @click="invokeRecover()"
        >
          <Spinner v-if="isLoading" />
          <span v-else>{{ recoverT('send') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
