import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FloatingAddButtonWrapper } from '@/components/dashboard/FloatingAddButton';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    redirect('/login');
  }
  return (
    <>
      {children}
      <FloatingAddButtonWrapper />
    </>
  );
}


