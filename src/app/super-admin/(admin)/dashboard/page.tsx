import { getStatsDashboard } from '@/lib/actions/orders'
import { formatPrix, formatDateShort } from '@/lib/utils'
import { TrendingUp, ShoppingBag, Package, Users, AlertTriangle } from 'lucide-react'
import ResetStatsButton from '@/components/admin/ResetStatsButton'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tableau de bord — DERBII Admin' }

export default async function DashboardPage() {
  const stats = await getStatsDashboard()

  const statCards = [
    {
      label: 'Chiffre d\'affaires',
      value: formatPrix(stats.chiffreAffaires),
      sub: 'Commandes livrées',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Commandes',
      value: stats.totalCommandes.toString(),
      sub: 'Total toutes commandes',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Produits actifs',
      value: stats.totalProduits.toString(),
      sub: 'En catalogue',
      icon: Package,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Clients',
      value: stats.totalClients.toString(),
      sub: 'Clients enregistrés',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  const statutColors: Record<string, string> = {
    'Nouvelle commande': 'bg-blue-100 text-blue-700',
    'Acceptée': 'bg-amber-100 text-amber-700',
    'Livrée': 'bg-emerald-100 text-emerald-700',
    'Annulée': 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Tableau de bord</h1>
        <p className="text-sm text-stone-500 mt-1">Vue d&apos;ensemble de votre activité DERBII</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-stone-100 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-stone-500 tracking-wide uppercase mb-2">{card.label}</p>
                <p className="text-2xl font-semibold text-stone-900">{card.value}</p>
                <p className="text-xs text-stone-400 mt-1">{card.sub}</p>
              </div>
              <div className={`${card.bg} p-2.5 rounded-md`}>
                <card.icon size={18} strokeWidth={1.5} className={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="xl:col-span-2 bg-white border border-stone-100 rounded-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="font-medium text-stone-900">Commandes récentes</h2>
            <Link href="/super-admin/commandes" className="text-xs text-stone-500 hover:text-stone-700 transition-colors">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-stone-50">
            {stats.commandesRecentes.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-stone-400">
                Aucune commande
              </div>
            ) : (
              stats.commandesRecentes.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/super-admin/commandes/${order.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-stone-800">{order.numero_commande}</p>
                      <p className="text-xs text-stone-400">{order.nom_client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${statutColors[order.statut] || 'bg-stone-100 text-stone-600'}`}>
                      {order.statut}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPrix(order.total)}</p>
                      <p className="text-[10px] text-stone-400">{formatDateShort(order.created_at)}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-5">
          {/* Top products */}
          <div className="bg-white border border-stone-100 rounded-lg">
            <div className="px-5 py-4 border-b border-stone-100">
              <h2 className="font-medium text-stone-900">Produits populaires</h2>
            </div>
            <div className="p-4 space-y-3">
              {stats.produitsPopulaires.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-4">Aucune vente encore</p>
              ) : (
                stats.produitsPopulaires.map((p: any, i: number) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-xs text-stone-300 w-4">{i + 1}</span>
                    <div className="w-8 h-8 bg-stone-100 flex-shrink-0 overflow-hidden rounded">
                      {p.image_principale && (
                        <img src={p.image_principale} alt={p.nom} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-700 truncate">{p.nom}</p>
                      <p className="text-[10px] text-stone-400">{p.nombre_ventes} vente{p.nombre_ventes !== 1 ? 's' : ''}</p>
                    </div>
                    <p className="text-xs font-medium text-stone-700 flex-shrink-0">{formatPrix(p.prix)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low stock alert */}
          {stats.stockFaible.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-amber-200">
                <AlertTriangle size={14} strokeWidth={1.5} className="text-amber-600" />
                <h2 className="font-medium text-amber-800 text-sm">Stock faible</h2>
              </div>
              <div className="p-4 space-y-2">
                {stats.stockFaible.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <p className="text-xs text-amber-700 truncate flex-1">{p.nom}</p>
                    <span className={`text-[10px] font-medium ml-2 ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {p.stock === 0 ? 'Épuisé' : `${p.stock} restant${p.stock > 1 ? 's' : ''}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
