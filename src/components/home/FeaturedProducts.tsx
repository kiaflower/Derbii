import Link from 'next/link'
import ProductCard from '@/components/shop/ProductCard'
import { HomepageSection, Product } from '@/types/database'

interface FeaturedProductsProps {
  produits: (Product & { product_images?: { url: string; alt: string | null }[] })[]
  section: HomepageSection
}

export default function FeaturedProducts({ produits, section }: FeaturedProductsProps) {
  if (produits.length === 0) return null

  const titre = section.titre || 'Pièces à la Une'
  const href = section.lien || '/boutique'

  return (
    <section className="py-20 lg:py-28 max-w-[1400px] mx-auto px-6 lg:px-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-12 lg:mb-16">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#D4B896]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8480]">
              {section.sous_titre || 'Sélection'}
            </span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl">{titre}</h2>
        </div>
        <Link
          href={href}
          className="hidden lg:inline-flex text-xs tracking-[0.15em] uppercase link-underline pb-0.5"
        >
          Tout voir
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        {produits.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="mt-10 text-center lg:hidden">
        <Link
          href={href}
          className="text-xs tracking-[0.15em] uppercase border-b border-[#0C0C0C] pb-0.5"
        >
          Voir tous les produits
        </Link>
      </div>
    </section>
  )
}