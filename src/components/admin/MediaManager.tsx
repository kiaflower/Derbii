'use client'

import { useState } from 'react'
import { addMediaItem, deleteMediaItem } from '@/lib/actions/cms'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Copy, Link as LinkIcon } from 'lucide-react'
import { MediaItem } from '@/types/database'

interface MediaManagerProps {
  initialMedias: MediaItem[]
}

export default function MediaManager({ initialMedias }: MediaManagerProps) {
  const router = useRouter()
  const [medias, setMedias] = useState(initialMedias)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlForm, setShowUrlForm] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)

        await addMediaItem({
          nom: file.name,
          url: json.url,
          type: file.type,
          taille: file.size,
          dossier: 'general',
        })
        toast.success(`${file.name} uploadé`)
      } catch (err) {
        toast.error(`Erreur pour ${file.name}`)
        console.error(err)
      }
    }

    setUploading(false)
    router.refresh()
  }

  const handleAddUrl = async () => {
    if (!urlInput) return
    try {
      const nom = urlInput.split('/').pop() || 'image'
      await addMediaItem({ nom, url: urlInput, type: 'image/external', dossier: 'general' })
      toast.success('Image ajoutée')
      setUrlInput('')
      setShowUrlForm(false)
      router.refresh()
    } catch {
      toast.error('Erreur')
    }
  }

  const handleDelete = async (id: string, nom: string) => {
    if (!confirm(`Supprimer "${nom}" ?`)) return
    try {
      await deleteMediaItem(id)
      setMedias(prev => prev.filter(m => m.id !== id))
      toast.success('Fichier supprimé')
    } catch {
      toast.error('Erreur')
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copiée')
  }

  return (
    <div className="space-y-5">
      {/* Upload controls */}
      <div className="bg-white border border-stone-100 rounded-lg p-5 space-y-4">
        <h2 className="font-medium text-stone-900">Ajouter des médias</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className={`flex items-center gap-2 cursor-pointer bg-stone-900 text-white px-4 py-2.5 text-sm rounded hover:bg-stone-700 transition-colors ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
            <Plus size={15} strokeWidth={1.5} />
            {uploading ? 'Upload en cours...' : 'Uploader des images'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowUrlForm(!showUrlForm)}
            className="flex items-center gap-2 border border-stone-200 text-stone-700 px-4 py-2.5 text-sm rounded hover:bg-stone-50 transition-colors"
          >
            <LinkIcon size={15} strokeWidth={1.5} />
            Ajouter par URL
          </button>
        </div>

        {showUrlForm && (
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://exemple.com/image.jpg"
              className="flex-1 border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
            />
            <button
              onClick={handleAddUrl}
              className="bg-stone-900 text-white px-4 py-2.5 text-sm rounded hover:bg-stone-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      {medias.length === 0 ? (
        <div className="bg-white border border-stone-100 rounded-lg py-16 text-center">
          <p className="text-sm text-stone-400">Aucun média. Uploadez vos premières images.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {medias.map((media) => (
            <div key={media.id} className="group relative bg-white border border-stone-100 rounded-lg overflow-hidden">
              <div className="aspect-square bg-stone-50">
                <img
                  src={media.url}
                  alt={media.nom}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=='
                  }}
                />
              </div>
              <div className="p-2">
                <p className="text-[10px] text-stone-500 truncate">{media.nom}</p>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(media.url)}
                  className="bg-white text-stone-700 p-2 rounded hover:bg-stone-100 transition-colors"
                  title="Copier l'URL"
                >
                  <Copy size={13} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => handleDelete(media.id, media.nom)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}