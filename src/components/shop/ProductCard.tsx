'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatPrix } from '@/lib/utils'
import { Product } from '@/types/database'

interface ProductCardProps {
  product: Product & {
    product_images?: { url: string; alt: string | null }[]
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.image_principale || product.product_images?.[0]?.url
  const hasPromo = product.prix_promo && product.prix_promo < product.prix

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      {/* Image */}
      <div className="img-zoom aspect-[3/4] bg-[#EDE3D8] relative overflow-hidden mb-4">
        {image ? (
          <Image
            src={image}
            alt={product.nom}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-[#EDE3D8] flex items-center justify-center">
            <span className="font-display text-4xl text-[#D4B896] opacity-30">D</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {hasPromo && (
            <span className="bg-[#0C0C0C] text-[#F5F2EE] text-[9px] tracking-[0.15em] uppercase px-2 py-1">
              Promo
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-[#8A8480] text-[#F5F2EE] text-[9px] tracking-[0.15em] uppercase px-2 py-1">
              Épuisé
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-sm tracking-wide font-medium group-hover:text-[#8A8480] transition-colors">
          {product.nom}
        </h3>
        {product.description_courte && (
          <p className="text-xs text-[#8A8480] tracking-wide line-clamp-1">
            {product.description_courte}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          {hasPromo ? (
            <>
              <span className="text-sm font-medium">{formatPrix(product.prix_promo!)}</span>
              <span className="text-xs text-[#8A8480] line-through">{formatPrix(product.prix)}</span>
            </>
          ) : (
            <span className="text-sm">{formatPrix(product.prix)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
