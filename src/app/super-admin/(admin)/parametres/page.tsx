import { getSettings } from '@/lib/actions/cms'
import SettingsForm from '@/components/admin/SettingsForm'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Paramètres — DERBII Admin' }

export default async function ParametresPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Paramètres</h1>
        <p className="text-sm text-stone-500 mt-1">Gérez les informations et paramètres de votre boutique</p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  )
}
