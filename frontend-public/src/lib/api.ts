import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Tipos de datos
export interface Language {
  id: number
  name: string
  code: string
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: number
  name: string
  image: string | null
  startDate: string
  endDate: string | null
  startTime: string | null
  endTime: string | null
  color: string | null
  location: string | null
  description: string | null
  state: string | null
  region: string | null
  tipo: string | null
  website: string | null
  slug: string
  status: string
  languageId: number
  userId: number
  registro: string | null
  seoTitle: string | null
  seoDesc: string | null
  createdAt: string
  updatedAt: string
  language: Language
  user: {
    id: number
    name: string
    username: string
  }
  translations: any[]
  seoMetadata: any[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    total: number
    limit: number
    offset: number
    language: string
  }
  message?: string
  error?: string
}

// Servicios
export const eventsService = {
  // Obtener todos los eventos
  getAll: async (params?: {
    language?: string
    limit?: number
    offset?: number
    tipo?: string
    region?: string
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<Event[]>> => {
    const response = await api.get('/events', { params })
    return response.data
  },

  // Obtener evento por slug
  getBySlug: async (slug: string, language?: string): Promise<ApiResponse<Event>> => {
    const response = await api.get(`/events/${slug}`, {
      params: { language }
    })
    return response.data
  },
}

export const languagesService = {
  // Obtener todos los idiomas
  getAll: async (): Promise<ApiResponse<Language[]>> => {
    const response = await api.get('/languages')
    return response.data
  },

  // Obtener idioma por defecto
  getDefault: async (): Promise<ApiResponse<Language>> => {
    const response = await api.get('/languages/default')
    return response.data
  },
}

export const healthService = {
  // Health check
  check: async () => {
    const response = await api.get('/health')
    return response.data
  },
}

export default api
