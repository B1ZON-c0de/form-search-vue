export interface Product {
  id: number
  title: string
  price: number
  status: 'В наличии' | 'Нет в наличии'
  category: string
}

export interface ProductFilter {
  field: keyof Product
  sortType: 'asc' | 'desc' | ''
}
