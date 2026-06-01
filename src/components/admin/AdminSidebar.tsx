'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { adminNavItems } from './adminNavItems'

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-100 overflow-x-auto"
      style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
    >
      <div className="flex min-w-max px-3">
        {adminNavItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2.5 text-[10px] whitespace-nowrap transition-colors',
                active ? 'text-stone-900' : 'text-stone-500'
              )}
            >
              <item.icon size={16} strokeWidth={active ? 2 : 1.5} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}