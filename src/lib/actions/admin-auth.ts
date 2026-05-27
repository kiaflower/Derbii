'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function loginAdminAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();

  if (!email || !password) return { error: 'Email et mot de passe requis.' };

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: 'Identifiants invalides.' };

  const { data: adminRow } = await supabase.from('admins').select('id').eq('email', email).maybeSingle();
  if (!adminRow) return { error: 'Accès refusé: compte non administrateur.' };

  (await cookies()).set('derbii_admin_token', data.session?.access_token ?? 'ok', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8
  });

  redirect('/super-admin');
}

export async function logoutAdminAction() {
  (await cookies()).delete('derbii_admin_token');
  redirect('/super-admin/login');
}
