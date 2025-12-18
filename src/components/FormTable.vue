<script lang="ts" setup>
import { useProductsStore } from '@/stores/products'
import type { ProductFilter } from '@/types/user.type'
import { ElNotification } from 'element-plus'
import { onBeforeMount, watch } from 'vue'

const productsStore = useProductsStore()

const showErrorNotification = (errorMessage: string) => {
  ElNotification({
    title: 'Error',
    message: errorMessage,
    type: 'error',
    duration: 3000,
  })
}

const handleSortChange = ({ prop, order }: { prop: ProductFilter['field']; order: string }) => {
  const sortType = order === 'ascending' ? 'asc' : order === 'descending ' ? 'desc' : ''

  productsStore.sortOption.field = prop
  productsStore.sortOption.sortType = sortType

  productsStore.fetchProducts()
}

watch(
  () => productsStore.errorMessage,
  (newError) => {
    if (newError) {
      showErrorNotification(newError)
    }
  },
)

onBeforeMount(async () => {
  await productsStore.fetchProducts()
})
</script>

<template lang="pug">
  el-table.form-table.font-semibold(@sort-change="handleSortChange",:default-sort="{ prop: 'price'}", v-loading="productsStore.isLoading",:data="productsStore.productsData", stripe)

    el-table-column.bg-red-500(prop="id", label="ID", width="100")
    
    el-table-column(prop="title", label="Название")

    el-table-column(prop="price",sortable, label="Цена",  width="300")

    el-table-column(prop="inStock", label="Статус",  width="300")

      template(v-slot="{ row }")

        span.text-green-600(v-if="row.inStock") В наличии

        span.text-red-600(v-else) Нет в наличии

    template(#empty)
      p Товары не найдены

</template>
