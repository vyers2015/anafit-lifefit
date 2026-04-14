'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { mockProducts } from '@/lib/mock-data'
import { Product } from '@/lib/types'
import ProductForm from '@/components/admin/ProductForm'

export default function EditarProdutoPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
        if (error || !data) throw error
        setProduct(data)
      } catch {
        const found = mockProducts.find((p) => p.id === id) || null
        setProduct(found)
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="text-gray-400">Carregando produto...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Produto não encontrado.</p>
      </div>
    )
  }

  return <ProductForm product={product} />
}
