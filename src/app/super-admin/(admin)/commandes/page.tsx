import { getCommandesAdmin } from '@/lib/actions/orders'
import { formatPrix, formatDateShort } from '@/lib/utils'
import { OrderStatut } from '@/types/database'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Commandes — DERBII Admin' }

const statutColors: Record<string, string> = {
  'Nouvelle commande': 'bg-blue-100 text-blue-700',
  'Acceptée': 'bg-amber-100 text-amber-700',
  'Livrée': 'bg-emerald-100 text-emerald-700',
  'Annulée': 'bg-red-100 text-red-700',
}

const statutOptions = [
  { value: '', label: 'Toutes' },
  { value: 'Nouvelle commande', label: 'Nouvelles' },
  { value: 'Acceptée', label: 'Acceptées' },
  { value: 'Livrée', label: 'Livrées' },
  { value: 'Annulée', label: 'Annulées' },
]

interface CommandesPageProps {
  searchParams: Promise<{ page?: string; statut?: string; q?: string }>
}

export default async function CommandesPage({ searchParams }: CommandesPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const statut = params.statut as OrderStatut | undefined
  const search = params.q

  const { commandes, total } = await getCommandesAdmin(page, 20, statut, search)
  const totalPages = Math.ceil(total / 20)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Commandes</h1>
        <p className="text-sm text-stone-500 mt-1">{total} commande{total !== 1 ? 's' : ''} au total</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-stone-100 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
        <form className="flex items-center gap-2 flex-1">
          <Search size={15} strokeWidth={1.5} className="text-stone-400 flex-shrink-0" />
          <input
            type="text"
            name="q"
            defaultValue={search || ''}
            placeholder="Rechercher par numéro DER-2026-000001..."
            className="flex-1 text-sm text-stone-700 placeholder-stone-400 focus:outline-none"
          />
          <button type="submit" className="text-xs bg-stone-900 text-white px-4 py-1.5 rounded hover:bg-stone-700 transition-colors">
            Chercher
          </button>
        </form>
        <div className="flex gap-2 flex-wrap">
          {statutOptions.map(opt => (
            <a
              key={opt.value}
              href={`?${opt.value ? `statut=${encodeURIComponent(opt.value)}` : ''}${search ? `&q=${search}` : ''}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                (params.statut || '') === opt.value
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {opt.label}
            </a>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-100 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium">N° Commande</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium">Client</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium hidden md:table-cell">Produits</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium">Total</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium">Statut</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium hidden lg:table-cell">Date</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {commandes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-stone-400">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                commandes.map((order: any) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono font-medium text-stone-700">{order.numero_commande}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-stone-700">{order.nom_client}</p>
                      <p className="text-xs text-stone-400">{order.telephone_client}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-xs text-stone-500">
                        {order.order_items?.length || 0} article{order.order_items?.length !== 1 ? 's' : ''}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-stone-700">{formatPrix(order.total)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center text-[10px] px-2 py-1 rounded-full font-medium ${statutColors[order.statut] || 'bg-stone-100 text-stone-600'}`}>
                        {order.statut}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-stone-400">{formatDateShort(order.created_at)}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/super-admin/commandes/${order.id}`}
                        className="text-xs text-stone-600 hover:text-stone-900 transition-colors border border-stone-200 hover:border-stone-400 px-3 py-1.5 rounded"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-stone-100">
            <p className="text-xs text-stone-400">
              Page {page} sur {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a href={`?page=${page - 1}${statut ? `&statut=${statut}` : ''}`} className="text-xs border border-stone-200 px-3 py-1.5 rounded hover:border-stone-400 transition-colors">
                  Précédent
                </a>
              )}
              {page < totalPages && (
                <a href={`?page=${page + 1}${statut ? `&statut=${statut}` : ''}`} className="text-xs border border-stone-200 px-3 py-1.5 rounded hover:border-stone-400 transition-colors">
                  Suivant
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
