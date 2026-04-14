'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { mockSlides } from '@/lib/mock-data'
import { CarouselSlide } from '@/lib/types'

const emptySlide: Omit<CarouselSlide, 'id'> = {
  title: '',
  subtitle: '',
  cta_text: 'Ver mais',
  cta_link: '/produtos',
  image_url: '',
  badge: '',
  active: true,
  order_index: 0,
}

export default function AdminBannersPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [editSlide, setEditSlide] = useState<CarouselSlide | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [form, setForm] = useState<Omit<CarouselSlide, 'id'>>(emptySlide)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [preview, setPreview] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('carousel_slides').select('*').order('order_index')
      if (error || !data) throw error
      setSlides(data)
    } catch {
      setSlides(mockSlides)
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setIsNew(true)
    setEditSlide(null)
    setForm({ ...emptySlide, order_index: slides.length + 1 })
    setPreview('')
  }

  const openEdit = (slide: CarouselSlide) => {
    setIsNew(false)
    setEditSlide(slide)
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      cta_text: slide.cta_text,
      cta_link: slide.cta_link,
      image_url: slide.image_url,
      badge: slide.badge || '',
      active: slide.active,
      order_index: slide.order_index,
    })
    setPreview(slide.image_url)
  }

  const closeForm = () => {
    setEditSlide(null)
    setIsNew(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isNew) {
        const { error } = await supabase.from('carousel_slides').insert(form)
        if (error) throw error
      } else if (editSlide) {
        const { error } = await supabase.from('carousel_slides').update(form).eq('id', editSlide.id)
        if (error) throw error
      }
      await load()
      closeForm()
    } catch {
      // Mock fallback
      if (isNew) {
        const newSlide: CarouselSlide = { ...form, id: Date.now().toString() }
        setSlides((prev) => [...prev, newSlide])
      } else if (editSlide) {
        setSlides((prev) => prev.map((s) => (s.id === editSlide.id ? { ...editSlide, ...form } : s)))
      }
      closeForm()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (!usingMock) {
        await supabase.from('carousel_slides').delete().eq('id', id)
      }
    } catch {}
    setSlides((prev) => prev.filter((s) => s.id !== id))
    setDeleteId(null)
  }

  const handleToggleActive = async (slide: CarouselSlide) => {
    const updated = { ...slide, active: !slide.active }
    setSlides((prev) => prev.map((s) => (s.id === slide.id ? updated : s)))
    try {
      await supabase.from('carousel_slides').update({ active: !slide.active }).eq('id', slide.id)
    } catch {}
  }

  const handleReorder = async (id: string, dir: 'up' | 'down') => {
    const idx = slides.findIndex((s) => s.id === id)
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === slides.length - 1)) return
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    const newSlides = [...slides]
    const temp = newSlides[idx]
    newSlides[idx] = { ...newSlides[swapIdx], order_index: temp.order_index }
    newSlides[swapIdx] = { ...temp, order_index: newSlides[swapIdx].order_index }
    setSlides(newSlides)
    try {
      await supabase.from('carousel_slides').update({ order_index: newSlides[idx].order_index }).eq('id', newSlides[idx].id)
      await supabase.from('carousel_slides').update({ order_index: newSlides[swapIdx].order_index }).eq('id', newSlides[swapIdx].id)
    } catch {}
  }

  const showForm = isNew || editSlide !== null

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners do Carrossel</h1>
          <p className="text-gray-500 text-sm mt-1">{slides.length} banner{slides.length !== 1 ? 's' : ''} cadastrado{slides.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#D4645A] hover:bg-[#B84D44] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Banner
        </button>
      </div>

      {usingMock && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          Supabase não configurado — usando dados de exemplo.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slides list */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400">Carregando...</div>
          ) : slides.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-gray-500">Nenhum banner cadastrado.</p>
              <button onClick={openNew} className="text-[#D4645A] text-sm mt-2">+ Criar primeiro banner</button>
            </div>
          ) : (
            slides.map((slide, idx) => (
              <div key={slide.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden border-2 transition-colors ${editSlide?.id === slide.id ? 'border-[#D4645A]' : 'border-transparent'}`}>
                {/* Preview image */}
                <div className="relative h-36 bg-gray-900 overflow-hidden">
                  {slide.image_url && (
                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover opacity-60" />
                  )}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    {slide.badge && (
                      <span className="bg-[#D4645A] text-white text-xs font-bold px-2 py-0.5 rounded-full w-fit mb-1">{slide.badge}</span>
                    )}
                    <p className="text-white font-bold text-base leading-tight">{slide.title || 'Sem título'}</p>
                    <p className="text-white/70 text-xs">{slide.subtitle}</p>
                  </div>
                  {/* Active badge */}
                  <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${slide.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {slide.active ? 'Ativo' : 'Inativo'}
                  </div>
                </div>

                <div className="p-4 flex items-center gap-2">
                  {/* Reorder */}
                  <div className="flex flex-col gap-1">
                    <button onClick={() => handleReorder(slide.id, 'up')} disabled={idx === 0} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button onClick={() => handleReorder(slide.id, 'down')} disabled={idx === slides.length - 1} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{slide.title || 'Sem título'}</p>
                    <p className="text-xs text-gray-400 truncate">{slide.cta_link}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Toggle active */}
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                        slide.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {slide.active ? 'Ativo' : 'Inativo'}
                    </button>
                    <button onClick={() => openEdit(slide)} className="p-1.5 text-gray-400 hover:text-[#D4645A] rounded-lg hover:bg-[#D4645A]/10 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => setDeleteId(slide.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900">{isNew ? 'Novo Banner' : 'Editar Banner'}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image preview */}
            {preview && (
              <div className="relative h-28 rounded-xl overflow-hidden bg-gray-900 mb-4">
                <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-60" onError={() => setPreview('')} />
                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                  {form.badge && <span className="bg-[#D4645A] text-white text-xs px-2 py-0.5 rounded-full w-fit mb-1">{form.badge}</span>}
                  <p className="text-white font-bold text-sm">{form.title || 'Título do banner'}</p>
                  <p className="text-white/70 text-xs">{form.subtitle}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL da imagem *</label>
                <input
                  required
                  type="url"
                  value={form.image_url}
                  onChange={(e) => { setForm({ ...form, image_url: e.target.value }); setPreview(e.target.value) }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Título *</label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                  placeholder="Nova Coleção Verão"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtítulo</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                  placeholder="Looks para treinos incríveis"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Texto do botão</label>
                  <input
                    type="text"
                    value={form.cta_text}
                    onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                    placeholder="Ver mais"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Badge</label>
                  <select
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] bg-white"
                  >
                    <option value="">Sem badge</option>
                    <option value="Novo">Novo</option>
                    <option value="Promoção">Promoção</option>
                    <option value="Destaque">Destaque</option>
                    <option value="Exclusivo">Exclusivo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Link do botão</label>
                <input
                  type="text"
                  value={form.cta_link}
                  onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                  placeholder="/produtos"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-200 peer-checked:bg-[#D4645A] rounded-full transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">Banner ativo</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#D4645A] hover:bg-[#B84D44] text-white py-2.5 rounded-xl font-semibold transition-colors text-sm disabled:opacity-60">
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 text-lg text-center mb-1">Excluir banner?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50">Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition-colors">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
