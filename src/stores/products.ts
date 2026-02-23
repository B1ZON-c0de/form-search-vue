import type { Product, ProductFilter } from '@/types/user.type'
import { acceptHMRUpdate, defineStore } from 'pinia'
import axios from 'axios'
import { reactive, ref } from 'vue'
import { useFiltersStore } from './filters'

export const useProductsStore = defineStore('products', () => {
  const filterStore = useFiltersStore()

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string>('')
  const totalItems = ref<number>(0)
  const currentPage = ref<number>(1)
  const sortOption = reactive<ProductFilter>({ field: 'price', sortType: '' })

  const productsData = ref<Product[]>([])

  const fetchProducts = async () => {
    try {
      isLoading.value = true
      errorMessage.value = ''
      const res = await axios.get('/api/products', {
        params: {
          _page: currentPage.value,

          category:
            filterStore.filtersState.category === 'any'
              ? undefined
              : filterStore.filtersState.category,

          inStock:
            filterStore.filtersState.inStock === 'all'
              ? undefined
              : filterStore.filtersState.inStock,

          ...(filterStore.filtersState.price !== 'any' && {
            price_gte: Number(filterStore.filtersState.price.split('-')[0]),
            price_lte: Number(filterStore.filtersState.price.split('-')[1]),
          }),

          ...(sortOption.field &&
            sortOption.sortType && {
              _sort: sortOption.field,
              _order: sortOption.sortType,
            }),

          ...(filterStore.filtersState.userSearch.trim() && {
            title_like: filterStore.filtersState.userSearch,
          }),
        },
      })
      if (!(res.statusText === 'OK')) {
        throw new Error('Не удалось получить продукты')
      }
      productsData.value = res.data
      totalItems.value = Number(res.headers['x-total-count'])
    } catch (e) {
      if (e instanceof Error) {
        errorMessage.value = e.message
        console.error(e.message)
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    productsData,
    isLoading,
    errorMessage,
    fetchProducts,
    totalItems,
    currentPage,
    sortOption,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductsStore, import.meta.hot))
}
