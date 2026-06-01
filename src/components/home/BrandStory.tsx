import Link from 'next/link'
import { HomepageSection } from '@/types/database'

interface BrandStoryProps {
  section: HomepageSection
}

export default function BrandStory({ section }: BrandStoryProps) {
  return (
    <section className="py-20 lg:py-32 max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Text */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-[#D4B896]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8480]">
              {section.sous_titre || 'Notre Histoire'}
            </span>
          </div>
          <h2 className="font-display text-4xl lg:text-6xl leading-tight mb-6">
            {section.titre || 'L\'Art du Cuir Sénégalais'}
          </h2>
          <p className="text-[#8A8480] text-sm leading-relaxed tracking-wide mb-8 max-w-md">
            {section.contenu ||
              'Depuis notre création, nous célébrons le savoir-faire sénégalais à travers des pièces en cuir d\'exception. Chaque accessoire DERBII raconte une histoire — celle d\'artisans passionnés, de matières soigneusement sélectionnées et d\'un design qui honore notre héritage.'}
          </p>
          {section.lien && (
            <Link
              href={section.lien}
              className="inline-flex text-xs tracking-[0.15em] uppercase border-b border-[#0C0C0C] pb-0.5 mb-8"
            >
              En savoir plus
            </Link>
          )}
          <div className="flex items-center gap-8">
            <div>
              <div className="font-display text-4xl text-[#D4B896]">100%</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mt-1">Cuir Authentique</div>
            </div>
            <div className="h-12 w-px bg-[#E8E4DF]" />
            <div>
              <div className="font-display text-4xl text-[#D4B896]">Made</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mt-1">In Sénégal</div>
            </div>
            <div className="h-12 w-px bg-[#E8E4DF]" />
            <div>
              <div className="font-display text-4xl text-[#D4B896]">Artisan</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mt-1">Local</div>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          {section.image_url ? (
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={section.image_url}
                alt="DERBII Atelier"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[4/5] bg-[#EDE3D8] flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(135deg, #EDE3D8 0%, #D4B896 50%, #B89470 100%)`,
                }}
              />
              <div className="relative text-center">
                <div className="font-display text-8xl text-white/30">D</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#F5F2EE]/60 mt-2">
                  Atelier DERBII
                </div>
              </div>
            </div>
          )}
          {/* Decorative element */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#EDE3D8] -z-10 hidden lg:block" />
          <div className="absolute -top-6 -right-6 w-16 h-16 border border-[#D4B896] -z-10 hidden lg:block" />
        </div>
      </div>
    </section>
  )
}