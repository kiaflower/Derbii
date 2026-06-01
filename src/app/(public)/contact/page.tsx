import { getPageCMS, getSettings } from '@/lib/actions/cms'
import { Metadata } from 'next'
import { MessageCircle, MapPin, Mail, AtSign } from 'lucide-react'

export const metadata: Metadata = { title: 'Contact' }

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    getPageCMS('contact'),
    getSettings(),
  ])

  const whatsapp = (settings.whatsapp_numero || '221700000000').replace(/\D/g, '')
  const instagram = settings.instagram
  const instagramHref = instagram?.startsWith('http://') || instagram?.startsWith('https://')
    ? instagram
    : instagram ? `https://instagram.com/${instagram.replace('@', '')}` : null
  const tiktok = settings.tiktok
  const tiktokHref = tiktok?.startsWith('http://') || tiktok?.startsWith('https://')
    ? tiktok
    : tiktok ? `https://tiktok.com/@${tiktok.replace('@', '')}` : null

  return (
    <div className="min-h-screen bg-[#F5F2EE] pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-8 bg-[#D4B896]" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8480]">Nous Contacter</span>
        </div>
        <h1 className="font-display text-5xl lg:text-6xl mb-14">{page?.titre || 'Contact'}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="space-y-8">
            <p className="text-sm text-[#8A8480] tracking-wide leading-relaxed max-w-md">
              Nous sommes disponibles pour répondre à toutes vos questions. Contactez-nous de préférence via WhatsApp pour une réponse rapide.
            </p>

            <div className="space-y-5">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 bg-[#EDE3D8] flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={18} strokeWidth={1.5} className="text-[#D4B896]" />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mb-0.5">WhatsApp</p>
                  <p className="text-sm group-hover:text-[#D4B896] transition-colors">+{whatsapp}</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#EDE3D8] flex items-center justify-center flex-shrink-0">
                  <Mail size={18} strokeWidth={1.5} className="text-[#D4B896]" />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mb-0.5">Email</p>
                  <a href={`mailto:${settings.email_contact || 'contact@derbii.sn'}`} className="text-sm hover:text-[#D4B896] transition-colors">
                    {settings.email_contact || 'contact@derbii.sn'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#EDE3D8] flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} strokeWidth={1.5} className="text-[#D4B896]" />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mb-0.5">Adresse</p>
                  <p className="text-sm">{settings.adresse || 'Dakar, Sénégal'}</p>
                </div>
              </div>

              {instagram && instagramHref && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#EDE3D8] flex items-center justify-center flex-shrink-0">
                    <AtSign size={18} strokeWidth={1.5} className="text-[#D4B896]" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mb-0.5">Instagram</p>
                    <a
                      href={instagramHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-[#D4B896] transition-colors"
                    >
                      {instagram}
                    </a>
                  </div>
                </div>
              )}

              {tiktok && tiktokHref && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#EDE3D8] flex items-center justify-center flex-shrink-0">
                    <AtSign size={18} strokeWidth={1.5} className="text-[#D4B896]" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8480] mb-0.5">TikTok</p>
                    <a
                      href={tiktokHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-[#D4B896] transition-colors"
                    >
                      {tiktok}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA WhatsApp */}
          <div className="bg-[#0C0C0C] p-10 flex flex-col justify-between">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4B896] mb-4">Réponse rapide</p>
              <h2 className="font-display text-3xl text-[#F5F2EE] mb-4">
                Parlons sur WhatsApp
              </h2>
              <p className="text-sm text-[#8A8480] tracking-wide leading-relaxed">
                Pour toute question sur nos produits, une commande ou un renseignement, contactez-nous directement sur WhatsApp. Nous répondons généralement en moins d&apos;une heure.
              </p>
            </div>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-[#D4B896] text-[#0C0C0C] px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#F5F2EE] transition-colors w-fit"
            >
              <MessageCircle size={16} strokeWidth={1.5} />
              Nous écrire
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}