const cats = ['Sacs', 'Portefeuilles', 'Ceintures', 'Petite maroquinerie'];
const products = [
  ['Sac en cuir Élégance', '85 000 FCFA'],
  ['Portefeuille Classique', '35 000 FCFA'],
  ['Ceinture Prestige', '25 000 FCFA'],
  ['Porte-cartes Slim', '15 000 FCFA'],
  ['Sac Business', '95 000 FCFA']
];

export default function HomePage() {
  return (
    <div className='luxury-container py-6 md:py-8 space-y-8'>
      <section className='overflow-hidden rounded-3xl border bg-[#1e140d] text-white' style={{ borderColor: '#2a1b10' }}>
        <div className='grid md:grid-cols-2'>
          <div className='hero-overlay p-8 md:p-14 space-y-6'>
            <h1 className='text-4xl md:text-6xl font-light leading-tight'>L’élégance<br/><span className='text-[#d0a46a]'>dans chaque détail</span></h1>
            <p className='max-w-lg text-white/85'>Accessoires en cuir haut de gamme. Pensés pour durer, créés pour vous.</p>
            <div className='flex gap-3'>
              <button className='btn-primary rounded-lg px-5 py-3'>Découvrir la collection</button>
              <button className='rounded-lg px-5 py-3 border border-white/40'>En savoir plus</button>
            </div>
          </div>
          <div className='min-h-[360px] bg-[radial-gradient(circle_at_30%_20%,#6b4422_0,#2b1a11_55%,#1a120d_100%)]' />
        </div>
      </section>

      <section className='card p-6'>
        <div className='flex items-center justify-between mb-4'><h2 className='text-3xl font-light'>Nos catégories</h2><span className='text-sm text-[var(--muted)]'>Voir tout</span></div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>{cats.map(c=><div key={c} className='rounded-xl border p-4 bg-white' style={{borderColor:'var(--border)'}}><div className='h-28 rounded-lg bg-[var(--panel-2)] mb-3'/><p>{c}</p><p className='text-sm text-[var(--muted)]'>Voir la collection</p></div>)}</div>
      </section>

      <section className='card p-6'>
        <div className='flex items-center justify-between mb-4'><h2 className='text-3xl font-light'>Nos best-sellers</h2><span className='text-sm text-[var(--muted)]'>Voir tout</span></div>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>{products.map(([n,p])=><article key={n} className='rounded-xl border p-3 bg-white' style={{borderColor:'var(--border)'}}><div className='h-28 rounded-lg bg-[var(--panel-2)] mb-3'/><p className='text-sm'>{n}</p><p className='text-sm font-medium'>{p}</p><p className='text-xs text-[var(--muted)]'>★ 4.8 (24)</p></article>)}</div>
      </section>
    </div>
  );
}
