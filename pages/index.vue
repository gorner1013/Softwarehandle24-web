<script setup lang="ts">
import type {
  CmsBlockImageFourColumn,
  CmsBlockImageThreeColumn,
} from '@shopware-pwa/composables-next'
import { getCategoryRoute } from '@shopware-pwa/helpers-next'
import { useLandingPage } from '../composables/useLandingPage'

const { data } = await useFetch('/api/navigations')
const router = useRouter()
const mobileModalView = useModal()
const landingPage = useLandingPage()
const isLoading = ref(false)
const { t: homeT } = useMessages('home')
const isShowMore = ref(false)

async function getCategory(child: any) {
  console.log('child', child.name)
  mobileModalView.close()
  isLoading.value = true
  await router.push(getCategoryRoute(child))
  window.location.reload()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  isLoading.value = false
}

const isContinueReading = ref(false)
const sliderBlock = computed(
  () => landingPage.value?.cmsPage?.sections?.[0]?.blocks?.[0] ?? null,
)
</script>

<template>
  <nav
    v-if="isLoading"
    class="w-full fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-100"
  >
    <FullScreenSpinner />
  </nav>
  <!-- <div class="text-black">
    <CmsPage v-if="landingPage?.cmsPage" :content="landingPage.cmsPage" />
  </div> -->
  <main>
    <div class="relative">
      <img src="/images/home-background.png" class="w-full h-full absolute" />
      <div class="max-w-360 px-5 md:px-10 m-auto flex flex-row items-center">
        <Swiper
          :slides-per-view="1"
          :loop="true"
          :modules="[SwiperAutoplay, SwiperEffectCreative]"
          :autoplay="{
            delay: 25000,
            disableOnInteraction: true,
          }"
        >
          <SwiperSlide
            key="0"
            class="flex lg:flex-row flex-col justify-center z--999 flex xl:gap-37 lg:gap-25 items-center"
          >
            <NuxtImg
              src="/images/home-slide1.png"
              alt="slide.alt"
              class="lg:mt-17 lg:mb-11 my-8 lg:w-1/3 lg:h-1/3 md:w-1/1.3 md:h-1/1.3 sm:w-1/1.3 md:h-1/1.3 lg:px-0 px-11"
            />
            <div class="flex flex-col xl:max-w-110 lg:max-w-90 ml-0">
              <h2
                class="md:text-10.5 xl:text-11.5 lg:text-9.5 lg:leading-11.5 text-8 font-bold text-gray-800 mb-3 leading-9.5 xl:leading-13.5"
                v-text="homeT('title1')"
              />
              <p
                class="text-gray-800 md:text-4.5 lg:font-bold font-semibold lg:mb-10 mb-8 md:leading-5.5 leading-4.9"
                v-text="homeT('description1')"
              />
              <div class="flex justify-start w-full">
                <button
                  class="bg-gray-800 text-white lg:w-[214px] w-full duration-300 hover:opacity-80 py-3.5 text-3.5 font-bold rounded-2 cursor-pointer border border-solid border-b-1 border-b-primary"
                  @click="getCategory(data[0].children[0])"
                  v-text="homeT('showMore')"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide
            key="1"
            class="flex lg:flex-row flex-col justify-center z--999 flex xl:gap-37 lg:gap-25 items-center"
          >
            <NuxtImg
              src="/images/home-slide1.png"
              alt="slide1.alt"
              class="lg:mt-17 lg:mb-11 my-8 lg:w-1/3 lg:h-1/3 md:w-1/1.3 md:h-1/1.3 sm:w-1/1.3 md:h-1/1.3 lg:px-0 px-11"
            />
            <div class="flex flex-col xl:max-w-110 lg:max-w-90 ml-0">
              <h2
                class="md:text-10.5 xl:text-11.5 lg:text-9.5 lg:leading-11.5 text-8 font-bold text-gray-800 mb-3 leading-9.5 xl:leading-13.5"
                v-text="homeT('title1')"
              />
              <p
                class="text-gray-800 md:text-4.5 lg:font-bold font-semibold lg:mb-10 mb-8 md:leading-5.5 leading-4.9"
                v-text="homeT('description1')"
              />
              <div class="flex justify-start w-full">
                <button
                  class="bg-gray-800 text-white lg:w-[214px] w-full duration-300 hover:opacity-80 py-3.5 text-3.5 font-bold rounded-2 cursor-pointer border border-solid border-b-1 border-b-primary"
                  @click="getCategory(data[0].children[0])"
                  v-text="homeT('showMore')"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide
            key="2"
            class="flex lg:flex-row flex-col justify-center z--999 flex xl:gap-37 lg:gap-25 items-center"
          >
            <NuxtImg
              src="/images/home-slide1.png"
              alt="slide1.alt"
              class="lg:mt-17 lg:mb-11 my-8 lg:w-1/3 lg:h-1/3 md:w-1/1.3 md:h-1/1.3 sm:w-1/1.3 md:h-1/1.3 lg:px-0 px-11"
            />
            <div class="flex flex-col xl:max-w-110 lg:max-w-90 ml-0">
              <h2
                class="md:text-10.5 xl:text-11.5 lg:text-9.5 lg:leading-11.5 text-8 font-bold text-gray-800 mb-3 leading-9.5 xl:leading-13.5"
                v-text="homeT('title1')"
              />
              <p
                class="text-gray-800 md:text-4.5 lg:font-bold font-semibold lg:mb-10 mb-8 md:leading-5.5 leading-4.9"
                v-text="homeT('description1')"
              />
              <div class="flex justify-start w-full">
                <button
                  class="bg-gray-800 text-white lg:w-[214px] w-full duration-300 hover:opacity-80 py-3.5 text-3.5 font-bold rounded-2 cursor-pointer border border-solid border-b-1 border-b-primary"
                  @click="getCategory(data[0].children[0])"
                  v-text="homeT('showMore')"
                />
              </div>
            </div>
          </SwiperSlide>
          <HeaderSwiperControls />
        </Swiper>
      </div>
    </div>
    <ul
      class="max-w-360 px-5 md:px-10 m-auto mt-10 flex lg:flex-row flex-col gap-5 lg:gap-7.5 lg:justify-between justify-start items-center"
    >
      <li
        class="w-full rounded-5 bg-gray-800 flex lg:flex-col flex-row items-center lg:justify-center justify-start md:p10 p-5 md:gap-10 gap-5 lg:h-100 h-auto"
      >
        <img
          src="/images/key-icon.png"
          alt="key"
          class="xl:w-21 lg:w-15 w-10 xl:h-21 lg:h-15 h-10"
        />
        <div class="flex flex-col">
          <p
            class="text-white lg:text-9 md:text-8 text-5 font-bold lg:text-center text-left"
            v-text="homeT('$cards.one.title')"
          />
          <p
            class="md:mt-0 mt-1 text-white lg:text-5 text-3.5 font-semibold lg:text-center text-left"
            v-text="homeT('$cards.one.content')"
          />
        </div>
      </li>
      <li
        class="w-full rounded-5 bg-gray-800 flex lg:flex-col flex-row items-center lg:justify-center justify-start md:p10 p-5 md:gap-10 gap-5 lg:h-100 h-auto"
      >
        <img
          src="/images/search-icon.png"
          alt="key"
          class="xl:w-21 lg:w-15 w-10 xl:h-21 lg:h-15 h-10"
        />
        <div class="flex flex-col">
          <p
            class="text-white lg:text-9 md:text-8 text-5 font-bold lg:text-center text-left"
            v-text="homeT('$cards.two.title')"
          />
          <p
            class="md:mt-0 mt-1 text-white lg:text-5 text-3.5 font-semibold lg:text-center text-left"
            v-text="homeT('$cards.two.content')"
          />
        </div>
      </li>
      <li
        class="w-full rounded-5 bg-gray-800 flex lg:flex-col flex-row items-center lg:justify-center justify-start md:p10 p-5 md:gap-10 gap-5 lg:h-100 h-auto"
      >
        <img
          src="/images/question-icon.png"
          alt="key"
          class="xl:w-21 lg:w-15 w-10 xl:h-21 lg:h-15 h-10"
        />
        <div class="flex flex-col">
          <p
            class="text-white lg:text-9 md:text-8 text-5 font-bold lg:text-center text-left"
            v-text="homeT('$cards.three.title')"
          />
          <p
            class="md:mt-0 mt-1 text-white lg:text-5 text-3.5 font-semibold lg:text-center text-left"
            v-text="homeT('$cards.three.content')"
          />
        </div>
      </li>
    </ul>
    <div
      class="max-w-360 mx-auto lg:mt-30 md:mt-15 mt-8 md:px-10 px-5 flex lg:flex-row flex-col lg:justify-between justify-center items-center lg:gap-12 xl:gap-21"
    >
      <div class="lg:w-1/2 w-full lg:flex lg:flex-col hidden">
        <h1
          class="text-gray-800 md:text-8 text-7 font-semibold break-words"
          v-text="homeT('$intro.title')"
        />
        <p
          class="md:mt-5 mt-3 md:text-4 font-medium leading-6 text-gray-800"
          v-text="homeT('$intro.contentOne')"
        />
        <p
          class="md:mt-5 mt-3 md:text-4 font-medium leading-6 text-gray-800"
          v-text="homeT('$intro.contentTwo')"
        />
        <h2
          class="mt-7.5 md:text-6 text-5 font-semibold leading-6 text-gray-800"
          v-text="homeT('$intro.benefit.title')"
        />
        <p
          class="md:mt-5 mt-3 md:text-4 font-medium leading-6 text-gray-800"
          v-text="homeT('$intro.benefit.content')"
        />
      </div>
      <div class="lg:w-1/2 w-full lg:hidden">
        <h1
          class="text-gray-800 md:text-8 text-7 font-semibold break-words"
          v-text="homeT('$intro.title')"
        />
        <p
          class="md:mt-5 mt-3 md:text-4 font-medium leading-6 text-gray-800"
          v-text="homeT('$intro.contentOne')"
        />
        <p
          v-if="isContinueReading"
          class="md:mt-5 mt-3 md:text-4 font-medium leading-6 text-gray-800"
          v-text="homeT('$intro.contentTwo')"
        />
        <p
          v-if="isContinueReading == false"
          class="md:mt-5 mt-3 md:text-4 font-medium leading-6 text-gray-800"
          v-text="homeT('$intro.lessContentTwo')"
        />
        <h2
          v-if="isContinueReading"
          class="mt-7.5 md:text-6 text-5 font-semibold leading-6 text-gray-800"
          v-text="homeT('$intro.benefit.title')"
        />
        <p
          v-if="isContinueReading"
          class="md:mt-5 mt-3 md:text-4 font-medium leading-6 text-gray-800"
          v-text="homeT('$intro.benefit.content')"
        />
        <div v-if="isContinueReading == false" class="items-center">
          <button
            class="text-slate-light-11 max-w-360 mx-auto lg:mt-6 mt-4 px-3.75 py-2.5 flex text-4 font-medium rounded-2 border border-slate-light-7"
            @click="isContinueReading = true"
          >
            {{ homeT('$intro.continueReading') }}
          </button>
        </div>
      </div>
      <div
        class="lg:w-1/2 w-full lg:flex lg:flex-col text-center mt-21.5 lg:mt-0"
      >
        <p
          class="md:mt-5 mt-3 md:text-4 text-3 font-medium leading-6 text-gray-800 pb-3"
          v-text="homeT('$advantage.title')"
        />
        <div
          class="flex lg:flex-row flex-col xl:gap-4 gap-3 justify-center items-center mb-4.5"
        >
          <div
            class="box-gradient-1 !border-b-white w-full flex flex-col items-center py-8"
          >
            <img src="/svgs/truck-fast.svg" alt="truck-fast" class="w-10 h-8" />
            <p
              class="mt-4 text-4.5 font-semibold leading-6 text-slate-2"
              v-text="homeT('$advantage.content.one')"
            />
          </div>
          <div
            class="box-gradient-2 !border-b-white w-full flex flex-col items-center py-8"
          >
            <img src="/svgs/globe.svg" alt="globe" class="w-10 h-8" />
            <p
              class="mt-4 text-4.5 font-semibold leading-6 text-slate-2"
              v-text="homeT('$advantage.content.two')"
            />
          </div>
        </div>
        <div
          class="lg:hidden box-gradient-3 !border-b-white w-full flex flex-col items-center py-8 mb-4.5"
        >
          <img src="/svgs/USER-tie.svg" alt="USER-tie" class="w-10 h-8" />
          <p
            class="mt-4 text-4.5 font-semibold leading-6 text-slate-2"
            v-text="homeT('$advantage.content.three')"
          />
        </div>
        <div
          class="flex lg:flex-row xl:gap-4 gap-3 justify-center items-center mb-4.5"
        >
          <div
            class="box-gradient-4 !border-b-white w-full flex flex-col items-center py-8"
          >
            <img
              src="/svgs/Phone-volume.svg"
              alt="Phone-volume"
              class="w-10 h-8"
            />
            <p
              class="mt-4 text-4.5 font-semibold leading-6 text-slate-2"
              v-text="homeT('$advantage.content.four')"
            />
          </div>
          <div
            class="hidden lg:flex lg:flex-col !border-b-white box-gradient-3 w-full items-center py-8"
          >
            <img src="/svgs/USER-tie.svg" alt="USER-tie" class="w-10 h-8" />
            <p
              class="mt-4 text-4.5 font-semibold leading-6 text-slate-2"
              v-text="homeT('$advantage.content.three')"
            />
          </div>
          <div
            class="box-gradient-5 !border-b-white w-full flex flex-col items-center py-8"
          >
            <img
              src="/svgs/Comments-question.svg"
              alt="Comments-question"
              class="w-10 h-8"
            />
            <p
              class="mt-4 text-4.5 font-semibold leading-6 text-slate-2"
              v-text="homeT('$advantage.content.five')"
            />
          </div>
        </div>
        <div
          class="box-gradient-6 !border-b-white w-full flex flex-col items-center py-8 mb-4.5"
        >
          <div class="flex gap-4.5">
            <img src="/svgs/cc-PAYPAL.svg" alt="cc-PAYPAL" class="w-9 h-8" />
            <img src="/svgs/cc-STRIPE.svg" alt="cc-STRIPE" class="w-9 h-8" />
            <img
              src="/svgs/cc-mastercard.svg"
              alt="cc-mastercard"
              class="w-9 h-8"
            />
            <img src="/svgs/cc-visa.svg" alt="cc-visa" class="w-9 h-8" />
            <img src="/svgs/cc-amex.svg" alt="cc-amex" class="w-9 h-8" />
            <img
              src="/svgs/cc-apple-pay.svg"
              alt="cc-apple-pay"
              class="w-9 h-8 sm:flex hidden"
            />
          </div>
          <p
            class="mt-4 text-4.5 font-semibold leading-6 text-slate-2"
            v-text="homeT('$advantage.content.six')"
          />
        </div>
      </div>
    </div>
    <div class="w-full lg:mt-30 mt-15 bg-image-wrapper">
      <div class="flex flex-col max-w-340 pl-5 xl:pl-0 m-auto py-10 gap-5">
        <p
          class="w-full md:text-center text-8 font-medium text-gray-800"
          v-text="homeT('recommentdation')"
        ></p>
        <div>
          <HomeProductSlider
            :block="(sliderBlock as CmsBlockImageFourColumn)"
          />
        </div>
      </div>
    </div>
    <div class="m-auto lg:my30 sm:my15 my8 max-w-360 md:px-10 px-5">
      <img src="/svgs/ticket.svg" alt="ticket" class="w-full" />
    </div>
    <div class="mb-10">
      <h1 class="max-w-360 mx-auto lg:mt-30 md:mt-15 mt-8 md:px-10 px-5 flex text-8 font-semibold">
      {{ homeT('$topCategories.title') }}</h1>
      <ul
        class="max-w-360 px-5 md:px-10 m-auto mt-5 grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-4 lg:justify-between justify-start items-center">
        <li
          class="relative group cursor-pointer w-full rounded-5 bg-gradient-to-r from-teal-600 to-cyan-600 flex flex-col  justify-between p-8 pr-45">
          <div class="h-40">
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.microsoft')" />
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.windowServer')" />
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex gap-1 items-center">
              <p class="text-white text-3.5 font-medium text-left group-hover:underline group-hover:underline-offset-4 decoration-white" v-text="homeT('$topCategories.showNow')" />
              <img src="/svgs/arrow-right1.svg" class="translate-x-0 duration-450 group-hover:translate-x-2" alt="key" />
            </div>
          </div>
          <img src="/images/categories/windowServer.png" alt="key" class="absolute right-0 bottom-0 h-5/6" />
        </li>
        <li
          class="relative group cursor-pointer w-full rounded-5 bg-gradient-to-r from-orange-500 to-amber-700 flex flex-col justify-between p-8 pr-45">
          <div class="h-40">
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.microsoft')" />
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.officeSuite')" />
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex gap-1 items-center">
              <p class="text-white text-3.5 font-medium text-left  group-hover:underline group-hover:underline-offset-4 decoration-white" v-text="homeT('$topCategories.showNow')" />
              <img src="/svgs/arrow-right1.svg" class="translate-x-0 duration-450 group-hover:translate-x-2" alt="key" />
            </div>
          </div>
          <img src="/images/categories/officeSuite.png" alt="key" class="absolute right-0 bottom-0 h-5/6" />
        </li>
        <li
        class="relative group cursor-pointer w-full rounded-5 bg-gradient-to-r from-purple-600 to-violet-600 flex flex-col  justify-between p-8 pr-45">
          <div class="h-40">
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.microsoft')" />
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.visualStudio')" />
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex gap-1 items-center">
              <p class="text-white text-3.5 font-medium text-left group-hover:underline group-hover:underline-offset-4 decoration-white" v-text="homeT('$topCategories.showNow')" />
              <img src="/svgs/arrow-right1.svg" class="translate-x-0 duration-450 group-hover:translate-x-2" alt="key" />
            </div>
          </div>
          <img src="/images/categories/visualStudio.png" alt="key" class="absolute right-0 bottom-0 h-5/6" />
        </li>
      </ul>
      <ul
        class="max-w-360 px-5 md:px-10 m-auto mt-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:justify-between justify-start items-center" v-if="isShowMore">
        <li
          class="relative group cursor-pointer w-full rounded-5 bg-gradient-to-r from-teal-600 to-cyan-600 flex flex-col  justify-between p-8 pr-45">
          <div class="h-40">
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.microsoft')" />
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.windowServer')" />
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex gap-1 items-center">
              <p class="text-white text-3.5 font-medium text-left group-hover:underline group-hover:underline-offset-4 decoration-white" v-text="homeT('$topCategories.showNow')" />
              <img src="/svgs/arrow-right1.svg" class="translate-x-0 duration-450 group-hover:translate-x-2" alt="key" />
            </div>
          </div>
          <img src="/images/categories/windowServer.png" alt="key" class="absolute right-0 bottom-0 h-5/6" />
        </li>
        <li
          class="relative group cursor-pointer w-full rounded-5 bg-gradient-to-r from-orange-500 to-amber-700 flex flex-col justify-between p-8 pr-45">
          <div class="h-40">
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.microsoft')" />
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.officeSuite')" />
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex gap-1 items-center">
              <p class="text-white text-3.5 font-medium text-left group-hover:underline group-hover:underline-offset-4 decoration-white" v-text="homeT('$topCategories.showNow')" />
              <img src="/svgs/arrow-right1.svg" class="translate-x-0 duration-450 group-hover:translate-x-2" alt="key" />
            </div>
          </div>
          <img src="/images/categories/officeSuite.png" alt="key" class="absolute right-0 bottom-0 h-5/6" />
        </li>
        <li
        class="relative group cursor-pointer w-full rounded-5 bg-gradient-to-r from-purple-600 to-violet-600 flex flex-col  justify-between p-8 pr-45">
          <div class="h-40">
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.microsoft')" />
            <h1 class="text-white text-7 font-semibold text-left" v-text="homeT('$topCategories.visualStudio')" />
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex gap-1 items-center">
              <p class="text-white text-3.5 font-medium text-left group-hover:underline group-hover:underline-offset-4 decoration-white" v-text="homeT('$topCategories.showNow')" />
              <img src="/svgs/arrow-right1.svg" class="translate-x-0 duration-450 group-hover:translate-x-2" alt="key" />
            </div>
          </div>
          <img src="/images/categories/visualStudio.png" alt="key" class="absolute right-0 bottom-0 h-5/6" />
        </li>
      </ul>
      <div class="items-center" v-if="isShowMore==false">
        <button class="max-w-360 mx-auto lg:mt-6 mt-4 px-3.75 py-2.5 flex text-4 font-medium rounded-2 border border-gray-500" @click="isShowMore=true">
        {{ homeT('showMore') }}</button>
      </div>
    </div>
    

  </main>
</template>

<style>
.bg-image-wrapper {
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: auto;
  z-index: 0;
}

.bg-image-wrapper::before {
  content: '';
  position: absolute;
  /* top: 0; */
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/section-3.jpg');
  background-size: cover;
  opacity: 0.1;
  z-index: -1;
  /* Ensure the background image stays behind the content */
}

.box-gradient-1 {
  background: linear-gradient(0deg, white 15%, #e7ffff 100%) padding-box,
    linear-gradient(0deg, white 15%, #02a1a1 100%) border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-left-color: white;
  border: 2px solid transparent;
}
.box-gradient-2 {
  background: linear-gradient(0deg, white 15%, #ffe3e4 100%) padding-box,
    linear-gradient(0deg, white 15%, #b51a1d 100%) border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border: 2px solid transparent;
}
.box-gradient-3 {
  background: linear-gradient(0deg, white 15%, #e3f5ff 100%) padding-box,
    linear-gradient(0deg, white 15%, #0e83c6 100%) border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border: 2px solid transparent;
}
.box-gradient-4 {
  background: linear-gradient(0deg, white 15%, #fff4ea 100%) padding-box,
    linear-gradient(0deg, white 15%, #ff8c1a 100%) border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border: 2px solid transparent;
}
.box-gradient-5 {
  background: linear-gradient(0deg, white 15%, #dcfaec 100%) padding-box,
    linear-gradient(0deg, white 15%, #21a366 100%) border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border: 2px solid transparent;
}
.box-gradient-6 {
  background: linear-gradient(0deg, white 15%, #f7effd 100%) padding-box,
    linear-gradient(0deg, white 15%, #8a59b0 100%) border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border: 2px solid transparent;
}
</style>
