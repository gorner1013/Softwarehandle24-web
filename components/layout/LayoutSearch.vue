<script setup lang="ts">
import { onClickOutside, useFocus, useMagicKeys } from '@vueuse/core'
import { useSideMenuModal } from '~/composables/useModal';

withDefaults(
  defineProps<{
    displayTotal?: number
  }>(),
  { displayTotal: 10 },
)

defineEmits<{
  (e: 'link-clicked'): void
}>()

const { searchTerm, search } = useProductSearchSuggest()

// True when the search bar is active and user can type in the search field
const active = ref(false)

// Reference to the search container
const searchContainer = ref(null)
const searchInput = ref()

watch(active, (value) => {
  const { focused } = useFocus(searchInput)
  focused.value = value
})

// String the user has typed in the search field
const typingQuery = ref('')
const performSuggestSearch = useDebounceFn((value) => {
  searchTerm.value = value
  search()
}, 300)

watch(typingQuery, (value) => {
  if (value.length >= 3) {
    performSuggestSearch(value)
  }
})

// Defer the search request to prevent the search from being triggered too after typing

if (process.client) {
  onClickOutside(searchContainer, () => {
    active.value = false
  })
}

const { enter } = useMagicKeys({ target: searchInput })
const { push } = useRouter()
const { t: globalT } = useMessages('global')

const sideMenuModal = useSideMenuModal()

watch(enter, (value) => {
  if (!value) return
  sideMenuModal.close()
  active.value = false
  push(`/search?query=${typingQuery.value}`)
  window.location.replace(`/search?query=${typingQuery.value}`)
})

function showAll(typingQuery: any) {
  if (active.value === false) {
    active.value = true
  } else {
    active.value = false
  }
  if (!typingQuery) return
  sideMenuModal.close()

  push(`/search?query=${typingQuery}`)
  window.location.replace(`/search?query=${typingQuery}`)
}
</script>

<template>
  <nav ref="searchContainer" class="relative group transition">
    <div class="lg:hidden flex items-center">
      <input
        ref="searchInput"
        v-model="typingQuery"
        :class="
          active === false
            ? 'border-2 border-solid border-gray-400 bg-white rounded-full w-0 pl-4 text-black duration-300 focus:outline-none text-4'
            : 'bg-white rounded-full w-48 h-7 pl-4 text-black   duration-300 focus:outline-none border-2 border-solid border-gray-400 text-4'
        "
        :placeholder="globalT('layoutSearch')"
        type="text"
        name="search"
        @click="active = true"
      />
      <div
        class="absolute right-0 p-2 bg-gray-800 rounded-full cursor-pointer"
        @click="showAll(typingQuery)"
      >
        <div class="w-3 h-3 i-carbon-search bg-white"></div>
      </div>
    </div>
  </nav>
</template>
