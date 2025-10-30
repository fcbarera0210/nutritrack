'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Bell, BellOff } from 'lucide-react';
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
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <Bell className="w-4 h-4" />
        <span>Notificaciones activadas</span>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm">
        <BellOff className="w-4 h-4" />
        <span>Notificaciones bloqueadas</span>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRequestPermission}
      isLoading={isLoading}
      className="w-full"
    >
      <Bell className="w-4 h-4 mr-2" />
      Activar notificaciones
    </Button>
  );
}

