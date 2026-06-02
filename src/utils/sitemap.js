export const publicRoutes = [
  '/',
  '/about',
  '/services',
  '/jobs',
  '/blogs',
  '/contact',
  '/cv-writing',
  '/campus-drive',
  '/events',
  '/catering',
  '/testimonials',
  '/brochures',
  '/terms',
  '/privacy',
]

export const excludedSitemapPatterns = [
  /^\/admin(\/|$)/,
  /^\/dashboard(\/|$)/,
  /^\/employer(\/|$)/,
  /^\/login\/?$/,
  /^\/register\/?$/,
  /^\/api(\/|$)/,
]

export const shouldIncludeInSitemap = (path = '/') =>
  !excludedSitemapPatterns.some((pattern) => pattern.test(path))
