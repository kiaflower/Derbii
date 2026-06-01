import { getCollections } from '@/lib/actions/cms'
import { getProducts } from '@/lib/actions/products'
import ProductCard from '@/components/shop/ProductCard'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'

interface CollectionPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createAdminClient()
  const { data } = await supabase.from('collections').select('nom, description').eq('slug', slug).single() as { data: any }
  if (!data) return { title: 'Collection introuvable' }
  return { title: data.nom, description: data.description || undefined }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  const supabase = await createAdminClient()

  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single() as { data: any }

  if (!collection) notFound()

  const { produits } = await getProducts({ collection: slug, limit: 50 }) as { produits: any[] }

  return (
    <div className="min-h-screen bg-[#F5F2EE]">
      {/* Banner */}
      <div className="relative aspect-[16/7] bg-[#1a1410] overflow-hidden">
        {collection.banniere_url ? (
          <img
            src={collection.banniere_url}
            alt={collection.nom}
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: 'linear-gradient(135deg, #1a1410 0%, #2a1f16 50%, #0C0C0C 100%)' }}
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-[#F5F2EE] text-center px-6">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#D4B896] mb-4">Collection</p>
          <h1 className="font-display text-5xl lg:text-7xl mb-4">{collection.nom}</h1>
          {collection.description && (
            <p className="text-sm text-[#D4B896]/70 tracking-wide max-w-lg">{collection.description}</p>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-8 bg-[#D4B896]" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8480]">
            {produits.length} pièce{produits.length > 1 ? 's' : ''}
          </span>
        </div>

        {produits.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-[#8A8480]">
              Bientôt disponible
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {produits.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
