import { getMediaLibrary } from '@/lib/actions/cms'
import MediaManager from '@/components/admin/MediaManager'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Médiathèque — DERBII Admin' }

export default async function MediaPage() {
  const medias = await getMediaLibrary()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Médiathèque</h1>
        <p className="text-sm text-stone-500 mt-1">{medias.length} fichier{medias.length !== 1 ? 's' : ''}</p>
      </div>
      <MediaManager initialMedias={medias} />
    </div>
  )
}
