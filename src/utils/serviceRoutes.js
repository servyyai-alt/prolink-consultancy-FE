export function getServiceRoute(slug = '') {
  if (!slug) return '/services'
  return slug === 'campus-drive' ? '/campus-drive' : `/services/${slug}`
}
