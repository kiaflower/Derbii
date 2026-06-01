'use client'

import { useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrix } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { ProductWithImages } from '@/types/database'

interface ProductInfoProps {
  product: ProductWithImages
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter()
  const [quantite, setQuantite] = useState(1)
  const [varianteSelectionnee, setVarianteSelectionnee] = useState<string | undefined>()
  const addItem = useCartStore((state) => state.addItem)

  const prix = product.prix_promo || product.prix
  const hasPromo = product.prix_promo && product.prix_promo < product.prix
  const enRupture = product.stock === 0

  const doAddToCart = () => {
    if (enRupture) return

    addItem({
      id: `${product.id}-${varianteSelectionnee || 'default'}-${Date.now()}`,
      product_id: product.id,
      nom: product.nom,
      prix,
      quantite,
      image: product.image_principale || product.product_images?.[0]?.url || null,
      variante: varianteSelectionnee,
      stock: product.stock,
    })
    router.push('/panier')
  }

  const buttonBaseStyles: CSSProperties = {
    border: 'none',
    cursor: 'pointer',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    fontFamily: 'inherit',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  }

  return (
    // WebkitUserSelect none sur tout le composant empêche la sélection de texte au tap long
    <div className="relative z-20 py-4 lg:py-8" style={{ WebkitUserSelect: 'none', userSelect: 'none' }}>

      {product.categories && (
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mb-4" style={{ WebkitUserSelect: 'none' }}>
          {product.categories.nom}
        </p>
      )}

      <h1 className="font-display text-3xl lg:text-4xl mb-2 leading-tight">{product.nom}</h1>

      <div className="flex items-baseline gap-3 mt-5 mb-8">
        <span className="font-display text-2xl lg:text-3xl">{formatPrix(prix)}</span>
        {hasPromo && <span className="text-sm text-[#8A8480] line-through">{formatPrix(product.prix)}</span>}
      </div>

      {product.description_courte && (
        <p className="text-sm text-[#8A8480] tracking-wide mb-6">{product.description_courte}</p>
      )}

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mb-3">Options</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={v.stock === 0}
                onClick={() => setVarianteSelectionnee(v.valeur)}
                style={{
                  ...buttonBaseStyles,
                  padding: '10px 16px',
                  fontSize: 11,
                  letterSpacing: '0.05em',
                  border: `1px solid ${varianteSelectionnee === v.valeur ? '#0C0C0C' : '#E8E4DF'}`,
                  background: varianteSelectionnee === v.valeur ? '#0C0C0C' : 'transparent',
                  color: varianteSelectionnee === v.valeur ? '#F5F2EE' : v.stock === 0 ? '#8A8480' : '#0C0C0C',
                  opacity: v.stock === 0 ? 0.5 : 1,
                }}
              >
                {v.valeur}{v.prix_supplement > 0 ? ` +${formatPrix(v.prix_supplement)}` : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantité */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mb-3">Quantité</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #E8E4DF' }}>

          <button
            type="button"
            aria-label="Diminuer"
            onClick={() => setQuantite((q) => Math.max(1, q - 1))}
            style={{ ...buttonBaseStyles, background: 'transparent', width: 48, height: 48, fontSize: 20, color: '#0C0C0C' }}
          >
            −
          </button>

          {/* pointer-events:none empêche la sélection du texte */}
          <div style={{
            width: 48, textAlign: 'center', fontSize: 14,
            WebkitUserSelect: 'none', userSelect: 'none',
            pointerEvents: 'none',
          }}>
            {quantite}
          </div>

          <button
            type="button"
            aria-label="Augmenter"
            disabled={quantite >= product.stock}
            onClick={() => setQuantite((q) => Math.min(product.stock, q + 1))}
            style={{
              ...buttonBaseStyles,
              background: 'transparent',
              width: 48,
              height: 48,
              fontSize: 20,
              color: quantite >= product.stock ? '#8A8480' : '#0C0C0C',
              opacity: quantite >= product.stock ? 0.4 : 1,
            }}
          >
            +
          </button>

        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-amber-600 mt-2 tracking-wide">Plus que {product.stock} en stock</p>
        )}
      </div>

      {/* Ajouter au panier */}
      <button
        type="button"
        onClick={doAddToCart}
        disabled={enRupture}
        style={{
          ...buttonBaseStyles,
          width: '100%',
          padding: '18px 0',
          background: enRupture ? '#8A8480' : '#0C0C0C',
          color: '#F5F2EE',
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: enRupture ? 0.6 : 1,
        }}
      >
        {enRupture ? 'Produit épuisé' : 'Ajouter au panier →'}
      </button>

      {/* Description */}
      {product.description && (
        <div className="mt-10 pt-8 border-t border-[#E8E4DF]" style={{ WebkitUserSelect: 'text', userSelect: 'text' }}>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mb-4">Description</p>
          <div className="text-sm text-[#8A8480] leading-relaxed tracking-wide space-y-3"
            dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      )}

      {/* Details */}
      {(product.matiere || product.dimensions) && (
        <div className="mt-8 space-y-3" style={{ WebkitUserSelect: 'text', userSelect: 'text' }}>
          {product.matiere && (
            <div className="flex justify-between py-3 border-b border-[#E8E4DF]">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480]">Matière</span>
              <span className="text-xs tracking-wide">{product.matiere}</span>
            </div>
          )}
          {product.dimensions && (
            <div className="flex justify-between py-3 border-b border-[#E8E4DF]">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480]">Dimensions</span>
              <span className="text-xs tracking-wide">{product.dimensions}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-b border-[#E8E4DF]">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480]">Livraison</span>
            <span className="text-xs tracking-wide">Dakar 24h — Régions 3–5 jours</span>
          </div>
        </div>
      )}

    </div>
  )
}