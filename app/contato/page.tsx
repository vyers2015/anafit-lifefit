'use client'

import { useState } from 'react'

export default function ContatoPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = `Olá! Me chamo ${form.name}.\n\nAssunto: ${form.subject}\n\n${form.message}\n\nEmail para retorno: ${form.email}`
    window.open(`https://wa.me/5521970281523?text=${encodeURIComponent(text)}`, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="min-h-screen bg-warm-50 pt-16">
      {/* Hero */}
      <div className="bg-brown-dark py-16 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-2">Fale Conosco</h1>
        <p className="text-warm-200">Estamos aqui para te ajudar</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Contato</p>
              <h2 className="font-display text-2xl font-bold text-brown-dark mb-4">
                Vamos conversar!
              </h2>
              <p className="text-brown-medium text-sm leading-relaxed">
                Tem alguma dúvida sobre nossos produtos, tamanhos, ou quer fazer um pedido especial? Entre em contato!
              </p>
            </div>

            {[
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                ),
                label: 'WhatsApp',
                value: '(21) 97028-1523',
                bg: 'bg-green-100',
                color: 'text-green-600',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                label: 'Email',
                value: 'contato@anafit.com.br',
                bg: 'bg-warm-100',
                color: 'text-primary',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                label: 'Horário de atendimento',
                value: 'Seg–Sex: 9h às 18h',
                bg: 'bg-warm-100',
                color: 'text-primary',
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-brown-light font-medium uppercase tracking-wider">{item.label}</p>
                  <p className="text-brown-dark font-medium">{item.value}</p>
                </div>
              </div>
            ))}

            <a
              href="https://wa.me/5521970281523?text=Olá! Gostaria de mais informações."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105 w-fit"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chamar no WhatsApp
            </a>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              {sent ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-semibold text-brown-dark text-xl mb-2">Mensagem enviada!</h3>
                  <p className="text-brown-medium">Você será redirecionada para o WhatsApp. Responderemos em breve!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-brown-dark mb-1.5">Nome</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brown-dark mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-1.5">Assunto</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-dark mb-1.5">Mensagem</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Escreva sua mensagem..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-full transition-all hover:scale-[1.01]"
                  >
                    Enviar pelo WhatsApp
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
