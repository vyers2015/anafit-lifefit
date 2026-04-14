'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { mockProducts } from '@/lib/mock-data'
import { Product } from '@/lib/types'

const CATEGORIES = ['todos', 'legging', 'top', 'conjunto', 'shorts', 'calça', 'macacão', 'jaqueta']

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('todos')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [usingMock, setUsingMock] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (error || !data) throw error
      setProducts(data)
      setUsingMock(false)
    } catch {
      setProducts(mockProducts)
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      if (!usingMock) {
        const { error } = await supabase.from('products').delete().eq('id', id)
        if (error) throw error
      }
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'todos' || p.category === category
      return matchSearch && matchCat
    })
  }, [products, search, category])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 bg-[#D4645A] hover:bg-[#B84D44] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Produto
        </Link>
      </div>

      {usingMock && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          Supabase não configurado — exibindo dados de exemplo. Configure o <code className="font-mono">.env.local</code> para persistir dados.
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#D4645A] transition-colors"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] capitalize bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <div className="text-sm text-gray-400">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 font-medium">Nenhum produto encontrado</p>
            <Link href="/admin/produtos/novo" className="text-[#D4645A] text-sm mt-2 inline-block">+ Criar novo produto</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Produto</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categoria</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Preço</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estoque</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-lg bg-gray-100 shrink-0"
                        />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{product.sizes.join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="capitalize text-sm text-gray-600">{product.category}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <span className="font-semibold text-[#D4645A] text-sm">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                        {product.original_price && (
                          <p className="text-xs text-gray-400 line-through">R$ {product.original_price.toFixed(2).replace('.', ',')}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.is_featured && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">Destaque</span>}
                        {product.is_new && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Novo</span>}
                        {product.is_promotion && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">Promo</span>}
                        {!product.is_featured && !product.is_new && !product.is_promotion && (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-sm font-medium ${product.stock < 5 ? 'text-red-500' : product.stock < 10 ? 'text-amber-500' : 'text-gray-700'}`}>
                        {product.stock} un.
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          className="text-sm text-gray-500 hover:text-[#D4645A] font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-[#D4645A]/10"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg text-center mb-1">Excluir produto?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-60"
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
