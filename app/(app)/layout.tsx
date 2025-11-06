import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FloatingAddButtonWrapper } from '@/components/dashboard/FloatingAddButton';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL === '1') {
    // Evita fallas por env/cookies en prod, mantenemos acceso para probar login
    return (
      <>
        {children}
        <FloatingAddButtonWrapper />
      </>
    );
  }
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect('/login');
  return (
    <>
      {children}
      <FloatingAddButtonWrapper />
    </>
  );
}


