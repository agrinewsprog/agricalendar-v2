import axios from 'axios'

const API_BASE_URL = 'https://agricalendar.net/api/'

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Tipos
export interface AdminUser {
  id: number
  name: string
  username: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'
  state: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    user: AdminUser
    token: string
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface Event {
  id: number
  name: string
  image?: string
  startDate: string
  endDate?: string
  startTime?: string
  endTime?: string
  color?: string
  location?: string
  address?: string
  description?: string
  state?: string
  region?: string
  tipo?: string
  type?: string
  website?: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'CANCELLED'
  languageId: number
  userId: number
  organizerName?: string
  organizerEmail?: string
  organizerPhone?: string
  maxAttendees?: number
  registrationRequired?: boolean
  registrationDeadline?: string
  tags?: string[]
  registro?: string
  seoTitle?: string
  seoDesc?: string
  createdAt: string
  updatedAt: string
  language: {
    id: number
    name: string
    code: string
  }
  user: {
    id: number
    name: string
    username: string
  }
}

export interface CreateEventData {
  name: string
  image?: string
  startDate: string
  endDate?: string
  startTime?: string
  endTime?: string
  color?: string
  location?: string
  address?: string
  description?: string
  state?: string
  region?: string
  tipo?: string
  type?: string
  website?: string
  slug?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'CANCELLED'
  languageId: number
  organizerName?: string
  organizerEmail?: string
  organizerPhone?: string
  maxAttendees?: number
  registrationRequired?: boolean
  registrationDeadline?: string
  tags?: string
  registro?: string
  seoTitle?: string
  seoDesc?: string
}

export interface Language {
  id: number
  name: string
  code: string
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

// === AUTH SERVICES ===

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async logout(): Promise<ApiResponse> {
    const response = await api.post('/auth/logout')
    return response.data
  },

  async verifyToken(): Promise<LoginResponse> {
    const response = await api.get('/auth/verify')
    return response.data
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  },

  // Helpers para localStorage
  saveAuth(user: AdminUser, token: string) {
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_user', JSON.stringify(user))
  },

  clearAuth() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  },

  getStoredUser(): AdminUser | null {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('admin_user')
    return user ? JSON.parse(user) : null
  },

  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('admin_token')
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }
}

// === EVENTS SERVICES ===

export const eventsService = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    tipo?: string
    region?: string
    languageId?: number
  }): Promise<ApiResponse<Event[]>> {
    const response = await api.get('/events', { params })
    return response.data
  },

  // Nuevo servicio para administradores - obtiene TODOS los eventos con filtros
  async getAdminEvents(params?: {
    limit?: number
    offset?: number
    status?: string
    tipo?: string
    region?: string
    startDate?: string
    endDate?: string
    search?: string
    userId?: number
    language?: string
  }): Promise<ApiResponse<Event[]>> {
    const response = await api.get('/admin/events', { params })
    return response.data
  },

  async getById(id: number): Promise<ApiResponse<Event>> {
    // Usar ruta temporal hasta que el admin endpoint esté disponible
    const response = await api.get(`/events/id/${id}`)
    return response.data
  },

  // Método admin para obtener evento por ID (incluye borradores y eventos privados)
  async getAdminEventById(id: number): Promise<ApiResponse<Event>> {
    const response = await api.get(`/admin/events/${id}`)
    return response.data
  },

  async getBySlug(slug: string, language?: string): Promise<ApiResponse<Event>> {
    const response = await api.get(`/events/slug/${slug}`, {
      params: language ? { language } : {}
    })
    return response.data
  },

  async create(data: CreateEventData | FormData): Promise<ApiResponse<Event>> {
    const config: any = {}
    
    // Si es FormData, no establecer Content-Type (axios lo hará automáticamente)
    if (data instanceof FormData) {
      config.headers = {
        // No establecer Content-Type para que axios maneje multipart/form-data automáticamente
      }
    }
    
    const response = await api.post('/events', data, config)
    return response.data
  },

  async update(id: number, data: Partial<CreateEventData>): Promise<ApiResponse<Event>> {
    const response = await api.put(`/events/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<ApiResponse> {
    const response = await api.delete(`/events/${id}`)
    return response.data
  },

  async updateStatus(id: number, status: Event['status']): Promise<ApiResponse<Event>> {
    const response = await api.patch(`/events/${id}/status`, { status })
    return response.data
  }
}

// === LANGUAGES SERVICES ===

export const languagesService = {
  async getAll(): Promise<ApiResponse<Language[]>> {
    const response = await api.get('/languages')
    return response.data
  },

  async getById(id: number): Promise<ApiResponse<Language>> {
    const response = await api.get(`/languages/${id}`)
    return response.data
  },

  async create(data: Omit<Language, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Language>> {
    const response = await api.post('/languages', data)
    return response.data
  },

  async update(id: number, data: Partial<Omit<Language, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Language>> {
    const response = await api.put(`/languages/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<ApiResponse> {
    const response = await api.delete(`/languages/${id}`)
    return response.data
  }
}

// === TRANSLATIONS SERVICES ===

export interface EventTranslation {
  id: number
  eventId: number
  languageId: number
  language: Language
  title: string
  description: string
  slug: string
  location?: string
  isAutoTranslated: boolean
  createdAt: string
  updatedAt: string
}

export interface SeoMetadata {
  id: number
  eventId: number
  languageId: number
  language: Language
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  createdAt: string
  updatedAt: string
}

export interface EventWithTranslations extends Event {
  translations: EventTranslation[]
  seoMetadata: SeoMetadata[]
}

export interface CreateTranslationData {
  title: string
  description: string
  slug?: string
  location?: string
  isAutoTranslated?: boolean
}

export interface CreateSeoData {
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

export const translationsService = {
  // Obtener todas las traducciones de un evento
  async getEventTranslations(eventId: number): Promise<ApiResponse<EventWithTranslations>> {
    const response = await api.get(`/events/${eventId}/translations`)
    return response.data
  },

  // Crear o actualizar una traducción específica
  async updateEventTranslation(
    eventId: number, 
    languageId: number, 
    data: CreateTranslationData
  ): Promise<ApiResponse<EventTranslation>> {
    const response = await api.put(`/events/${eventId}/translations/${languageId}`, data)
    return response.data
  },

  // Obtener traducción específica por idioma
  async getTranslationByLanguage(
    eventId: number, 
    languageId: number
  ): Promise<ApiResponse<EventTranslation>> {
    const response = await api.get(`/events/${eventId}/translations/${languageId}`)
    return response.data
  },

  // Eliminar una traducción específica
  async deleteTranslation(eventId: number, languageId: number): Promise<ApiResponse> {
    const response = await api.delete(`/events/${eventId}/translations/${languageId}`)
    return response.data
  },

  // Crear traducciones automáticas para todos los idiomas
  async createAutoTranslations(eventId: number): Promise<ApiResponse<EventTranslation[]>> {
    const response = await api.post(`/events/${eventId}/translations/auto`)
    return response.data
  },

  // Generar slug automático
  async generateSlug(text: string, languageId: number): Promise<ApiResponse<{ slug: string }>> {
    const response = await api.post('/translations/generate-slug', { text, languageId })
    return response.data
  }
}

// === SEO METADATA SERVICES ===

export const seoService = {
  // Obtener metadata SEO de un evento para un idioma específico
  async getSeoMetadata(eventId: number, languageId: number): Promise<ApiResponse<SeoMetadata>> {
    const response = await api.get(`/events/${eventId}/seo/${languageId}`)
    return response.data
  },

  // Crear o actualizar metadata SEO
  async updateSeoMetadata(
    eventId: number, 
    languageId: number, 
    data: CreateSeoData
  ): Promise<ApiResponse<SeoMetadata>> {
    const response = await api.put(`/events/${eventId}/seo/${languageId}`, data)
    return response.data
  },

  // Eliminar metadata SEO
  async deleteSeoMetadata(eventId: number, languageId: number): Promise<ApiResponse> {
    const response = await api.delete(`/events/${eventId}/seo/${languageId}`)
    return response.data
  },

  // Generar metadata SEO automática basada en el contenido del evento
  async generateAutoSeo(eventId: number, languageId: number): Promise<ApiResponse<SeoMetadata>> {
    const response = await api.post(`/events/${eventId}/seo/${languageId}/auto`)
    return response.data
  }
}

export default api
