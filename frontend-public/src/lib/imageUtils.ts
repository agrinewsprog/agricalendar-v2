/**
 * Utilidades para manejo de imágenes
 */

/**
 * Obtiene la URL base del API
 */
export const getAPIBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Cliente: usar la URL actual
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:4000'
      : 'https://agricalendar.net/api';
  }
  
  // Servidor: usar variable de entorno o default
  return process.env.API_URL || 'http://localhost:4000';
};

/**
 * Genera la URL completa para una imagen de evento
 * @param imageName - Nombre del archivo de imagen
 * @returns URL completa de la imagen
 */
export const getEventImageUrl = (imageName: string | null | undefined): string | null => {
  if (!imageName) return null;
  
  const baseUrl = getAPIBaseUrl();
  return `${baseUrl}/public/images/eventos/${imageName}`;
};
