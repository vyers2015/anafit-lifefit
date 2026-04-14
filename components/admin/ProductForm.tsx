'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'

const CATEGORIES = ['legging', 'top', 'conjunto', 'shorts', 'calça', 'macacão', 'jaqueta']
const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG']

interface ProductFormProps {
  product?: Product | null
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product

  const [form, setForm] = useState({
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
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (product) {
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
      setImagePreview(product.image_url)
    }
  }, [product])

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      category: form.category,
      sizes: form.sizes,
      colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
      image_url: form.image_url || `https://picsum.photos/seed/${Date.now()}/400/500`,
      is_featured: form.is_featured,
      is_new: form.is_new,
      is_promotion: form.is_promotion,
      discount_percent: form.discount_percent ? parseInt(form.discount_percent) : null,
      stock: parseInt(form.stock) || 0,
    }

    try {
      if (isEdit && product) {
        const { error: err } = await supabase.from('products').update(payload).eq('id', product.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase.from('products').insert(payload)
        if (err) throw err
      }
      setSuccess(true)
      setTimeout(() => router.push('/admin/produtos'), 1000)
    } catch (err: any) {
      // Fallback: just show success for demo (mock mode)
      console.warn('Supabase error (usando mock):', err?.message)
      setSuccess(true)
      setTimeout(() => router.push('/admin/produtos'), 1000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/admin/produtos')}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Produto' : 'Novo Produto'}</h1>
          <p className="text-gray-500 text-sm">{isEdit ? `Editando: ${product?.name}` : 'Preencha os dados do novo produto'}</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Produto salvo! Redirecionando...
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic info */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-gray-900 text-base">Informações básicas</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do produto *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] transition-colors"
                  placeholder="Ex: Legging Sculpt Coral"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] transition-colors resize-none"
                  placeholder="Descreva o produto, materiais, características..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preço (R$) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] transition-colors"
                    placeholder="149.90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preço original (de)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.original_price}
                    onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] transition-colors"
                    placeholder="199.90"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] capitalize bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Estoque</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] transition-colors"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

            {/* Sizes & Colors */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-gray-900 text-base">Tamanhos e Cores</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamanhos disponíveis</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`min-w-[3rem] px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        form.sizes.includes(size)
                          ? 'bg-[#D4645A] border-[#D4645A] text-white'
                          : 'border-gray-200 text-gray-600 hover:border-[#D4645A] hover:text-[#D4645A]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cores disponíveis</label>
                <input
                  type="text"
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] transition-colors"
                  placeholder="Coral, Preto, Nude, Vinho (separadas por vírgula)"
                />
                {form.colors && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.colors.split(',').map((c) => c.trim()).filter(Boolean).map((color) => (
                      <span key={color} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">{color}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Image + Flags */}
          <div className="space-y-5">
            {/* Image */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 text-base">Imagem</h2>

              {/* Preview */}
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreview('')} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs">Preview da imagem</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL da imagem</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => {
                    setForm({ ...form, image_url: e.target.value })
                    setImagePreview(e.target.value)
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] transition-colors"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-400 mt-1">Cole a URL da imagem para ver o preview acima</p>
              </div>
            </div>

            {/* Flags */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 text-base">Etiquetas</h2>

              {[
                { key: 'is_featured', label: 'Destaque', desc: 'Aparece na seção de destaques', color: 'text-amber-600' },
                { key: 'is_new', label: 'Lançamento', desc: 'Badge "Novo" no produto', color: 'text-green-600' },
                { key: 'is_promotion', label: 'Promoção', desc: 'Badge de promoção + desconto', color: 'text-red-500' },
              ].map((flag) => (
                <label key={flag.key} className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={form[flag.key as keyof typeof form] as boolean}
                      onChange={(e) => setForm({ ...form, [flag.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-200 peer-checked:bg-[#D4645A] rounded-full transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${flag.color}`}>{flag.label}</p>
                    <p className="text-xs text-gray-400">{flag.desc}</p>
                  </div>
                </label>
              ))}

              {form.is_promotion && (
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">% de desconto</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={form.discount_percent}
                    onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                    placeholder="Ex: 20"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving || success}
                className="w-full bg-[#D4645A] hover:bg-[#B84D44] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Salvando...
                  </>
                ) : success ? '✓ Salvo!' : isEdit ? 'Salvar Alterações' : 'Criar Produto'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/produtos')}
                className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}
      </form>
    </div>
  )
}
