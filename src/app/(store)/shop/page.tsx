const products = ['Sac en cuir Élégance','Portefeuille Classique','Ceinture Prestige','Porte-cartes Slim','Sac Business','Portefeuille Premium'];

export default function Page(){
  return <div className='luxury-container py-8'>
    <h1 className='text-4xl mb-6'>Boutique</h1>
    <div className='grid lg:grid-cols-[260px_1fr] gap-6'>
      <aside className='card p-5 space-y-6 h-fit'>
        <div><p className='font-medium mb-2'>Catégories</p><ul className='space-y-1 text-sm text-[var(--muted)]'><li>Tous les produits</li><li>Sacs</li><li>Portefeuilles</li><li>Ceintures</li></ul></div>
        <div><p className='font-medium mb-2'>Prix</p><div className='h-2 rounded bg-[var(--panel-2)]'/></div>
        <div><p className='font-medium mb-2'>Couleurs</p><div className='flex gap-2'><span className='h-5 w-5 rounded-full bg-black'/><span className='h-5 w-5 rounded-full bg-amber-900'/><span className='h-5 w-5 rounded-full bg-stone-400'/></div></div>
      </aside>
      <section className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {products.map((name)=><article key={name} className='card p-3'><div className='h-44 rounded-lg bg-[var(--panel-2)] mb-3'/><h3>{name}</h3><p className='text-sm'>85 000 FCFA</p><p className='text-xs text-[var(--muted)]'>★ 4.8 (24)</p></article>)}
      </section>
    </div>
  </div>;
}
