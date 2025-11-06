'use client';

import { ModalProvider } from '@/contexts/ModalContext';
import { FloatingAddButtonWrapper } from '@/components/dashboard/FloatingAddButton';

export function ModalProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      {children}
      <FloatingAddButtonWrapper />
    </ModalProvider>
  );
}

