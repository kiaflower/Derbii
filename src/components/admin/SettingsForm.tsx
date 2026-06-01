'use client'

import { useState } from 'react'
import { updateSettings } from '@/lib/actions/cms'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

interface SettingsFormProps {
  initialSettings: Record<string, string>
}

const FIELDS = [
  { section: 'Contact & WhatsApp', fields: [
    { key: 'whatsapp_numero', label: 'Numéro WhatsApp', placeholder: '221700000000', help: 'Numéro international sans +' },
    { key: 'email_contact', label: 'Email de contact', placeholder: 'contact@derbii.sn' },
    { key: 'adresse', label: 'Adresse boutique', placeholder: 'Dakar, Sénégal' },
  ]},
  { section: 'Marque', fields: [
    { key: 'nom_marque', label: 'Nom de la marque', placeholder: 'DERBII' },
    { key: 'slogan', label: 'Slogan', placeholder: "L'art du cuir sénégalais" },
  ]},
  { section: 'Réseaux sociaux', fields: [
    { key: 'instagram', label: 'Instagram', placeholder: '@derbii' },
    { key: 'tiktok', label: 'TikTok', placeholder: '@derbii' },
  ]},
  { section: 'Stock', fields: [
    { key: 'alerte_stock_min', label: 'Seuil d\'alerte stock faible', placeholder: '5', help: 'Alerte si stock ≤ cette valeur' },
  ]},
]

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [values, setValues] = useState(initialSettings)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateSettings(values)
      toast.success('Paramètres sauvegardés')
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {FIELDS.map(group => (
        <div key={group.section} className="bg-white border border-stone-100 rounded-lg p-5 space-y-4">
          <h2 className="font-medium text-stone-900">{group.section}</h2>
          {group.fields.map(field => (
            <div key={field.key}>
              <label className="text-xs text-stone-500 block mb-1.5">
                {field.label}
                {field.help && <span className="ml-2 text-stone-400">({field.help})</span>}
              </label>
              <input
                type="text"
                value={values[field.key] || ''}
                onChange={e => setValues({ ...values, [field.key]: e.target.value })}
                className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 transition-colors"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 text-sm rounded hover:bg-stone-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Save size={14} strokeWidth={1.5} />
        {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
      </button>
    </form>
  )
}