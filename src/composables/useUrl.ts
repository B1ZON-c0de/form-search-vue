import { INITIAL_FILTER_STATE } from '@/constants/constants'
import { useFiltersStore } from '@/stores/filters'
import { useProductsStore } from '@/stores/products'
import { onMounted, reactive, ref, watch } from 'vue'

export const useUrl = () => {
  const url = reactive(new URL(window.location.href))
  const urlString = ref(window.location.href)

  const productsStore = useProductsStore()
  const filtersStore = useFiltersStore()

  const parseUrl = () => {
    const getUserSearch = url.searchParams.get('search')
    const priceFrom = url.searchParams.get('priceFrom')
    const priceTo = url.searchParams.get('priceTo')
    const getCategory = url.searchParams.get('category')
    const getPage = url.searchParams.get('page')
    const getStatus = url.searchParams.get('inStock')

    filtersStore.filtersState.userSearch = getUserSearch || ''

    if (getPage) {
      productsStore.currentPage = Number(getPage)
    } else {
      productsStore.currentPage = 1
    }

    if (getCategory) {
      filtersStore.filtersState.category = getCategory as string
    } else {
      filtersStore.filtersState.category = INITIAL_FILTER_STATE.category
    }

    if (priceFrom !== null && priceTo !== null) {
      filtersStore.filtersState.price = `${priceFrom}-${priceTo}`
    } else {
      filtersStore.filtersState.price = INITIAL_FILTER_STATE.price
    }

    if (getStatus) {
      let status: boolean | 'all'

      switch (getStatus) {
        case 'true':
          status = true
          break
        case 'false':
          status = false
          break
        default:
          return INITIAL_FILTER_STATE.inStock
      }

      filtersStore.filtersState.inStock = status
    } else {
      filtersStore.filtersState.inStock = INITIAL_FILTER_STATE.inStock
    }
  }

  const updateUserSearchUrl = (newSearchQuery: string) => {
    if (newSearchQuery.trim()) {
      url.searchParams.set('search', newSearchQuery)
    } else {
      url.searchParams.delete('search')
    }
    urlString.value = url.toString()
    history.replaceState(null, '', url.toString())
  }

  const updateUrlPage = (page: number) => {
    url.searchParams.set('page', String(page))
    urlString.value = url.toString()
    history.replaceState(null, '', url.toString())
  }

  const updateUrlCategory = (newCategory: string) => {
    if (newCategory && newCategory !== 'any') {
      url.searchParams.set('category', String(newCategory))
    } else {
      url.searchParams.delete('category')
    }
    urlString.value = url.toString()
    history.replaceState(null, '', url.toString())
  }

  const updateUrlPrice = (newPrice: string) => {
    url.searchParams.delete('price')
    url.searchParams.delete('priceFrom')
    url.searchParams.delete('priceTo')

    if (newPrice && newPrice !== 'any') {
      const [from, to] = newPrice.split('-')
      from && url.searchParams.set('priceFrom', from)
      to && url.searchParams.set('priceTo', to)
    }

    urlString.value = url.toString()
    history.replaceState(null, '', url.toString())
  }

  const updateUrlStatus = (newStatus: boolean | 'all') => {
    if (newStatus !== 'all') {
      url.searchParams.set('inStock', String(newStatus))
    } else {
      url.searchParams.delete('inStock')
    }
    urlString.value = url.toString()
    history.replaceState(null, '', url.toString())
  }

  watch(
    [
      () => productsStore.currentPage,
      () => filtersStore.filtersState.inStock,
      () => filtersStore.filtersState.category,
      () => filtersStore.filtersState.price,
      () => filtersStore.filtersState.userSearch,
    ],
    ([page, status, category, price, newSearchQuery]) => {
      updateUserSearchUrl(newSearchQuery)
      updateUrlPage(page)
      updateUrlStatus(status)
      updateUrlCategory(category)
      updateUrlPrice(price)
    },
  )

  onMounted(() => {
    parseUrl()
  })

  return {
    urlString,
  }
}
