import type { FilterCategory, FiltersState } from '@/types/filter.types'

export const INITIAL_CATEGORY_STATE: FilterCategory = {
  category: [{ value: 'any', label: 'Все' }],
  price: [{ value: 'any', label: 'Любая' }],
}

export const INITIAL_FILTER_STATE: FiltersState = {
  userSearch: '',
  category: 'any',
  price: 'any',
  inStock: 'all',
}
