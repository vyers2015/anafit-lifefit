'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { mockProducts } from '@/lib/mock-data'
import { Suspense } from 'react'

const CATEGORIES = ['todos', 'legging', 'top', 'conjunto', 'shorts', 'calça', 'macacão', 'jaqueta']
const SIZES = ['P', 'M', 'G', 'GG']
const COLORS = ['Coral', 'Preto', 'Nude', 'Terracota', 'Rosa', 'Vinho', 'Branco', 'Bege']
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'newest', label: 'Mais novos' },
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category') || 'todos'
  const urlFilter = searchParams.get('filter')

  const [category, setCategory] = useState(urlCategory)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(500)
  const [sortBy, setSortBy] = useState('relevance')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = [...mockProducts]

    if (urlFilter === 'new') list = list.filter((p) => p.is_new)
    if (urlFilter === 'promo') list = list.filter((p) => p.is_promotion)

    if (category !== 'todos') list = list.filter((p) => p.category === category)
    if (selectedSizes.length) list = list.filter((p) => selectedSizes.some((s) => p.sizes.includes(s)))
    if (selectedColors.length) list = list.filter((p) => selectedColors.some((c) => p.colors.includes(c)))
    list = list.filter((p) => p.price <= maxPrice)

    if (sortBy === 'price_asc') list.sort((a, b) => a.price - b.price)
    if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price)
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return list
  }, [category, selectedSizes, selectedColors, maxPrice, sortBy, urlFilter])

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )
  }

  const clearFilters = () => {
    setCategory('todos')
    setSelectedSizes([])
    setSelectedColors([])
    setMaxPrice(500)
    setSortBy('relevance')
  }

  const hasActiveFilters =
    category !== 'todos' ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    maxPrice < 500

  const pageTitle = urlFilter === 'new'
    ? 'Lançamentos'
    : urlFilter === 'promo'
    ? 'Promoções'
    : 'Todos os Produtos'

  return (
    <div className="min-h-screen bg-warm-50 pt-16">
      {/* Header */}
      <div className="bg-brown-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display text-4xl font-bold mb-2">{pageTitle}</h1>
          <p className="text-warm-200">{filtered.length} produto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                category === cat
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-brown-medium hover:bg-warm-100 border border-warm-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-brown-dark text-lg">Filtros</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary hover:text-primary-dark font-medium"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-brown-dark mb-3">Tamanho</h4>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-12 h-10 rounded-lg text-sm font-medium border transition-all ${
                        selectedSizes.includes(size)
                          ? 'bg-primary border-primary text-white'
                          : 'border-warm-200 text-brown-medium hover:border-primary hover:text-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-brown-dark mb-3">Cor</h4>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedColors.includes(color)
                          ? 'bg-primary border-primary text-white'
                          : 'border-warm-200 text-brown-medium hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-sm font-semibold text-brown-dark mb-3">
                  Preço máximo: <span className="text-primary">R$ {maxPrice}</span>
                </h4>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-brown-light mt-1">
                  <span>R$ 50</span>
                  <span>R$ 500</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Sort + mobile filter */}
            <div className="flex justify-between items-center mb-6">
              <button
                className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-warm-200 text-sm font-medium text-brown-dark"
                onClick={() => setSidebarOpen(true)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filtros {hasActiveFilters && <span className="bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">!</span>}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ml-auto bg-white border border-warm-200 rounded-full px-4 py-2 text-sm text-brown-dark focus:outline-none focus:border-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-semibold text-brown-dark text-lg mb-2">Nenhum produto encontrado</h3>
                <p className="text-brown-medium mb-6">Tente ajustar os filtros</p>
                <button onClick={clearFilters} className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary-dark transition-colors">
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-brown-dark text-lg">Filtros</h3>
              <button onClick={() => setSidebarOpen(false)} className="text-brown-medium hover:text-brown-dark">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-brown-dark mb-3">Tamanho</h4>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`w-12 h-10 rounded-lg text-sm font-medium border transition-all ${
                      selectedSizes.includes(size)
                        ? 'bg-primary border-primary text-white'
                        : 'border-warm-200 text-brown-medium hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-brown-dark mb-3">Cor</h4>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedColors.includes(color)
                        ? 'bg-primary border-primary text-white'
                        : 'border-warm-200 text-brown-medium'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-brown-dark mb-3">
                Preço máximo: <span className="text-primary">R$ {maxPrice}</span>
              </h4>
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <button
              onClick={() => { setSidebarOpen(false); if (hasActiveFilters) clearFilters() }}
              className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm-50 pt-16 flex items-center justify-center"><div className="text-brown-medium">Carregando...</div></div>}>
      <ProductsContent />
    </Suspense>
  )
}
