import Link from 'next/link'

interface FooterProps {
  settings: Record<string, string>
}

function cleanPhone(numero?: string) {
  return (numero || '').replace(/\D/g, '')
}

function instagramUrl(instagram?: string) {
  if (!instagram) return null
  if (instagram.startsWith('http://') || instagram.startsWith('https://')) return instagram
  return `https://instagram.com/${instagram.replace('@', '')}`
}

function tiktokUrl(tiktok?: string) {
  if (!tiktok) return null
  if (tiktok.startsWith('http://') || tiktok.startsWith('https://')) return tiktok
  return `https://tiktok.com/@${tiktok.replace('@', '')}`
}

export default function Footer({ settings }: FooterProps) {
  const brandName = settings.nom_marque || 'DERBII'
  const slogan = settings.slogan || "L'art du cuir sénégalais"
  const email = settings.email_contact || 'contact@derbii.sn'
  const adresse = settings.adresse || 'Dakar, Sénégal'
  const whatsapp = cleanPhone(settings.whatsapp_numero || '221700000000')
  const instagram = instagramUrl(settings.instagram)
  const tiktok = tiktokUrl(settings.tiktok)

  return (
    <footer className="bg-[#0C0C0C] text-[#F5F2EE]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="font-display text-3xl tracking-[0.25em] mb-4">{brandName}</div>
            <p className="text-xs text-[#8A8480] leading-relaxed tracking-wide max-w-[200px]">
              {slogan}. Pièces artisanales d&apos;exception.
            </p>
            {(instagram || tiktok) && (
              <div className="flex gap-4 mt-6">
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-xs tracking-[0.1em] text-[#8A8480] hover:text-[#D4B896] transition-colors uppercase">
                    Instagram
                  </a>
                )}
                {tiktok && (
                  <a href={tiktok} target="_blank" rel="noopener noreferrer" className="text-xs tracking-[0.1em] text-[#8A8480] hover:text-[#D4B896] transition-colors uppercase">
                    TikTok
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#D4B896] mb-5">Boutique</div>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/boutique', label: 'Tous les produits' },
                { href: '/collections', label: 'Collections' },
                { href: '/boutique?categorie=sacs', label: 'Sacs' },
                { href: '/boutique?categorie=ceintures', label: 'Ceintures' },
                { href: '/boutique?categorie=portefeuilles', label: 'Portefeuilles' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-[#8A8480] hover:text-[#F5F2EE] tracking-wide transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info */}
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#D4B896] mb-5">Informations</div>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/a-propos', label: 'Notre Histoire' },
                { href: '/contact', label: 'Nous Contacter' },
                { href: '/faq', label: 'FAQ' },
                { href: '/conditions', label: 'Conditions Générales' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-[#8A8480] hover:text-[#F5F2EE] tracking-wide transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#D4B896] mb-5">Contact</div>
            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#8A8480] tracking-wide">{adresse}</p>
              <a
                href={`mailto:${email}`}
                className="text-xs text-[#8A8480] hover:text-[#F5F2EE] tracking-wide transition-colors"
              >
                {email}
              </a>
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#D4B896] hover:text-[#F5F2EE] tracking-wide transition-colors"
                >
                  WhatsApp {brandName}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-[#8A8480] tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} {brandName}. Tous droits réservés.
          </p>
          <p className="text-[10px] text-[#8A8480] tracking-[0.1em]">
            Maroquinerie artisanale — {adresse}
          </p>
        </div>
      </div>
    </footer>
  )
}