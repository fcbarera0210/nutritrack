'use client';

import { HandWaving } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface HeaderProps {
  userName?: string;
}

export function Header({ userName }: HeaderProps) {
  const [userNameState, setUserNameState] = useState<string | null>(userName || null);

  useEffect(() => {
    // Si se pasa userName como prop, usarlo directamente
    if (userName) {
      setUserNameState(userName);
    } else {
      // Si no se pasó userName como prop, obtenerlo de la API
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.name) {
            setUserNameState(data.name);
          }
        })
        .catch(() => {
          // Si falla, mantener null
        });
    }
  }, [userName]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getInitials = () => {
    if (userNameState) {
      return userNameState.substring(0, 2).toUpperCase();
    }
    return 'JD';
  };

  return (
    <header className="flex items-center justify-between bg-[#131917] text-white rounded-b-[30px] pt-[24px]">
      {/* User Avatar with Initials */}
      <Link href="/profile">
        <button className="w-12 h-12 rounded-full bg-[#404040] flex items-center justify-center text-white hover:opacity-90 transition-colors">
          <span className="font-bold text-xl">{getInitials()}</span>
        </button>
      </Link>

      {/* Greeting */}
      <div className="flex-1 text-center">
        <h1 className="text-white font-semibold inline-flex items-center gap-2" style={{ fontSize: '20px' }}>
          {getGreeting()}
          <span className="animate-color-wave">
            <HandWaving size={16} weight="bold" />
          </span>
        </h1>
      </div>

      {/* Empty space to balance layout */}
      <div className="w-12 h-12" />
    </header>
  );
}
