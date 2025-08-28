/**
 * Utility for handling admin routes with proper basePath in production
 */

/**
 * Utility for handling admin routes with proper basePath in production
 */

/**
 * Utility for handling admin routes with proper basePath in production
 */

// Get the base path for admin routes
const getAdminBasePath = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: if we're NOT on localhost, we need /admin prefix
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    return isLocalhost ? '' : '/admin';
  }
  
  // Server-side: use environment variable
  return process.env.NODE_ENV === 'production' ? '/admin' : '';
};

/**
 * Creates a properly formatted admin route for router navigation
 * For Next.js router.push(), we DON'T add basePath as Next.js handles it automatically
 * @param path - The path relative to admin (e.g., '/dashboard/events')
 * @returns Path for router navigation (without basePath)
 */
export const createAdminRoute = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanPath;
};

/**
 * Creates a properly formatted admin route for direct navigation (window.location, <a href>)
 * For direct navigation, we DO need to add basePath manually
 * @param path - The path relative to admin (e.g., '/dashboard/events')
 * @returns Full path with basePath for direct navigation
 */
export const createAdminRouteWithBasePath = (path: string): string => {
  const basePath = getAdminBasePath();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const result = `${basePath}${cleanPath}`;
  
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('🔍 createAdminRouteWithBasePath Debug:', {
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      inputPath: path,
      basePath: basePath,
      result: result
    });
  }
  
  return result;
};

/**
 * Navigate to an admin route using Next.js router
 * @param router - Next.js router instance
 * @param path - The path relative to admin
 */
export const navigateToAdminRoute = (router: any, path: string): void => {
  const routePath = createAdminRoute(path);
  router.push(routePath);
};

/**
 * Redirect to an admin route using window.location
 * @param path - The path relative to admin
 */
export const redirectToAdminRoute = (path: string): void => {
  const fullPath = createAdminRouteWithBasePath(path);
  window.location.href = fullPath;
};

// Common admin routes
export const ADMIN_ROUTES = {
  DASHBOARD: '/dashboard',
  EVENTS: '/dashboard/events',
  EVENTS_CREATE: '/dashboard/events/create',
  EVENTS_EDIT: (id: string) => `/dashboard/events/edit/${id}`,
  LANGUAGES: '/dashboard/languages',
  USERS: '/dashboard/users',
  STATS: '/dashboard/stats',
  ANALYTICS: '/dashboard/analytics',
  SETTINGS: '/dashboard/settings',
} as const;
