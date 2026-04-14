'use client'

import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  {
    category: 'Produtos',
    items: [
      {
        q: 'Como escolher o tamanho certo?',
        a: 'Recomendamos consultar nossa tabela de medidas. Em geral, nossas peças têm caimento normal. Se você estiver entre dois tamanhos e preferir um ajuste mais confortável, escolha o maior.',
      },
      {
        q: 'Os tecidos são de qualidade?',
        a: 'Sim! Utilizamos apenas tecidos de alta performance: dry-fit, suplex com proteção UV, e blends elastano. Todas as peças passam por controle de qualidade rigoroso.',
      },
      {
        q: 'As cores são fiéis às fotos?',
        a: 'Fazemos o possível para que as fotos representem fielmente as cores reais. Podem existir variações mínimas dependendo da calibração da tela do seu dispositivo.',
      },
    ],
  },
  {
    category: 'Pedidos',
    items: [
      {
        q: 'Como faço um pedido?',
        a: 'Nosso site é um catálogo de produtos. Para realizar um pedido, basta clicar em "Comprar pelo WhatsApp" no produto desejado e falar diretamente com a gente.',
      },
      {
        q: 'Posso encommendar uma peça em cor ou tamanho específico?',
        a: 'Sim! Adoramos personalizar. Entre em contato pelo WhatsApp e verificamos a disponibilidade ou prazo para encomenda.',
      },
      {
        q: 'Tem desconto para compras em quantidade?',
        a: 'Sim! Para compras acima de 3 peças, oferecemos desconto especial. Consulte nossas promoções pelo WhatsApp.',
      },
    ],
  },
  {
    category: 'Envio',
    items: [
      {
        q: 'Qual o prazo de entrega?',
        a: 'O prazo varia de 3 a 10 dias úteis dependendo da sua localização. Produtos em estoque são enviados em 1 dia útil após confirmação do pagamento.',
      },
      {
        q: 'Fazem entrega para todo o Brasil?',
        a: 'Sim! Entregamos para todos os estados brasileiros via Correios e transportadoras parceiras.',
      },
      {
        q: 'Frete grátis?',
        a: 'Oferecemos frete grátis para compras acima de R$ 299. Para compras abaixo deste valor, o frete é calculado pelo CEP de destino.',
      },
    ],
  },
  {
    category: 'Trocas e Devoluções',
    items: [
      {
        q: 'Qual a política de trocas?',
        a: 'Aceitamos troca em até 30 dias após o recebimento, desde que o produto esteja sem uso, com etiqueta e na embalagem original.',
      },
      {
        q: 'Como solicitar uma troca?',
        a: 'Entre em contato pelo WhatsApp com fotos do produto e o motivo da troca. Nossa equipe vai te orientar sobre o processo.',
      },
      {
        q: 'Quem paga o frete da troca?',
        a: 'Em caso de defeito ou erro nosso, o frete de troca é por nossa conta. Em outros casos (troca de tamanho, por exemplo), o frete é por conta do cliente.',
      },
    ],
  },
]

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-warm-200 last:border-0">
      <button
        className="w-full flex justify-between items-center py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-brown-dark">{q}</span>
        <span className={`shrink-0 w-6 h-6 rounded-full bg-warm-100 flex items-center justify-center transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-4' : 'max-h-0'}`}>
        <p className="text-brown-medium text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-warm-50 pt-16">
      {/* Hero */}
      <div className="bg-brown-dark py-16 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-2">Perguntas Frequentes</h1>
        <p className="text-warm-200">Tudo que você precisa saber sobre a Anafit & LipeFit</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-8">
          {faqs.map((section) => (
            <div key={section.category} className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-brown-dark mb-2 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full inline-block" />
                {section.category}
              </h2>
              <div>
                {section.items.map((item) => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-primary rounded-2xl p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-white mb-2">Ainda tem dúvidas?</h3>
          <p className="text-warm-100 mb-6">Nossa equipe está pronta para te ajudar</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/5521970281523?text=Olá! Tenho uma dúvida."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Formulário de contato
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
