<script lang="ts" setup>
import { useUrl } from '@/composables/useUrl'
import { useFiltersStore } from '@/stores/filters'
import { useProductsStore } from '@/stores/products'
import { ElNotification } from 'element-plus'
import { onBeforeMount, onMounted, ref, watch } from 'vue'

const filterStore = useFiltersStore()
const productsStore = useProductsStore()
const { urlString } = useUrl()

const resetFilters = () => {
  filterStore.resetFilters()
  productsStore.fetchProducts()
}

onBeforeMount(async () => {
  await filterStore.fetchFilters()
})

const showErrorNotification = (errorMessage: string) => {
  ElNotification({
    title: 'Error',
    message: errorMessage,
    type: 'error',
    duration: 3000,
  })
}

watch(
  () => filterStore.errorMessage,
  (newError) => {
    if (newError) {
      showErrorNotification(newError)
    }
  },
)

const handleFindButton = () => {
  productsStore.fetchProducts()
}
</script>

<template lang="pug">
  
    .form-wrapper
      el-form.form(v-loading="filterStore.isLoading", :inline="true",:model="filterStore.filtersState", label-widdth="auto")

          
          .form-item
            span Поиск

            el-input(v-model="filterStore.filtersState.userSearch", placeholder="Поиск...", clearable)

          .form-item
            span Категории:

            el-select(v-model="filterStore.filtersState.category", placeholder="Выберите категорию")

              el-option(v-for="category in filterStore.filtersCategory.category", :label="category.label", :value="category.value" :key="category.value")


          .form-item
            span Цена:

            el-select(v-model="filterStore.filtersState.price", placeholder="Выберит дипазон цены")

              el-option(v-for="price in filterStore.filtersCategory.price", :key="price.label", :label="price.label", :value="price.value")

          .form-item
            span Статус:

            el-select(v-model="filterStore.filtersState.inStock", placeholder="Выберите наличиие")

              el-option(label="В наличии", :value="true")
              el-option(label="Нет в наличии", :value="false")
              el-option(label="Все", value="all")

          div
          
            el-button(type="default", @click="resetFilters") Сбросить фиьтры
          
          div
          
            el-button(type="primary", @click="handleFindButton") Найти
      
      .form-url
        p
          span.font-bold.mr-2 URL: 
          span.font-semibold.text-gray-500.mr-1 {{urlString.split('?')[0]}} 
          
          span ?{{urlString.split("?")[1]}}
    
</template>
<style></style>
