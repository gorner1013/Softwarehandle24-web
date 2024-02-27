<script setup lang="ts">
import { useModal } from '~/composables/useModal'
const props = withDefaults(
  defineProps<{
    controller: ReturnType<typeof useModal>
    side: 'left' | 'right'
  }>(),
  {
    side: 'right',
  },
)

const { controller } = toRefs(props)
const { isOpen, close } = controller.value

const sidebarContentElement = ref()
onClickOutside(sidebarContentElement, () => close())
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-300 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="isOpen"
        class="min-w-screen fixed z-20 inset-0 overflow-y-auto bg-black bg-opacity-50"
      >
        <div class="flex items-start justify-center h-screen text-center">
          <Transition
            enter-active-class="transition ease-out duration-500 transform"
            :enter-from-class="
              side === 'left' ? '-translate-x-full' : 'translate-x-full'
            "
            :enter-to-class="
              side === 'left' ? '-translate-x-0' : 'translate-x-0'
            "
            leave-active-class="transition ease-in duration-300 transform"
            :leave-from-class="
              side === 'left' ? '-translate-x-0' : 'translate-x-0'
            "
            :leave-to-class="
              side === 'left' ? '-translate-x-full' : 'translate-x-full'
            "
          >
            <div
              v-if="isOpen"
              class="pointer-events-none fixed inset-y-0 flex max-w-full"
              :data-testid="`sidebar-${side}`"
              :class="{
                'left-0': side === 'left',
                'right-0': side === 'right',
              }"
            >
              <div
                ref="sidebarContentElement"
                class="pointer-events-auto w-screen max-w-1/2"
              >
                <div
                  ref="sidebarContentElement"
                  class="flex flex-col bg-white shadow-xl"
                >
                  <slot></slot>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
