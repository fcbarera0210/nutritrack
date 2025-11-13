/**
 * Utilidades para manejo de fechas en la aplicación
 */

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD usando la zona horaria local del cliente/servidor
 * Esta función evita problemas de zona horaria al usar siempre la fecha local
 */
export function getTodayDateLocal(): string {
  const now = new Date();
  // Usar métodos locales para evitar problemas de zona horaria
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha Date a formato YYYY-MM-DD usando la zona horaria local
 */
export function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una hora (timestamp) a formato HH:mm usando la zona horaria local
 * Esta función convierte correctamente timestamps de la BD a la zona horaria local
 */
export function formatTimeLocal(timestamp: Date | string): string {
  // Si es string, crear Date object
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  // Usar métodos locales para obtener hora y minutos en la zona horaria local
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Formatea una hora (timestamp) a formato HH:mm usando la zona horaria de Chile (America/Santiago)
 * Esta función convierte correctamente timestamps UTC de la BD a la zona horaria de Chile
 * La app está destinada solo para uso en Chile, por lo que siempre usamos esta zona horaria
 */
export function formatTimeChile(timestamp: Date | string): string {
  // Si es string, crear Date object
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  // Usar Intl.DateTimeFormat para convertir a la zona horaria de Chile
  // Esto maneja correctamente el horario de verano (UTC-3 o UTC-4)
  const formatter = new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  return formatter.format(date);
}
