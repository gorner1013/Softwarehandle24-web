<script setup></script>

<template>
  <div
    class="w-5 h-5 rounded-1/2 relative before:content-empty before:absolute before:rounded-1/2 before:border-3 before:border-solid before:border-white before:box-border before:top-0 before:right-0 before:left-0 before:bottom-0 loader"
  ></div>
</template>

<style scoped>
.loader {
  animation: rotate 1s linear infinite;
}
.loader::before {
  animation: prixClipFix 2s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}
</style>
