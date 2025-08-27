import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale: string = 'es') {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj)
}

export function formatDateRange(startDate: string | Date, endDate?: string | Date | null, locale: string = 'es') {
  const start = formatDate(startDate, locale)
  if (!endDate) return start
  
  const end = formatDate(endDate, locale)
  return `${start} - ${end}`
}
