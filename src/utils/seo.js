import webLogo from '../assets/web-logo.jpeg'

export const SITE_NAME = 'ProLink Consultancy'
export const DEFAULT_SITE_URL = 'https://prolinkconsultancy.in'

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
    title: 'ProLink Consultancy | Jobs, Staffing & HR Solutions',
    description:
      'ProLink Consultancy connects job seekers, employers, colleges, and businesses through recruitment, HR, CV writing, campus drive, event, and catering solutions.',
    keywords: 'ProLink Consultancy, jobs in India, staffing agency, HR consultancy, recruitment services',
    robots: 'index,follow',
  },
  routes: {
    '/': {
      title: 'ProLink Consultancy | Jobs, Staffing & HR Solutions',
      description:
        'Find jobs, hire talent, improve resumes, organize campus drives, and access business services with ProLink Consultancy.',
      keywords: 'jobs, staffing, recruitment, HR consultancy, career services',
    },
    '/about': {
      title: 'About ProLink Consultancy | Recruitment & HR Partner',
      description:
        'Learn about ProLink Consultancy, a trusted partner for recruitment, HR outsourcing, campus hiring, and career growth services.',
      keywords: 'about ProLink, recruitment consultancy, HR partner',
    },
    '/services': {
      title: 'Consultancy Services | ProLink Consultancy',
      description:
        'Explore ProLink services including job consultancy, CV writing, campus drives, event management, catering, background verification, and HR outsourcing.',
      keywords: 'consultancy services, job placement, CV writing, campus drive, background verification',
    },
    '/jobs': {
      title: 'Browse Jobs in India | ProLink Consultancy',
      description:
        'Search active job openings by title, company, category, location, experience, salary, and work mode with ProLink Consultancy.',
      keywords: 'jobs in India, job openings, hiring, careers, recruitment',
    },
    '/blogs': {
      title: 'Career Blog | ProLink Consultancy',
      description:
        'Read career advice, resume writing tips, interview preparation guides, salary insights, and HR updates from ProLink Consultancy.',
      keywords: 'career blog, resume tips, interview tips, HR insights, salary guide',
    },
    '/contact': {
      title: 'Contact ProLink Consultancy | Hiring & Career Support',
      description:
        'Contact ProLink Consultancy for recruitment, job placement, HR services, CV writing, campus drives, events, and catering enquiries.',
      keywords: 'contact ProLink, recruitment enquiry, HR service enquiry',
    },
    '/cv-writing': {
      title: 'Professional CV Writing Services | ProLink Consultancy',
      description:
        'Get ATS-friendly CV writing support, resume optimization, and career profile improvements from ProLink Consultancy.',
      keywords: 'CV writing, resume writing, ATS resume, career profile',
    },
    '/campus-drive': {
      title: 'Campus Drive & Placement Services | ProLink Consultancy',
      description:
        'Plan structured campus drives, college placement programs, and fresher hiring campaigns with ProLink Consultancy.',
      keywords: 'campus drive, college placement, fresher hiring, placement services',
    },
    '/events': {
      title: 'Event Management Services | ProLink Consultancy',
      description:
        'Organize corporate events, recruitment events, campus programs, and business gatherings with ProLink Consultancy.',
      keywords: 'event management, corporate events, recruitment events',
    },
    '/catering': {
      title: 'Catering Services | ProLink Consultancy',
      description:
        'Book catering support for corporate events, campus programs, business meetings, and special occasions.',
      keywords: 'catering services, corporate catering, event catering',
    },
    '/testimonials': {
      title: 'Client Testimonials | ProLink Consultancy',
      description:
        'Read testimonials from candidates, employers, and partners who have worked with ProLink Consultancy.',
      keywords: 'ProLink testimonials, client reviews, recruitment reviews',
    },
    '/brochures': {
      title: 'Brochures | ProLink Consultancy',
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
