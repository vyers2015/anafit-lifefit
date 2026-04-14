import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
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
