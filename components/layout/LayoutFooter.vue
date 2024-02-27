<script setup lang="ts">
import { getCategoryRoute } from '@shopware-pwa/helpers-next'
import { TransitionExpand } from '@morev/vue-transitions'

const { t: globalT } = useMessages('global')
const { data } = await useFetch('/api/navigations')
const mobileactiveTopCategory = ref('')

const router = useRouter()
async function getCategory(child: any) {
  await router.push(getCategoryRoute(child))
  window.location.reload()
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

function toggleCategory(categoryName: any) {
  if (mobileactiveTopCategory.value === categoryName) {
    mobileactiveTopCategory.value = ''
  } else {
    mobileactiveTopCategory.value = categoryName
  }
}
</script>

<template>
  <div class="footer pb-20">
    <div class="max-w-360 md:px-10 px-5 m-auto">
      <div
        class="pt-10 w-full flex lg:flex-row flex-col justify-start items-center gap-5 lg:gap-20"
      >
        <a
          href="/"
          class="flex items-center cursor-pointer transform duration-500 hover:opacity-50"
        >
          <img src="/svgs/logo-black.svg" alt="logo" class="w-full lg:w-90" />
        </a>
        <div class="h-px w-full bg-gray-400 lg:hidden"></div>
        <div class="flex flex-col lg:flex-row gap-2.5 lg:gap-10 w-full">
          <div
            class="flex gap-2 items-center border border-rounded-2 border-gray-400 py-1 px-4 justify-center"
          >
            <img src="/svgs/headset.svg" alt="logo" class="w-4" />
            <a
              href="tel:0800-6030220"
              class="text-gray-700 text-4 font-medium cursor-pointer hover:opacity-80"
            >
              {{ globalT('$footer.phone') }}
            </a>
          </div>
          <div
            class="flex gap-2 items-center border border-rounded-2 border-gray-400 py-1 px-4 justify-center"
          >
            <i class="fa-regular fa-envelope text-gray-700"></i>
            <a
              href="mailto:support@softwarehandel24.de"
              class="text-gray-700 text-4 font-medium cursor-pointer hover:opacity-80"
            >
              support@softwarehandel24.de
            </a>
          </div>
        </div>
        <div class="h-px w-full bg-gray-400 lg:hidden"></div>
      </div>
      <div class="mt-10 h-px w-full bg-gray-400 hidden lg:block"></div>
      <div
        v-for="item in data"
        :key="item.id"
        class="border-b border-b-solid border-b-gray-400 py-5 lg:hidden hover:cursor-pointer"
      >
        <div
          class="flex justify-between items-center"
          @click="toggleCategory(item.name)"
        >
          <p class="text-gray-800 text-4.5 font-semibold">
            {{ item.name }}
          </p>
          <div class="cursor-pointer">
            <i
              :class="
                item.name === mobileactiveTopCategory
                  ? 'fa-solid fa-minus'
                  : 'fa-solid fa-plus'
              "
            ></i>
          </div>
        </div>
        <TransitionExpand :duration="600">
          <div v-if="item.name === mobileactiveTopCategory">
            <div v-for="child in item.children" :key="child.id">
              <div class="h-9 flex items-center cursor-pointer mt-3">
                <div
                  class="text-gray-800 text-4 font-medium decoration-none cursor-pointer"
                  @click="getCategory(child)"
                >
                  {{ child.name }}
                </div>
              </div>
              <div
                v-for="menuitem in child.children"
                :key="menuitem.id"
                class="block"
              >
                <div class="flex pl-5 items-center py-1">
                  <div
                    class="text-gray-700 text-3.5 font-medium decoration-none cursor-pointer"
                    @click="getCategory(menuitem)"
                  >
                    {{ menuitem.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionExpand>
      </div>
      <div v-for="item in data" :key="item.id" class="mt-5 hidden lg:block">
        <p
          class="text-gray-800 text-4.5 font-semibold my-2 hover:underline cursor-pointer"
          @click="getCategory(item)"
        >
          {{ item.name }}
        </p>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="child in item.children" :key="child.id" class="">
            <div class="h-9 flex items-center cursor-pointer my-2">
              <p
                class="text-gray-800 text-4 font-medium cursor-pointer hover:underline"
                @click="getCategory(child)"
              >
                {{ child.name }}
              </p>
            </div>
            <div
              v-for="menuitem in child.children"
              :key="menuitem.id"
              class="block"
            >
              <div class="flex pl-3 items-center py-2">
                <div
                  class="text-gray-700 text-3.5 font-medium decoration-none cursor-pointer hover:underline"
                  @click="getCategory(menuitem)"
                >
                  {{ menuitem.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10 mb-5 h-px w-full bg-gray-400 hidden lg:block"></div>
      <div class="flex py-5 border-b border-b-solid border-b-gray-400">
        <div class="flex lg:flex-row flex-col gap-5 lg:gap-20">
          <div class="flex-1 flex flex-col gap-5">
            <h3
              class="text-4 font-bold text-gray-800 uppercase"
              v-text="globalT('$footer.contact')"
            />
            <div class="flex flex-col gap-3 pl-3">
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.contactForm')"
              />
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.legalNotice')"
              />
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.phone')"
              />
              <a
                href="mailto:support@softwarehandel24.de"
                class="text-3.5 font-medium text-gray-700 cursor-pointer"
              >
                support@softwarehandel24.de
              </a>
            </div>
          </div>
          <div class="flex-1 flex flex-col gap-5">
            <h3
              class="text-4 font-bold text-gray-800 uppercase"
              v-text="globalT('$footer.informations')"
            />
            <div class="flex flex-col gap-3 pl-3">
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.aboutUs')"
              />
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.situation')"
              />
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.license')"
              />
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.conditions')"
              />
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.legalNotice')"
              />
            </div>
          </div>
          <div class="flex-1 flex flex-col gap-5">
            <h3
              class="text-4 font-bold text-gray-800 uppercase"
              v-text="globalT('$footer.content')"
            />
            <div class="flex flex-col gap-3 pl-3">
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.shippingAndReturns')"
              />
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.privacyNotice')"
              />
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.rescission')"
              />
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.references')"
              />
              <p
                class="text-gray-700 font-medium text-3.5"
                v-text="globalT('$footer.sellLicenses')"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 flex flex-col-reverse gap-5 lg:flex-row justify-between">
        <div
          class="flex text-gray-700 text-3.5 font-medium text-left items-center"
        >
          {{ globalT('$footer.copyright') }} | {{ globalT('$footer.allRight') }}
        </div>
        <div class="flex flex-col gap-6">
          <div class="flex flex-wrap">
            <img src="/images/payments/1.png" alt="card" />
            <img src="/images/payments/2.png" alt="card" />
            <img src="/images/payments/3.png" alt="card" />
            <img src="/images/payments/4.png" alt="card" />
            <img src="/images/payments/5.png" alt="card" />
            <img src="/images/payments/6.png" alt="card" />
            <img src="/images/payments/7.png" alt="card" />
            <img src="/images/payments/8.png" alt="card" />
            <img src="/images/payments/9.png" alt="card" />
            <img src="/images/payments/10.png" alt="card" />
            <img src="/images/payments/11.png" alt="card" />
            <img src="/images/payments/12.png" alt="card" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer {
  background: #f9f9fb;
}

select {
  /* Reset Select */
  appearance: none;
  outline: 0;
  border: 0;
  box-shadow: none;
  /* Personalize */
  flex: 1;
  padding: 0 1em;
  color: #000;
  background-color: #ffffff;
  background-image: none;
  cursor: pointer;
}

/* Remove IE arrow */
select::-ms-expand {
  display: none;
}
</style>
