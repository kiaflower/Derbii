import Link from 'next/link'
import { Collection, HomepageSection } from '@/types/database'

interface CollectionsGridProps {
  collections: Collection[]
  section: HomepageSection
}

export default function CollectionsGrid({ collections, section }: CollectionsGridProps) {
  if (collections.length === 0) return null

  const titre = section.titre || 'Nos Collections'
  const href = section.lien || '/collections'

  return (
    <section className="bg-[#EDE3D8] py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#B89470]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B89470]">
              {section.sous_titre || 'Univers'}
            </span>
            <div className="h-px w-8 bg-[#B89470]" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl">{titre}</h2>
          {section.contenu && (
            <p className="text-[#8A8480] text-sm tracking-wide mt-4 max-w-xl mx-auto">
              {section.contenu}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {collections.slice(0, 3).map((collection, i) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className={`group relative overflow-hidden ${i === 0 ? 'lg:row-span-2' : ''}`}
            >
              <div className={`img-zoom bg-[#D4B896] relative ${i === 0 ? 'aspect-[3/4] lg:h-full lg:min-h-[600px]' : 'aspect-[4/3]'}`}>
                {collection.banniere_url ? (
                  <img
                    src={collection.banniere_url}
                    alt={collection.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#D4B896] to-[#B89470] flex items-center justify-center">
                    <span className="font-display text-6xl text-white/20">{collection.nom[0]}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-[#0C0C0C]/20 group-hover:bg-[#0C0C0C]/40 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-[#F5F2EE]">
                  <p className="text-[10px] tracking-[0.25em] uppercase opacity-70 mb-1">Collection</p>
                  <h3 className="font-display text-2xl lg:text-3xl">{collection.nom}</h3>
                  {collection.description && (
                    <p className="text-xs opacity-70 mt-1 tracking-wide line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-[10px] tracking-[0.2em] uppercase">Découvrir</span>
                    <div className="h-px w-6 bg-[#F5F2EE]" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={href}
            className="inline-flex text-xs tracking-[0.15em] uppercase border-b border-[#0C0C0C] pb-0.5"
          >
            Voir toutes les collections
          </Link>
        </div>
      </div>
    </section>
  )
}