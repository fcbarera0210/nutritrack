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
