import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { getDefaultImage, getRouteSeo, getAbsoluteUrl, SITE_NAME, truncateText } from '../utils/seo'
import { organizationSchema, websiteSchema } from '../utils/schema'

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  canonical,
  type = 'website',
  robots,
  schemas = [],
  includeGlobalSchemas = false,
}) {
  const location = useLocation()
  const routeSeo = getRouteSeo(location.pathname)
  const seoTitle = title || routeSeo.title
  const seoDescription = truncateText(description || routeSeo.description, 160)
  const seoKeywords = keywords || routeSeo.keywords
  const seoImage = image || getDefaultImage()
  const seoUrl = url || routeSeo.url || getAbsoluteUrl(location.pathname)
  const seoCanonical = canonical || routeSeo.canonical || seoUrl
  const seoRobots = robots || routeSeo.robots || 'index,follow'
  const allSchemas = [
    ...(includeGlobalSchemas ? [organizationSchema(), websiteSchema()] : []),
    ...schemas,
  ].filter(Boolean)

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {seoKeywords && <meta name="keywords" content={seoKeywords} />}
      <meta name="robots" content={seoRobots} />
      {import.meta.env.VITE_GOOGLE_SITE_VERIFICATION && (
        <meta name="google-site-verification" content={import.meta.env.VITE_GOOGLE_SITE_VERIFICATION} />
      )}
      <link rel="canonical" href={seoCanonical} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:type" content={type} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {allSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
