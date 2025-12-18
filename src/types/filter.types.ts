export interface Price {
  value: string
  label: string
}

export interface Category {
  value: string
  label: string
}

export interface FilterCategory {
  category: Category[]
  price: Price[]
}

export interface FiltersState {
  userSearch: string
  category: string
  price: Price['value']
  inStock: boolean | 'all'
}
