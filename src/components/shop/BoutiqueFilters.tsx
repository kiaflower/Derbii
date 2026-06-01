'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Category } from '@/types/database'

interface BoutiqueFiltersProps {
  categories: Category[]
}

const TRIS = [
  { value: '', label: 'Nouveautés' },
  { value: 'populaire', label: 'Plus populaires' },
  { value: 'prix_asc', label: 'Prix croissant' },
  { value: 'prix_desc', label: 'Prix décroissant' },
]

export default function BoutiqueFilters({ categories }: BoutiqueFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCat = searchParams.get('categorie') || ''
  const currentTri = searchParams.get('tri') || ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="mb-8 rounded-xl border border-[#E8E4DF] bg-[#F5F2EE]/90 p-3 lg:p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px] lg:items-end">
        {/* Search */}
        <label className="block">
          <span className="mb-1.5 block text-[9px] tracking-[0.22em] uppercase text-[#8A8480]">Recherche</span>
          <input
            type="text"
            placeholder="Rechercher..."
            defaultValue={searchParams.get('q') || ''}
            onChange={(e) => updateFilter('q', e.target.value)}
            className="h-10 w-full rounded border border-[#E8E4DF] bg-white/60 px-3 text-sm text-[#0C0C0C] placeholder-[#8A8480] transition-colors focus:border-[#0C0C0C] focus:outline-none"
          />
        </label>

        {/* Catégories */}
        <label className="block">
          <span className="mb-1.5 block text-[9px] tracking-[0.22em] uppercase text-[#8A8480]">Catégorie</span>
          <select
            value={currentCat}
            onChange={(e) => updateFilter('categorie', e.target.value)}
            className="h-10 w-full rounded border border-[#E8E4DF] bg-white/60 px-3 text-sm text-[#0C0C0C] transition-colors focus:border-[#0C0C0C] focus:outline-none"
          >
            <option value="">Tout voir</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.nom}</option>
            ))}
          </select>
        </label>

        {/* Tri */}
        <label className="block">
          <span className="mb-1.5 block text-[9px] tracking-[0.22em] uppercase text-[#8A8480]">Trier par</span>
          <select
            value={currentTri}
            onChange={(e) => updateFilter('tri', e.target.value)}
            className="h-10 w-full rounded border border-[#E8E4DF] bg-white/60 px-3 text-sm text-[#0C0C0C] transition-colors focus:border-[#0C0C0C] focus:outline-none"
          >
            {TRIS.map((tri) => (
              <option key={tri.value} value={tri.value}>{tri.label}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}