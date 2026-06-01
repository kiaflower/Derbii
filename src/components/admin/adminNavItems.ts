import {
  LayoutDashboard, Package, ShoppingBag, Users, Layers,
  Image, Settings, FileText
} from 'lucide-react'

export const adminNavItems = [
  { href: '/super-admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/super-admin/commandes', icon: ShoppingBag, label: 'Commandes' },
  { href: '/super-admin/produits', icon: Package, label: 'Produits' },
  { href: '/super-admin/collections', icon: Layers, label: 'Collections' },
  { href: '/super-admin/clients', icon: Users, label: 'Clients' },
  { href: '/super-admin/cms', icon: FileText, label: 'CMS' },
  { href: '/super-admin/media', icon: Image, label: 'Médias' },
  { href: '/super-admin/parametres', icon: Settings, label: 'Paramètres' },
]