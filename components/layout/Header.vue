<script setup lang="ts">
import { getCategoryRoute } from '@shopware-pwa/helpers-next'
import { useModal } from '~/composables/useModal'
import { useClickOutside } from '~/composables/useClickOutside'
import { faPhone, faEnvelope, faUser, faCartShopping } from '@fortawesome/sharp-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/sharp-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()
const { isLoggedIn, logout, refreshUser, user } = useUser()
const { totalPrice, isEmpty } = useCart()
const isLoading = ref(false)

const { data } = await useFetch('/api/navigations')
const activeTopCategory = ref('')
const isHoverContent = ref(false)
const profileDropRef = ref(null)
const logInDropRef = ref(null)

const mobileactiveTopCategory = ref('')
const mobileActiveSubCategory = ref('')
const shoppingCartModalView = useModal()
const mobileModalView = useModal()
const userLoginRegisterDropdown = ref(false)
const userProfileDropdown = ref(false)
const userAccountModalView = ref(false)
const userLoggedinModalView = ref(false)
const { t: globalT } = useMessages('global')

useClickOutside(profileDropRef, () => {
  if (userProfileDropdown.value) {
    userProfileDropdown.value = false
  }
})
useClickOutside(logInDropRef, () => {
  if (userLoginRegisterDropdown.value) {
    userLoginRegisterDropdown.value = false
  }
})
function setActiveTopCategory(categoryName: string) {
  if (activeTopCategory.value === categoryName) {
    // document.body.style.overflow = "auto";
  } else {
    activeTopCategory.value = categoryName
    // document.body.style.overflow = "hidden";
  }
}

function setActiveHoverCategory(categoryName: string) {
  setActiveTopCategory(categoryName)
  setHoverContent(true)
}
function setDeactiveHoverCategory() {
  // setActiveTopCategory("");
  setHoverContent(false)
}

function setHoverContent(val: boolean) {
  isHoverContent.value = val
}
async function invokeLogout() {
  userProfileDropdown.value = false
  mobileModalView.close()
  isLoading.value = true
  await logout()
  isLoading.value = false
  userAccountModalView.value = false
  userLoggedinModalView.value = false
  router.push('/login')
}
async function getCategory(child: any) {
  mobileModalView.close()
  isLoading.value = true
  await router.push(getCategoryRoute(child))
  window.location.reload()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  isLoading.value = false
}

async function handleDropdownMenu() {
  if (userProfileDropdown.value || userLoginRegisterDropdown.value) {
    userProfileDropdown.value = false
    userLoginRegisterDropdown.value = false
  } else {
    if (isLoggedIn.value) {
      await refreshUser()
      userProfileDropdown.value = true
    } else {
      setTimeout(() => {
        userLoginRegisterDropdown.value = true
      }, 50)
    }
  }
}

function onRegisterClick() {
  userLoginRegisterDropdown.value = false
  mobileModalView.close()
  router.push('/register')
}
function onshopcartClick() {
  mobileModalView.close()
  router.push('/cart')
}

function onLoginClick() {
  userLoginRegisterDropdown.value = false
  mobileModalView.close()
  router.push('/login')
}
</script>

<template>
  <nav v-if="isLoading"
    class="w-full fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-100">
    <FullScreenSpinner />
  </nav>
  <nav class="w-full bg-white border border-solid border-b-1 border-zinc-200">
    <div class="w-full max-w-8xl mx-auto">
      <div class="px-3 sm:px-12 my-5 md:py-10 h-12">
        <div class="w-full h-full flex items-center justify-between relative gap-3">
          <a href="/" class="flex items-center cursor-pointer transform duration-500 hover:opacity-70">
            <img src="/svgs/logo-black.svg" alt=" logo" class="h-15" />
          </a>
          <!-- desktop -->
          <div class="hidden lg:flex flex-col gap-2">
            <div class="flex items-center">
              <FontAwesomeIcon :icon="faPhone" class="text-gray-800"/>
              <a href="tel:0800-6030220" class="ml-1.5 text-sm font-medium text-gray-800 cursor-pointer hover:opacity-80">
                {{ globalT('$header.phone') }}
              </a>
            </div>
            <div class="flex items-center ">     
              <FontAwesomeIcon :icon="faEnvelope" class="text-gray-800"/>
              <a href="mailto:support@softwarehandel24.de"
                class="text-sm font-medium ml-1.5 text-gray-800 cursor-pointer hover:opacity-80">
                support@softwarehandel24.de
              </a>
            </div>
          </div>
          <LayoutStoreSearch />
          <div class="lg:flex gap-5 items-center justify-center hidden">
            <div class="hidden lg:flex items-center justify-center">
              <div class="flex items-center cursor-pointer" @click="shoppingCartModalView.open">
                <div class="flex items-center justify-center">
                  <FontAwesomeIcon :icon="faCartShopping" class="text-gray-800"/>
                  <div class="flex flex-col ml-2">
                    <p class="text-3.5 font-medium text-gray-800 hover:underline">
                      € {{ totalPrice }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center">
              <div class="flex items-center cursor-pointer" @click="handleDropdownMenu()">
                <FontAwesomeIcon :icon="faUser" class="text-gray-800"/>
                <div class="text-3.5 font-medium ml-1.5 text-gray-800 hover:underline">
                  <p v-if="isLoggedIn === true">
                    {{ globalT('$header.hello') }} {{ user?.firstName }}
                  </p>
                  <p v-if="isLoggedIn === false">
                    {{ globalT('$header.account') }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between flex-1 w-full text-gray-800">
              <div class="w-full text-gray-800">
                <select
                  class="focus-visible:b-1 focus-visible:b-solid focus-visible:b-gray-400 focus-visible:outline-none border-1 rounded-2 b-solid b-gray-400 w-22 h-8 position-relative bg-white text-gray-800 px-2.5 py-1 appearance-none text-3  font-medium">
                  <option :value="'de'" class="text-gray-800 text-3 font-medium">DE &nbsp;|&nbsp; €</option>
                  <option :value="'en'" class="text-gray-800 text-3 font-medium">EN &nbsp;|&nbsp; €</option>
                </select>
              </div>
            </div>
          </div>
          <!-- mobile -->

          <div class="flex items-center lg:hidden gap-2">
            <div
              class="flex items-center w-10 h-10 justify-center rounded-2 border border-solid border-gray-400 cursor-pointer bg-gray-300"
              @click="shoppingCartModalView.open">
              <FontAwesomeIcon :icon="faMagnifyingGlass" class="flex text-gray-800 items-center justify-center"/>
            </div>
            <div
              class="flex items-center w-10 h-10 justify-center rounded-2 border border-solid border-gray-400 cursor-pointer bg-gray-300 duration-900"
              @click="mobileModalView.open">
              <i class="flex fa-solid fa-bars w-5 h-5 text-gray-800 items-center justify-center"></i>
            </div>
          </div>
          <!-- login/register modal start -->
          <div v-if="userLoginRegisterDropdown" ref="logInDropRef"
            class="w-64 bg-white rounded-lg shadow-md absolute right-0 top-5 z-20">
            <div class="p-4 flex flex-col items-center justify-center">
              <p class="text-gray-700 text-normal font-semibold">
                {{ globalT('$header.account') }}
              </p>
              <div class="h-px w-full bg-gray-700 mt-4"></div>
              <button
                class="w-full py-3.5 text-center font-bold font-sm text-white bg-primary rounded mt-3 cursor-pointer duration-300 hover:opacity-80"
                @click="onRegisterClick()">
                {{ globalT('$header.register') }}
              </button>
              <p class="font-sm text-medium text-gray-700 text-center mt-3">
                or
              </p>
              <button
                class="w-full py-3.5 text-center font-bold font-sm text-white bg-primary rounded mt-3 cursor-pointer duration-300 hover:opacity-80"
                @click="onLoginClick">
                {{ globalT('$header.login') }}
              </button>
            </div>
          </div>
          <!-- login/register modal end -->

          <!-- profile dropdown menu start -->
          <div v-if="userProfileDropdown" ref="profileDropRef"
            class="w-64 bg-white rounded-lg shadow-md absolute right-0 top-5 z-20">
            <div class="p-4 flex flex-col items-center justify-center">
              <div class="text-gray-700 text-normal font-semibold">
                {{ globalT('$header.account') }}
              </div>
              <div class="h-px w-full bg-gray-700 mt-4"></div>
              <div class="text-gray-700 text-xl font-bold mt-2">
                {{ user?.firstName }} {{ user?.lastName }}
              </div>
              <div class="h-px w-full bg-gray-700 mt-2"></div>
              <div class="w-full mt-5" @click="userProfileDropdown = !userProfileDropdown">
                <NuxtLink to="/account"
                  class="no-underline text-gray-700 font-semibold text-sm cursor-pointer hover:opacity-70">
                  {{ globalT('$header.overview') }}
                </NuxtLink>
              </div>
              <div class="w-full mt-5" @click="userProfileDropdown = !userProfileDropdown">
                <NuxtLink to="/account/profile"
                  class="no-underline text-gray-700 font-semibold text-sm cursor-pointer hover:opacity-70">
                  {{ globalT('$header.personalData') }}
                </NuxtLink>
              </div>
              <div class="w-full mt-5" @click="userProfileDropdown = !userProfileDropdown">
                <NuxtLink to="/account/address"
                  class="no-underline text-gray-700 font-semibold text-sm cursor-pointer hover:opacity-70">
                  {{ globalT('$header.address') }}
                </NuxtLink>
              </div>
              <div class="w-full mt-5" @click="userProfileDropdown = !userProfileDropdown">
                <NuxtLink to="/account/payment"
                  class="no-underline text-gray-700 font-semibold text-sm cursor-pointer hover:opacity-70">
                  {{ globalT('$header.paymentMethods') }}</NuxtLink>
              </div>
              <div class="w-full mt-5" @click="userProfileDropdown = !userProfileDropdown">
                <NuxtLink to="/account/orders"
                  class="no-underline text-gray-700 font-semibold text-sm cursor-pointer hover:opacity-70">
                  {{ globalT('$header.orders') }}
                </NuxtLink>
              </div>
              <div class="w-full mt-5">
                <div class="no-underline text-gray-700 font-semibold text-sm cursor-pointer w-fit hover:opacity-70"
                  @click="invokeLogout">
                  {{ globalT('$header.signout') }}
                </div>
              </div>
            </div>
          </div>
          <!-- profile dropdown menu end -->
        </div>
      </div>
    </div>
  </nav>

  <nav class="w-full h-full sticky top-0 z-10" @mouseleave="setDeactiveHoverCategory()">
    <div v-if="data && data?.length > 0" class="w-full bg-gray-800 hidden lg:block">
      <div class="w-full max-w-6xl mx-auto">
        <div id="test-button" class="px-3 grid grid-flow-col items-center justify-stretch">
          <div v-for="item in data" :key="item?.id"
            class="text-normal text-white first-border-l-px first-border-l-solid first-border-l-white first-border-l-op-20 border-r-px border-r-solid border-r-white border-r-op-20 h-15 flex items-center justify-center cursor-pointer border-b-3 duration-500"
            :class="item?.name === activeTopCategory
              ? 'border-b-primary'
              : 'border-b-gray-800'
              " @mouseover="setActiveHoverCategory(item?.name || '')" @click="getCategory(item)">
            {{ item?.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="w-full h-full relative hidden lg:block">
      <div class="w-full absolute top-0 left-0 right-0 h-screen bg-black transition-opacity pointer-events-none"
        :class="isHoverContent ? 'opacity-70' : 'opacity-0'"></div>
      <div class="absolute top-0 left-0 right-0 bg-white rounded-b-lg overflow-y-scroll transition-high"
        :class="isHoverContent ? 'max-h-65' : 'max-h-0'" @mouseleave="setDeactiveHoverCategory()">
        <div v-for="item in data" :key="item.id">
          <div v-show="item.name === activeTopCategory" class="w-full max-w-300 mx-auto">
            <div class="px-12 grid grid-flow-col justify-stretch">
              <div v-for="child in item.children" :key="child.id"
                class="flex flex-col px-5 py-4 border-r-2 border-r-solid border-r-gray-200">
                <div class="font-bold text-normal text-black no-underline py-2 cursor-pointer hover:underline"
                  @click="getCategory(child)">
                  {{ child.name }}
                </div>
                <div v-for="menuitem in child.children" :key="menuitem.id"
                  class="px-5 font-medium text-normal text-black no-underline py-1 cursor-pointer hover:underline"
                  @click="getCategory(menuitem)">
                  {{ menuitem.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <LayoutSidebar :controller="mobileModalView" side="right">
    <nav class="fixed top-0 right-0 left-0 bottom-0 z-36 lg:hidden">
      <div class="absolute top-0 right-0 bottom-0 bg-white w-full sm:w-100">
        <div class="h-18 flex items-center justify-end border-b border-b-solid border-b-primary cursor-pointer">
          <div class="w-6 h-6 mr-5.5" @click="mobileModalView.close">
            <img src="/svgs/mobile-close.svg" alt="mobile-close" class="w-6 h-6 cursor-pointer" />
          </div>
        </div>
        <div class="border-b border-b-solid border-b-primary overflow-y-scroll">
          <div v-for="item in data" :key="item.id">
            <div class="h-11.5 flex items-center border-b border-b-solid border-b-gray-100"
              :class="item.name === mobileactiveTopCategory ? ' mb-2.5' : ''">
              <div class="shadow-md h-6 w-6 rounded-3 bg-white ml-3 mr-3 cursor-pointer" @click="
                item.name === mobileactiveTopCategory
                  ? (mobileactiveTopCategory = '')
                  : (mobileactiveTopCategory = item.name || '')
                ">
                <img :src="item.name === mobileactiveTopCategory
                  ? '/svgs/mobile-minus.svg'
                  : '/svgs/mobile-plus.svg'
                  " alt="open" class="h-6 w-6" />
              </div>
              <div class="text-black text-3 font-semibold">
                {{ item.name }}
              </div>
              <div class="main-category-liner-gradient ml-auto h-12.5 w-0.25"></div>
              <div class="shadow-md h-6 w-6 rounded-3 bg-white ml-3 mr-3 cursor-pointer" @click="getCategory(item)">
                <img src="/svgs/mobile-arrow.svg" alt="arrow" class="w-6 h-6" />
              </div>
            </div>
            <div v-show="item.name === mobileactiveTopCategory">
              <div>
                <div v-for="child in item.children" :key="child.id">
                  <div class="h-9 flex items-center pl-10 border-b border-b-solid border-b-gray-400 cursor-pointer">
                    <img :src="mobileActiveSubCategory === child.name
                      ? '/svgs/mobile-subcategory-closed.svg'
                      : '/svgs/mobile-subcategory-opened.svg'
                      " alt="mobile-subcategory" class="w-4 h-4 mr-1" @click="
    mobileActiveSubCategory === child.name
      ? (mobileActiveSubCategory = '')
      : (mobileActiveSubCategory = child.name || '')
    " />
                    <div class="text-gray-700 text-3 font-medium decoration-none cursor-pointer"
                      @click="getCategory(child)">
                      {{ child.name }}
                    </div>
                  </div>
                  <div v-if="mobileActiveSubCategory === child.name"
                    class="pb-5 border-b border-b-solid border-b-gray-400">
                    <div v-for="menuitem in child.children" :key="menuitem.id" class="block">
                      <div class="h-4 ml-12.5 border-l border-l-solid border-l-gray-400"></div>
                      <div
                        class="h-4 ml-12.5 flex items-center border-l border-l-solid border-l-gray-400 last-border-l last-border-l-dashed last-border-l-transparent last-relative last-flex last-items-center before:last-absolute -before:last-left-0.25 before:last-top-0 before:last-w-0.25 before-last-h-2 before:last-bg-gray-400">
                        <div class="w-4 h-0.25 bg-gray-400"></div>
                        <div class="text-gray-700 text-3 font-medium decoration-none cursor-pointer"
                          @click="getCategory(menuitem)">
                          {{ menuitem.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-34.5">
          <div class="h-12.5 flex items-center cursor-pointer" @click="onshopcartClick()">
            <div class="w-6 h-6 ml-3 mr-3">
              <img src="/svgs/mobile-cart.svg" alt="mobile-cart" class="w-6 h-6" />
            </div>
            <div class="text-black text-3 font-medium">
              {{ globalT('$header.shoppingCart') }}
            </div>
          </div>
          <div class="h-12.5 flex items-center cursor-pointer" @click="onRegisterClick()">
            <div class="w-6 h-6 ml-3 mr-3">
              <img src="/svgs/mobile-register.svg" alt="mobile-cart" class="w-6 h-6" />
            </div>
            <div class="text-black text-3 font-medium">
              <p v-if="isLoggedIn === true">
                {{ globalT('$header.hello') }} {{ user?.firstName }}
              </p>
              <p v-if="isLoggedIn === false">
                {{ globalT('$header.register') }}
              </p>
            </div>
          </div>
          <div v-if="isLoggedIn === false" class="h-12.5 flex items-center cursor-pointer" @click="onLoginClick()">
            <div class="w-6 h-6 ml-3 mr-3">
              <img src="/svgs/mobile-login.svg" alt="mobile-cart" class="w-6 h-6" />
            </div>
            <div class="text-black text-3 font-medium cursor-pointer">
              Log in
            </div>
          </div>
          <div v-if="isLoggedIn === true" class="h-12.5 flex items-center cursor-pointer" @click="invokeLogout()">
            <div class="w-6 h-6 ml-3 mr-3">
              <img src="/svgs/mobile-login.svg" alt="mobile-cart" class="w-6 h-6" />
            </div>
            <div class="text-black text-3 font-medium cursor-pointer">
              {{ globalT('$header.signout') }}
            </div>
          </div>
        </div>
      </div>
    </nav>
  </LayoutSidebar>
  <Cart :controller="shoppingCartModalView" />
</template>

<style scoped>
::-webkit-scrollbar {
  height: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.main-category-liner-gradient {
  background: linear-gradient(180deg,
      rgba(245, 245, 245, 0.14) 0%,
      rgba(239, 239, 239, 0.62) 28.13%,
      #eee 51.56%,
      rgba(239, 239, 239, 0.62) 79.17%,
      rgba(245, 245, 245, 0.17) 100%);
}

.transition-opacity {
  transition: 300ms ease-in-out;
}

.transition-high {
  transition: max-height 300ms ease-in-out;
}

select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 16px;
  color: #252b31;
}
</style>
