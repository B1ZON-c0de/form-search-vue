import { INITIAL_CATEGORY_STATE, INITIAL_FILTER_STATE } from '@/constants/constants'
import type { FilterCategory, FiltersState } from '@/types/filter.types'
import axios from 'axios'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useFiltersStore = defineStore('filters', () => {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string>('')

  const filtersState = reactive<FiltersState>({ ...INITIAL_FILTER_STATE })

  const filtersCategory = reactive<FilterCategory>({ ...INITIAL_CATEGORY_STATE })

  const resetFilters = () => {
    filtersState.userSearch = INITIAL_FILTER_STATE.userSearch
    filtersState.category = INITIAL_FILTER_STATE.category
    filtersState.price = INITIAL_FILTER_STATE.price
    filtersState.inStock = INITIAL_FILTER_STATE.inStock
  }

  const fetchFilters = async () => {
    try {
      isLoading.value = true
      errorMessage.value = ''
      const res = await axios.get<FilterCategory>('/api/filters')
      // Из-за vercel
      // if (!(res.statusText === 'OK')) {
      //   throw new Error('Не удалось получить фильтры')
      // }

      filtersCategory.category = [...INITIAL_CATEGORY_STATE.category, ...res.data.category]
      filtersCategory.price = [...INITIAL_CATEGORY_STATE.price, ...res.data.price]
    } catch (e) {
      if (e instanceof Error) {
        errorMessage.value = e.message
        console.error(e.message)
      }
    } finally {
      isLoading.value = false
    }
  }
  return { fetchFilters, filtersCategory, filtersState, isLoading, errorMessage, resetFilters }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFiltersStore, import.meta.hot))
}
