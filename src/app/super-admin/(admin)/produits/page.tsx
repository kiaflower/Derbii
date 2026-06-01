import { getProductsAdmin } from '@/lib/actions/products'
import { formatPrix, formatDateShort } from '@/lib/utils'
import Link from 'next/link'
import { Plus, Search, Edit, Archive } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Produits — DERBII Admin' }

interface ProduitsPageProps {
  searchParams: Promise<{ page?: string; q?: string; archive?: string }>
}

export default async function ProduitsPage({ searchParams }: ProduitsPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const isArchived = params.archive === '1'
  const { produits, total } = await getProductsAdmin(page, 20, params.q, isArchived)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Produits</h1>
          <p className="text-sm text-stone-500 mt-1">{total} produit{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/super-admin/produits/nouveau"
          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 text-sm rounded hover:bg-stone-700 transition-colors"
        >
          <Plus size={15} strokeWidth={1.5} />
          Nouveau produit
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-stone-100 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center">
        <form className="flex items-center gap-2 flex-1">
          <Search size={15} strokeWidth={1.5} className="text-stone-400" />
          <input
            type="text"
            name="q"
            defaultValue={params.q || ''}
            placeholder="Rechercher un produit..."
            className="flex-1 text-sm text-stone-700 placeholder-stone-400 focus:outline-none"
          />
          {isArchived && <input type="hidden" name="archive" value="1" />}
          <button type="submit" className="text-xs bg-stone-900 text-white px-4 py-1.5 rounded">Chercher</button>
        </form>
        <div className="flex gap-2">
          <a
            href="/super-admin/produits"
            className={`text-xs px-3 py-1.5 rounded-full border ${!isArchived ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600'}`}
          >
            Actifs
          </a>
          <a
            href="/super-admin/produits?archive=1"
            className={`text-xs px-3 py-1.5 rounded-full border ${isArchived ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600'}`}
          >
            Archivés
          </a>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-100 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium">Produit</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium hidden md:table-cell">Catégorie</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium">Prix</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium">Stock</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium hidden lg:table-cell">Statut</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-stone-500 px-5 py-3.5 font-medium hidden xl:table-cell">Créé le</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {produits.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-sm text-stone-400">
                  Aucun produit
                </td>
              </tr>
            ) : (
              produits.map((p: any) => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-stone-100 rounded flex-shrink-0 overflow-hidden">
                        {p.image_principale && (
                          <img src={p.image_principale} alt={p.nom} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-700">{p.nom}</p>
                        <p className="text-xs text-stone-400">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-stone-500">{p.categories?.nom || '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm text-stone-700">{formatPrix(p.prix)}</p>
                      {p.prix_promo && (
                        <p className="text-xs text-red-500">{formatPrix(p.prix_promo)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-500' : 'text-stone-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${p.actif ? 'bg-emerald-400' : 'bg-stone-300'}`} />
                      <span className="text-xs text-stone-500">{p.actif ? 'Actif' : 'Inactif'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden xl:table-cell">
                    <span className="text-xs text-stone-400">{formatDateShort(p.created_at)}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/super-admin/produits/${p.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-400 px-3 py-1.5 rounded transition-colors"
                    >
                      <Edit size={12} strokeWidth={1.5} />
                      Modifier
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
