<script setup lang="ts">
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const emits = defineEmits<{
  (e: 'success'): void
  (e: 'close'): void
}>()
const router = useRouter()
const $toast = useToast()
const isLoading = ref(false)
const loginData = ref({
  username: '',
  password: '',
  remember: true,
})
const { t: checkoutT } = useMessages('checkout')

const { isLoggedIn, login } = useUser()
const { refreshSessionContext } = useSessionContext()
const loginErrors = ref<string[]>([])
if (process.client && isLoggedIn.value) {
  navigateTo({ path: '/checkout/payment' })
}
watch(isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    navigateTo({ path: '/checkout/payment' })
  }
})
useBreadcrumbs([
  {
    name: 'checkout',
    path: '/checkout',
  },
])

const isEmailValid = computed(() => {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (loginData.value.username.match(validRegex)) {
    return true
  }
  return false
})
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
    emits('close')
    router.push('/checkout/payment')
    isLoading.value = false
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
</script>

<template>
  <div>
    <LayoutBreadcrumbs />
    <div class="max-w-360 m-auto md:mt-6 mt-5 px-5 pb-30">
      <div
        class="md:text-6 text-3.5 font-bold text-black"
        v-text="checkoutT('title')"
      />
      <div
        class="max-w-240 flex items-center justify-center mx-auto mt-5 px-10"
      >
        <div class="flex flex-col items-center justify-center">
          <p
            class="flex items-center w-14 h-14 justify-center rounded-full bg-gray-800 text-white"
          >
            1
          </p>
        </div>
        <div class="h-px w-full bg-gray-700"></div>
        <div class="flex flex-col items-center justify-center">
          <p
            class="flex items-center w-14 h-14 justify-center rounded-full border border-solid border-gray-700 cursor-pointer bg-white text-gray-800"
          >
            2
          </p>
        </div>
        <div class="h-px w-full bg-gray-700"></div>
        <div class="flex flex-col items-center justify-center">
          <p
            class="flex items-center w-14 h-14 justify-center rounded-full border border-solid border-gray-700 cursor-pointer bg-white text-gray-800"
          >
            3
          </p>
        </div>
      </div>
      <div
        class="max-w-240 flex items-center justify-between mx-auto mt-5 px-5"
      >
        <div class="flex flex-col items-center justify-center">
          <p
            class="text-center text-3.5 font-semibold text-gray-800"
            v-text="checkoutT('customerData')"
          />
        </div>
        <div class="flex flex-col items-center justify-center">
          <p
            class="text-center text-3.5 font-semibold text-gray-800"
            v-text="checkoutT('paymentMethod')"
          />
        </div>

        <div class="flex flex-col items-center justify-center">
          <p
            class="text-center text-3.5 font-semibold text-gray-800"
            v-text="checkoutT('finalizeOrder')"
          />
        </div>
      </div>

      <div class="md:mt-10 mt-5">
        <div class="md:mt-10 mt-5 grid md:grid-cols-3 grid-cols-1 gap-5">
          <div class="w-full h-100 rounded-2.5 bg-white shadow-1.5xl">
            <div
              class="h-16 flex items-center justify-center text-center bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 text-white text-4 font-bold uppercase"
              v-text="checkoutT('$cards.one.title')"
            />
            <div class="h-84 p-5 flex flex-col justify-between">
              <div class="flex flex-col gap-5">
                <div
                  class="text-4 font-bold text-black text-left proportional-nums"
                  v-text="checkoutT('$cards.one.subTitle')"
                />
                <div class="w-full">
                  <input
                    id="email"
                    v-model="loginData.username"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    :placeholder="checkoutT('$cards.one.email')"
                    class="w-full px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                  />
                  <div
                    v-if="!isEmailValid && loginData.username.length > 0"
                    class="absolute text-3 text-red-600"
                    v-text="checkoutT('$cards.one.emailValid')"
                  />
                </div>
                <div class="w-full">
                  <input
                    id="password"
                    v-model="loginData.password"
                    name="password"
                    type="password"
                    required
                    :placeholder="checkoutT('$cards.one.pwd')"
                    class="w-full px-5 py-4 bg-white border border-solid border-gray-700 text-3.5 font-medium text-black"
                  />
                </div>
              </div>
              <div class="w-full">
                <NuxtLink
                  to="/account/recover"
                  class="text-primary text-3.5 font-medium underline cursor-pointer"
                >
                  {{ checkoutT('$cards.one.forgotPwd') }}</NuxtLink
                >
              </div>
              <button
                class="flex items-center justify-center text-center py-3.5 border-none duration-300 hover:opacity-80 rounded-1 bg-primary text-3.5 font-bold cursor-pointer text-white"
                @click="invokeLogin()"
              >
                <Spinner v-if="isLoading" />
                <span v-else v-text="checkoutT('$cards.one.btn')" />
              </button>
            </div>
          </div>
          <div class="h-100 rounded-2.5 bg-white shadow-1.5xl">
            <div
              class="bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 h-16 flex items-center text-center justify-center text-white text-4 font-bold uppercase"
              v-text="checkoutT('$cards.two.title')"
            />
            <div class="p-5 h-84 flex flex-col justify-between">
              <div class="flex flex-col gap-7">
                <div class="flex items-center gap-2.5">
                  <img class="w-6 h-6" src="/svgs/circle-check.svg" />
                  <div
                    class="text-gray-800 text-3.5 font-bold"
                    v-text="checkoutT('$cards.two.contentOne')"
                  />
                </div>
                <div class="flex items-center gap-2.5">
                  <img class="w-6 h-6" src="/svgs/circle-check.svg" />
                  <p
                    class="text-gray-800 text-3.5 font-bold"
                    v-text="checkoutT('$cards.two.contentTwo')"
                  />
                </div>
                <div class="flex items-center gap-2.5">
                  <img class="w-6 h-6" src="/svgs/circle-check.svg" />
                  <p
                    class="text-gray-800 text-3.5 font-bold"
                    v-text="checkoutT('$cards.two.contentThree')"
                  />
                </div>
                <div class="flex items-center gap-2.5">
                  <img class="w-6 h-6" src="/svgs/circle-check.svg" />
                  <p
                    class="text-gray-800 text-3.5 font-bold"
                    v-text="checkoutT('$cards.two.contentFour')"
                  />
                </div>
              </div>
              <button
                class="w-full py-3.5 rounded-1 duration-300 hover:opacity-80 bg-primary flex justify-center items-center text-white text-3.5 font-medium border-none cursor-pointer"
                @click="router.push('/checkout/newcustom')"
                v-text="checkoutT('$cards.two.btn')"
              />
            </div>
          </div>
          <div class="h-100 rounded-2.5 bg-white shadow-1.5xl">
            <p
              class="bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 h-16 flex items-center text-center justify-center text-white text-4 font-bold uppercase"
              v-text="checkoutT('$cards.three.title')"
            />
            <div class="p-5 h-84 flex flex-col justify-between">
              <div>
                <p
                  class="text-gray-800 text-4 font-medium"
                  v-text="checkoutT('$cards.three.description')"
                />
              </div>
              <button
                class="w-full py-3.5 rounded-1 bg-primary flex justify-center items-center duration-300 hover:opacity-80 text-white text-3.5 font-medium border-none cursor-pointer"
                @click="router.push('/checkout/guest')"
                v-text="checkoutT('$cards.three.btn')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
