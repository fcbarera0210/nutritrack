'use client';

import { Plus } from '@phosphor-icons/react';
import Link from 'next/link';

export function FloatingAddButton() {
  return (
    <Link href="/add">
      <button className="fixed bottom-[90px] right-[20px] w-[56px] h-[56px] rounded-full bg-[#3CCC1F] hover:brightness-105 flex items-center justify-center text-[#131917] transition-all shadow-[0_4px_15px_rgba(60,204,31,0.40)] z-50">
        <Plus size={28} weight="bold" />
      </button>
    </Link>
  );
}

// Wrapper para usar en componentes de servidor
export function FloatingAddButtonWrapper() {
  return <FloatingAddButton />;
}

