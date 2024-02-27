<script setup lang="ts">
const { params } = useRoute()
const { document } = await useMarkdown(`about`)
</script>

<template>
  <div>
    <div v-if="document" class="px-0 lg:mx-auto mb-8 max-w-6xl">
      <div class="mt-4  gap-x-12 gap-y-6">
        <div>
          <div class="mb-8">
            <h1 class="text-gold font-serif text-4xl font-bold" v-html="document.title"></h1>
            <p class="text-gold font-serif text-4 font-normal mt-5" v-html="document.description">
            </p>
          </div>
          <div class="blog__doc px-4 lg:px-0 text-black mt-10">
            <ContentRenderer :value="document" />
          </div>
        </div>
        <div class="px-4 block lg:hidden my-3">
          <div class="h-[1px] bg-yellow-lighter"></div>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="postcss">
.blog__doc {
  hr {
    @apply mt-8;
    @apply border-yellow-dark;
  }

  h1 {
    @apply mb-3 mt-8 font-serif text-3.5xl font-bold text-black;
  }

  p {
    @apply font-sans font-normal text-3.5xl text-black;
  }
}
</style>



