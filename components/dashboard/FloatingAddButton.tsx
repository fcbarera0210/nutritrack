'use client';

import { Plus } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import { ModalContext } from '@/contexts/ModalContext';

export function FloatingAddButton() {
  const [mounted, setMounted] = useState(false);
  const modalContext = useContext(ModalContext);
  
  useEffect(() => {
    // Solo renderizar después del mount para evitar doble renderizado en React Strict Mode
    setMounted(true);
  }, []);
  
  // No renderizar hasta que esté montado (evita renderizado durante SSR y doble renderizado)
  if (!mounted) {
    return null;
  }
  
  // Ocultar cuando hay un modal abierto (si el contexto está disponible)
  if (modalContext?.isAnyModalOpen) {
    return null;
  }
  
  return (
    <Link href="/add" className="fixed bottom-[90px] right-[20px] z-50">
      <button className="w-[56px] h-[56px] rounded-full bg-[#3CCC1F] hover:brightness-105 flex items-center justify-center text-[#131917] transition-all shadow-[0_4px_15px_rgba(60,204,31,0.40)]">
        <Plus size={28} weight="bold" />
      </button>
    </Link>
  );
}

// Wrapper para usar en componentes de servidor
export function FloatingAddButtonWrapper() {
  return <FloatingAddButton />;
}

