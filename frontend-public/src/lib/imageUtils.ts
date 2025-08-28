/**
 * Utilidades para manejo de imágenes
 */

/**
 * Obtiene la URL base del frontend público
 */
export const getPublicBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Cliente: usar la URL actual del frontend público
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:3000'
      : 'https://agricalendar.net';
  }
  
  // Servidor: usar variable de entorno o default
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

/**
 * Genera la URL completa para una imagen de evento
 * @param imagePath - Ruta o nombre del archivo de imagen
 * @returns URL completa de la imagen
 */
export const getEventImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  const baseUrl = getPublicBaseUrl();
  
  // Si ya incluye la ruta completa (ej: "/images/eventos/file.jpg")
  if (imagePath.startsWith('/images/eventos/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // Si solo es el nombre del archivo
  return `${baseUrl}/images/eventos/${imagePath}`;
};
