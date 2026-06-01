import { getHomepageSections } from '@/lib/actions/cms'
import CMSEditor from '@/components/admin/CMSEditor'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'CMS — DERBII Admin' }

export default async function CMSPage() {
  const sections = await getHomepageSections({ includeInactive: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">CMS — Gestion du contenu</h1>
        <p className="text-sm text-stone-500 mt-1">Modifiez le contenu de votre site sans toucher au code</p>
      </div>
      <CMSEditor initialSections={sections} />
    </div>
  )
}