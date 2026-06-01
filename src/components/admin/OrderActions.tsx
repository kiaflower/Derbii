'use client'

import { useState } from 'react'
import { mettreAJourStatutCommande } from '@/lib/actions/orders'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { MessageCircle, CheckCircle, Truck, XCircle } from 'lucide-react'
import { Order } from '@/types/database'

interface OrderActionsProps {
  order: Order
}

export default function OrderActions({ order }: OrderActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (statut: Order['statut']) => {
    setLoading(statut)
    const whatsappWindow = statut === 'Acceptée' ? window.open('', '_blank') : null

    try {
      const result = await mettreAJourStatutCommande(order.id, statut)

      if (statut === 'Acceptée' && result.whatsappUrl) {
        toast.success('Commande acceptée ! Ouverture WhatsApp...')

        if (whatsappWindow) {
          whatsappWindow.location.href = result.whatsappUrl
        } else {
          window.location.href = result.whatsappUrl
        }
      } else if (statut === 'Acceptée') {
        whatsappWindow?.close()
        toast.success('Commande acceptée.')
      } else if (statut === 'Livrée') {
        toast.success('Commande marquée comme livrée. Chiffre d\'affaires mis à jour.')
      } else if (statut === 'Annulée') {
        toast.success('Commande annulée.')
      }

      router.refresh()
    } catch {
      whatsappWindow?.close()
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(null)
    }
  }

  const canAccept = order.statut === 'Nouvelle commande'
  const canDeliver = order.statut === 'Acceptée'
  const canCancel = order.statut !== 'Livrée' && order.statut !== 'Annulée'

  return (
    <div className="bg-white border border-stone-100 rounded-lg p-5">
      <h2 className="font-medium text-stone-900 mb-4">Actions</h2>
      <div className="space-y-2.5">
        {canAccept && (
          <button
            onClick={() => handleAction('Acceptée')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-2.5 text-xs tracking-wide rounded hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading === 'Acceptée' ? (
              'Traitement...'
            ) : (
              <>
                <CheckCircle size={14} strokeWidth={1.5} />
                Accepter la commande
              </>
            )}
          </button>
        )}

        {canDeliver && (
          <button
            onClick={() => handleAction('Livrée')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 text-xs tracking-wide rounded hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading === 'Livrée' ? (
              'Traitement...'
            ) : (
              <>
                <Truck size={14} strokeWidth={1.5} />
                Marquer comme livrée
              </>
            )}
          </button>
        )}

        <a
          href={`https://wa.me/${order.telephone_client.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 border border-stone-200 text-stone-700 py-2.5 text-xs tracking-wide rounded hover:bg-stone-50 transition-colors"
        >
          <MessageCircle size={14} strokeWidth={1.5} />
          Contacter le client
        </a>

        {canCancel && (
          <button
            onClick={() => {
              if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
                handleAction('Annulée')
              }
            }}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2.5 text-xs tracking-wide rounded hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <XCircle size={14} strokeWidth={1.5} />
            Annuler la commande
          </button>
        )}
      </div>
    </div>
  )
}