import webLogo from '../assets/web-logo.jpeg'

export const SITE_NAME = 'ProLink Consultancy'
export const DEFAULT_SITE_URL = 'https://www.prolinkconsultancy.in'

export const getSiteUrl = () => {
  const rawUrl = import.meta.env.VITE_SITE_URL || import.meta.env.VITE_APP_URL || DEFAULT_SITE_URL
  return rawUrl.replace(/\/+$/, '')
}

export const getAbsoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalizedPath}`
}

export const getDefaultImage = () => getAbsoluteUrl(webLogo)

export const stripHtml = (value = '') =>
  String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const truncateText = (value = '', maxLength = 155) => {
  const clean = stripHtml(value)
  if (clean.length <= maxLength) return clean
  return `${clean.slice(0, maxLength - 1).trim()}...`
}

export const seoConfig = {
  default: {
    title: 'Manpower Recruitment Agency in Bhubaneswar | ProLink Consultancy',
    description:
      'ProLink Consultancy delivers recruitment and staffing services in Odisha, including manpower consultancy in Bhubaneswar, job consultancy, CV writing, and HR outsourcing.',
    keywords:
      'ProLink Consultancy, manpower recruitment agency, recruitment and staffing services, manpower consultancy in Bhubaneswar, manpower recruitment agency in Odisha',
    robots: 'index,follow',
  },
  routes: {
    '/': {
      title: 'Manpower Recruitment Agency in Bhubaneswar | ProLink Consultancy',
      description:
        'ProLink Consultancy delivers recruitment and staffing services in Odisha, including manpower consultancy in Bhubaneswar, permanent staffing, temporary staffing, contract staffing, CV writing, and HR outsourcing.',
      keywords:
        'manpower recruitment agency, recruitment and staffing services, manpower consultancy in Bhubaneswar, manpower recruitment agency in Odisha, manpower recruitment agency in Bhubaneswar',
    },
    '/about': {
      title: 'About ProLink Consultancy | Recruitment Partner in Odisha',
      description:
        'Learn how ProLink Consultancy supports recruitment consultancy, workforce planning, campus hiring, and HR solutions for businesses in Odisha and beyond.',
      keywords: 'about ProLink, recruitment consultancy, HR partner, Odisha recruitment company',
    },
    '/services': {
      title: 'Recruitment & Staffing Services in Odisha | ProLink Consultancy',
      description:
        'Explore job consultancy, permanent staffing, temporary staffing, contract staffing, CV writing, campus drive, background verification, and HR outsourcing services.',
      keywords:
        'recruitment and staffing services, job consultancy, permanent staffing, temporary staffing, contract staffing, CV writing, HR outsourcing',
    },
    '/jobs': {
      title: 'Find Jobs in India | ProLink Consultancy',
      description:
        'Search active job openings by title, company, category, location, experience, salary, and work mode with ProLink Consultancy.',
      keywords: 'jobs in India, job openings, hiring, careers, recruitment',
    },
    '/blogs': {
      title: 'Career Advice Blog | ProLink Consultancy',
      description:
        'Read career advice, resume writing tips, interview preparation guides, salary insights, and HR updates from ProLink Consultancy.',
      keywords: 'career blog, resume tips, interview tips, HR insights, salary guide',
    },
    '/contact': {
      title: 'Contact ProLink Consultancy | Bhubaneswar Staffing & HR',
      description:
        'Contact ProLink Consultancy for manpower recruitment agency support, job consultancy, CV writing, campus drives, HR outsourcing, and staffing enquiries in Odisha.',
      keywords:
        'contact ProLink, recruitment enquiry, HR service enquiry, Bhubaneswar staffing support',
    },
    '/cv-writing': {
      title: 'Professional CV Writing Services in Odisha | ProLink Consultancy',
      description:
        'Get ATS-friendly CV writing support, resume optimization, and career profile improvements from ProLink Consultancy.',
      keywords:
        'professional CV writing services, CV writing agency in Bhubaneswar, executive resume writing, ATS resume',
    },
    '/campus-drive': {
      title: 'Campus Drive & Placement Services | ProLink Consultancy',
      description:
        'Plan structured campus drives, college placement programs, and fresher hiring campaigns with ProLink Consultancy.',
      keywords: 'campus drive, college placement, fresher hiring, placement services',
    },
    '/events': {
      title: 'Event Management Services in India | ProLink Consultancy',
      description:
        'Organize corporate events, recruitment events, campus programs, and business gatherings with ProLink Consultancy.',
      keywords: 'event management, corporate events, recruitment events',
    },
    '/catering': {
      title: 'Catering Services for Corporate Events | ProLink Consultancy',
      description:
        'Book catering support for corporate events, campus programs, business meetings, and special occasions.',
      keywords: 'catering services, corporate catering, event catering',
    },
    '/testimonials': {
      title: 'Client Testimonials & Success Stories | ProLink Consultancy',
      description:
        'Read testimonials from candidates, employers, and partners who have worked with ProLink Consultancy.',
      keywords: 'ProLink testimonials, client reviews, recruitment reviews',
    },
    '/brochures': {
      title: 'Brochures & Service Guides | ProLink Consultancy',
      description:
        'View and download ProLink Consultancy brochures for services, recruitment support, and business solutions.',
      keywords: 'ProLink brochures, service brochure, consultancy brochure',
    },
    '/terms': {
      title: 'Terms and Conditions | ProLink Consultancy',
      description: 'Review the terms and conditions for using ProLink Consultancy services and digital platforms.',
      keywords: 'terms and conditions, ProLink terms',
    },
    '/privacy': {
      title: 'Privacy Policy | ProLink Consultancy',
      description: 'Learn how ProLink Consultancy collects, uses, protects, and manages your personal information.',
      keywords: 'privacy policy, data privacy, ProLink privacy',
    },
  },
}

export const privateRoutePatterns = [
  /^\/login\/?$/,
  /^\/register\/?$/,
  /^\/admin(\/|$)/,
  /^\/dashboard(\/|$)/,
  /^\/employer(\/|$)/,
  /^\/verify-otp\/?$/,
  /^\/forgot-password\/?$/,
  /^\/reset-password(\/|$)/,
  /^\/submit-testimonial\/?$/,
]

export const isPrivateRoute = (pathname = '/') =>
  privateRoutePatterns.some((pattern) => pattern.test(pathname))

export const getRouteSeo = (pathname = '/') => {
  const cleanPath = pathname.replace(/\/+$/, '') || '/'
  const matched = seoConfig.routes[cleanPath]

  if (matched) {
    return {
      ...seoConfig.default,
      ...matched,
      canonical: getAbsoluteUrl(cleanPath),
      url: getAbsoluteUrl(cleanPath),
      robots: isPrivateRoute(cleanPath) ? 'noindex,nofollow' : matched.robots || 'index,follow',
    }
  }

  const robots = isPrivateRoute(cleanPath) ? 'noindex,nofollow' : 'index,follow'
  return {
    ...seoConfig.default,
    title: robots === 'noindex,nofollow' ? `Private Area | ${SITE_NAME}` : seoConfig.default.title,
    canonical: getAbsoluteUrl(cleanPath),
    url: getAbsoluteUrl(cleanPath),
    robots,
  }
}
