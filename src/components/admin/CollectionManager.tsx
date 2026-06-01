'use client'

import { useState } from 'react'
import { creerCollection, modifierCollection } from '@/lib/actions/cms'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Eye, EyeOff } from 'lucide-react'
import { Collection } from '@/types/database'
import { slugify } from '@/lib/utils'

interface CollectionManagerProps {
  initialCollections: Collection[]
}

export default function CollectionManager({ initialCollections }: CollectionManagerProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nom: '', description: '', banniere_url: '' })

  const handleCreate = async () => {
    if (!form.nom) { toast.error('Nom requis'); return }
    setLoading(true)
    try {
      await creerCollection({
        nom: form.nom,
        slug: slugify(form.nom),
        description: form.description || undefined,
        banniere_url: form.banniere_url || undefined,
      })
      toast.success('Collection créée')
      setForm({ nom: '', description: '', banniere_url: '' })
      setShowForm(false)
      router.refresh()
    } catch {
      toast.error('Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (col: Collection) => {
    try {
      await modifierCollection(col.id, { active: !col.active })
      toast.success(`Collection ${col.active ? 'désactivée' : 'activée'}`)
      router.refresh()
    } catch {
      toast.error('Erreur')
    }
  }

  return (
    <div className="space-y-5">
      {/* Create form */}
      {showForm ? (
        <div className="bg-white border border-stone-100 rounded-lg p-5 space-y-4">
          <h2 className="font-medium text-stone-900">Nouvelle collection</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-stone-500 block mb-1.5">Nom *</label>
              <input
                type="text"
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
                className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                placeholder="Ex: Collection Été 2026"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1.5">URL bannière</label>
              <input
                type="text"
                value={form.banniere_url}
                onChange={e => setForm({ ...form, banniere_url: e.target.value })}
                className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-stone-900 text-white px-5 py-2.5 text-sm rounded hover:bg-stone-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Création...' : 'Créer la collection'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-sm text-stone-600 border border-stone-200 px-5 py-2.5 rounded hover:bg-stone-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 text-sm rounded hover:bg-stone-700 transition-colors"
        >
          <Plus size={15} strokeWidth={1.5} />
          Nouvelle collection
        </button>
      )}

      {/* List */}
      <div className="bg-white border border-stone-100 rounded-lg overflow-hidden">
        {initialCollections.length === 0 ? (
          <div className="text-center py-12 text-sm text-stone-400">
            Aucune collection
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {initialCollections.map((col: any) => (
              <div key={col.id} className="flex items-center justify-between px-5 py-4 hover:bg-stone-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                    {col.banniere_url && (
                      <img src={col.banniere_url} alt={col.nom} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-700">{col.nom}</p>
                    {col.description && (
                      <p className="text-xs text-stone-400 mt-0.5 max-w-sm truncate">{col.description}</p>
                    )}
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5">{col.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full ${col.active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                    {col.active ? 'Visible' : 'Masquée'}
                  </div>
                  <button
                    onClick={() => handleToggleActive(col)}
                    className="text-stone-400 hover:text-stone-700 p-1.5 rounded hover:bg-stone-100 transition-colors"
                    title={col.active ? 'Masquer' : 'Afficher'}
                  >
                    {col.active ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
