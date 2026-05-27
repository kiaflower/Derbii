export default async function ProductDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  return <div className='luxury-container py-8'>
    <div className='grid lg:grid-cols-[120px_1fr_1fr] gap-6'>
      <div className='space-y-3'>{[1,2,3,4].map(i=><div key={i} className='h-20 rounded border bg-white' style={{borderColor:'var(--border)'}}/>)}</div>
      <div className='card p-4'><div className='h-[460px] rounded-xl bg-[var(--panel-2)]'/></div>
      <div className='space-y-4'>
        <h1 className='text-4xl'>{slug.replaceAll('-',' ')}</h1>
        <p className='text-2xl font-medium'>85 000 FCFA</p>
        <p className='text-[var(--muted)]'>Sac en cuir véritable, élégant et spacieux.</p>
        <div className='flex gap-2'><button className='rounded-full border px-4 py-2' style={{borderColor:'var(--border)'}}>Marron</button><button className='rounded-full border px-4 py-2' style={{borderColor:'var(--border)'}}>Noir</button></div>
        <button className='btn-primary w-full rounded-lg py-3'>Ajouter au panier</button>
        <button className='w-full rounded-lg py-3 border' style={{borderColor:'var(--border)'}}>Acheter maintenant</button>
      </div>
    </div>
  </div>;
}
