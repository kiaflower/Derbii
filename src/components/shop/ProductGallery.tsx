'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: { id: string; url: string; alt: string }[]
  nom: string
}

export default function ProductGallery({ images, nom }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-[#EDE3D8] flex items-center justify-center">
        <span className="font-display text-8xl text-[#D4B896]/30">D</span>
      </div>
    )
  }

  const current = images[activeIndex]
  const prev = () => setActiveIndex((activeIndex - 1 + images.length) % images.length)
  const next = () => setActiveIndex((activeIndex + 1) % images.length)

  return (
    <div className="relative z-0 space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-square overflow-hidden lg:aspect-[4/5] bg-[#EDE3D8]"
        style={{ isolation: 'isolate' }}
      >
        <Image
          src={current.url}
          alt={current.alt || nom}
          fill
          className="pointer-events-none select-none object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onTouchEnd={(e) => { e.stopPropagation(); prev() }}
              onClick={prev}
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', zIndex: 10, position: 'absolute' }}
              className="left-2 top-1/2 -translate-y-1/2 bg-white/90 p-3 shadow-sm"
              aria-label="Image précédente"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onTouchEnd={(e) => { e.stopPropagation(); next() }}
              onClick={next}
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', zIndex: 10, position: 'absolute' }}
              className="right-2 top-1/2 -translate-y-1/2 bg-white/90 p-3 shadow-sm"
              aria-label="Image suivante"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5" style={{ zIndex: 10 }}>
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onTouchEnd={(e) => { e.stopPropagation(); setActiveIndex(i) }}
                onClick={() => setActiveIndex(i)}
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails desktop uniquement */}
      {images.length > 1 && (
        <div className="hidden lg:flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              className={`relative w-16 h-20 flex-shrink-0 overflow-hidden ${
                i === activeIndex ? 'ring-1 ring-[#0C0C0C]' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}