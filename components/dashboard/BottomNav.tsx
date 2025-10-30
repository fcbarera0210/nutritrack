'use client';

import { House, ChartDonut, Plus, User, Gear } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', icon: House, label: 'Inicio' },
    { href: '/stats', icon: ChartDonut, label: 'Informe' },
    { href: '/add', icon: Plus, label: 'Agregar', isCenter: true },
    { href: '/profile', icon: User, label: 'Perfil' },
    { href: '/settings', icon: Gear, label: 'Ajustes' },
  ];

  const handleCenterButtonClick = () => {
    router.push('/add');
  };

  return (
    <nav className="fixed bottom-[10px] left-[10px] right-[10px] bg-[#131917] z-50 shadow-[0_2px_10px_rgba(0,0,0,0.10)] rounded-[15px] px-[5px] py-[10px]">
      <div className="flex justify-between items-center text-white">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCenter = item.isCenter;

          if (isCenter) {
            return (
              <button
                key={item.href}
                onClick={handleCenterButtonClick}
                className="flex flex-col items-center justify-center gap-1 flex-1 relative"
              >
                <div className="w-[38px] h-[38px] rounded-[10px] bg-[#CEFB48] hover:brightness-105 flex items-center justify-center text-[#131917] transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
                  <item.icon size={20} weight="bold" />
                </div>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 px-2 py-2 flex-1
                transition-colors duration-200 text-white
                ${isActive ? 'opacity-100' : 'opacity-70'}
              `}
            >
              <item.icon size={24} weight="bold" />
              <span className="text-xs font-medium text-white">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
