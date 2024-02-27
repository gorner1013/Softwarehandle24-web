<script setup lang="ts">
const router = useRouter()
const { userDefaultShippingAddress } = useUser()
const { t: accountT } = useMessages('account')

useBreadcrumbs([
  {
    name: 'account',
    path: '/account',
  },
  {
    name: 'address',
    path: '/account/address',
  },
])
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="max-w-360 m-auto pb-30 px-5">
    <div
      class="md:mt-6 mt-0 md:text-6 text-3.5 font-bold text-black"
      v-text="accountT('$address.title')"
    />
    <div class="max-w-240 m-auto md:mt-6 mt-5">
      <div class="md:mt-10 mt-5">
        <div class="md:mt-10 mt-5 grid md:grid-cols-2 gap-5">
          <div class="h-72 rounded-2.5 bg-white shadow-1.5xl">
            <div
              class="bg-gray-800 rounded-tl-2.5 rounded-tr-2.5 h-16 flex items-center text-center justify-center text-white text-4 font-bold uppercase"
              v-text="accountT('$address.default')"
            />
            <div class="p-5 h-56 flex flex-col justify-between">
              <div>
                <div class="text-gray-800 text-4 font-medium">
                  {{ userDefaultShippingAddress?.firstName }}
                  {{ userDefaultShippingAddress?.lastName }}
                </div>
                <div class="mt-2.5 text-3.5 font-bold text-gray-800">
                  {{ userDefaultShippingAddress?.street }}
                </div>
                <div class="mt-2.5 text-3.5 font-bold text-gray-800">
                  {{ userDefaultShippingAddress?.zipcode }}
                </div>
                <div class="mt-2.5 text-3.5 font-bold text-gray-800">
                  {{ userDefaultShippingAddress?.city }}
                </div>
              </div>
              <button
                class="w-full mt-2.5 py-3.5 rounded-1 bg-primary duration-300 hover:opacity-50 flex justify-center items-center text-white text-3.5 font-medium border-none cursor-pointer"
                @click="router.push('/account/addressEdit')"
              >
                {{ accountT('$address.edit') }}
              </button>
            </div>
          </div>
          <button
            class="w-full py-3.5 h-14 rounded-1 bg-primary duration-300 hover:opacity-50 flex justify-center items-center text-white text-3.5 font-medium border-none cursor-pointer"
            @click="router.push('/account/addressNew')"
          >
            {{ accountT('$address.add') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
