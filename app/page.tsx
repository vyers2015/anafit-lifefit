import Link from 'next/link'
import HeroCarousel from '@/components/HeroCarousel'
import ProductCard from '@/components/ProductCard'
import { mockSlides, mockProducts } from '@/lib/mock-data'

const categories = [
  { name: 'Legging', slug: 'legging', emoji: '🩱', color: 'from-coral-400 to-primary' },
  { name: 'Top', slug: 'top', emoji: '👙', color: 'from-warm-300 to-warm-400' },
  { name: 'Conjunto', slug: 'conjunto', emoji: '✨', color: 'from-secondary to-accent' },
  { name: 'Shorts', slug: 'shorts', emoji: '🩳', color: 'from-accent to-primary-dark' },
  { name: 'Macacão', slug: 'macacão', emoji: '💪', color: 'from-warm-400 to-brown-light' },
  { name: 'Jaqueta', slug: 'jaqueta', emoji: '🧥', color: 'from-primary-dark to-brown-medium' },
]

export default function HomePage() {
  const featuredProducts = mockProducts.filter((p) => p.is_featured)
  const newProducts = mockProducts.filter((p) => p.is_new)
  const promoProducts = mockProducts.filter((p) => p.is_promotion)

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel slides={mockSlides} />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-brown-dark mb-2">Categorias</h2>
          <p className="text-brown-medium">Encontre o look perfeito para o seu treino</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/produtos?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-full bg-warm-100 flex items-center justify-center text-2xl group-hover:bg-warm-200 transition-colors">
                {cat.emoji}
              </div>
              <span className="text-sm font-semibold text-brown-dark group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-warm-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-1">Seleção Especial</p>
              <h2 className="font-display text-3xl font-bold text-brown-dark">Destaques</h2>
            </div>
            <Link
              href="/produtos"
              className="text-primary hover:text-primary-dark text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="relative py-24 overflow-hidden bg-brown-dark">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://picsum.photos/seed/banner/1400/400)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            Promoção Especial
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Até 40% OFF em peças selecionadas
          </h2>
          <p className="text-warm-200 text-lg mb-8 max-w-xl mx-auto">
            Não perca a chance de renovar seu guarda-roupa fitness com os melhores preços
          </p>
          <Link
            href="/produtos?filter=promo"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-10 py-4 rounded-full text-base transition-all hover:scale-105 shadow-xl"
          >
            Ver Promoções
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-1">Acabou de Chegar</p>
            <h2 className="font-display text-3xl font-bold text-brown-dark">Lançamentos</h2>
          </div>
          <Link
            href="/produtos?filter=new"
            className="text-primary hover:text-primary-dark text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            Ver todos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Produtos' },
              { number: '10k+', label: 'Clientes felizes' },
              { number: '100%', label: 'Qualidade garantida' },
              { number: '4.9★', label: 'Avaliação média' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-warm-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Nossa História</p>
          <h2 className="font-display text-3xl font-bold text-brown-dark mb-4">
            Nascemos da paixão pelo movimento
          </h2>
          <p className="text-brown-medium leading-relaxed mb-4">
            A Anafit & LipeFit surgiu do desejo de criar roupas que acompanhem cada agachamento, cada corrida, cada superação. Somos apaixonadas por treinos e sabemos que o look certo faz toda a diferença.
          </p>
          <p className="text-brown-medium leading-relaxed mb-6">
            Nossas peças são desenvolvidas com tecidos de alta performance para garantir conforto, durabilidade e estilo em cada treino.
          </p>
          <Link
            href="/sobre"
            className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-7 py-3 rounded-full transition-all duration-200"
          >
            Conheça nossa história
          </Link>
        </div>
        <div className="relative h-80 md:h-auto rounded-2xl overflow-hidden">
          <img
            src="https://picsum.photos/seed/about/600/500"
            alt="Sobre a Anafit & LipeFit"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
        </div>
      </section>
    </>
  )
}
