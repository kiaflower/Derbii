import { getPageCMS } from '@/lib/actions/cms'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'À Propos' }

export default async function AProposPage() {
  const page = await getPageCMS('a-propos') as { titre: string; contenu: string | null } | null

  return (
    <div className="min-h-screen bg-[#F5F2EE] pt-28 pb-20">
      <div className="max-w-[900px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-8 bg-[#D4B896]" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8480]">Notre Maison</span>
        </div>
        <h1 className="font-display text-5xl lg:text-6xl mb-12">
          {page?.titre || 'À Propos de DERBII'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="text-center">
            <div className="font-display text-5xl text-[#D4B896] mb-2">100%</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480]">Cuir Authentique</div>
          </div>
          <div className="text-center">
            <div className="font-display text-5xl text-[#D4B896] mb-2">Made</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480]">In Sénégal</div>
          </div>
          <div className="text-center">
            <div className="font-display text-5xl text-[#D4B896] mb-2">Artisan</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480]">Local</div>
          </div>
        </div>

        {page?.contenu ? (
          <div
            className="prose prose-stone max-w-none text-[#8A8480] leading-relaxed tracking-wide [&>h2]:font-display [&>h2]:text-[#0C0C0C] [&>h2]:text-3xl [&>h2]:font-normal [&>h2]:mt-10 [&>h2]:mb-4 [&>p]:text-sm [&>p]:mb-6"
            dangerouslySetInnerHTML={{ __html: page.contenu }}
          />
        ) : (
          <div className="space-y-6 text-sm text-[#8A8480] leading-relaxed tracking-wide">
            <p>DERBII est une maison de cuir sénégalaise fondée avec la passion de valoriser l&apos;artisanat local. Chaque pièce est conçue avec soin, alliant tradition et modernité.</p>
            <p>Notre vision est de créer des accessoires en cuir de qualité premium qui célèbrent l&apos;identité africaine tout en s&apos;inscrivant dans les codes du luxe contemporain.</p>
            <p>Tous nos produits sont fabriqués à Dakar par des artisans passionnés qui maîtrisent leur métier depuis des générations.</p>
          </div>
        )}
      </div>
    </div>
  )
}
