'use client'

import { useState } from 'react'
import { updateHomepageSection } from '@/lib/actions/cms'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { HomepageSection } from '@/types/database'
import { ChevronDown, ChevronUp, Save } from 'lucide-react'

interface CMSEditorProps {
  initialSections: HomepageSection[]
}

const sectionLabels: Record<string, string> = {
  'hero': 'Section Hero (Accueil)',
  'featured_title': 'Titre — Produits à la Une',
  'brand_story': 'Notre Histoire',
  'collections_title': 'Titre — Collections',
  'newsletter_title': 'Section Newsletter',
}

export default function CMSEditor({ initialSections }: CMSEditorProps) {
  const router = useRouter()
  const [openSection, setOpenSection] = useState<string | null>(initialSections[0]?.id || null)
  const [saving, setSaving] = useState<string | null>(null)

  // Initialise directement avec les valeurs existantes
  const [values, setValues] = useState<Record<string, Record<string, any>>>(() => {
    const init: Record<string, Record<string, any>> = {}
    initialSections.forEach(s => {
      init[s.id] = {
        titre: s.titre || '',
        sous_titre: s.sous_titre || '',
        contenu: s.contenu || '',
        image_url: s.image_url || '',
        lien: s.lien || '',
        actif: s.actif ?? true,
      }
    })
    return init
  })

  const updateVal = (id: string, field: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }))
  }

  const handleSave = async (section: HomepageSection) => {
    setSaving(section.id)
    try {
      await updateHomepageSection(section.id, values[section.id])
      toast.success('Section mise à jour')
      router.refresh()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-3">
      {initialSections.map((section) => (
        <div key={section.id} className="bg-white border border-stone-100 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-stone-50 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-stone-800">
                {sectionLabels[section.cle] || section.cle}
              </p>
              <p className="text-xs text-stone-400 mt-0.5 font-mono">{section.cle}</p>
            </div>
            {openSection === section.id ? (
              <ChevronUp size={16} strokeWidth={1.5} className="text-stone-400" />
            ) : (
              <ChevronDown size={16} strokeWidth={1.5} className="text-stone-400" />
            )}
          </button>

          {openSection === section.id && (
            <div className="border-t border-stone-100 p-5 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-500 block mb-1.5">Titre</label>
                  <input
                    type="text"
                    value={values[section.id]?.titre ?? ''}
                    onChange={e => updateVal(section.id, 'titre', e.target.value)}
                    className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1.5">Sous-titre</label>
                  <input
                    type="text"
                    value={values[section.id]?.sous_titre ?? ''}
                    onChange={e => updateVal(section.id, 'sous_titre', e.target.value)}
                    className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1.5">Contenu / Description</label>
                <textarea
                  value={values[section.id]?.contenu ?? ''}
                  onChange={e => updateVal(section.id, 'contenu', e.target.value)}
                  rows={3}
                  className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1.5">URL Image</label>
                <input
                  type="text"
                  value={values[section.id]?.image_url ?? ''}
                  onChange={e => updateVal(section.id, 'image_url', e.target.value)}
                  className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                  placeholder="https://..."
                />
                {values[section.id]?.image_url && (
                  <img
                    src={values[section.id].image_url}
                    alt="Aperçu"
                    className="mt-2 h-24 w-auto rounded object-cover border border-stone-100"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>
              <div>
                <label className="text-xs text-stone-500 block mb-1.5">Lien</label>
                <input
                  type="text"
                  value={values[section.id]?.lien ?? ''}
                  onChange={e => updateVal(section.id, 'lien', e.target.value)}
                  className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                  placeholder="/boutique"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values[section.id]?.actif ?? true}
                    onChange={e => updateVal(section.id, 'actif', e.target.checked)}
                    className="w-4 h-4 accent-stone-900"
                  />
                  <span className="text-sm text-stone-700">Section visible</span>
                </label>
                <button
                  onClick={() => handleSave(section)}
                  disabled={saving === section.id}
                  className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 text-sm rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
                >
                  <Save size={13} strokeWidth={1.5} />
                  {saving === section.id ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}