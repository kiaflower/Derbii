import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: {
    default: 'DERBII — Accessoires en Cuir Premium',
    template: '%s | DERBII',
  },
  description: "DERBII, maison de cuir sénégalaise. Accessoires et articles en cuir artisanaux de luxe.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0C0C0C',
              color: '#F5F2EE',
              border: '1px solid #2a2a2a',
              fontFamily: 'Jost, sans-serif',
              fontSize: '13px',
              letterSpacing: '0.03em',
            },
          }}
        />
      </body>
    </html>
  )
}
