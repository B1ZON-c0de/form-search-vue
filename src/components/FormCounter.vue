<script lang="ts" setup>
interface Props {
  value: number
}
const { value } = defineProps<Props>()
</script>

<template lang="pug">
  div
    span.font-semibold Результат: 
    span.font-normal {{value}}  товаров
</template>
