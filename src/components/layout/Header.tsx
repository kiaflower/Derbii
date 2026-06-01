'use client'

import Link from 'next/link'
import { ShoppingBag, Search } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const navigation = [
  { href: '/boutique', label: 'Boutique' },
  { href: '/collections', label: 'Collections' },
  { href: '/a-propos', label: 'À Propos' },
  { href: '/contact', label: 'Contact' },
]

interface HeaderProps {
  settings: Record<string, string>
}

export default function Header({ settings }: HeaderProps) {
  const { totalItems } = useCartStore()
  const count = totalItems()
  const brandName = settings.nom_marque || 'DERBII'

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 40,
      backgroundColor: '#F5F2EE',
      borderBottom: '1px solid #E8E4DF',
    }}>

      {/* Ligne 1 : Logo + actions */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>

          <Link href="/" style={{ color: '#0C0C0C', textDecoration: 'none', letterSpacing: '0.2em', fontWeight: 300 }}
            className="font-display text-2xl lg:text-3xl">
            {brandName}
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex" style={{ alignItems: 'center', gap: 40 }}>
            {navigation.map(item => (
              <Link key={item.href} href={item.href}
                style={{ color: '#0C0C0C', textDecoration: 'none', fontSize: 11, letterSpacing: '0.15em', opacity: 0.7 }}
                className="uppercase link-underline hover:opacity-100">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Icônes — tous des <Link> natifs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/boutique?search=1" aria-label="Rechercher"
              style={{ color: '#0C0C0C', opacity: 0.7, display: 'flex' }}>
              <Search size={18} strokeWidth={1.5} />
            </Link>
            {/* Panier — Link direct vers /panier, pas de toggleCart */}
            <Link href="/panier" aria-label="Panier"
              style={{ position: 'relative', color: '#0C0C0C', opacity: 0.7, display: 'flex' }}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: '#D4B896', color: '#0C0C0C',
                  fontSize: 9, width: 16, height: 16,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {count}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>

      {/* Ligne 2 : Nav mobile scrollable */}
      <div className="lg:hidden" style={{
        borderTop: '1px solid #E8E4DF',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        <div style={{ display: 'flex', padding: '0 24px', minWidth: 'max-content' }}>
          {navigation.map(item => (
            <Link key={item.href} href={item.href} style={{
              color: '#0C0C0C', textDecoration: 'none',
              fontSize: 10, letterSpacing: '0.15em', opacity: 0.7,
              padding: '12px 16px', whiteSpace: 'nowrap',
              display: 'block', textTransform: 'uppercase',
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

    </header>
  )
}