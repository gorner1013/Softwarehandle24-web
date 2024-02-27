<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    countryId: string | null
    stateId: string | null
    // countryIdValidation?: BaseValidation;
    // stateIdValidation?: BaseValidation;
    countryIdValidation?: any
    stateIdValidation?: any
  }>(),
  {
    countryId: '',
    stateId: '',
    countryIdValidation: undefined,
    stateIdValidation: undefined,
  },
)

// import { BaseValidation } from "@vuelidate/core";
const { t: frontendsT } = useMessages('frontends')
const emit = defineEmits<{
  (e: 'update:countryId', value: string): void
  (e: 'update:stateId', value: string): void
}>()

const { countryId, stateId } = useVModels(props, emit)
const { getCountries, getStatesForCountry } = useCountries()
const states = computed(() => {
  return getStatesForCountry(countryId.value || '')
})
function onCountrySelectChanged() {
  stateId.value = ''
}
</script>

<template>
  <div class="flex md:flex-row flex-col gap-6">
    <div class="w-full flex text-black text-3.5 font-medium">
      <select
        id="country"
        v-model="countryId"
        required
        name="country"
        autocomplete="country-name"
        class="w-full px-6 py-4 text-3.5 text-black bg-white border border-solid border-gray-700"
        @change="onCountrySelectChanged"
        @blur="countryIdValidation?.$touch()"
      >
        <option disabled selected value="" v-text="frontendsT('$shared.country')" />
        <option
          v-for="country in getCountries"
          :key="country.id"
          :value="country.id"
        >
          {{ country.name }}
        </option>
      </select>
    </div>
    <div
      v-if="states && states.length"
      class="w-full flex text-black text-3.5 font-medium"
    >
      <select
        id="state"
        v-model="stateId"
        required
        name="state"
        autocomplete="state-name"
        class="w-full px-6 py-4 text-3.5 text-black bg-white border border-solid border-gray-700"
        @blur="stateIdValidation?.$touch()"
      >
        <option disabled selected value="" v-text="frontendsT('$shared.state')" />

        <option v-for="state in states" :key="state.id" :value="state.id">
          {{ state.name }}
        </option>
      </select>
      <p v-if="stateIdValidation?.$error">
        {{ stateIdValidation.$errors[0].$message }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.form-div {
  width: 100%;
  margin-top: 20px;
  display: flex;
  color: #000;
  font-family: Raleway;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.form-div input {
  width: calc(100% - 50px);
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 24px;
  padding-right: 24px;
  font-family: Raleway;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border: 1px solid #808080;
  background: #fff;
}

.form-div .half {
  width: calc(50% - 40px);
}

.form-div .half:first-child {
  margin-right: 20px;
}

.form-div select {
  width: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 24px;
  padding-right: 24px;
  font-family: Raleway;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border: 1px solid #808080;
  background: #fff;
}
</style>
