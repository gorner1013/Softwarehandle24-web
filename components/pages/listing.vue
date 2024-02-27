<script setup lang="ts">
import type { Category } from '@shopware-pwa/types'
import {
  getCategoryRoute,
  getProductThumbnailUrl,
  getProductUrl,
  getTranslatedProperty,
} from '@shopware-pwa/helpers-next'

const { category } = defineProps<{ category: Category }>()
const { t: pagesT } = useMessages('pages')
const {
  search,
  getElements,
  getCurrentPage,
  changeCurrentPage,
  getTotalPagesCount,
  getCurrentSortingOrder,
  getSortingOrders,
  changeCurrentSortingOrder,
} = useListing({
  listingType: 'categoryListing',
  categoryId: category.id,
  defaultSearchCriteria: {
    // set the default criteria
    limit: 4,
    p: 1,
  },
})

search({
  // invoke search() method
  // includes: { // omit this parameter if you want to use the whole product entity
  //   product: ["id", "name", "cover", "calculatedPrice", "translated"],
  //   product_media: ["media"],
  //   media: ["url", "thumbnails"],
  // },
})

function onOrderChange(onOrderChangeEvent: Event) {
  // accept the DOM Event and extract the option's value
  // pass the value to the listing method that triggers the search() method internally
  changeCurrentSortingOrder(
    (onOrderChangeEvent.target as HTMLSelectElement).value,
  )
}
const { data } = await useFetch('/api/navigations')
const viewMode = ref(0)

const isLoading = ref(false)
const router = useRouter()
async function getCategory(child: any) {
  isLoading.value = true
  await router.push(getCategoryRoute(child))
  window.location.reload()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  isLoading.value = false
}
async function getProduct(child: any) {
  isLoading.value = true
  await router.push(getProductUrl(child))
  // window.location.reload();
  await new Promise((resolve) => setTimeout(resolve, 500))
  isLoading.value = false
}
async function onView(value: any) {
  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 500))
  viewMode.value = value
  isLoading.value = false
}
</script>

<template>
  <div>
    <div
      v-if="isLoading"
      class="w-full fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-100"
    >
      <FullScreenSpinner />
    </div>
    <LayoutBreadcrumbs />
    <div class="w-full m-auto max-w-360 flex mt-6 px-5">
      <div
        v-for="item in data"
        v-show="item.name === category.breadcrumb[1]"
        :key="item.id"
        class="w-1xs hidden xl:block"
      >
        <div v-show="item.name === category.breadcrumb[1]">
          <li
            class="h-12.5 flex items-center bg-gray-700 p-5 text-base font-semibold leading-7 not-italic text-white"
          >
            {{ item.name }}
          </li>
          <li
            v-for="child1 in item.children"
            :key="child1.id"
            class="h-12.5 flex items-center bg-gray-300 px-5 text-sm font-semibold leading-7 not-italic cursor-pointer text-black decoration-none hover:underline"
            @click="getCategory(child1)"
          >
            {{ child1.name }}
          </li>
        </div>
        <div
          v-for="child in item.children"
          v-show="child.name === category.breadcrumb[2]"
          :key="child.id"
        >
          <li
            class="h-12.5 flex items-center bg-orange-500 p-5 text-base font-semibold leading-7 not-italic text-white"
          >
            {{ child.name }}
          </li>
          <li
            v-for="child1 in child.children"
            :key="child1.id"
            class="h-12.5 flex items-center bg-gray-300 px-5 text-sm font-semibold leading-7 not-italic cursor-pointer text-black decoration-none hover:underline"
            @click="getCategory(child1)"
          >
            {{ child1.name }}
          </li>
        </div>
        <div
          class="mt-7.5 h-12.5 flex items-center bg-orange-500 p-5 text-base font-medium leading-7 not-italic text-white"
        >
          <img src="/svgs/info-icon.svg" class="pr-2" alt="info-icon" />
          <h3 v-text="pagesT('$listing.discount')" />
        </div>
        <div
          class="flex items-center bg-gray-300 pb-5.25 pl-5 pr-6 pt-5.25 text-xl font-medium leading-7 not-italic text-black"
          v-text="pagesT('$listing.description')"
        />
        <h1 class="mt-9 text-2xl font-bold not-italic text-gray-700">
          {{ category.metaTitle }}
        </h1>
        <div
          class="mt-2 mb-10 text-base font-medium leading-7 not-italic text-gray-700"
        >
          {{ category.metaDescription }}
        </div>
      </div>
      <div class="ml0 w-full xl:ml-7.5 lg:flex-1">
        <div class="mb-4.5 flex gap-5">
          <select
            class="cursor-pointer mr-auto h-7.5 w-36 sm:w-50 flex-initial rounded-1.25 bg-gray-300 text-sm font-medium leading-6 not-italic text-black duration-300 hover:opacity-80 appearance-none px-2 outline-none"
            @change="onOrderChange"
          >
            <option
              v-for="sortingOrder in getSortingOrders"
              :key="sortingOrder.key"
              :value="sortingOrder.key"
              :selected="sortingOrder.key === getCurrentSortingOrder"
            >
              {{ sortingOrder.label }}
            </option>
          </select>
          <div class="flex">
            <img
              :src="
                viewMode === 1
                  ? '/svgs/cardview.svg'
                  : '/svgs/cardview-active.svg'
              "
              class="mr-1.25 hidden xl:block h-7.5 w-7.5 cursor-pointer"
              @click="onView(0)"
            />
            <img
              :src="
                viewMode === 0
                  ? '/svgs/listview.svg'
                  : '/svgs/listview-active.svg'
              "
              class="mr-1.25 hidden h-7.5 w-7.5 xl:block cursor-pointer"
              @click="onView(1)"
            />
            <img
              v-if="getCurrentPage > 1"
              src="/svgs/prevbtn.svg"
              class="mr-1.25 h-7.5 w-7.5 cursor-pointer"
              @click="changeCurrentPage(getCurrentPage - 1)"
            />
            <img
              v-if="getCurrentPage < getTotalPagesCount"
              src="/svgs/nextbtn.svg"
              class="mr-1.25 h-7.5 w-7.5 cursor-pointer"
              @click="changeCurrentPage(getCurrentPage + 1)"
            />
            <div
              class="cursor-pointer h-7.5 flex items-center justify-center rounded-1.25 bg-gray-300 pl-2.5 pr-5 text-center text-xs font-medium leading-6.5 not-italic not-italic text-black whitespace-nowrap"
            >
              {{ pagesT('$listing.page') }} {{ getCurrentPage }} of
              {{ getTotalPagesCount }}
            </div>
          </div>
        </div>
        <div
          :class="
            viewMode === 1
              ? 'grid-cols-1 grid grid-cols-1 mb-20 gap-x-4 gap-y-4 '
              : 'grid-cols-1 grid grid-cols-1 mb-20 gap-x-4 gap-y-4 xl:grid-cols-3 '
          "
        >
          <div
            v-for="product in getElements"
            :key="product.id"
            class="shadow-2.5xl rounded-tr-12.5 rounded-br-2.5 items-center rounded-bl-12.5 rounded-tl-2.5 flex bg-gradient-to-tl from-slate-100 to-slate-50 border-solid border border-white shadow p-4 gap-4 sm:gap-6 md:p-8 hover:from-slate-200 hover:to-slate-100"
            :class="
              viewMode === 1 ? 'flex w-full flex-row' : 'flex-row xl:flex-col'
            "
            @click="getProduct(product)"
          >
            <img
              :src="getProductThumbnailUrl(product)"
              alt="product-image"
              class="h-28 md:h-40"
              :class="viewMode === 1 ? '' : ' xl:ml-0'"
            />
            <div
              class="w-full flex-col items-center justify-center flex-1 xl:flex"
              :class="viewMode === 1 ? 'flex-col' : ''"
            >
              <div
                class="w-full xl:text-center text-left"
                :class="viewMode === 1 ? 'text-left' : ''"
              >
                <div
                  class=" "
                  :class="viewMode === 1 ? 'text-left' : 'xl:px-4'"
                >
                  <h3
                    class="w-full mt-5 text-base font-bold leading-6.5 not-italic text-black hover:underline cursor-pointer"
                    @click="getProduct(product)"
                  >
                    {{ getTranslatedProperty(product, 'name') }}
                  </h3>
                </div>
              </div>
              <div class="w-full mt-2">
                <div class=" " :class="viewMode === 1 ? '' : 'xl:px-0'">
                  <div
                    class="w-full flex flex-row"
                    :class="
                      viewMode === 1
                        ? 'flex-row  gap-2 sm:gap-20 '
                        : 'xl:flex-col xl:justify-center xl:items-center gap-2 sm:gap-20 xl:gap-0'
                    "
                  >
                    <p
                      class="mt-1 text-center text-3.5 sm:text-base font-bold leading-6.5 not-italic text-black whitespace-nowrap"
                    >
                      EUR {{ product.calculatedPrice.unitPrice }}
                    </p>
                    <div v-if="product.ratingAverage"  class="mt-1 flex items-center justify-center">
                      <div v-for="i in 5" :key="i">
                        <i
                          v-if="product.ratingAverage / 2 >= i"
                          class="fa-solid fa-star fa-md text-primary"
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
                            class="fa-regular fa-star fa-md text-primary"
                          ></i>
                        </div>
                      </div>
                      <div v-if="product.ratingAverage % 2 === 1" class="flex">
                        <div v-for="i in 5" :key="i">
                          <i
                            v-if="product.ratingAverage / 2 < i - 1"
                            class="fa-regular fa-star fa-md text-primary"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="text-slate-700 mt-2"
                :class="[
                  $style.description,
                  viewMode === 1 ? 'active' : 'text-left xl:text-center',
                ]"
                v-html="product.description"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" module>
.description {
  font-family: Raleway;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  hyphens: auto;
}

.description > *:not(p:first-of-type) {
  display: none;
}

.description p {
  @apply text-sm md:text-base;

  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  line-height: 1.45;
}

.description p:has(strong) {
  @apply hidden;
}

.description p:has(span) {
  @apply hidden;
}

.description.active {
  text-align: left;
}

.description ul {
  margin: 0 !important;
  padding: 0 !important;
}

.description li,
.description p,
.description div {
  margin: 0;
  padding: 0;
  font-family: Raleway;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
}
</style>
