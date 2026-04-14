'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { mockProducts } from '@/lib/mock-data'

const CATEGORIES = ['legging', 'top', 'conjunto', 'shorts', 'calça', 'macacão', 'jaqueta']
const SIZES = ['P', 'M', 'G', 'GG']

const emptyForm = {
  name: '',
  description: '',
  price: '',
  original_price: '',
  category: 'legging',
  sizes: [] as string[],
  colors: '',
  image_url: '',
  is_featured: false,
  is_new: false,
  is_promotion: false,
  discount_percent: '',
  stock: '',
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleEdit = (product: Product) => {
    setEditProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category: product.category,
      sizes: product.sizes,
      colors: product.colors.join(', '),
      image_url: product.image_url,
      is_featured: product.is_featured,
      is_new: product.is_new,
      is_promotion: product.is_promotion,
      discount_percent: product.discount_percent?.toString() || '',
      stock: product.stock.toString(),
    })
    setView('form')
  }

  const handleNew = () => {
    setEditProduct(null)
    setForm(emptyForm)
    setView('form')
  }

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeleteId(null)
  }

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const saved: Product = {
        id: editProduct?.id || Date.now().toString(),
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : undefined,
        category: form.category,
        sizes: form.sizes,
        colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
        image_url: form.image_url || `https://picsum.photos/seed/${Date.now()}/400/500`,
        is_featured: form.is_featured,
        is_new: form.is_new,
        is_promotion: form.is_promotion,
        discount_percent: form.discount_percent ? parseInt(form.discount_percent) : undefined,
        created_at: editProduct?.created_at || new Date().toISOString(),
        stock: parseInt(form.stock) || 0,
      }
      if (editProduct) {
        setProducts((prev) => prev.map((p) => (p.id === editProduct.id ? saved : p)))
      } else {
        setProducts((prev) => [saved, ...prev])
      }
      setSaving(false)
      setView('list')
    }, 600)
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 pt-16 flex items-center justify-center">
        <div className="text-brown-medium">Verificando acesso...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 pt-16">
      {/* Admin Header */}
      <div className="bg-brown-dark text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-xl text-white">
              Anafit<span className="text-secondary">&</span>LipeFit
            </span>
            <span className="ml-3 text-warm-300 text-sm">Painel Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-warm-300 hover:text-white text-sm flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === 'list' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total de produtos', value: products.length, color: 'text-brown-dark' },
                { label: 'Em promoção', value: products.filter((p) => p.is_promotion).length, color: 'text-primary' },
                { label: 'Lançamentos', value: products.filter((p) => p.is_new).length, color: 'text-green-600' },
                { label: 'Destaques', value: products.filter((p) => p.is_featured).length, color: 'text-warm-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-xs text-brown-light">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Table header */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-warm-100">
                <h2 className="font-semibold text-brown-dark text-lg">Produtos</h2>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-warm-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary w-48"
                  />
                  <button
                    onClick={handleNew}
                    className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Novo Produto
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-warm-50 text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-brown-light uppercase tracking-wider">Produto</th>
                      <th className="px-6 py-3 text-xs font-semibold text-brown-light uppercase tracking-wider">Categoria</th>
                      <th className="px-6 py-3 text-xs font-semibold text-brown-light uppercase tracking-wider">Preço</th>
                      <th className="px-6 py-3 text-xs font-semibold text-brown-light uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-brown-light uppercase tracking-wider">Estoque</th>
                      <th className="px-6 py-3 text-xs font-semibold text-brown-light uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-100">
                    {filtered.map((product) => (
                      <tr key={product.id} className="hover:bg-warm-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-10 h-12 object-cover rounded-lg"
                            />
                            <span className="font-medium text-brown-dark text-sm">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-brown-medium capitalize">{product.category}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-primary">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {product.is_new && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Novo</span>}
                            {product.is_promotion && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">Promo</span>}
                            {product.is_featured && <span className="bg-warm-100 text-warm-500 text-xs px-2 py-0.5 rounded-full font-medium">Destaque</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${product.stock < 5 ? 'text-red-500' : 'text-brown-dark'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                            >
                              Editar
                            </button>
                            <span className="text-warm-200">|</span>
                            <button
                              onClick={() => setDeleteId(product.id)}
                              className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-brown-light">Nenhum produto encontrado</div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Product Form */
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-brown-medium hover:text-primary text-sm mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="font-semibold text-brown-dark text-xl mb-6">
                {editProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-brown-dark mb-1.5">Nome do produto</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    placeholder="Ex: Legging Sculpt Coral"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-dark mb-1.5">Descrição</label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
                    placeholder="Descreva o produto..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-1.5">Preço (R$)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                      placeholder="149.90"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-1.5">Preço original (opcional)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.original_price}
                      onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                      placeholder="199.90"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-1.5">Categoria</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary capitalize"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-1.5">Estoque</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-dark mb-2">Tamanhos disponíveis</label>
                  <div className="flex gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`w-12 h-10 rounded-lg text-sm font-medium border transition-all ${
                          form.sizes.includes(size)
                            ? 'bg-primary border-primary text-white'
                            : 'border-warm-200 text-brown-medium hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-dark mb-1.5">Cores (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    placeholder="Coral, Preto, Nude"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-dark mb-1.5">URL da imagem</label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-6 pt-2">
                  {[
                    { key: 'is_featured', label: 'Destaque' },
                    { key: 'is_new', label: 'Lançamento' },
                    { key: 'is_promotion', label: 'Promoção' },
                  ].map((flag) => (
                    <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form[flag.key as keyof typeof form] as boolean}
                        onChange={(e) => setForm({ ...form, [flag.key]: e.target.checked })}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-brown-dark">{flag.label}</span>
                    </label>
                  ))}
                </div>

                {form.is_promotion && (
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-1.5">% de desconto</label>
                    <input
                      type="number"
                      value={form.discount_percent}
                      onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                      placeholder="20"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className="flex-1 border border-warm-200 text-brown-medium py-3 rounded-full font-medium hover:bg-warm-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary text-white py-3 rounded-full font-bold hover:bg-primary-dark transition-colors disabled:opacity-60"
                  >
                    {saving ? 'Salvando...' : editProduct ? 'Salvar alterações' : 'Criar produto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-brown-dark text-lg mb-2">Excluir produto?</h3>
            <p className="text-brown-medium text-sm mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-warm-200 text-brown-medium py-2.5 rounded-full font-medium hover:bg-warm-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
