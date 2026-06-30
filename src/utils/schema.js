import { getAbsoluteUrl, getDefaultImage, getSiteUrl, SITE_NAME, truncateText } from './seo'
import { SITE_ADDRESS } from './seoContent'

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

export const webPageSchema = ({ name, description, url } = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: name || SITE_NAME,
  description: truncateText(description || '', 180),
  url: url || (typeof window !== 'undefined' ? window.location.href : getSiteUrl()),
  isPartOf: {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getSiteUrl(),
  },
})

export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'EmploymentAgency',
  name: SITE_NAME,
  url: getSiteUrl(),
  logo: getDefaultImage(),
  image: getDefaultImage(),
  telephone: '+91 99370 47733',
  email: 'admin@prolinkconsultancy.in',
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_ADDRESS,
    addressLocality: 'Bhubaneswar',
    addressRegion: 'Odisha',
    postalCode: '751025',
    addressCountry: 'IN',
  },
  areaServed: ['Bhubaneswar', 'Odisha', 'India'],
  hasMap: 'https://maps.app.goo.gl/Gd4wiqyPGsTfE13Z9',
  sameAs: [],
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

export const faqSchema = (faqs = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs
    .filter((faq) => faq?.question && faq?.answer)
    .map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: truncateText(faq.answer, 1000),
      },
    })),
})
