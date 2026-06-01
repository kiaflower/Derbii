import { getProductBySlug, getProducts } from '@/lib/actions/products'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProductGallery from '@/components/shop/ProductGallery'
import ProductInfo from '@/components/shop/ProductInfo'
import ProductCard from '@/components/shop/ProductCard'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug) as any
  if (!product) return { title: 'Produit introuvable' }
  return {
    title: product.nom,
    description: product.description_courte || product.description || undefined,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug) as any
  if (!product) notFound()

  const { produits: similaires } = await getProducts({
    categorie: product.categories?.slug,
    limit: 4,
  }) as { produits: any[] }
  const similairesFiltres = similaires.filter(p => p.id !== product.id).slice(0, 4)

  const images = [
    ...(product.image_principale ? [{ id: 'main', url: product.image_principale, alt: product.nom }] : []),
    ...(product.product_images || []).map((img: any) => ({ id: img.id, url: img.url, alt: img.alt || product.nom })),
  ]

  return (
    <div className="min-h-screen bg-[#F5F2EE]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 lg:pt-32 pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mb-10">
          <a href="/boutique" className="hover:text-[#0C0C0C] transition-colors">Boutique</a>
          <span>/</span>
          {product.categories && (
            <>
              <a href={`/boutique?categorie=${product.categories.slug}`} className="hover:text-[#0C0C0C] transition-colors">
                {product.categories.nom}
              </a>
              <span>/</span>
            </>
          )}
          <span className="text-[#0C0C0C]">{product.nom}</span>
        </div>

        {/* Product layout — isolation sur chaque colonne pour éviter z-index leaks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Galerie — isolation empêche son absolute inset-0 de déborder sur ProductInfo */}
          <div className="relative z-0 overflow-hidden" style={{ isolation: 'isolate' }}>
            <ProductGallery images={images} nom={product.nom} />
          </div>

          {/* ProductInfo — z-index explicite pour être au-dessus sur mobile */}
          <div className="relative z-20">
            <ProductInfo product={product as any} />
          </div>
        </div>

        {/* Similaires */}
        {similairesFiltres.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#E8E4DF]">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-8 bg-[#D4B896]" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8480]">Vous pourriez aussi aimer</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {similairesFiltres.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}