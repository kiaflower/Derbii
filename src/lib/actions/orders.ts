'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { generateWhatsAppMessage, generateWhatsAppConfirmation } from '@/lib/utils'
import { getSettings } from '@/lib/actions/cms'
import { CartItem, OrderStatut } from '@/types/database'
import { revalidatePath } from 'next/cache'

export interface CreerCommandeInput {
  nom_client: string
  telephone_client: string
  adresse_client?: string
  items: CartItem[]
}

export async function creerCommande(input: CreerCommandeInput) {
  const supabase = await createAdminClient()

  const total = input.items.reduce((sum, item) => sum + item.prix * item.quantite, 0)

  // Créer ou trouver le client
  let customer_id: string | null = null
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('telephone', input.telephone_client)
    .single()

  if (existingCustomer) {
    customer_id = existingCustomer.id
  } else {
    const { data: newCustomer } = await supabase
      .from('customers')
      .insert({
        nom: input.nom_client,
        telephone: input.telephone_client,
        adresse: input.adresse_client || null,
      })
      .select('id')
      .single()
    if (newCustomer) customer_id = newCustomer.id
  }

  // Créer la commande (numero_commande généré automatiquement par la DB)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id,
      nom_client: input.nom_client,
      telephone_client: input.telephone_client,
      adresse_client: input.adresse_client || null,
      total,
      statut: 'Nouvelle commande',
    })
    .select('*')
    .single()

  if (orderError || !order) {
    throw new Error('Erreur lors de la création de la commande')
  }

  // Créer les items
  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    nom_produit: item.nom,
    quantite: item.quantite,
    prix_unitaire: item.prix,
    variante: item.variante || null,
  }))

  await supabase.from('order_items').insert(orderItems)

  const settings = await getSettings()
  const whatsappNumero = (settings.whatsapp_numero || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '')

  // Générer message WhatsApp
  const messageWA = generateWhatsAppMessage({
    numero_commande: order.numero_commande,
    nom_client: input.nom_client,
    telephone_client: input.telephone_client,
    adresse_client: input.adresse_client || null,
    items: input.items.map((i) => ({ nom: i.nom, quantite: i.quantite, prix: i.prix })),
    total,
  })

  // Sauvegarder le message
  await supabase.from('whatsapp_messages').insert({
    order_id: order.id,
    type: 'commande',
    message: messageWA,
    envoye: false,
  })

  // Mettre à jour la commande avec le message
  await supabase
    .from('orders')
    .update({ message_whatsapp: messageWA })
    .eq('id', order.id)

  revalidatePath('/super-admin/commandes')

  return {
    order,
    messageWA,
    whatsappUrl: whatsappNumero ? `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(messageWA)}` : '',
  }
}

export async function mettreAJourStatutCommande(
  orderId: string,
  statut: OrderStatut
) {
  const supabase = await createAdminClient()

  const updateData: Record<string, unknown> = { statut }
  
  if (statut === 'Livrée') {
    updateData.date_livraison = new Date().toISOString()
  }

  const { data: order, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select('*, order_items(*)')
    .single()

  if (error || !order) {
    throw new Error('Erreur lors de la mise à jour du statut')
  }

  // Si acceptée, générer message de confirmation
  if (statut === 'Acceptée') {
    const messageConfirmation = generateWhatsAppConfirmation({
      numero_commande: order.numero_commande,
      telephone_client: order.telephone_client,
    })

    await supabase.from('whatsapp_messages').insert({
      order_id: orderId,
      type: 'confirmation',
      message: messageConfirmation,
      envoye: false,
    })

    revalidatePath('/super-admin/commandes')

    return {
      order,
      messageWA: messageConfirmation,
      whatsappUrl: `https://wa.me/${order.telephone_client.replace(/\D/g, '')}?text=${encodeURIComponent(messageConfirmation)}`,
    }
  }

  revalidatePath('/super-admin/commandes')
  revalidatePath('/super-admin/dashboard')

  return { order, messageWA: null, whatsappUrl: null }
}

export async function rechercherCommande(query: string) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (id, nom, image_principale)
      ),
      customers (*)
    `)
    .ilike('numero_commande', `%${query}%`)
    .limit(10)

  if (error) throw new Error('Erreur de recherche')
  return data || []
}

export async function getCommandesAdmin(
  page = 1,
  limit = 20,
  statut?: OrderStatut,
  search?: string
) {
  const supabase = await createAdminClient()

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (id, nom, image_principale)
      ),
      customers (*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (statut) query = query.eq('statut', statut)
  if (search) query = query.ilike('numero_commande', `%${search}%`)

  const { data, count, error } = await query

  if (error) throw new Error('Erreur lors du chargement des commandes')

  return { commandes: data || [], total: count || 0 }
}

export async function getStatsDashboard() {
  const supabase = await createAdminClient()
  const settings = await getSettings()
  const seuilStockFaible = Number(settings.alerte_stock_min || 5)

  const [
    { count: totalCommandes },
    { count: totalProduits },
    { count: totalClients },
    { data: commandesLivrees },
    { data: commandesRecentes },
    { data: produitsPopulaires },
    { data: stockFaible },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('actif', true).eq('archive', false),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total').eq('statut', 'Livrée'),
    supabase
      .from('orders')
      .select('*, order_items(*, products(nom, image_principale))')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('products')
      .select('id, nom, image_principale, nombre_ventes, stock, prix')
      .eq('actif', true)
      .order('nombre_ventes', { ascending: false })
      .limit(5),
    supabase
      .from('products')
      .select('id, nom, stock, image_principale')
      .eq('actif', true)
      .eq('archive', false)
      .lte('stock', Number.isFinite(seuilStockFaible) ? seuilStockFaible : 5)
      .order('stock', { ascending: true })
      .limit(10),
  ])

  const chiffreAffaires = commandesLivrees?.reduce((sum, o) => sum + Number(o.total), 0) || 0

  return {
    chiffreAffaires,
    totalCommandes: totalCommandes || 0,
    totalProduits: totalProduits || 0,
    totalClients: totalClients || 0,
    commandesRecentes: commandesRecentes || [],
    produitsPopulaires: produitsPopulaires || [],
    stockFaible: stockFaible || [],
  }
}