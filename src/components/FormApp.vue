<script lang="ts" setup>
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()
</script>

<template lang="pug">
  .main.flex.flex-col.gap-6
    FormFilter
    FormCounter(:value="productsStore.totalItems")
    FormTable
    FormPagination.items-end

</template>
