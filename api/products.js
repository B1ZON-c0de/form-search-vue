import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'db.json')
    const db = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    let products = db.products

    const {
      _page = 1,
      category,
      inStock,
      price_gte,
      price_lte,
      _sort,
      _order,
      title_like,
    } = req.query

    if (category) {
      products = products.filter((p) => p.category === category)
    }

    if (inStock !== undefined) {
      products = products.filter((p) => String(p.inStock) === inStock)
    }

    if (price_gte) {
      products = products.filter((p) => p.price >= Number(price_gte))
    }

    if (price_lte) {
      products = products.filter((p) => p.price <= Number(price_lte))
    }

    if (title_like) {
      products = products.filter((p) => p.title.toLowerCase().includes(title_like.toLowerCase()))
    }

    if (_sort && _order) {
      products.sort((a, b) => {
        if (_order === 'asc') return a[_sort] > b[_sort] ? 1 : -1
        if (_order === 'desc') return a[_sort] < b[_sort] ? 1 : -1
        return 0
      })
    }

    const pageSize = 10
    const start = (Number(_page) - 1) * pageSize
    const paginated = products.slice(start, start + pageSize)

    res.setHeader('x-total-count', products.length)
    res.status(200).json(paginated)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
}
