// Código para añadir al api.ts del frontend

// Interfaces para las traducciones
interface EventTranslation {
  id: number;
  eventId: number;
  languageId: number;
  name: string;
  description?: string;
  location?: string;
  slug: string;
  isAuto: boolean;
  language: {
    id: number;
    code: string;
    name: string;
  };
}

interface SeoMetadata {
  id: number;
  eventId: number;
  languageId: number;
  title: string;
  description: string;
  keywords?: string;
  language: {
    id: number;
    code: string;
    name: string;
  };
}

interface EventWithTranslations {
  id: number;
  name: string;
  description?: string;
  location?: string;
  slug: string;
  languageId: number;
  language: {
    id: number;
    code: string;
    name: string;
  };
  translations: EventTranslation[];
  seoMetadata: SeoMetadata[];
}

interface TranslationData {
  name: string;
  description?: string;
  location?: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
}

// Servicios de traducción
export const translationService = {
  /**
   * Obtener todas las traducciones de un evento
   */
  async getEventTranslations(eventId: number): Promise<ApiResponse<EventWithTranslations>> {
    try {
      const response = await api.get(`/events/${eventId}/translations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event translations:', error);
      throw error;
    }
  },

  /**
   * Crear o actualizar traducción
   */
  async saveTranslation(
    eventId: number,
    languageCode: string,
    data: TranslationData
  ): Promise<ApiResponse<EventTranslation>> {
    try {
      const response = await api.post(`/events/${eventId}/translations/${languageCode}`, data);
      return response.data;
    } catch (error) {
      console.error('Error saving translation:', error);
      throw error;
    }
  },

  /**
   * Actualizar traducción existente
   */
  async updateTranslation(
    eventId: number,
    languageCode: string,
    data: TranslationData
  ): Promise<ApiResponse<EventTranslation>> {
    try {
      const response = await api.put(`/events/${eventId}/translations/${languageCode}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating translation:', error);
      throw error;
    }
  },

  /**
   * Eliminar traducción
   */
  async deleteTranslation(eventId: number, languageCode: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/events/${eventId}/translations/${languageCode}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting translation:', error);
      throw error;
    }
  },

  /**
   * Generar slug automático basado en el nombre
   */
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Eliminar guiones duplicados
      .replace(/^-|-$/g, ''); // Eliminar guiones al inicio y final
  },

  /**
   * Validar datos de traducción
   */
  validateTranslationData(data: TranslationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push('El nombre es requerido');
    }

    if (!data.slug?.trim()) {
      errors.push('El slug es requerido');
    }

    if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
      errors.push('El slug solo puede contener letras minúsculas, números y guiones');
    }

    if (data.seoTitle && data.seoTitle.length > 60) {
      errors.push('El título SEO no puede exceder 60 caracteres');
    }

    if (data.seoDescription && data.seoDescription.length > 160) {
      errors.push('La descripción SEO no puede exceder 160 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
