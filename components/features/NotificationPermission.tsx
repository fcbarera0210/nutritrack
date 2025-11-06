'use client';

import { useState, useEffect } from 'react';
import { Bell, BellSlash } from '@phosphor-icons/react';
import { requestNotificationPermission, showNotification } from '@/lib/utils/notifications';

export function NotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    const granted = await requestNotificationPermission();
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    if (granted) {
      // Test notification
      setTimeout(() => {
        showNotification('¡Notificaciones activadas! 🎉', {
          body: 'Ahora recibirás recordatorios para tus comidas',
        });
      }, 500);
    }
    
    setIsLoading(false);
  };

  if (permission === 'granted') {
    return (
      <div className="bg-[#CEFB48]/70 rounded-[20px] p-4">
        <div className="flex items-center gap-2 text-[#131917] text-sm">
          <Bell size={20} weight="bold" />
          <span style={{ fontFamily: 'Quicksand, sans-serif' }}>Notificaciones activadas</span>
        </div>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="bg-[#CEFB48]/70 rounded-[20px] p-4">
        <div className="flex items-center gap-2 text-[#131917] text-sm">
          <BellSlash size={20} weight="bold" />
          <span style={{ fontFamily: 'Quicksand, sans-serif' }}>Notificaciones bloqueadas</span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleRequestPermission}
      disabled={isLoading}
      className="w-full bg-[#6484E2] rounded-[15px] px-4 py-[10px] text-white font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      style={{ fontFamily: 'Quicksand, sans-serif' }}
    >
      <Bell size={20} weight="bold" />
      {isLoading ? 'Activando...' : 'Activar notificaciones'}
    </button>
  );
}

