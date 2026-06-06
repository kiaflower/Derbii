'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

export default function ConnexionPage() {
const router = useRouter()
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [showPassword, setShowPassword] = useState(false)
const [loading, setLoading] = useState(false)
const [checking, setChecking] = useState(true)

// Vérifier si déjà connecté — redirect côté client uniquement
useEffect(() => {
const check = async () => {
try {
const supabase = createClient()
const { data: { session } } = await supabase.auth.getSession()
if (session) {
router.replace('/super-admin/dashboard')
return
}
} catch {}
setChecking(false)
}
check()
}, [router])

const handleLogin = async (e: React.FormEvent) => {
e.preventDefault()
setLoading(true)

```
try {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    toast.error('Identifiants incorrects')
    setLoading(false)
    return
  }

  router.replace('/super-admin/dashboard')
} catch {
  toast.error('Erreur de connexion')
  setLoading(false)
}
```

}

// Pendant la vérification initiale, afficher un écran neutre
if (checking) {
return (
<div className="min-h-screen bg-stone-900 flex items-center justify-center">
<div className="w-5 h-5 border border-stone-600 border-t-stone-300 rounded-full animate-spin" />
</div>
)
}

return (
<div className="min-h-screen bg-stone-900 flex items-center justify-center px-6" style={{ fontFamily: 'Jost, sans-serif' }}>
<div className="w-full max-w-sm">
<div className="text-center mb-12">
<div className="text-3xl tracking-[0.25em] text-stone-100 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
DERBII
</div>
<p className="text-xs tracking-[0.2em] uppercase text-stone-500">Administration</p>
</div>

```
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-500 mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full bg-stone-800 border border-stone-700 text-stone-100 px-4 py-3 text-sm tracking-wide placeholder-stone-600 focus:outline-none focus:border-stone-400"
          placeholder="admin@derbii.sn"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-500 mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full bg-stone-800 border border-stone-700 text-stone-100 px-4 py-3 text-sm tracking-wide placeholder-stone-600 focus:outline-none focus:border-stone-400 pr-10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
          >
            {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-stone-100 text-stone-900 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  </div>
</div>
```

)
}