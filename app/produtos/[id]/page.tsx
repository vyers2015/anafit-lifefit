import Link from 'next/link'
import { mockProducts } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id)
  if (!product) notFound()

  const related = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const hasDiscount = product.is_promotion && product.original_price

  return (
    <div className="min-h-screen bg-warm-50 pt-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-brown-light">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-primary transition-colors">Produtos</Link>
          <span>/</span>
          <span className="text-brown-dark font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-warm-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new && (
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Novo</span>
              )}
              {hasDiscount && (
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  -{product.discount_percent}%
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="py-4">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="font-display text-3xl font-bold text-brown-dark mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  R$ {product.original_price!.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            <p className="text-brown-medium leading-relaxed mb-8">{product.description}</p>

            {/* Sizes */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-brown-dark mb-3">Tamanho</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="w-12 h-11 border-2 border-warm-200 rounded-lg text-sm font-medium text-brown-dark hover:border-primary hover:text-primary transition-all"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-brown-dark mb-3">Cores disponíveis</h3>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="px-4 py-1.5 border border-warm-200 rounded-full text-sm text-brown-medium"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <a
              href={`https://wa.me/5521970281523?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name} (R$ ${product.price.toFixed(2)}). Poderia me dar mais informações?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-full text-base transition-all hover:scale-[1.02] shadow-lg mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Comprar pelo WhatsApp
            </a>

            <div className="grid grid-cols-3 gap-3 text-center text-xs text-brown-medium">
              {['Frete grátis acima de R$299', 'Troca em até 30 dias', 'Pagamento seguro'].map((t) => (
                <div key={t} className="bg-warm-100 rounded-xl p-3">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="bg-warm-100 py-16 mt-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-display text-2xl font-bold text-brown-dark mb-8">Você também pode gostar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/produtos/${p.id}`} className="group block">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-warm-200 mb-3">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <p className="font-semibold text-brown-dark text-sm group-hover:text-primary transition-colors">{p.name}</p>
                  <p className="text-primary font-bold text-sm">R$ {p.price.toFixed(2).replace('.', ',')}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
