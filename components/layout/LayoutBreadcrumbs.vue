<script setup lang="ts">
import { getCategoryRoute } from '@shopware-pwa/helpers-next'

const router = useRouter()
const { breadcrumbs } = useBreadcrumbs()
const { data } = await useFetch('/api/navigations')
function path(path: string) {
  router.push(path)
}
async function list(name: string) {
  for (const item of data?.value) {
    if (name === item.breadcrumb[1]) {
      await router.push(getCategoryRoute(item))
      window.location.reload()
    }
    for (const child of item.children) {
      if (name === child.breadcrumb[2]) {
        await router.push(getCategoryRoute(child))
        window.location.reload()
      }
      for (const child1 of child.children) {
        if (name === child1.breadcrumb[3]) {
          await router.push(getCategoryRoute(child1))
          window.location.reload()
        }
      }
    }
  }
}
</script>

<template>
  <nav
    class="md:flex hidden flex-row max-w-360 m-auto mt-6 px-5 gap-1"
    aria-label="Breadcrumb"
  >
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
      <li class="inline-flex items-center">
        <a href="/">
          <i class="fa-solid fa-house-chimney"></i>
        </a>
      </li>
      <li
        v-for="breadcrumb in breadcrumbs"
        :key="breadcrumb.path"
        class="inline-flex items-center justify-center"
      >
        <p class="flex items-center text-4.5 font-medium text-gray-700 mr-1">
          /
        </p>
        <p
          v-if="breadcrumb.path"
          class="inline-flex items-center text-4.5 font-medium text-gray-700 hover:text-primary cursor-pointer"
          @click="path(breadcrumb.path)"
        >
          {{ breadcrumb.name }}
        </p>
        <p
          v-else
          class="inline-flex items-center text-4 font-medium text-gray-700 hover:text-primary cursor-pointer"
          @click="list(breadcrumb.name)"
        >
          {{ breadcrumb.name }}
        </p>
      </li>
    </ol>
  </nav>
</template>
