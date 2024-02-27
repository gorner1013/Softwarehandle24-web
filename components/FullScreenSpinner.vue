<script setup></script>

<template>
  <div class="loader w-10 h-10 rounded-1/2 bg-white relative"></div>
</template>

<style scoped>
.loader {
  box-shadow:
    32px 0 #fff,
    -32px 0 #fff;
  animation: flash 0.5s ease-out infinite alternate;
}

@keyframes flash {
  0% {
    background-color: #fff2;
    box-shadow:
      62px 0 #fff2,
      -62px 0 #ff8c1a;
  }
  50% {
    background-color: #ff8c1a;
    box-shadow:
      62px 0 #fff2,
      -62px 0 #fff2;
  }
  100% {
    background-color: #fff2;
    box-shadow:
      62px 0 #ff8c1a,
      -62px 0 #fff2;
  }
}
</style>
