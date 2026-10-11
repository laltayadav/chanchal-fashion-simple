"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { HomepageSlide } from '../lib/types'

const SLIDE_INTERVAL_MS = 6000

export function HomepageHero({
  title,
  description,
  slides,
}: {
  title: string
  description: string
  slides: HomepageSlide[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [slides.length])

  const activeSlide = slides[activeIndex]
  const activeTitle = activeIndex === 0 ? title : activeSlide?.title || title
  const activeDescription = activeIndex === 0 ? description : activeSlide?.description || description

  return (
    <section
      aria-label="Featured collection"
      aria-roledescription="carousel"
      className="relative isolate flex min-h-[28rem] overflow-hidden rounded-card bg-gradient-to-br from-maroon-deep via-maroon to-[#8b354f] shadow-xl sm:min-h-[34rem] lg:min-h-[40rem]"
    >
      {slides.length ? (
        <>
          {slides.map((slide, index) => (
            <img
              key={`${slide.image}-${index}`}
              src={`/${slide.image}`}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
        </>
      ) : (
        <>
          <div aria-hidden="true" className="absolute -right-20 -top-28 -z-0 h-96 w-96 rounded-full border border-gold-soft/30" />
          <div aria-hidden="true" className="absolute -bottom-48 right-1/4 -z-0 h-[32rem] w-[32rem] rounded-full border border-gold-soft/20" />
          <div aria-hidden="true" className="absolute inset-0 -z-0 bg-gradient-to-tr from-black/15 via-transparent to-gold/10" />
        </>
      )}
      <div className="relative z-10 flex w-full items-end p-6 sm:p-10 lg:p-14">
        <div className="max-w-2xl space-y-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-soft sm:text-sm">Chanchal Fashion</p>
          <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{activeTitle}</h2>
          <p className="max-w-xl text-base leading-7 text-white/85 sm:text-lg">{activeDescription}</p>
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-cream px-7 py-3 text-sm font-semibold text-maroon-deep shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-soft"
          >
            Explore the collection
          </Link>
        </div>
      </div>
      {slides.length > 1 ? (
        <div role="group" aria-label="Choose hero image" className="absolute bottom-5 right-5 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8">
          {slides.map((slide, index) => (
            <button
              key={`${slide.image}-dot-${index}`}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
              className={`h-3 rounded-full border border-white/90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${index === activeIndex ? 'w-7 bg-white' : 'w-3 bg-white/40 hover:bg-white/75'}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
