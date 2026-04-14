'use client'

import Link from 'next/link'
import { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.is_promotion && product.original_price

  return (
    <Link href={`/produtos/${product.id}`} className="block">
      <div className="product-card bg-white rounded-2xl overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-warm-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new && (
              <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Novo
              </span>
            )}
            {hasDiscount && (
              <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{product.discount_percent}%
              </span>
            )}
          </div>

          {/* WhatsApp quick link */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <a
              href={`https://wa.me/5521970281523?text=Olá! Tenho interesse no produto: ${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-brown-light uppercase tracking-wider font-medium mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-brown-dark text-base mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Sizes */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="text-xs border border-warm-200 text-brown-medium px-2 py-0.5 rounded"
              >
                {size}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                R$ {product.original_price!.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
