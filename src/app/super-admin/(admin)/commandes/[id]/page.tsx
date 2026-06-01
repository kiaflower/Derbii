import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrix, formatDate } from '@/lib/utils'
import { Metadata } from 'next'
import OrderActions from '@/components/admin/OrderActions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface CommandeDetailPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Détail commande — DERBII Admin' }

const statutColors: Record<string, string> = {
  'Nouvelle commande': 'bg-blue-100 text-blue-700',
  'Acceptée': 'bg-amber-100 text-amber-700',
  'Livrée': 'bg-emerald-100 text-emerald-700',
  'Annulée': 'bg-red-100 text-red-700',
}

export default async function CommandeDetailPage({ params }: CommandeDetailPageProps) {
  const { id } = await params
  const supabase = await createAdminClient()

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (id, nom, image_principale, slug)
      ),
      customers (*)
    `)
    .eq('id', id)
    .single()

  if (!order) notFound()

  const { data: messages } = await supabase
    .from('whatsapp_messages')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/super-admin/commandes" className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors">
          <ArrowLeft size={13} strokeWidth={1.5} />
          Retour
        </Link>
        <div className="h-4 w-px bg-stone-200" />
        <h1 className="text-xl font-semibold text-stone-900">{order.numero_commande}</h1>
        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${statutColors[order.statut] || 'bg-stone-100'}`}>
          {order.statut}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Products */}
          <div className="bg-white border border-stone-100 rounded-lg">
            <div className="px-5 py-4 border-b border-stone-100">
              <h2 className="font-medium text-stone-900">Articles commandés</h2>
            </div>
            <div className="divide-y divide-stone-50">
              {(order.order_items as any[]).map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-12 h-12 bg-stone-100 rounded flex-shrink-0 overflow-hidden">
                    {item.products?.image_principale && (
                      <img src={item.products.image_principale} alt={item.nom_produit} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">{item.nom_produit}</p>
                    {item.variante && <p className="text-xs text-stone-400">{item.variante}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone-600">× {item.quantite}</p>
                    <p className="text-xs text-stone-400">{formatPrix(item.prix_unitaire)}</p>
                  </div>
                  <p className="text-sm font-medium text-stone-700 w-28 text-right">
                    {formatPrix(item.prix_unitaire * item.quantite)}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-stone-100 flex justify-between">
              <span className="text-sm text-stone-500">Total</span>
              <span className="text-base font-semibold text-stone-900">{formatPrix(order.total)}</span>
            </div>
          </div>

          {/* WhatsApp messages */}
          {messages && messages.length > 0 && (
            <div className="bg-white border border-stone-100 rounded-lg">
              <div className="px-5 py-4 border-b border-stone-100">
                <h2 className="font-medium text-stone-900">Messages WhatsApp générés</h2>
              </div>
              <div className="p-5 space-y-4">
                {messages.map((msg: any) => (
                  <div key={msg.id} className="bg-stone-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-stone-500">
                        {msg.type === 'commande' ? 'Message client' : msg.type === 'confirmation' ? 'Confirmation' : 'Livraison'}
                      </span>
                      <span className="text-[10px] text-stone-400">{formatDate(msg.created_at)}</span>
                    </div>
                    <pre className="text-xs text-stone-600 whitespace-pre-wrap leading-relaxed font-mono">
                      {msg.message}
                    </pre>
                    <a
                      href={`https://wa.me/${order.telephone_client.replace(/\D/g, '')}?text=${encodeURIComponent(msg.message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-emerald-600 hover:text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded transition-colors"
                    >
                      Envoyer sur WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Client */}
          <div className="bg-white border border-stone-100 rounded-lg p-5">
            <h2 className="font-medium text-stone-900 mb-4">Client</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Nom</p>
                <p className="text-sm text-stone-700">{order.nom_client}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Téléphone</p>
                <a
                  href={`https://wa.me/${order.telephone_client.replace(/\D/g, '')}`}
                  target="_blank"
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  {order.telephone_client}
                </a>
              </div>
              {order.adresse_client && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Adresse</p>
                  <p className="text-sm text-stone-700">{order.adresse_client}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order info */}
          <div className="bg-white border border-stone-100 rounded-lg p-5">
            <h2 className="font-medium text-stone-900 mb-4">Informations</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Date de commande</p>
                <p className="text-sm text-stone-700">{formatDate(order.created_at)}</p>
              </div>
              {order.date_livraison && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Date de livraison</p>
                  <p className="text-sm text-stone-700">{formatDate(order.date_livraison)}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Statut actuel</p>
                <span className={`inline-flex items-center text-[10px] px-2 py-1 rounded-full font-medium ${statutColors[order.statut]}`}>
                  {order.statut}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <OrderActions order={order} />
        </div>
      </div>
    </div>
  )
}
