<script setup lang="ts">
import type {
  ListingResult,
  Product,
  ShopwareSearchParams,
} from '@shopware-pwa/types'
import {
  getProductThumbnailUrl,
  getProductUrl,
  getTranslatedProperty,
} from '@shopware-pwa/helpers-next'

const { t: searchT } = useMessages('search')
const route = useRoute()
const router = useRouter()

const {
  search,
  getElements: products,
  getTotalPagesCount,
  getCurrentPage,
  changeCurrentPage,
  loading,
  setInitialListing,
  getCurrentListing,
  changeCurrentSortingOrder,
  getSortingOrders,
  getCurrentSortingOrder,
} = useListing({
  listingType: 'productSearchListing',
  defaultSearchCriteria: {
    limit: 8,
    p: 1,
  },
})

const { data: productSearch } = await useAsyncData(
  'productSearch',
  async () => {
    await search(route.query)
    return getCurrentListing.value
  },
  {
    watch: [route],
  },
)
async function changePage(page: number) {
  await router.push({
    query: {
      ...route.query,
      p: page,
    },
  })
  changeCurrentPage(page, route.query as Partial<ShopwareSearchParams>)
}

setInitialListing(productSearch.value as Partial<ListingResult<Product>>)

const viewMode = ref(0)

async function onOrderChange(onOrderChangeEvent: Event) {
  await router.push({
    query: {
      ...route.query,
      order: (onOrderChangeEvent.target as HTMLSelectElement).value,
    },
  })
  changeCurrentSortingOrder(
    (onOrderChangeEvent.target as HTMLSelectElement).value,
    route.query as Partial<ShopwareSearchParams>,
  )
}
const isLoading = ref(false)
async function getProduct(child: any) {
  isLoading.value = true
  await router.push(getProductUrl(child))
  // window.location.reload();
  await new Promise((resolve) => setTimeout(resolve, 500))
  isLoading.value = false
}
</script>

<script lang="ts">
export default {
  name: 'SearchResultPage',
}
</script>

<template>
  <div
    class="w-full mx-auto container my-10"
    data-testid="search-results-container"
  >
    <div
      v-if="loading"
      class="w-full fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-100"
    >
      <FullScreenSpinner />
    </div>
    <div class="px-5 w-full">
      <div class="mb-8 mt-20 md:mt-0 text-3xl text-center text-black">
        <p v-if="products.length">
          {{ searchT('title') }} "<strong>{{ route.query.query }}</strong
          >"
        </p>
        <p v-else v-text="searchT('notFound')" />
      </div>
      <div class="flex flex-col lg:flex-row justify-between w-full">
        <div class="w-full lg:w-3/12 lg:mx-10 mb-5">
          <h1 class="text-8 text-black font-bold" v-text="searchT('filters')" />
          <ListingFilters class="flex mt-8" />
        </div>
        <div class="ml-0 w-full xl:ml-7.5 lg:flex-1">
          <div class="mb-4.5 flex gap-5">
            <select
              class="cursor-pointer mr-auto h-7.5 w-36 sm:w-50 flex-initial rounded-1.25 bg-gray-300 text-sm font-medium leading-6 not-italic text-black appearance-none px-2 outline-none"
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
                class="hidden xl:block mr-1.25 h-7.5 w-7.5 cursor-pointer"
                @click="viewMode = 0"
              />
              <img
                :src="
                  viewMode === 0
                    ? '/svgs/listview.svg'
                    : '/svgs/listview-active.svg'
                "
                class="mr-1.25 hidden h-7.5 w-7.5 xl:block cursor-pointer"
                @click="viewMode = 1"
              />
              <img
                v-if="getCurrentPage > 1"
                src="/svgs/prevbtn.svg"
                class="mr-1.25 h7.5 w-7.5 cursor-pointer"
                @click="changePage(getCurrentPage - 1)"
              />
              <img
                v-if="getCurrentPage < getTotalPagesCount"
                src="/svgs/nextbtn.svg"
                class="mr-1.25 h-7.5 w-7.5 cursor-pointer"
                @click="changePage(getCurrentPage + 1)"
              />
              <div
                class="cursor-pointer h-7.5 flex items-center justify-center rounded-1.25 bg-gray-300 pl-2.5 pr-5 text-center text-xs font-medium leading-6.5 not-italic not-italic text-black whitespace-nowrap"
              >
                {{ searchT('page') }} {{ getCurrentPage }} {{ searchT('of') }}
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
              v-for="product in products"
              :key="product.id"
              class="shadow-2.5xl rounded-tr-12.5 rounded-br-2.5 items-center rounded-bl-12.5 rounded-tl-2.5 flex bg-gradient-to-tl from-slate-100 to-slate-50 border-solid border border-white shadow p-4 sm:gap-6 md:p-8 hover:from-slate-200 hover:to-slate-100"
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
                      <div v-if="product.ratingAverage" class="mt-1 flex items-center justify-center">
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
                        <div v-if="!product.ratingAverage % 2" class="flex">
                          <div v-for="i in 5" :key="i">
                            <i
                              v-if="product.ratingAverage / 2 < i"
                              class="fa-regular fa-star fa-md text-primary"
                            ></i>
                          </div>
                        </div>
                        <div v-if="product.ratingAverage % 2" class="flex">
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
</style>
