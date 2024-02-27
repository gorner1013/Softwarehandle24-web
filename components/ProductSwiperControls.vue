<script setup>
const swiper = useSwiper()
</script>

<template>
  <div class="dot-container ">
    <div v-for="(slide, idx) in swiper.slides" :key="idx"
      :style="`background-color: ${swiper.realIndex !== idx ? '#9A9A9A' : '#252b31'};`" @click="() => {
        swiper.slideToLoop(idx)
      }
        "></div>
  </div>
</template>

<style>
.dot-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.dot-container div {
  background-color: #ffffff;
  width: 17px;
  height: 17px;
  border-radius: 100%;
  margin-left: 8px;
  margin-right: 8px;
}

.nextSlide {
  width: 0px;
  height: 0px;
}
</style>
