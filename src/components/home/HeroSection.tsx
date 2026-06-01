import Link from 'next/link'
import { HomepageSection } from '@/types/database'

interface HeroSectionProps {
  section: HomepageSection
}

export default function HeroSection({ section }: HeroSectionProps) {
  const titleParts = section.titre?.split(' ').filter(Boolean) || []
  const firstLine = titleParts.slice(0, 2).join(' ') || "L'Élégance"
  const secondLine = titleParts.slice(2).join(' ') || 'du Cuir'
  const primaryHref = section.lien || '/boutique'

  return (
    <section className="relative min-h-screen flex items-end pb-20 lg:pb-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#1a1410]">
        {section.image_url ? (
          <img
            src={section.image_url}
            alt="DERBII Hero"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          /* Gradient fallback */
          <div className="w-full h-full bg-gradient-to-br from-[#1a1410] via-[#2a1f16] to-[#0C0C0C]">
            {/* Decorative texture */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(ellipse at 20% 50%, #D4B896 0%, transparent 50%),
                                   radial-gradient(ellipse at 80% 20%, #B89470 0%, transparent 50%)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Large DERBII background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-display text-[20vw] leading-none tracking-[0.1em] text-white opacity-[0.03]"
          aria-hidden="true"
        >
          DERBII
        </span>
      </div>

      {/* Content */}
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-[#D4B896]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4B896]">
              {section.sous_titre || 'Maison de Cuir Sénégalaise'}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-[13vw] lg:text-[8rem] leading-none text-[#F5F2EE] mb-6">
            {firstLine}
            <br />
            <em className="font-display font-light italic text-[#D4B896]">
              {secondLine}
            </em>
          </h1>

          {/* Subtitle */}
          <p className="text-[#D4B896]/80 text-sm tracking-[0.15em] mb-10 max-w-md">
            {section.contenu || 'Accessoires artisanaux de luxe. Pièces d\'exception nées à Dakar.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center bg-[#F5F2EE] text-[#0C0C0C] px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#D4B896] transition-colors"
            >
              Découvrir la Boutique
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center border border-[#F5F2EE]/30 text-[#F5F2EE] px-10 py-4 text-xs tracking-[0.2em] uppercase hover:border-[#F5F2EE]/80 transition-colors"
            >
              Nos Collections
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-12 hidden lg:flex flex-col items-center gap-3">
        <span className="text-[9px] tracking-[0.3em] uppercase text-[#8A8480] rotate-90 origin-center">Défiler</span>
        <div className="w-px h-12 bg-[#D4B896]/40" />
      </div>
    </section>
  )
}