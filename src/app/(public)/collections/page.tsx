import { getCollections } from '@/lib/actions/cms'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Explorez toutes nos collections de maroquinerie en cuir premium.',
}

export default async function CollectionsPage() {
  const collections = await getCollections() as any[]

  return (
    <div className="min-h-screen bg-[#F5F2EE] pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#D4B896]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8480]">Univers DERBII</span>
          </div>
          <h1 className="font-display text-5xl lg:text-6xl">Collections</h1>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-[#8A8480]">Aucune collection disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {collections.map((col, i) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className={`group relative overflow-hidden bg-[#EDE3D8] ${i === 0 ? 'lg:col-span-2' : ''}`}
              >
                <div className={`img-zoom ${i === 0 ? 'aspect-[16/7]' : 'aspect-[4/3]'} relative`}>
                  {col.banniere_url ? (
                    <img
                      src={col.banniere_url}
                      alt={col.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(135deg, #EDE3D8 0%, #D4B896 50%, #B89470 100%)`,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-[#0C0C0C]/25 group-hover:bg-[#0C0C0C]/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 text-[#F5F2EE]">
                    <p className="text-[10px] tracking-[0.3em] uppercase opacity-60 mb-2">Collection</p>
                    <h2 className={`font-display ${i === 0 ? 'text-4xl lg:text-6xl' : 'text-3xl lg:text-4xl'} mb-2`}>
                      {col.nom}
                    </h2>
                    {col.description && (
                      <p className="text-sm opacity-70 tracking-wide max-w-lg">{col.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-5">
                      <span className="text-[10px] tracking-[0.25em] uppercase">Découvrir</span>
                      <div className="h-px w-8 bg-[#F5F2EE] transition-all duration-300 group-hover:w-16" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
