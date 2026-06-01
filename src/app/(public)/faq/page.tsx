import { getPageCMS } from '@/lib/actions/cms'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'FAQ' }

export default async function FAQPage() {
  const page = await getPageCMS('faq') as any

  return (
    <div className="min-h-screen bg-[#F5F2EE] pt-28 pb-20">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-8 bg-[#D4B896]" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8480]">Aide</span>
        </div>
        <h1 className="font-display text-5xl lg:text-6xl mb-12">
          {page?.titre || 'Questions Fréquentes'}
        </h1>
        {page?.contenu ? (
          <div
            className="[&>h2]:font-display [&>h2]:text-3xl [&>h2]:font-normal [&>h2]:text-[#0C0C0C] [&>h2]:mt-10 [&>h2]:mb-4 [&>p]:text-sm [&>p]:text-[#8A8480] [&>p]:leading-relaxed [&>p]:tracking-wide [&>p]:mb-6"
            dangerouslySetInnerHTML={{ __html: page.contenu }}
          />
        ) : (
          <p className="text-sm text-[#8A8480]">Contenu à venir.</p>
        )}
      </div>
    </div>
  )
}
