import { createAdminClient } from '@/lib/supabase/server'
import { getCategories, getCollectionsAdmin } from '@/lib/actions/cms'
import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Modifier produit — DERBII Admin' }

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await createAdminClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

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
        <h1 className="text-xl font-semibold text-stone-900">Modifier : {product.nom}</h1>
      </div>
      <ProductForm product={product} categories={categories} collections={collections as any} mode="edit" />
    </div>
  )
}
