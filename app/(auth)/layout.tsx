import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL === '1') {
    // Evita fallas por env/cookies en prod mientras estabilizamos login
    return <>{children}</>;
  }
  const user = await getCurrentUser().catch(() => null);
  if (user) redirect('/dashboard');
  return <>{children}</>;
}


