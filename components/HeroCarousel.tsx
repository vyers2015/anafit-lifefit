'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { CarouselSlide } from '@/lib/types'

interface HeroCarouselProps {
  slides: CarouselSlide[]
}

const BADGE_COLORS: Record<string, string> = {
  'Novo': 'bg-green-500',
  'Promoção': 'bg-primary',
  'Destaque': 'bg-warm-400',
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrent(index)
      setTimeout(() => setIsTransitioning(false), 600)
    },
    [isTransitioning]
  )

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, slides.length, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, slides.length, goTo])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  if (!slides.length) return null

  return (
    <div className="relative w-full h-[85vh] min-h-[500px] max-h-[700px] overflow-hidden bg-brown-dark">
      {/* Slides */}
      <div
        className="carousel-track h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="carousel-slide h-full relative"
            style={{
              backgroundImage: `url(${slide.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay */}
            <div className="carousel-overlay absolute inset-0" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
                <div className="max-w-xl animate-slide-up">
                  {slide.badge && (
                    <span
                      className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider ${
                        BADGE_COLORS[slide.badge] || 'bg-primary'
                      }`}
                    >
                      {slide.badge}
                    </span>
                  )}
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-warm-200 text-lg sm:text-xl mb-8 leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.cta_link}
                    className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-full text-base transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    {slide.cta_text}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all backdrop-blur-sm"
        aria-label="Anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all backdrop-blur-sm"
        aria-label="Próximo"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-8 h-2 bg-primary'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-6 right-6 text-white/70 text-sm font-medium">
        {current + 1} / {slides.length}
      </div>
    </div>
  )
}
