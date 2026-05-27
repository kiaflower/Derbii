import Link from 'next/link';

const links = [['Accueil', '/'], ['Boutique', '/shop'], ['Collections', '/collections'], ['À propos', '/about'], ['Contact', '/contact']];

export function Header() {
  return (
    <header className='sticky top-0 z-30 border-b bg-[var(--panel)]/95 backdrop-blur' style={{ borderColor: 'var(--border)' }}>
      <div className='luxury-container flex h-16 items-center justify-between'>
        <Link href='/' className='text-xl tracking-[0.2em] font-medium'>DERBII</Link>
        <nav className='hidden md:flex gap-6 text-sm'>
          {links.map(([t, h]) => <Link key={h} href={h}>{t}</Link>)}
        </nav>
        <div className='text-sm text-[var(--muted)]'>♡ ⌕ 👜</div>
      </div>
    </header>
  );
}
