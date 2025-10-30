'use client';

import { List, User, HandWaving } from '@phosphor-icons/react';
import Link from 'next/link';

interface HeaderProps {
  userName?: string;
}

export function Header({ userName }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <header className="flex items-center justify-between bg-[#131917] text-white rounded-b-[80px] pt-[40px]">
      {/* User Icon */}
      <Link href="/profile">
        <button className="w-12 h-12 rounded-full bg-[#404040] flex items-center justify-center text-white hover:opacity-90 transition-colors">
          <User size={25} weight="bold" />
        </button>
      </Link>

      {/* Greeting */}
      <div className="flex-1 text-center">
        <h1 className="text-white font-semibold text-[20px] inline-flex items-center gap-2">
          {getGreeting()}
          <HandWaving size={16} weight="bold" color="#CEFB48" />
        </h1>
      </div>

      {/* Menu */}
      <button className="w-12 h-12 rounded-full bg-[#404040] flex items-center justify-center text-white hover:opacity-90 transition-colors">
        <List size={25} weight="bold" />
      </button>
    </header>
  );
}
