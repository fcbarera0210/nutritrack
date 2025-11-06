'use client';

import { House, User, ChartBar } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { ModalContext } from '@/contexts/ModalContext';

export function BottomNav() {
  const pathname = usePathname();
  const modalContext = useContext(ModalContext);

  // Ocultar cuando hay un modal abierto (si el contexto está disponible)
  if (modalContext?.isAnyModalOpen) {
    return null;
  }

  const navItems = [
    { href: '/dashboard', icon: House, label: 'Inicio' },
    { href: '/stats', icon: ChartBar, label: 'Informe' },
    { href: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-[35px] left-1/2 transform -translate-x-1/2 z-50 flex justify-center items-center gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center justify-center text-white relative overflow-hidden
              ${isActive 
                ? 'bg-[#1a1f1d] rounded-[12px] px-4 py-2 gap-2' 
                : 'bg-[#131917] rounded-[12px] px-3 py-2'
              }
              transition-all duration-300 ease-in-out
              ${isActive ? 'scale-105' : 'scale-100 hover:scale-[1.02]'}
            `}
            style={{
              border: '3px solid #404040',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <item.icon 
              size={24} 
              weight="bold" 
              className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}
            />
            {isActive && (
              <span 
                className="text-sm font-medium text-white whitespace-nowrap animate-fade-in"
                style={{
                  animation: 'fadeInSlide 0.3s ease-in-out',
                }}
              >
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
