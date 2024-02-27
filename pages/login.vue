<script setup lang="ts">
// import { ClientApiError } from '@shopware-pwa/types';
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const emits = defineEmits<{
  (e: 'success'): void
  (e: 'close'): void
}>()
const $toast = useToast()
const router = useRouter()
const { logout, isLoggedIn, login } = useUser()
const { refreshSessionContext } = useSessionContext()
const { pushSuccess } = useNotifications()
const loginErrors = ref<string[]>([])
const isLoading = ref(false)
const { t: loginT } = useMessages('login')

useBreadcrumbs([
  {
    name: 'Login',
    path: '/login',
  },
])
onBeforeMount(async () => {
  if (process.client && isLoggedIn.value) {
    // redirect to account page if user is logged in
    navigateTo({ path: '/account' })
  } else {
    await logout() // if you do a hard reload on the login page, you will be logged out
  }
})
const loginData = ref({
  username: '',
  password: '',
  remember: true,
})
const passwordView = ref(false)
const errorMessageShow = ref(false)
async function invokeLogin(): Promise<void> {
  isLoading.value = true
  try {
    await refreshSessionContext()
    await login(loginData.value)
    emits('success')
    $toast.success('Login Successfully!', {
      duration: 3000,
      position: 'top-right',
    })
    isLoading.value = false
    pushSuccess('Account Login Success!!')
    emits('close')
    router.push('/account')
  } catch (error) {
    isLoading.value = false
    const e = error
    loginErrors.value = e.messages.map(({ detail }) => detail)
    $toast.error(`${loginErrors.value}`, {
      duration: 3000,
      position: 'top-right',
    })
  }
}
const isEmailValid = computed(() => {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (loginData.value.username.match(validRegex)) {
    return true
  }
  return false
})
watch(loginData.value, () => {
  errorMessageShow.value = false
})
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="max-w-360 m-auto md:mt-6 mt-5 px-5 pb-30">
    <h1
      class="text-black md:text-6 text-3.5 font-bold"
      v-text="loginT('login')"
    />
    <div class="max-w-114 m-auto md:mt-10 mt-5">
      <div class="p-5 rounded-2.5 bg-white shadow-1.5xl">
        <p
          class="text-4 font-bold text-black text-center"
          v-text="loginT('welcome')"
        />
        <div>
          <input
            v-model="loginData.username"
            class="w-full mt-6 border border-solid border-gray-700 bg-white px-6 py-4 text-gray-800 text-3.5 font-medium"
            :placeholder="loginT('emailPlaceholder')"
            name="email"
            type="email"
            autocomplete="email"
            required
          />
          <div
            v-if="!isEmailValid && loginData.username.length > 0"
            class="absolute text-3 text-red-600"
            v-text="loginT('correctEmail')"
          />
        </div>
        <div class="relative">
          <input
            v-model="loginData.password"
            class="w-full mt-5 border border-solid border-gray-700 bg-white px-6 py-4 text-gray-800 text-3.5 font-medium"
            :placeholder="loginT('pwdPlaceholder')"
            name="password"
            :type="passwordView ? 'text' : 'password'"
            autocomplete="current-password"
            required
          />
          <img
            class="absolute top-9 right-5 w-6 h-6 cursor-pointer"
            src="/svgs/eye-on.svg"
            @click="passwordView = !passwordView"
          />
        </div>
        <div class="mt-5">
          <NuxtLink
            to="/recover"
            class="text-primary text-3.5 font-medium cursor-pointer hover:underline hover:opacity-60"
          >
            {{ loginT('forgotPwd') }}</NuxtLink
          >
        </div>
        <button
          class="w-full mt-8 rounded-1.25 border-none duration-300 hover:opacity-80 bg-primary h-10.5 flex justify-center items-center text-white text-3.5 md:font-bold font-medium cursor-pointer duration-300 hover:opacity-80"
          @click="invokeLogin()"
        >
          <Spinner v-if="isLoading" />
          <span v-else>{{ loginT('login') }}</span>
        </button>
      </div>
      <div class="mt-6 text-center text-gray-800 text-4 font-medium">
        {{ loginT('$createAccount.question') }}
        <NuxtLink
          to="/register"
          class="text-primary cursor-pointer hover:underline hover:opacity-60"
          >{{ loginT('$createAccount.register') }}</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
