import Link from 'next/link'

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-warm-50 pt-16">
      {/* Hero */}
      <div className="relative h-72 bg-brown-dark overflow-hidden">
        <img
          src="https://picsum.photos/seed/about-hero/1400/400"
          alt="Sobre nós"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative flex items-center justify-center h-full text-center">
          <div>
            <h1 className="font-display text-5xl font-bold text-white mb-2">Nossa História</h1>
            <p className="text-warm-200 text-lg">Nascemos da paixão pelo movimento</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Quem somos</p>
            <h2 className="font-display text-3xl font-bold text-brown-dark mb-4">
              Duas amigas, uma missão
            </h2>
            <p className="text-brown-medium leading-relaxed mb-4">
              A <strong>Anafit & LipeFit</strong> nasceu em 2020, quando Ana e Lipe – duas amigas apaixonadas por treinos – perceberam que faltava no mercado uma marca que unisse performance, estilo e preço justo para mulheres que amam se mover.
            </p>
            <p className="text-brown-medium leading-relaxed mb-4">
              Cansadas de escolher entre roupas bonitas e funcionais, resolveram criar a própria. Com muito esforço, pesquisa e muitos agachamentos, a marca ganhou vida.
            </p>
            <p className="text-brown-medium leading-relaxed">
              Hoje, somos referência em moda fitness feminina, com clientes em todo o Brasil que usam nossas peças do aquecimento ao pós-treino.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square">
            <img
              src="https://picsum.photos/seed/founders/500/500"
              alt="Fundadoras"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">O que nos move</p>
            <h2 className="font-display text-3xl font-bold text-brown-dark">Nossos valores</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '💪',
                title: 'Performance',
                desc: 'Tecidos selecionados para máximo desempenho. Cada peça é testada nos treinos mais intensos.',
              },
              {
                icon: '🌿',
                title: 'Sustentabilidade',
                desc: 'Comprometidas com a produção responsável, reduzindo o impacto ambiental em cada etapa.',
              },
              {
                icon: '✨',
                title: 'Empoderamento',
                desc: 'Acreditamos que a mulher certa roupa transforma a autoestima e o rendimento no treino.',
              },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-semibold text-brown-dark text-lg mb-2">{v.title}</h3>
                <p className="text-brown-medium text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Numbers */}
        <div className="bg-primary rounded-2xl p-10 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: '2020', label: 'Ano de fundação' },
              { n: '10k+', label: 'Clientes satisfeitas' },
              { n: '500+', label: 'Modelos criados' },
              { n: '4.9★', label: 'Avaliação média' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-white mb-1">{s.n}</div>
                <div className="text-warm-100 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-brown-dark mb-4">
            Pronta para fazer parte da família Anafit?
          </h2>
          <p className="text-brown-medium mb-6">Explore nossa coleção e encontre o look perfeito para o seu treino</p>
          <Link
            href="/produtos"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-10 py-4 rounded-full transition-all hover:scale-105"
          >
            Ver Coleção
          </Link>
        </div>
      </div>
    </div>
  )
}
