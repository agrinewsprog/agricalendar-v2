/**
 * Utility for handling admin routes with proper basePath in production
 */

// Get the base path for admin routes
const getAdminBasePath = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: check if we're in production
    return window.location.hostname !== 'localhost' ? '/admin' : '';
  }
  
  // Server-side: use environment
  return process.env.NODE_ENV === 'production' ? '/admin' : '';
};

/**
 * Creates a properly formatted admin route
 * @param path - The path relative to admin (e.g., '/dashboard/events')
 * @returns Full path with basePath in production
 */
export const createAdminRoute = (path: string): string => {
  const basePath = getAdminBasePath();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
};

/**
 * Navigate to an admin route using Next.js router
 * @param router - Next.js router instance
 * @param path - The path relative to admin
 */
export const navigateToAdminRoute = (router: any, path: string): void => {
  const fullPath = createAdminRoute(path);
  router.push(fullPath);
};

/**
 * Redirect to an admin route using window.location
 * @param path - The path relative to admin
 */
export const redirectToAdminRoute = (path: string): void => {
  const fullPath = createAdminRoute(path);
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
