import { getAbsoluteUrl, getDefaultImage, getSiteUrl, SITE_NAME, truncateText } from './seo'

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: getSiteUrl(),
  logo: getDefaultImage(),
  sameAs: [],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  ],
})

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: getSiteUrl(),
  potentialAction: {
    '@type': 'SearchAction',
    target: `${getSiteUrl()}/jobs?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
})

export const breadcrumbSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: getAbsoluteUrl(item.url),
  })),
})

export const articleSchema = (blog = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: blog.metaTitle || blog.title,
  description: truncateText(blog.metaDescription || blog.excerpt || blog.content, 155),
  image: blog.thumbnail?.url ? [blog.thumbnail.url] : [getDefaultImage()],
  datePublished: blog.publishedAt || blog.createdAt,
  dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
  author: {
    '@type': 'Person',
    name: `${blog.author?.firstName || ''} ${blog.author?.lastName || ''}`.trim() || SITE_NAME,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: getDefaultImage(),
    },
  },
  mainEntityOfPage: getAbsoluteUrl(`/blogs/${blog.slug}`),
})

export const jobPostingSchema = (job = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: truncateText(job.description, 5000),
  datePosted: job.createdAt,
  validThrough: job.deadline,
  employmentType: job.type?.toUpperCase?.(),
  hiringOrganization: {
    '@type': 'Organization',
    name: job.company?.name || SITE_NAME,
    sameAs: job.company?.website,
    logo: job.company?.logo || getDefaultImage(),
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: job.district || job.location,
      addressRegion: job.state || undefined,
      streetAddress: job.address || undefined,
      addressCountry: 'IN',
    },
  },
  baseSalary: job.salary?.isVisible && job.salary?.min ? {
    '@type': 'MonetaryAmount',
    currency: job.salary.currency || 'INR',
    value: {
      '@type': 'QuantitativeValue',
      minValue: job.salary.min,
      maxValue: job.salary.max,
      unitText: job.salary.period || 'YEAR',
    },
  } : undefined,
})

export const serviceSchema = (service = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  description: truncateText(service.metaDescription || service.shortDescription || service.description, 500),
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: getSiteUrl(),
  },
  areaServed: 'IN',
  url: getAbsoluteUrl(`/services/${service.slug}`),
})
