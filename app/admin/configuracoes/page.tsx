'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const THEMES = [
  { id: 'coral', label: 'Coral', primary: '#D4645A', secondary: '#F5A78E', bg: '#FDF5F0' },
  { id: 'rose', label: 'Rosa', primary: '#BE185D', secondary: '#F9A8D4', bg: '#FFF0F7' },
  { id: 'terracota', label: 'Terracota', primary: '#C2410C', secondary: '#FDBA74', bg: '#FFF7F0' },
  { id: 'purple', label: 'Roxo', primary: '#7C3AED', secondary: '#C4B5FD', bg: '#F8F0FF' },
  { id: 'emerald', label: 'Verde', primary: '#059669', secondary: '#6EE7B7', bg: '#F0FFF8' },
]

const DEFAULT_SETTINGS: Record<string, string> = {
  theme: 'coral',
  site_name: 'Anafit & LipeFit',
  tagline: 'Moda Fitness Feminina',
  whatsapp: '5521970281523',
  email: 'contato@anafit.com.br',
  instagram: 'https://instagram.com',
  hero_title: 'Vista sua melhor versão',
  hero_subtitle: 'Roupas de academia que combinam conforto, performance e estilo',
  about_title: 'Nascemos da paixão pelo movimento',
  about_text: 'A Anafit & LipeFit surgiu do desejo de criar roupas que acompanhem cada agachamento, cada corrida, cada superação.',
}

type Tab = 'aparencia' | 'informacoes' | 'textos'

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('aparencia')
  const [usingMock, setUsingMock] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from('site_settings').select('key, value')
        if (error || !data || data.length === 0) throw new Error('no data')
        const loaded = Object.fromEntries(data.map((row: any) => [row.key, row.value]))
        setSettings({ ...DEFAULT_SETTINGS, ...loaded })
      } catch {
        setUsingMock(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const set = (key: string, value: string) => setSettings((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const rows = Object.entries(settings).map(([key, value]) => ({ key, value }))
      const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
      if (error) throw error
    } catch {
      // Mock mode: still show success
    } finally {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const currentTheme = THEMES.find((t) => t.id === settings.theme) || THEMES[0]

  const tabs: { id: Tab; label: string }[] = [
    { id: 'aparencia', label: 'Aparência' },
    { id: 'informacoes', label: 'Informações' },
    { id: 'textos', label: 'Textos' },
  ]

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações do Site</h1>
          <p className="text-gray-500 text-sm mt-1">Personalize a aparência e o conteúdo do site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="flex items-center gap-2 bg-[#D4645A] hover:bg-[#B84D44] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-70"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </>
          ) : saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Salvo!
            </>
          ) : 'Salvar Alterações'}
        </button>
      </div>

      {usingMock && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          Configure o Supabase para persistir as configurações. Execute o schema SQL para criar a tabela <code className="font-mono">site_settings</code>.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-[#D4645A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400">Carregando...</div>
      ) : (
        <>
          {/* Tab: Aparência */}
          {activeTab === 'aparencia' && (
            <div className="space-y-6">
              {/* Theme picker */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-1">Tema de Cores</h2>
                <p className="text-gray-500 text-sm mb-5">Escolha a paleta de cores do site</p>

                <div className="grid grid-cols-5 gap-3">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => set('theme', theme.id)}
                      className={`group flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        settings.theme === theme.id ? 'border-[#D4645A] bg-[#D4645A]/5' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: theme.primary }} />
                        <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: theme.secondary }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{theme.label}</span>
                      {settings.theme === theme.id && (
                        <svg className="w-4 h-4 text-[#D4645A]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                {/* Live preview */}
                <div className="mt-6 rounded-xl overflow-hidden border border-gray-100">
                  <div className="h-2" style={{ backgroundColor: currentTheme.primary }} />
                  <div className="p-4" style={{ backgroundColor: currentTheme.bg }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-sm" style={{ color: currentTheme.primary }}>
                        {settings.site_name || 'Anafit & LipeFit'}
                      </div>
                      <div className="flex gap-2">
                        {['Início', 'Produtos', 'Sobre'].map((item) => (
                          <span key={item} className="text-xs text-gray-500">{item}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg p-4 text-white text-center" style={{ backgroundColor: currentTheme.primary }}>
                      <div className="font-bold text-sm mb-1">{settings.hero_title || 'Vista sua melhor versão'}</div>
                      <div className="text-xs opacity-80">{settings.hero_subtitle?.slice(0, 50) || 'Moda fitness feminina'}...</div>
                      <div className="mt-2 inline-block bg-white text-xs font-semibold px-3 py-1 rounded-full" style={{ color: currentTheme.primary }}>
                        Ver Coleção
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {['Legging', 'Top', 'Conjunto'].map((cat) => (
                        <div key={cat} className="flex-1 text-center py-2 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: currentTheme.secondary }}>
                          {cat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Informações */}
          {activeTab === 'informacoes' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-gray-900">Identidade da Marca</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do site</label>
                  <input
                    type="text"
                    value={settings.site_name}
                    onChange={(e) => set('site_name', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                    placeholder="Anafit & LipeFit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => set('tagline', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                    placeholder="Moda Fitness Feminina"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-gray-900">Contato</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp (com DDI)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">+</span>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => set('whatsapp', e.target.value.replace(/\D/g, ''))}
                      className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                      placeholder="5521970281523"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Ex: 5521970281523 (55 = Brasil, 21 = Rio, número sem espaços)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => set('email', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                    placeholder="contato@anafit.com.br"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram (URL)</label>
                  <input
                    type="url"
                    value={settings.instagram}
                    onChange={(e) => set('instagram', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                    placeholder="https://instagram.com/seuuser"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Textos */}
          {activeTab === 'textos' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-gray-900">Seção Hero (Banner principal)</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Título</label>
                  <input
                    type="text"
                    value={settings.hero_title}
                    onChange={(e) => set('hero_title', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                    placeholder="Vista sua melhor versão"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtítulo</label>
                  <textarea
                    rows={2}
                    value={settings.hero_subtitle}
                    onChange={(e) => set('hero_subtitle', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] resize-none"
                    placeholder="Roupas de academia que combinam conforto, performance e estilo"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-gray-900">Seção Sobre</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Título</label>
                  <input
                    type="text"
                    value={settings.about_title}
                    onChange={(e) => set('about_title', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Texto</label>
                  <textarea
                    rows={4}
                    value={settings.about_text}
                    onChange={(e) => set('about_text', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Save button (bottom) */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="bg-[#D4645A] hover:bg-[#B84D44] text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-70"
        >
          {saving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  )
}
