'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  const supabase = await createAdminClient()
  const { data } = await supabase.from('settings').select('*')
  const settings = Object.fromEntries((data || []).map(s => [s.cle, s.valeur]))

  if (!settings.tiktok) {
    settings.tiktok = settings.facebook || '@derbii'
  }

  return settings
}

function revalidateSettingsPages() {
  revalidatePath('/super-admin/parametres')
  revalidatePath('/', 'layout')
  revalidatePath('/contact')
}

export async function updateSetting(cle: string, valeur: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('settings')
    .upsert({ cle, valeur, updated_at: new Date().toISOString() }, { onConflict: 'cle' })
  if (error) throw new Error('Erreur lors de la mise à jour du paramètre')
  revalidateSettingsPages()
}

export async function updateSettings(settings: Record<string, string>) {
  const supabase = await createAdminClient()
  const updates = Object.entries(settings).map(([cle, valeur]) => ({
    cle,
    valeur,
    updated_at: new Date().toISOString(),
  }))
  const { error } = await supabase
    .from('settings')
    .upsert(updates, { onConflict: 'cle' })
  if (error) throw new Error('Erreur lors de la mise à jour des paramètres')
  revalidateSettingsPages()
}

export async function getHomepageSections(options: { includeInactive?: boolean } = {}) {
  const supabase = await createAdminClient()
  let query = supabase
    .from('homepage_sections')
    .select('*')
    .order('ordre', { ascending: true })

  if (!options.includeInactive) {
    query = query.eq('actif', true)
  }

  const { data } = await query
  return data || []
}

export async function updateHomepageSection(id: string, data: {
  titre?: string
  sous_titre?: string
  contenu?: string
  image_url?: string
  lien?: string
  actif?: boolean
}) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('homepage_sections')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error('Erreur lors de la mise à jour de la section')
  revalidatePath('/')
  revalidatePath('/super-admin/cms')
}

export async function getPageCMS(slug: string) {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('pages_cms')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function updatePageCMS(slug: string, data: {
  titre?: string
  contenu?: string
  meta_description?: string
}) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('pages_cms')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('slug', slug)
  if (error) throw new Error('Erreur lors de la mise à jour de la page')
  revalidatePath(`/${slug}`)
  revalidatePath('/super-admin/cms')
}

export async function getCollections() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('collections')
    .select(`
      *,
      collection_products (
        products (
          id, nom, image_principale, prix, slug
        )
      )
    `)
    .eq('active', true)
    .order('ordre', { ascending: true })
  return data || []
}

export async function getCollectionsAdmin() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('collections')
    .select(`
      *,
      collection_products (count)
    `)
    .order('ordre', { ascending: true })
  return data || []
}

export async function creerCollection(data: {
  nom: string
  slug: string
  description?: string
  banniere_url?: string
}) {
  const supabase = await createAdminClient()
  const { data: col, error } = await supabase
    .from('collections')
    .insert(data)
    .select()
    .single()
  if (error) throw new Error('Erreur lors de la création de la collection')
  revalidatePath('/super-admin/collections')
  return col
}

export async function modifierCollection(id: string, data: {
  nom?: string
  description?: string
  banniere_url?: string
  active?: boolean
}) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('collections')
    .update(data)
    .eq('id', id)
  if (error) throw new Error('Erreur lors de la modification')
  revalidatePath('/super-admin/collections')
  revalidatePath('/collections')
  revalidatePath('/')
}

export async function getCategories() {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('ordre', { ascending: true })
  return data || []
}

export async function getClientsAdmin(page = 1, limit = 20, search?: string) {
  const supabase = await createAdminClient()

  let query = supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) {
    query = query.or(`nom.ilike.%${search}%,telephone.ilike.%${search}%`)
  }

  const { data, count, error } = await query
  if (error) throw new Error('Erreur lors du chargement des clients')

  return { clients: data || [], total: count || 0 }
}

export async function getClientById(id: string) {
  const supabase = await createAdminClient()

  const [{ data: client }, { data: commandes }] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).single(),
    supabase
      .from('orders')
      .select('*, order_items(*, products(nom))')
      .eq('customer_id', id)
      .order('created_at', { ascending: false }),
  ])

  return { client, commandes: commandes || [] }
}

export async function getMediaLibrary(dossier?: string) {
  const supabase = await createAdminClient()
  let query = supabase
    .from('media_library')
    .select('*')
    .order('created_at', { ascending: false })
  if (dossier) query = query.eq('dossier', dossier)
  const { data } = await query
  return data || []
}

export async function addMediaItem(item: {
  nom: string
  url: string
  type: string
  taille?: number
  dossier?: string
}) {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('media_library')
    .insert(item)
    .select()
    .single()
  if (error) throw new Error("Erreur lors de l'ajout du média")
  revalidatePath('/super-admin/media')
  return data
}

export async function deleteMediaItem(id: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('media_library')
    .delete()
    .eq('id', id)
  if (error) throw new Error('Erreur lors de la suppression du média')
  revalidatePath('/super-admin/media')
}