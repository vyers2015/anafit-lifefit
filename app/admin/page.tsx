'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { mockProducts } from '@/lib/mock-data'
import { Product } from '@/lib/types'

interface Stat {
  label: string
  value: number | string
  color: string
  icon: React.ReactNode
  href: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
        if (error || !data) throw error
        setProducts(data)
      } catch {
        setProducts(mockProducts)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats: Stat[] = [
    {
      label: 'Total de Produtos',
      value: products.length,
      color: 'bg-[#D4645A]',
      href: '/admin/produtos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Em Promoção',
      value: products.filter((p) => p.is_promotion).length,
      color: 'bg-orange-500',
      href: '/admin/produtos?filter=promo',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      label: 'Lançamentos',
      value: products.filter((p) => p.is_new).length,
      color: 'bg-green-500',
      href: '/admin/produtos?filter=new',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      label: 'Estoque Baixo',
      value: products.filter((p) => p.stock < 5).length,
      color: 'bg-red-500',
      href: '/admin/produtos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ]

  const recent = products.slice(0, 6)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Bem-vinda ao painel Anafit & LipeFit</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} text-white flex items-center justify-center`}>
                {stat.icon}
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-[#D4645A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-0.5">
              {loading ? <span className="inline-block w-8 h-7 bg-gray-100 rounded animate-pulse" /> : stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Novo Produto', href: '/admin/produtos/novo', color: 'bg-[#D4645A] hover:bg-[#B84D44] text-white' },
          { label: 'Gerenciar Banners', href: '/admin/banners', color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200' },
          { label: 'Configurações do Site', href: '/admin/configuracoes', color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-semibold text-sm transition-all ${action.color}`}
          >
            {action.label}
          </Link>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Produtos Recentes</h2>
          <Link href="/admin/produtos" className="text-sm text-[#D4645A] hover:text-[#B84D44] font-medium transition-colors">
            Ver todos →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-14 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/5" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((product) => (
              <div key={product.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-12 h-14 object-cover rounded-lg bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {product.is_new && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Novo</span>}
                  {product.is_promotion && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">Promo</span>}
                  <span className="font-semibold text-[#D4645A] text-sm">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                  <Link href={`/admin/produtos/${product.id}`} className="text-gray-400 hover:text-[#D4645A] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
