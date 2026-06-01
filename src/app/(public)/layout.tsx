import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/shop/CartSidebar'
import { getSettings } from '@/lib/actions/cms'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <>
      <Header settings={settings} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} />
      <CartSidebar />
    </>
  )
}