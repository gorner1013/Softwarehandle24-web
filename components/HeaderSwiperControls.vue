<script setup>
const swiper = useSwiper()
</script>

<script>
export default {
  data() {
    return {
      intervalId: null,
    }
  },
  mounted() {
    this.startInterval();
  },
  beforeUnmount() {
    this.stopInterval()
  },
  methods: {
    nextSlide() {
      this.$refs.nextSlide.click()
    },
    startInterval() {
      this.intervalId = setInterval(this.nextSlide, 25000)
    },
    stopInterval() {
      clearInterval(this.intervalId)
    },
  },
}
</script>

<template>
  <div class="flex justify-center items-center lg:mt-0 mt-8 mb-4">
    <div
      v-for="(slide, idx) in swiper.slides"
      :key="idx"
      :class="
        swiper.realIndex !== idx
          ? 'bg-gray-700 w-3.25 h-3.25 lg:w-4.25 lg:h-4.25 rounded-full mx-2 border border-1.5 border-gray-600'
          : 'bg-gray-800 w-3.25 h-3.25 lg:w-4.25 lg:h-4.25 rounded-full mx-2'
      "
      @click="
        () => {
          swiper.slideToLoop(idx)
        }
      "
    ></div>
  </div>
  <div
    ref="nextSlide"
    class="w-0 h-0"
    @click="
      () => {
        swiper.slideNext()
      }
    "
  ></div>
</template>

<style></style>
