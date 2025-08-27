import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LANGUAGES = ['es', 'en', 'pt', 'vi', 'th', 'id'];
const DEFAULT_LANGUAGE = 'es';

// Mapeo de rutas por idioma
const ROUTE_MAPPINGS: Record<string, Record<string, string>> = {
  eventos: {
    es: 'eventos',
    en: 'events', 
    pt: 'eventos',
    vi: 'su-kien',
    th: 'events',
    id: 'acara'
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignorar archivos estáticos, API routes y rutas del dashboard admin
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/admin') ||     // Excluir rutas del admin
    pathname.startsWith('/dashboard') ||  // Excluir rutas del dashboard
    pathname.includes('/dashboard/') ||   // Excluir rutas que contengan dashboard
    pathname.includes('/admin/') ||       // Excluir rutas que contengan admin
    pathname.includes('.') ||
    pathname.startsWith('/locales')
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  
  // Si no hay segmentos o el primer segmento no es un idioma
  if (segments.length === 0 || !SUPPORTED_LANGUAGES.includes(segments[0])) {
    // Redirigir a la versión con idioma por defecto
    const newUrl = new URL(`/${DEFAULT_LANGUAGE}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  const language = segments[0];
  
  // Si es la página de inicio con idioma, mostrar directamente
  if (segments.length === 1) {
    return NextResponse.rewrite(new URL(`/${language}`, request.url));
  }

  // Manejar rutas de eventos
  if (segments.length === 3) {
    const [lang, route, slug] = segments;
    
    // Verificar si es una ruta de eventos válida para el idioma
    const eventRoutes = Object.values(ROUTE_MAPPINGS.eventos);
    if (eventRoutes.includes(route)) {
      // Reescribir a la estructura de carpetas de Next.js
      return NextResponse.rewrite(new URL(`/${lang}/eventos/${slug}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - locales (translation files)
     * - admin (admin routes)
     * - dashboard (admin dashboard routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|locales|admin|.*dashboard.*).*)',
  ],
};
