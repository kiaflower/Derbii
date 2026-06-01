import { getCollectionsAdmin } from '@/lib/actions/cms'
import CollectionManager from '@/components/admin/CollectionManager'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Collections — DERBII Admin' }

export default async function AdminCollectionsPage() {
  const collections = await getCollectionsAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Collections</h1>
        <p className="text-sm text-stone-500 mt-1">{collections.length} collection{collections.length !== 1 ? 's' : ''}</p>
      </div>
      <CollectionManager initialCollections={collections as any} />
    </div>
  )
}
