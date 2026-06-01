import { getProducts } from '@/lib/actions/products'
import { getCategories } from '@/lib/actions/cms'
import ProductCard from '@/components/shop/ProductCard'
import BoutiqueFilters from '@/components/shop/BoutiqueFilters'
import { Metadata } from 'next'
import { Product } from '@/types/database'

export const metadata: Metadata = {
  title: 'Boutique',
  description: 'Découvrez tous nos accessoires et articles en cuir premium.',
}

interface BoutiquePageProps {
  searchParams: Promise<{
    categorie?: string
    tri?: string
    page?: string
    q?: string
  }>
}

export default async function BoutiquePage({ searchParams }: BoutiquePageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 12

  const [{ produits, total }, categories] = await Promise.all([
    getProducts({
      categorie: params.categorie,
      search: params.q,
      sort: params.tri,
      page,
      limit,
    }) as Promise<{ produits: (Product & { product_images?: { url: string; alt: string | null }[] })[]; total: number }>,
    getCategories(),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-[#F5F2EE]">
      {/* Page header */}
      <div className="pt-24 pb-6 px-6 lg:pt-28 lg:pb-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-px w-8 bg-[#D4B896]" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8480]">
            {total} article{total > 1 ? 's' : ''}
          </span>
        </div>
        <h1 className="font-display text-4xl lg:text-6xl">Boutique</h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20">
        <BoutiqueFilters categories={categories} />

        {/* Products */}
        <div>
          {produits.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-[#8A8480]">Aucun produit trouvé</p>
                <p className="text-sm text-[#8A8480] mt-2 tracking-wide">
                  Modifiez vos critères de recherche
                </p>
              </div>
          ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                  {produits.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-16">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <a
                        key={p}
                        href={`?page=${p}${params.categorie ? `&categorie=${params.categorie}` : ''}${params.tri ? `&tri=${params.tri}` : ''}`}
                        className={`w-9 h-9 flex items-center justify-center text-sm tracking-wide border transition-colors ${
                          p === page
                            ? 'bg-[#0C0C0C] text-[#F5F2EE] border-[#0C0C0C]'
                            : 'border-[#E8E4DF] hover:border-[#0C0C0C]'
                        }`}
                      >
                        {p}
                      </a>
                    ))}
                  </div>
              )}
              </>
          )}
        </div>
      </div>
    </div>
  )
}