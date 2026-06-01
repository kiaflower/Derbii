import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrix(prix: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(prix) + ' FCFA'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function generateWhatsAppMessage(order: {
  numero_commande: string
  nom_client: string
  telephone_client: string
  adresse_client: string | null
  items: { nom: string; quantite: number; prix: number }[]
  total: number
}): string {
  const lignesProduits = order.items
    .map(item => `• ${item.nom} x${item.quantite}`)
    .join('\n')

  return `Bonjour DERBII,

Je souhaite confirmer ma commande.

Numéro de commande :
${order.numero_commande}

Produits :

${lignesProduits}

Montant total :
${formatPrix(order.total)}

Nom : ${order.nom_client}
Téléphone : ${order.telephone_client}
Adresse : ${order.adresse_client || 'À préciser'}

Merci.`
}

export function generateWhatsAppConfirmation(ordre: {
  numero_commande: string
  telephone_client: string
}): string {
  return `Bonjour,

Votre commande ${ordre.numero_commande} a bien été prise en compte.

Préférez-vous :

1. Récupérer votre article ou vos articles à la boutique

ou

2. Vous faire livrer ?

Merci.`
}

export function generateWhatsAppLink(numero: string, message: string): string {
  const cleanNumero = numero.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanNumero}?text=${encodedMessage}`
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

export type StatutCommande = 'Nouvelle commande' | 'Acceptée' | 'Livrée' | 'Annulée'

export const STATUTS_COMMANDE: Record<StatutCommande, { label: string; couleur: string }> = {
  'Nouvelle commande': { label: 'Nouvelle commande', couleur: 'blue' },
  'Acceptée': { label: 'Acceptée', couleur: 'amber' },
  'Livrée': { label: 'Livrée', couleur: 'green' },
  'Annulée': { label: 'Annulée', couleur: 'red' },
}