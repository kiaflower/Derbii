import { HomepageSection } from '@/types/database'

interface NewsletterSectionProps {
  section: HomepageSection
}

export default function NewsletterSection({ section }: NewsletterSectionProps) {
  return (
    <section className="bg-[#0C0C0C] text-[#F5F2EE] py-20 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-[#D4B896]/40" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4B896]">
            {section.sous_titre || 'Newsletter'}
          </span>
          <div className="h-px w-12 bg-[#D4B896]/40" />
        </div>
        <h2 className="font-display text-4xl lg:text-5xl mb-3">
          {section.titre || 'Rejoignez la Famille DERBII'}
        </h2>
        <p className="text-[#8A8480] text-sm tracking-wide mb-10 max-w-md mx-auto">
          {section.contenu || 'Recevez nos nouvelles collections en avant-première'}
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Votre adresse email"
            className="flex-1 bg-white/5 border border-white/10 text-[#F5F2EE] placeholder-[#8A8480] px-5 py-3.5 text-sm tracking-wide focus:outline-none focus:border-[#D4B896] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#D4B896] text-[#0C0C0C] px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-[#F5F2EE] transition-colors flex-shrink-0"
          >
            S&apos;inscrire
          </button>
        </form>
        <p className="text-[10px] text-[#8A8480] mt-4 tracking-wide">
          En vous inscrivant, vous acceptez de recevoir nos communications. Désinscription possible à tout moment.
        </p>
      </div>
    </section>
  )
}