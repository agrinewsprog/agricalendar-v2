/**
 * Utilidades para manejo de imágenes en el frontend admin
 */

/**
 * Obtiene la URL base del frontend público para acceder a las imágenes
 */
export const getPublicBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Cliente: usar la URL del frontend público
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:3000'
      : 'https://agricalendar.net';
  }
  
  // Servidor: usar variable de entorno o default
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

/**
 * Genera la URL completa para una imagen de evento
 * @param imageName - Nombre del archivo de imagen
 * @returns URL completa de la imagen
 */
export const getEventImageUrl = (imageName: string | null | undefined): string | null => {
  if (!imageName) return null;
  
  const baseUrl = getPublicBaseUrl();
  return `${baseUrl}/images/eventos/${imageName}`;
};
