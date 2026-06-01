import { getCategories, getCollectionsAdmin } from '@/lib/actions/cms'
import ProductForm from '@/components/admin/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Nouveau produit — DERBII Admin' }

export default async function NouveauProduitPage() {
  const [categories, collections] = await Promise.all([
    getCategories(),
    getCollectionsAdmin(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/super-admin/produits" className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors">
          <ArrowLeft size={13} strokeWidth={1.5} />
          Retour
        </Link>
        <div className="h-4 w-px bg-stone-200" />
        <h1 className="text-xl font-semibold text-stone-900">Nouveau produit</h1>
      </div>
      <ProductForm categories={categories} collections={collections as any} mode="create" />
    </div>
  )
}
