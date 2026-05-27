import Link from 'next/link';
const links=[['Shop','/shop'],['Collections','/collections'],['About','/about'],['Contact','/contact']];
export function Header(){return <header className='sticky top-0 z-30 border-b border-white/10 bg-charcoal/90 backdrop-blur'><div className='luxury-container flex h-16 items-center justify-between'><Link href='/' className='text-xl tracking-[0.3em]'>DERBII</Link><nav className='flex gap-6 text-sm'>{links.map(([t,h])=><Link key={h} href={h}>{t}</Link>)}</nav></div></header>;}
