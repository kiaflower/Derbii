import { loginAdminAction } from '@/lib/actions/admin-auth';

export default function AdminLogin() {
  return (
    <div className='min-h-[70vh] grid place-items-center px-4'>
      <form action={loginAdminAction} className='card w-full max-w-md space-y-4 rounded-xl p-8 shadow-sm'>
        <h1 className='text-3xl'>Super Admin</h1>
        <p className='text-sm text-[var(--muted)]'>Accès réservé à l’équipe DERBII.</p>
        <input name='email' className='w-full rounded border p-3' style={{ borderColor: 'var(--border)' }} placeholder='Email' type='email' required />
        <input name='password' className='w-full rounded border p-3' style={{ borderColor: 'var(--border)' }} placeholder='Password' type='password' required />
        <button className='btn-primary w-full rounded p-3 font-semibold'>Secure Login</button>
      </form>
    </div>
  );
}
