<script lang="ts" setup>
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()

const handlePagination = () => {
  productsStore.fetchProducts()
}
</script>

<template lang="pug">
  div.flex.justify-center
    el-pagination(@change="handlePagination",v-model:current-page="productsStore.currentPage",background, layout="prev, pager, next", :total="productsStore.totalItems")
</template>
