import { MetadataRoute } from 'next';

const SUPPORTED_LANGUAGES = ['es', 'en', 'pt', 'vi', 'th', 'id'];

// Mapeo de idiomas a rutas
const LANGUAGE_ROUTES: Record<string, string> = {
  es: 'eventos',
  en: 'events',
  pt: 'eventos',
  vi: 'su-kien',
  th: 'events',
  id: 'acara',
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://agricalendar.net';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://agricalendar.net/api';

// Función para obtener eventos desde la API
async function getEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events?limit=1000`, {
      next: { revalidate: 3600 }, // Revalidar cada hora (3600 segundos)
    });
    
    if (!response.ok) {
      console.error(`Error fetching events for sitemap: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    console.log(`Sitemap: Found ${data.data?.length || 0} events`);
    return data.data || [];
  } catch (error) {
    console.error('Error in sitemap generation:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getEvents();
  const currentDate = new Date();

  // URLs estáticas base
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Agregar páginas principales en todos los idiomas
  SUPPORTED_LANGUAGES.forEach((lang) => {
    staticUrls.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  });

  // Generar URLs de eventos para cada idioma
  const eventUrls: MetadataRoute.Sitemap = [];

  events.forEach((event: any) => {
    if (!event.slug) return;

    SUPPORTED_LANGUAGES.forEach((lang) => {
      const route = LANGUAGE_ROUTES[lang] || 'events';
      
      eventUrls.push({
        url: `${BASE_URL}/${lang}/${route}/${event.slug}`,
        lastModified: event.updatedAt ? new Date(event.updatedAt) : currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  return [...staticUrls, ...eventUrls];
}
