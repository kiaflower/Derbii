'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { ProductInsert, ProductUpdate } from '@/types/database'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export async function getProducts(options?: {
  categorie?: string
  collection?: string
  featured?: boolean
  search?: string
  sort?: string
  page?: number
  limit?: number
}) {
  const supabase = await createAdminClient()
  const { categorie, collection, featured, search, sort = 'created_at', page = 1, limit = 12 } = options || {}

  let query = supabase
    .from('products')
    .select(`
      *,
      product_images (id, url, alt, ordre),
      categories (id, nom, slug),
      collections (id, nom, slug),
      variants (*)
    `, { count: 'exact' })
    .eq('actif', true)
    .eq('archive', false)
    .range((page - 1) * limit, page * limit - 1)

  if (categorie) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorie).single()
    if (cat) query = query.eq('categorie_id', cat.id)
  }

  if (collection) {
    const { data: col } = await supabase.from('collections').select('id').eq('slug', collection).single()
    if (col) {
      const { data: cp } = await supabase.from('collection_products').select('product_id').eq('collection_id', col.id)
      const ids = cp?.map(r => r.product_id) || []
      if (ids.length > 0) query = query.in('id', ids)
    }
  }

  if (featured) query = query.eq('featured', true)

  if (search) query = query.ilike('nom', `%${search}%`)

  if (sort === 'prix_asc') query = query.order('prix', { ascending: true })
  else if (sort === 'prix_desc') query = query.order('prix', { ascending: false })
  else if (sort === 'populaire') query = query.order('nombre_ventes', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data, count, error } = await query

  if (error) throw new Error('Erreur lors du chargement des produits')

  return { produits: data || [], total: count || 0 }
}

export async function getProductBySlug(slug: string) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (id, url, alt, ordre),
      categories (id, nom, slug),
      collections (id, nom, slug),
      variants (*)
    `)
    .eq('slug', slug)
    .eq('actif', true)
    .single()

  if (error || !data) return null

  return data
}

export async function getProductsAdmin(page = 1, limit = 20, search?: string, archive = false) {
  const supabase = await createAdminClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      product_images (id, url, alt, ordre),
      categories (id, nom, slug),
      collections (id, nom, slug)
    `, { count: 'exact' })
    .eq('archive', archive)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) query = query.ilike('nom', `%${search}%`)

  const { data, count, error } = await query

  if (error) throw new Error('Erreur lors du chargement des produits')

  return { produits: data || [], total: count || 0 }
}

// Colonnes valides de la table products
const PRODUCT_COLUMNS = [
  'nom', 'slug', 'description', 'description_courte', 'prix', 'prix_promo',
  'stock', 'image_principale', 'categorie_id', 'collection_id', 'featured',
  'actif', 'archive', 'matiere', 'dimensions', 'couleurs_disponibles',
]

function cleanProductData(data: Record<string, any>): Record<string, any> {
  const clean: Record<string, any> = {}
  for (const key of PRODUCT_COLUMNS) {
    if (key in data && data[key] !== undefined && data[key] !== null && data[key] !== '') {
      clean[key] = data[key]
    }
  }
  return clean
}

export async function creerProduit(data: Omit<ProductInsert, 'slug'> & { nom: string }) {
  const supabase = await createAdminClient()

  const slug = slugify(data.nom)
  let finalSlug = slug
  let counter = 1

  while (true) {
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', finalSlug)
      .single()
    if (!existing) break
    finalSlug = `${slug}-${counter}`
    counter++
  }

  const cleanData = cleanProductData({ ...data, slug: finalSlug })

  const { data: product, error } = await supabase
    .from('products')
    .insert(cleanData)
    .select()
    .single()

  if (error) throw new Error(error.message + ' | ' + error.details + ' | ' + error.hint)

  revalidatePath('/boutique')
  revalidatePath('/super-admin/produits')

  return product
}

export async function modifierProduit(id: string, data: ProductUpdate) {
  const supabase = await createAdminClient()

  const cleanData = cleanProductData(data as Record<string, any>)

  const { data: product, error } = await supabase
    .from('products')
    .update(cleanData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error('Erreur lors de la modification du produit')

  revalidatePath('/boutique')
  revalidatePath(`/produit/${product.slug}`)
  revalidatePath('/super-admin/produits')

  return product
}

export async function supprimerProduit(id: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('products')
    .update({ archive: true, actif: false })
    .eq('id', id)

  if (error) throw new Error('Erreur lors de la suppression du produit')

  revalidatePath('/boutique')
  revalidatePath('/super-admin/produits')
}

export async function ajouterImageProduit(productId: string, url: string, alt?: string) {
  const supabase = await createAdminClient()

  const { data: lastImage } = await supabase
    .from('product_images')
    .select('ordre')
    .eq('product_id', productId)
    .order('ordre', { ascending: false })
    .limit(1)
    .single()

  const ordre = (lastImage?.ordre || 0) + 1

  const { data, error } = await supabase
    .from('product_images')
    .insert({ product_id: productId, url, alt: alt || null, ordre })
    .select()
    .single()

  if (error) throw new Error('Erreur lors de l\'ajout de l\'image')

  return data
}

export async function supprimerImageProduit(imageId: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)

  if (error) throw new Error('Erreur lors de la suppression de l\'image')
}