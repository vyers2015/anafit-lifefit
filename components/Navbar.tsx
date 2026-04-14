'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
  { label: 'Início', href: '/' },
  { label: 'Produtos', href: '/produtos' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
  { label: 'FAQ', href: '/faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col leading-tight">
              <span
                className={`font-display font-bold text-xl tracking-tight transition-colors duration-300 ${
                  scrolled || menuOpen ? 'text-primary' : 'text-white'
                }`}
              >
                Anafit<span className="text-secondary">&</span>LipeFit
              </span>
              <span
                className={`text-xs tracking-widest uppercase transition-colors duration-300 ${
                  scrolled || menuOpen ? 'text-brown-medium' : 'text-warm-200'
                }`}
              >
                Moda Fitness
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  scrolled ? 'text-brown-dark' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/produtos"
              className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-200"
            >
              Ver Coleção
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled || menuOpen ? 'text-brown-dark' : 'text-white'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-warm-100 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-4 text-brown-dark hover:text-primary hover:bg-warm-50 rounded-lg font-medium transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Link
                href="/produtos"
                className="block bg-primary text-white text-center font-semibold px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Ver Coleção
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
