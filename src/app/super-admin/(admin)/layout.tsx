import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
const supabase = await createClient()

let user = null
try {
const { data } = await supabase.auth.getUser()
user = data.user
} catch {
// Supabase indisponible
}

if (!user) {
redirect('/super-admin/connexion')
}

return (
<div className="flex h-screen bg-stone-50 overflow-hidden” style={{ fontFamily: 'Jost, sans-serif' }}>
<AdminSidebar />
<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
<AdminHeader user={user!} />
<main className="flex-1 overflow-y-auto p-6 lg:p-8">
{children}
</main>
</div>
</div>
)
}