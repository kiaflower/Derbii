'use client'

import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrix, cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

const BTN_STYLE = {
  touchAction: 'manipulation' as const,
  WebkitTapHighlightColor: 'transparent',
  cursor: 'pointer',
}

export default function CartSidebar() {
  const { isOpen, closeCart, items, removeItem, updateQuantite, total } = useCartStore()

  return (
    <>
      {/* Overlay — z-40 pour être sous la sidebar */}
      <div
        className={cn(
          'fixed inset-0 bg-[#0C0C0C]/40 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ zIndex: 40 }}
        onClick={closeCart}
      />

      {/* Sidebar — z-50 au-dessus de l'overlay */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-[#F5F2EE] flex flex-col',
          isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        )}
        style={{
          zIndex: 50,
          transition: 'transform 0.3s ease',
          overscrollBehavior: 'contain',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E4DF] flex-shrink-0">
          <div>
            <h2 className="font-display text-xl tracking-wide">Mon Panier</h2>
            {items.length > 0 && (
              <p className="text-xs text-[#8A8480] tracking-wide mt-0.5">
                {items.length} article{items.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            type="button"
            style={BTN_STYLE}
            onTouchEnd={(e) => { e.preventDefault(); closeCart() }}
            onClick={closeCart}
            className="p-3 -mr-2 active:opacity-60"
            aria-label="Fermer"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <ShoppingBag size={40} strokeWidth={1} className="text-[#D4B896]" />
              <div>
                <p className="font-display text-xl">Votre panier est vide</p>
                <p className="text-xs text-[#8A8480] mt-2 tracking-wide">
                  Découvrez nos pièces d&apos;exception
                </p>
              </div>
              <button
                type="button"
                style={BTN_STYLE}
                onTouchEnd={(e) => { e.preventDefault(); closeCart() }}
                onClick={closeCart}
                className="mt-2 text-xs tracking-[0.15em] uppercase border-b border-[#0C0C0C] pb-0.5 py-1 px-1"
              >
                Explorer la boutique
              </button>
            </div>
          ) : (
            <div className="px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-[#E8E4DF] last:border-0">
                  {/* Image */}
                  <div className="w-20 h-24 bg-[#EDE3D8] flex-shrink-0 relative overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.nom} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full bg-[#EDE3D8]" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium tracking-wide truncate">{item.nom}</p>
                        {item.variante && (
                          <p className="text-xs text-[#8A8480] mt-0.5">{item.variante}</p>
                        )}
                      </div>
                      {/* Supprimer — zone de tap large */}
                      <button
                        type="button"
                        style={BTN_STYLE}
                        onTouchEnd={(e) => { e.preventDefault(); removeItem(item.id) }}
                        onClick={() => removeItem(item.id)}
                        className="p-2 -mr-1 -mt-1 flex-shrink-0 active:opacity-60"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={14} strokeWidth={1.5} className="text-[#8A8480]" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls — zone de tap min 44px */}
                      <div className="flex items-center border border-[#E8E4DF]">
                        <button
                          type="button"
                          style={BTN_STYLE}
                          onTouchEnd={(e) => { e.preventDefault(); updateQuantite(item.id, item.quantite - 1) }}
                          onClick={() => updateQuantite(item.id, item.quantite - 1)}
                          className="w-11 h-11 flex items-center justify-center active:bg-[#EDE3D8]"
                          aria-label="Diminuer"
                        >
                          <Minus size={13} strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-sm select-none">{item.quantite}</span>
                        <button
                          type="button"
                          style={BTN_STYLE}
                          onTouchEnd={(e) => { e.preventDefault(); updateQuantite(item.id, item.quantite + 1) }}
                          onClick={() => updateQuantite(item.id, item.quantite + 1)}
                          className="w-11 h-11 flex items-center justify-center active:bg-[#EDE3D8]"
                          aria-label="Augmenter"
                        >
                          <Plus size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrix(item.prix * item.quantite)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E8E4DF] p-6 space-y-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8A8480] tracking-wide">Total</span>
              <span className="font-display text-xl">{formatPrix(total())}</span>
            </div>
            <p className="text-[10px] text-[#8A8480] tracking-wide leading-relaxed">
              Commande finalisée via WhatsApp. Livraison calculée à la confirmation.
            </p>
            <Link
              href="/panier"
              onClick={closeCart}
              style={BTN_STYLE}
              className="block w-full bg-[#0C0C0C] text-[#F5F2EE] text-center py-4 text-xs tracking-[0.2em] uppercase active:bg-[#2a2a2a]"
            >
              Valider ma commande
            </Link>
          </div>
        )}
      </div>
    </>
  )
}