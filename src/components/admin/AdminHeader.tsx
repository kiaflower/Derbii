'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, ExternalLink } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import { adminNavItems } from './adminNavItems'

interface AdminHeaderProps {
  user: User
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/super-admin/connexion')
    router.refresh()
  }

  return (
    <header className="hidden lg:flex h-16 bg-white border-b border-stone-100 items-center px-6 flex-shrink-0 gap-6">
      <Link href="/super-admin/dashboard" className="flex-shrink-0 text-stone-900">
        <span className="font-display text-xl tracking-[0.2em]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          DERBII
        </span>
      </Link>

      <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {adminNavItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs transition-all duration-150',
                active
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
              )}
            >
              <item.icon
                size={14}
                strokeWidth={active ? 2 : 1.5}
                className={active ? 'text-white' : 'text-stone-400'}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-shrink-0 items-center gap-4">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors"
        >
          <ExternalLink size={13} strokeWidth={1.5} />
          Voir le site
        </a>
        <div className="h-5 w-px bg-stone-200" />
        <span className="max-w-44 truncate text-xs text-stone-500 tracking-wide">{user.email}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors"
        >
          <LogOut size={13} strokeWidth={1.5} />
          Déconnexion
        </button>
      </div>
    </header>
  )
}