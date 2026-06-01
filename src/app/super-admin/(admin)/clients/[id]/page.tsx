import { getClientById } from '@/lib/actions/cms'
import { formatPrix, formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

interface ClientDetailPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Détail client — DERBII Admin' }

const statutColors: Record<string, string> = {
  'Nouvelle commande': 'bg-blue-100 text-blue-700',
  'Acceptée': 'bg-amber-100 text-amber-700',
  'Livrée': 'bg-emerald-100 text-emerald-700',
  'Annulée': 'bg-red-100 text-red-700',
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params
  const { client, commandes } = await getClientById(id) as { client: any; commandes: any[] }

  if (!client) notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/super-admin/clients" className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors">
          <ArrowLeft size={13} strokeWidth={1.5} />
          Retour
        </Link>
        <div className="h-4 w-px bg-stone-200" />
        <h1 className="text-xl font-semibold text-stone-900">{client.nom}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Client info */}
        <div className="bg-white border border-stone-100 rounded-lg p-5">
          <h2 className="font-medium text-stone-900 mb-4">Informations</h2>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Nom</p>
              <p className="text-sm text-stone-700">{client.nom}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Téléphone</p>
              <a href={`https://wa.me/${client.telephone.replace(/\D/g, '')}`} target="_blank" className="text-sm text-emerald-600 hover:text-emerald-700">
                {client.telephone}
              </a>
            </div>
            {client.adresse && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Adresse</p>
                <p className="text-sm text-stone-700">{client.adresse}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Client depuis</p>
              <p className="text-sm text-stone-700">{formatDate(client.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white border border-stone-100 rounded-lg p-5">
            <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-2">Total dépensé</p>
            <p className="text-2xl font-semibold text-stone-900">{formatPrix(client.total_depense)}</p>
            <p className="text-xs text-stone-400 mt-1">Commandes livrées uniquement</p>
          </div>
          <div className="bg-white border border-stone-100 rounded-lg p-5">
            <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-2">Commandes</p>
            <p className="text-2xl font-semibold text-stone-900">{client.total_commandes}</p>
            <p className="text-xs text-stone-400 mt-1">Commandes livrées</p>
          </div>
        </div>
      </div>

      {/* Order history */}
      <div className="bg-white border border-stone-100 rounded-lg">
        <div className="px-5 py-4 border-b border-stone-100">
          <h2 className="font-medium text-stone-900">Historique des commandes</h2>
        </div>
        {commandes.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-stone-400">
            Aucune commande
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {commandes.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-mono font-medium text-stone-700">{order.numero_commande}</p>
                  <p className="text-xs text-stone-400">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${statutColors[order.statut] || ''}`}>
                    {order.statut}
                  </span>
                  <p className="text-sm font-medium text-stone-700">{formatPrix(order.total)}</p>
                  <Link
                    href={`/super-admin/commandes/${order.id}`}
                    className="text-xs text-stone-500 hover:text-stone-700 border border-stone-200 px-2 py-1 rounded"
                  >
                    Voir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
