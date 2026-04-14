import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Anafit & LipeFit | Moda Fitness Feminina',
  description: 'Roupas de academia femininas com estilo, conforto e qualidade. Leggings, tops, conjuntos e muito mais.',
  keywords: 'roupa academia feminina, legging, top fitness, conjunto academia, moda fitness',
  openGraph: {
    title: 'Anafit & LipeFit | Moda Fitness Feminina',
    description: 'Roupas de academia femininas com estilo, conforto e qualidade.',
    type: 'website',
  },
}

async function getSiteTheme(): Promise<string> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || url.includes('placeholder') || !key || key === 'placeholder') return 'coral'
    const supabase = createClient(url, key)
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'theme')
      .single()
    return data?.value || 'coral'
  } catch {
    return 'coral'
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getSiteTheme()

  return (
    <html lang="pt-BR">
      <body className={`theme-${theme}`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
