import { getClientsAdmin } from '@/lib/actions/cms'
import { formatPrix, formatDateShort } from '@/lib/utils'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Clients — DERBII Admin' }

interface ClientsPageProps {
  searchParams: Promise<{ page?: string; q?: string }>
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const { clients, total } = await getClientsAdmin(page, 20, params.q)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Clients</h1>
        <p className="text-sm text-stone-500 mt-1">{total} client{total !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-white border border-stone-100 rounded-lg p-4">
        <form className="flex items-center gap-2">
          <Search size={15} strokeWidth={1.5} className="text-stone-400" />
          <input
            type="text"
            name="q"
            defaultValue={params.q || ''}
            placeholder="Rechercher par nom ou téléphone..."
            className="flex-1 text-sm text-stone-700 placeholder-stone-400 focus:outline-none"
          />
          <button type="submit" className="text-xs bg-stone-900 text-white px-4 py-1.5 rounded">Chercher</button>
        </form>
      </div>

      <div className="bg-white border border-stone-100 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium">Client</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium">Téléphone</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium hidden md:table-cell">Commandes</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium hidden lg:table-cell">Total dépensé</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium hidden xl:table-cell">Depuis le</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-sm text-stone-400">Aucun client</td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-stone-600">
                          {client.nom.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-stone-700">{client.nom}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={`https://wa.me/${client.telephone.replace(/\D/g, '')}`}
                      target="_blank"
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      {client.telephone}
                    </a>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-stone-700">{client.total_commandes}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm font-medium text-stone-700">{formatPrix(client.total_depense)}</span>
                  </td>
                  <td className="px-5 py-4 hidden xl:table-cell">
                    <span className="text-xs text-stone-400">{formatDateShort(client.created_at)}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/super-admin/clients/${client.id}`}
                      className="text-xs text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-400 px-3 py-1.5 rounded transition-colors"
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
    </div>
  )
}
