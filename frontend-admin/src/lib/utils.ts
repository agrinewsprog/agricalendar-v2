import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDateRange(startDate: string, endDate?: string | null) {
  const start = new Date(startDate)
  
  if (!endDate) {
    return formatDate(start)
  }
  
  const end = new Date(endDate)
  
  // Si es el mismo día
  if (start.toDateString() === end.toDateString()) {
    return formatDate(start)
  }
  
  // Si es el mismo mes
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
  }
  
  // Fechas diferentes
  return `${formatDate(start)} - ${formatDate(end)}`
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/--+/g, '-') // Reemplazar múltiples guiones con uno solo
    .trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PUBLISHED':
      return 'bg-green-100 text-green-800'
    case 'DRAFT':
      return 'bg-yellow-100 text-yellow-800'
    case 'ARCHIVED':
      return 'bg-gray-100 text-gray-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getStatusText(status: string): string {
  switch (status.toUpperCase()) {
    case 'PUBLISHED':
      return 'Publicado'
    case 'DRAFT':
      return 'Borrador'
    case 'ARCHIVED':
      return 'Archivado'
    case 'CANCELLED':
      return 'Cancelado'
    default:
      return status
  }
}

export function getRoleText(role: string): string {
  switch (role.toUpperCase()) {
    case 'SUPER_ADMIN':
      return 'Super Admin'
    case 'ADMIN':
      return 'Administrador'
    case 'EDITOR':
      return 'Editor'
    case 'VIEWER':
      return 'Visualizador'
    default:
      return role
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}
