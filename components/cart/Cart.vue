<script setup lang="ts">
import { getSmallestThumbnailUrl } from '@shopware-pwa/helpers-next'
import type { LineItem, Product } from '@shopware-pwa/types'

const props = defineProps<{
  controller: ReturnType<typeof useModal>
}>()

const { t: cartT } = useMessages('cart')

const { cartItems, removeItem, totalPrice, isEmpty } = useCart()
const changedTotalPrice = computed(() => totalPrice.value.toFixed(2))
const isLoading = ref(false)
async function removeCartItem(cartItem: LineItem) {
  isLoading.value = true
  await removeItem(cartItem)
  isLoading.value = false
}
</script>

<template>
  <LayoutSidebar :controller="props.controller" side="right">
    <div class="top-0 right-0 left-0 bottom-0 z-9999">
      <div
        class="absolute top-0 right-0 bottom-0 w-full sm:w-115 bg-white overflow-y-auto"
      >
        <div
          class="flex items-center bg-gray-300 h-11.5 cursor-pointer"
          @click="props.controller.close"
        >
          <img src="/svgs/back-left.svg" class="ml-2.5 w-6 h-6" />
          <p
            class="text-gray-700 text-3.5 font-medium leading-4.5 ml-1"
            v-text="cartT('back')"
          />
        </div>
        <div v-if="!isEmpty">
          <div
            v-for="cartItem in cartItems"
            :key="cartItem.id"
            class="color-black border flex m-4 p-4 gap-5 border border-solid rounded-1 border-gray-700"
          >
            <div class="flex gap-5 items-center text-gray-800">
              <div class="flex-1/3">
                <img
                  class="logo w-full"
                  :src="getSmallestThumbnailUrl(cartItem.cover)"
                />
              </div>
              <div class="flex-2/3">
                <div>
                  <div class="text-3.5 font-medium text-left">{{ cartItem.label }}</div>
                  <div class="text-3 font-medium text-left">
                    {{ cartT('itemNumber') }}
                    {{ (cartItem.payload as Product)?.productNumber }}
                  </div>
                </div>
                <div class="text-3 font-medium">
                  <div class="flex justify-between">
                    <p v-text="cartT('amount')" />
                    <p>
                      {{ cartItem.quantity }}
                    </p>
                  </div>
                  <div class="flex justify-between">
                    <p v-text="cartT('unitPrice1')" />
                    <p>€ {{ cartItem.price?.unitPrice.toFixed(2) }}</p>
                  </div>
                  <div class="flex justify-between">
                    <p v-text="cartT('totalPrice1')" />
                    <p>€ {{ cartItem.price?.totalPrice.toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="cursor-pointer" @click="removeCartItem(cartItem)">
              <i
                class="fa-regular fa-trash-can text-gray-800 hover:text-primary cursor-pointer"
              ></i>
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-2xl text-center text-black border m-4 p-4 gap-5 border border-solid rounded-1 border-gray-700"
          v-text="cartT('yourCartIsEmpty')"
        />
        <div v-if="!isEmpty" class="m-4">
          <div class="text-4 font-medium text-black">
            {{ cartT('totalAmount') }} : € {{ changedTotalPrice }}
          </div>
          <button
            class="mt-4 py-3.75 w-full bg-primary rounded text-3.5 font-bold border-none cursor-pointer border-none duration-300 hover:opacity-80"
            @click="props.controller.close"
            v-text="cartT('continue')"
          />
          <button
            class="mt-4 py-3.75 w-full bg-gray-300 rounded text-3.5 font-medium border-none text-gray-800 flex items-center justify-center cursor-pointer"
          >
            <img src="/svgs/logos_paypal.svg" class="mr-2.5" />
            {{ cartT('payLater') }}
          </button>
          <button
            class="mt-4 py-3.75 w-full bg-gray-300 rounded text-3.5 font-medium border-none text-gray-800 flex items-center justify-center cursor-pointer"
          >
            {{ cartT('directTo') }}
            <img src="/svgs/logos_paypal.svg" class="ml-2.5" />
          </button>
          <NuxtLink to="/cart">
            <button
              class="mt-4 py-3.75 w-full bg-primary rounded text-3.5 font-bold border-none cursor-pointer duration-300 hover:opacity-80"
              @click="props.controller.close"
              v-text="cartT('viewCart')"
            />
          </NuxtLink>
        </div>
        <div v-else class="m-4">
          <div class="text-4 font-medium text-black">
            {{ cartT('totalAmount') }} : € {{ changedTotalPrice }}
          </div>
          <button
            class="mt-4 py-3.75 w-full bg-primary rounded text-3.5 font-bold border-none cursor-pointer border-none duration-300 hover:opacity-80"
            @click="props.controller.close"
            v-text="cartT('continue')"
          />
        </div>
      </div>
    </div>
  </LayoutSidebar>
</template>
