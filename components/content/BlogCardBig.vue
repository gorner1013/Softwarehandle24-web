<script setup lang="ts">
import type { BlogPost } from '../../types/post'
const { post } = defineProps<{ post: BlogPost }>()
const postRoute = computed(() => makeBlogPostRoute(post.localizedSlug))
console.log("postRoute", postRoute)
console.log("post", post)
</script>

<template>
  <div>
    

    <NuxtLink :to="post.slug" class="cursor-pointer">
      <h3
        class="text-gold blog__title mt-4 font-serif text-2xl font-bold lg:mt-5 lg:text-4xl lg:text-white"
        v-html="post.title"
      ></h3>
    </NuxtLink>
    
  </div>
</template>

<style lang="postcss" scoped>
.blog__title span {
  @apply text-gold;
}

.module-border-wrap{
  background: linear-gradient(to right, #BA9859, #E6C78A,#BA9859);
  @apply rounded-lg;
}

.module{
  @apply bg-gray-darkest;
  padding: 14px 36px;
  @apply rounded-lg
}

</style>
