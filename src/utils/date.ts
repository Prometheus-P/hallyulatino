const SPANISH_MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const SPANISH_MONTHS_SHORT = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
];

const SPANISH_DAYS = [
  'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
];

/**
 * Format date in Spanish long format
 * Example: "25 de noviembre de 2025"
 */
export function formatDateLong(date: Date): string {
  const day = date.getDate();
  const month = SPANISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

/**
 * Format date in Spanish short format
 * Example: "25 nov 2025"
 */
export function formatDateShort(date: Date): string {
  const day = date.getDate();
  const month = SPANISH_MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format date with day of week
 * Example: "martes, 25 de noviembre de 2025"
 */
export function formatDateWithDay(date: Date): string {
  const dayOfWeek = SPANISH_DAYS[date.getDay()];
  const day = date.getDate();
  const month = SPANISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${dayOfWeek}, ${day} de ${month} de ${year}`;
}

/**
 * Format date for datetime attribute (ISO format)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString();
}

/**
 * Get relative time in Spanish
 * Example: "hace 2 días", "hace 1 semana"
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'hoy';
  if (diffDays === 1) return 'ayer';
  if (diffDays < 7) return `hace ${diffDays} días`;
  if (diffDays < 14) return 'hace 1 semana';
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 60) return 'hace 1 mes';
  if (diffDays < 365) return `hace ${Math.floor(diffDays / 30)} meses`;
  if (diffDays < 730) return 'hace 1 año';
  return `hace ${Math.floor(diffDays / 365)} años`;
}

/**
 * Format year for display
 */
export function formatYear(year: number): string {
  return year.toString();
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: Date): boolean {
  return date.getTime() > new Date().getTime();
}

/**
 * Get month and year
 * Example: "noviembre 2025"
 */
export function formatMonthYear(date: Date): string {
  const month = SPANISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
}
