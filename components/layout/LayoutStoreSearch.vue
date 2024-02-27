<script setup lang="ts">
import { onClickOutside, useFocus, useMagicKeys } from '@vueuse/core'
import { faMagnifyingGlass } from '@fortawesome/sharp-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useSideMenuModal } from '~/composables/useModal'

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
const { t: globalT } = useMessages('global')
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
// Defer the search request to prevent the search from being triggered too after typing
const performSuggestSearch = useDebounceFn((value) => {
  searchTerm.value = value
  search()
}, 300)

watch(typingQuery, (value) => {
  if (value.length >= 3) {
    performSuggestSearch(value)
  }
})

if (process.client) {
  onClickOutside(searchContainer, () => {
    active.value = false
  })
}

const { enter } = useMagicKeys({ target: searchInput })
const { push } = useRouter()

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
  active.value = false
  push(`/search?query=${typingQuery}`)
  window.location.replace(`/search?query=${typingQuery}`)
}
</script>

<template>
  <nav ref="searchContainer" class="relative group transition">
    <div class="hidden lg:flex items-center relative">
      <input
        ref="searchInput"
        v-model="typingQuery"
        class="px-10 py-2 border-1 border-solid border-gray-400 bg-gray-300 rounded-2 w-75 h-10 text-gray-800 duration-300 outline-none text-3.5"
        :placeholder="globalT('layoutSearch')"
        type="text"
        name="search"
      />
      <FontAwesomeIcon
        :icon="faMagnifyingGlass"
        class="absolute left-3 text-gray-800"
        @click="showAll(typingQuery)"
      />
      <!-- <font-awesome-icon icon="fa-sharp fa-thin fa-magnifying-glass" /> -->
    </div>
  </nav>
</template>
