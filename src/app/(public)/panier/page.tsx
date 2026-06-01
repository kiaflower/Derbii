'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { formatPrix } from '@/lib/utils'
import { creerCommande } from '@/lib/actions/orders'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'

const BUTTON_STYLE = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  touchAction: 'manipulation' as const,
  WebkitTapHighlightColor: 'transparent',
  fontFamily: 'inherit',
}

export default function PanierPage() {
  const { items, removeItem, updateQuantite, clearCart, total } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nom: '', telephone: '', adresse: '' })
  const [commandeCreee, setCommandeCreee] = useState<{ numero: string; whatsappUrl: string } | null>(null)

  const handleSubmit = async () => {
    if (!form.nom || !form.telephone) {
      toast.error('Veuillez renseigner votre nom et téléphone')
      return
    }
    if (items.length === 0) {
      toast.error('Votre panier est vide')
      return
    }
    setLoading(true)
    try {
      const result = await creerCommande({
        nom_client: form.nom,
        telephone_client: form.telephone,
        adresse_client: form.adresse || undefined,
        items,
      }) as { order: { numero_commande: string }; whatsappUrl: string }
      setCommandeCreee({ numero: result.order.numero_commande, whatsappUrl: result.whatsappUrl })
      clearCart()
      toast.success('Commande créée !')
    } catch {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (commandeCreee) {
    return (
      <div className="min-h-screen bg-[#F5F2EE] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#EDE3D8] flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={28} strokeWidth={1} className="text-[#D4B896]" />
          </div>
          <h1 className="font-display text-3xl mb-3">Commande Créée</h1>
          <p className="text-[#8A8480] text-sm tracking-wide mb-2">Numéro de commande</p>
          <p className="font-display text-2xl text-[#D4B896] mb-6">{commandeCreee.numero}</p>
          <p className="text-sm text-[#8A8480] tracking-wide leading-relaxed mb-8">
            Votre commande a été enregistrée. Appuyez ci-dessous pour confirmer via WhatsApp.
          </p>
          <a href={commandeCreee.whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#0C0C0C] text-[#F5F2EE] px-8 py-4 text-xs tracking-[0.2em] uppercase mb-4">
            <MessageCircle size={16} strokeWidth={1.5} />
            Confirmer sur WhatsApp
          </a>
          <div className="mt-4">
            <Link href="/boutique" className="text-xs tracking-[0.15em] uppercase text-[#8A8480] border-b border-[#8A8480] pb-0.5">
              Continuer les achats
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F2EE] pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">

        <div className="mb-10">
          <Link href="/boutique" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#8A8480] mb-6 py-2">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Continuer mes achats
          </Link>
          <h1 className="font-display text-4xl lg:text-5xl">Mon Panier</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-[#8A8480] mb-4">Votre panier est vide</p>
            <Link href="/boutique" className="text-xs tracking-[0.15em] uppercase border-b border-[#0C0C0C] pb-0.5">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

            {/* Items */}
            <div className="lg:col-span-2 border-t border-[#E8E4DF]">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 py-6 border-b border-[#E8E4DF]">
                  <div className="w-24 h-28 bg-[#EDE3D8] flex-shrink-0 relative overflow-hidden">
                    {item.image
                      ? <Image src={item.image} alt={item.nom} fill className="object-cover" sizes="96px" />
                      : <div className="w-full h-full bg-[#EDE3D8]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm tracking-wide">{item.nom}</p>
                        {item.variante && <p className="text-xs text-[#8A8480] mt-0.5">{item.variante}</p>}
                      </div>
                      {/* Supprimer */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={{
                          ...BUTTON_STYLE,
                          color: '#8A8480',
                          fontSize: 14,
                          padding: '4px 8px',
                        }}
                        aria-label="Supprimer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantité */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E8E4DF' }}>
                        <button
                          type="button"
                          onClick={() => updateQuantite(item.id, item.quantite - 1)}
                          style={{
                            ...BUTTON_STYLE,
                            width: 44,
                            height: 44,
                            fontSize: 16,
                            color: '#0C0C0C',
                          }}
                          aria-label="Diminuer"
                        >
                          −
                        </button>
                        <span style={{ width: 40, textAlign: 'center', fontSize: 14, userSelect: 'none', pointerEvents: 'none' }}>
                          {item.quantite}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantite(item.id, item.quantite + 1)}
                          style={{
                            ...BUTTON_STYLE,
                            width: 44,
                            height: 44,
                            fontSize: 16,
                            color: '#0C0C0C',
                          }}
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-display text-lg">{formatPrix(item.prix * item.quantite)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary + Form */}
            <div>
              <div className="bg-[#EDE3D8] p-6 mb-6">
                <h2 className="font-display text-xl mb-5">Vos informations</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Nom complet *', key: 'nom', type: 'text', placeholder: 'Votre nom', auto: 'name' },
                    { label: 'Téléphone *', key: 'telephone', type: 'tel', placeholder: 'Ex: 77 000 00 00', auto: 'tel' },
                    { label: 'Adresse de livraison', key: 'adresse', type: 'text', placeholder: 'Quartier, Ville', auto: 'street-address' },
                  ].map(({ label, key, type, placeholder, auto }) => (
                    <div key={key}>
                      <label className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] block mb-2">{label}</label>
                      <input
                        type={type}
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        autoComplete={auto}
                        className="w-full bg-transparent border-b border-[#D4B896] pb-2 text-sm text-[#0C0C0C] placeholder-[#B89470] focus:outline-none focus:border-[#0C0C0C] tracking-wide"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[#E8E4DF] p-6">
                <h2 className="font-display text-xl mb-5">Résumé</h2>
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[#8A8480] tracking-wide">{item.nom} × {item.quantite}</span>
                      <span>{formatPrix(item.prix * item.quantite)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E8E4DF] pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs tracking-[0.15em] uppercase text-[#8A8480]">Total</span>
                    <span className="font-display text-2xl">{formatPrix(total())}</span>
                  </div>
                  <p className="text-[10px] text-[#8A8480] mt-1 tracking-wide">Livraison calculée à la confirmation</p>
                </div>

                {/* Commander */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    background: '#0C0C0C',
                    color: '#F5F2EE',
                    border: 'none',
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    fontFamily: 'inherit',
                  }}
                >
                  {loading ? 'Traitement en cours...' : 'Commander via WhatsApp'}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}