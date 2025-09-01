import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://agricalendar.net/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Aumentar timeout a 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
})

// Función para hacer reintentos automáticos
const retryRequest = async (fn: () => Promise<any>, maxRetries = 2, delay = 1000): Promise<any> => {
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries + 1
      const shouldRetry = error.code === 'ECONNREFUSED' || 
                         error.code === 'ECONNABORTED' || 
                         error.response?.status >= 500 ||
                         !error.response // Network error

      if (isLastAttempt || !shouldRetry) {
        throw error
      }

      console.log(`API request failed (attempt ${attempt}/${maxRetries + 1}), retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay * attempt)) // Exponential backoff
    }
  }
}

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo log errores que no sean 404 en eventos específicos para reducir spam
    if (!(error.response?.status === 404 && error.config?.url?.includes('/events/'))) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        code: error.code,
      })
    }
    return Promise.reject(error)
  }
)

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
  address: string | null
  description: string | null
  state: string | null
  region: string | null
  tipo: string | null
  website: string | null
  slug: string
  status: string
  languageId: number
  userId: number
  organizerName: string | null
  organizerEmail: string | null
  organizerPhone: string | null
  maxAttendees: number | null
  registrationRequired: boolean | null
  registrationDeadline: string | null
  tags: string | null
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
    return retryRequest(async () => {
      const response = await api.get('/events', { params })
      return response.data
    })
  },

  // Obtener evento por slug
  getBySlug: async (slug: string, language?: string): Promise<ApiResponse<Event>> => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/events/${slug}`, {
          params: { language }
        })
        return response.data
      } catch (error: any) {
        // Si es un 404, retornar una respuesta controlada
        if (error.response?.status === 404) {
          return {
            success: false,
            data: null as any,
            error: 'Evento no encontrado'
          }
        }
        // Para otros errores, re-lanzar para que el retry funcione
        throw error
      }
    })
  },
}

export const languagesService = {
  // Obtener todos los idiomas
  getAll: async (): Promise<ApiResponse<Language[]>> => {
    return retryRequest(async () => {
      const response = await api.get('/languages')
      return response.data
    })
  },

  // Obtener idioma por defecto
  getDefault: async (): Promise<ApiResponse<Language>> => {
    return retryRequest(async () => {
      const response = await api.get('/languages/default')
      return response.data
    })
  },
}

export const healthService = {
  // Health check
  check: async () => {
    return retryRequest(async () => {
      const response = await api.get('/health')
      return response.data
    })
  },
}

export default api
