// Sistema de notificaciones del navegador

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('Este navegador no soporta notificaciones');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function showNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      ...options,
    });
  }
}

export function scheduleMealReminder(mealName: string, hour: number, minute: number) {
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(hour, minute, 0, 0);

  // Si la hora ya pasó hoy, programar para mañana
  if (reminderTime.getTime() <= now.getTime()) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const timeUntilReminder = reminderTime.getTime() - now.getTime();

  setTimeout(() => {
    showNotification(`¡Es hora de ${mealName}! 🌮`, {
      body: 'No olvides registrar lo que comes para mantener tu progreso',
      tag: `meal-reminder-${mealName}`,
    });
  }, timeUntilReminder);
}

export async function enableMealReminders(reminders: Array<{ mealType: string; hour: number; minute: number }>) {
  const hasPermission = await requestNotificationPermission();
  
  if (!hasPermission) {
    alert('Por favor, permite las notificaciones para recibir recordatorios');
    return false;
  }

  reminders.forEach((reminder) => {
    const mealNames: { [key: string]: string } = {
      breakfast: 'Desayuno',
      lunch: 'Almuerzo',
      dinner: 'Cena',
      snack: 'Snack',
    };

    scheduleMealReminder(mealNames[reminder.mealType] || reminder.mealType, reminder.hour, reminder.minute);
  });

  return true;
}

