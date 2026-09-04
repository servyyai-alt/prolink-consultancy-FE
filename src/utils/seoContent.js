export const SITE_ADDRESS =
  'Plot no 3010, Cuttack - Puri Bypass, Palasuni Rasulagarh, Bhubaneswar, Odisha 751025, India'

export const PUBLIC_SERVICE_FALLBACKS = [
  {
    slug: 'job-consultancy',
    name: 'Job Consultancy',
    shortDescription: 'Recruitment consultant jobs, job placement agency support, and professional hiring guidance.',
  },
  {
    slug: 'permanent-staffing',
    name: 'Permanent Staffing',
    shortDescription: 'Permanent staffing solutions for long-term hires and stable team growth.',
  },
  {
    slug: 'temporary-staffing',
    name: 'Temporary Staffing',
    shortDescription: 'Temporary staffing agencies and flexible hiring support for short-term needs.',
  },
  {
    slug: 'contract-staffing',
    name: 'Contract Staffing',
    shortDescription: 'Contract staffing solutions for project teams and specialist roles.',
  },
  {
    slug: 'cv-writing',
    name: 'CV Writing Services',
    shortDescription: 'Professional CV writing services and ATS-friendly resume support.',
  },
  {
    slug: 'hr-outsourcing',
    name: 'HR Outsourcing',
    shortDescription: 'HR outsourcing services for payroll, onboarding, and people operations.',
  },
  {
    slug: 'background-verification',
    name: 'Background Verification',
    shortDescription: 'Candidate verification and background checks for safer hiring.',
  },
  {
    slug: 'campus-drive',
    name: 'Campus Drive',
    shortDescription: 'College placement drives and fresher hiring support.',
  },
]

export const HOME_SERVICE_CARDS = [
  {
    slug: 'job-consultancy',
    title: 'Job Consultancy',
    description: 'Job placement agency support for employers and candidates who want a cleaner hiring process.',
  },
  {
    slug: 'permanent-staffing',
    title: 'Permanent Staffing',
    description: 'Permanent staffing solutions for long-term roles, growth teams, and business-critical hires.',
  },
  {
    slug: 'temporary-staffing',
    title: 'Temporary Staffing',
    description: 'Temporary staffing agency support for seasonal demand, projects, and flexible workforce needs.',
  },
  {
    slug: 'contract-staffing',
    title: 'Contract Staffing',
    description: 'Contract staffing recruiters for specialist, project-based, and time-bound requirements.',
  },
]

const SERVICE_LIBRARY = {
  'job-consultancy': {
    name: 'Job Consultancy',
    metaTitle: 'Job Consultancy in Odisha | ProLink Consultancy',
    metaDescription:
      'Looking for a job consultancy in Bhubaneswar or Odisha? ProLink Consultancy provides professional job placement agency support, recruitment consultant jobs, and hiring guidance.',
    keywords:
      'job consultancy, recruitment consultant jobs, job placement agency, professional job consultancy, professional job placement agencies, professional job consultancy in Odisha, best job consultancy in Odisha Bhubaneswar',
    intro:
      'We pair employer hiring requirements with candidate ambition, so interviews, shortlists, and placements move faster and feel more organized.',
    highlights: [
      'Employer shortlisting support',
      'Candidate placement guidance',
      'Local hiring in Bhubaneswar and Odisha',
    ],
    relatedServices: ['permanent-staffing', 'temporary-staffing', 'contract-staffing', 'cv-writing', 'hr-outsourcing'],
  },
  'permanent-staffing': {
    name: 'Permanent Staffing',
    metaTitle: 'Permanent Staffing Solutions in Odisha | ProLink Consultancy',
    metaDescription:
      'Need a permanent staffing agency in Bhubaneswar or Odisha? ProLink Consultancy provides permanent recruitment agency support and long-term hiring solutions.',
    keywords:
      'permanent staffing agency, permanent staffing solutions, permanent recruitment agency, permanent placement staffing agency, permanent placement agencies, permanent job recruitment agencies, permanent employment agencies, permanent hiring solutions, permanent job placement agencies, permanent staffing services, permanent staffing solutions in Odisha, permanent staffing solutions in Bhubaneswar, best permanent staffing solutions, professional permanent staffing solutions',
    intro:
      'We find stable, long-term hires for teams that want dependable growth instead of short-term fixes.',
    highlights: [
      'Long-term team build-out',
      'Role fit and culture fit checks',
      'Permanent hiring in Odisha and Bhubaneswar',
    ],
    relatedServices: ['job-consultancy', 'temporary-staffing', 'contract-staffing', 'hr-outsourcing'],
  },
  'temporary-staffing': {
    name: 'Temporary Staffing',
    metaTitle: 'Temporary Staffing Agency in Odisha | ProLink Consultancy',
    metaDescription:
      'Hire a temporary staffing agency in Bhubaneswar or Odisha. ProLink Consultancy offers flexible staffing solutions for seasonal, project-based, and short-term needs.',
    keywords:
      'temporary staffing agencies, temporary work agencies, temporary placement agencies, temporary staffing agency, professional temporary staffing solutions, temporary staffing solutions, temporary recruitment agencies, best temporary staffing recruitment agency, temporary staffing companies, temporary staffing solutions in Odisha, temporary staffing solutions in Bhubaneswar, temporary staffing agency in Odisha, temporary staffing agency in Bhubaneswar',
    intro:
      'We handle urgent and flexible staffing requirements with a fast, structured process that keeps operations moving.',
    highlights: [
      'Flexible workforce planning',
      'Project and seasonal support',
      'Temporary staffing in Bhubaneswar and Odisha',
    ],
    relatedServices: ['job-consultancy', 'permanent-staffing', 'contract-staffing', 'hr-outsourcing'],
  },
  'contract-staffing': {
    name: 'Contract Staffing',
    metaTitle: 'Contract Staffing Agency in Odisha | ProLink Consultancy',
    metaDescription:
      'Looking for contract staffing solutions in Bhubaneswar or Odisha? ProLink Consultancy connects businesses with contract staffing recruiters and flexible workforce support.',
    keywords:
      'contract staffing solutions, contract staffing, best contract recruitment agency, contract staffing recruiters, contract staffing firms, professional contract staffing solutions, best contract staffing agency, contract staffing solutions agency, best contract staffing agency Odisha, best contract staffing agency Bhubaneswar',
    intro:
      'We support project teams and time-bound hiring needs with practical contract staffing solutions that are easy to manage.',
    highlights: [
      'Project-based workforce support',
      'Specialist and volume hiring',
      'Contract staffing in Odisha and Bhubaneswar',
    ],
    relatedServices: ['job-consultancy', 'permanent-staffing', 'temporary-staffing', 'hr-outsourcing'],
  },
  'cv-writing': {
    name: 'CV Writing Services',
    metaTitle: 'Professional CV Writing Services in Odisha | ProLink Consultancy',
    metaDescription:
      'Need a CV writing agency in Bhubaneswar or Odisha? ProLink Consultancy offers professional CV writing services, executive resume writing, and ATS-friendly profiles.',
    keywords:
      'professional CV writing services, CV writing service, best CV writing service, executive resume writing services, affordable CV writing services, best CV writing service for professionals, cheap CV writing services, professional CV writing agency, CV writing agency in Odisha, CV writing agency in Bhubaneswar',
    intro:
      'We turn work history into a clearer, more interview-ready story for freshers, professionals, and leaders.',
    highlights: [
      'ATS-friendly resume writing',
      'Executive profile positioning',
      'CV writing in Odisha and Bhubaneswar',
    ],
    relatedServices: ['job-consultancy', 'permanent-staffing', 'hr-outsourcing'],
  },
  'hr-outsourcing': {
    name: 'HR Outsourcing',
    metaTitle: 'HR Outsourcing Services in Odisha | ProLink Consultancy',
    metaDescription:
      'ProLink Consultancy provides HR outsourcing services in Bhubaneswar and Odisha, including outsourced HR services for small business and scalable HR support.',
    keywords:
      'HR outsourcing services, HR outsourcing agency, HR outsourcing solutions, outsourced HR services for small business, HR outsourcing contract, HR outsourcing services in Odisha, HR outsourcing services in Bhubaneswar',
    intro:
      'We keep day-to-day HR work organized so founders and managers can focus on growth.',
    highlights: [
      'Onboarding and documentation support',
      'Attendance and payroll coordination',
      'Scalable HR operations for growing teams',
    ],
    relatedServices: ['job-consultancy', 'permanent-staffing', 'contract-staffing'],
  },
  'background-verification': {
    name: 'Background Verification',
    metaTitle: 'Background Verification Services in Odisha | ProLink Consultancy',
    metaDescription:
      'Reduce hiring risk with background verification services from ProLink Consultancy. We support employment checks, identity checks, and dependable onboarding.',
    keywords:
      'background verification, candidate verification, employment verification, hiring checks, onboarding verification',
    intro:
      'We verify candidate details, reduce hiring risk, and help employers make confident onboarding decisions.',
    highlights: [
      'Employment history checks',
      'Identity and address verification',
      'Safer onboarding for employers',
    ],
    relatedServices: ['job-consultancy', 'permanent-staffing', 'hr-outsourcing'],
  },
  'campus-drive': {
    name: 'Campus Drive',
    metaTitle: 'Campus Drive & Placement Services | ProLink Consultancy',
    metaDescription:
      'Plan campus drives and placement programs with ProLink Consultancy. We connect colleges in Odisha with employers hiring fresh talent.',
    keywords:
      'campus drive, campus recruitment, college placement, placement services, fresher hiring',
    intro:
      'We coordinate registration, drive scheduling, and employer matching for colleges that want predictable placement outcomes.',
    highlights: [
      'College registration support',
      'Employer matching for fresher hiring',
      'Campus drive planning in Odisha and India',
    ],
    relatedServices: ['job-consultancy', 'cv-writing', 'hr-outsourcing'],
  },
}

const buildFaq = (question, answer) => ({ question, answer })

export function getServiceSeoContent(slug = 'job-consultancy') {
  const service = SERVICE_LIBRARY[slug]
  if (!service) return null

  return {
    slug,
    name: service.name,
    metaTitle: service.metaTitle,
    metaDescription: service.metaDescription,
    keywords: service.keywords,
    intro: service.intro,
    highlights: service.highlights,
    relatedServices: service.relatedServices,
    faqs: buildServiceFaqs(service),
  }
}

export function mergeServiceCatalog(apiServices = []) {
  if (!Array.isArray(apiServices) || apiServices.length === 0) {
    return []
  }

  const seenSlugs = new Set()
  const seenNames = new Set()
  const result = []

  for (const service of apiServices) {
    if (!service) continue
    const normSlug = (service.slug || '').toLowerCase().trim()
    const normName = (service.name || '').toLowerCase().trim()

    if (normSlug && seenSlugs.has(normSlug)) continue
    if (normName && seenNames.has(normName)) continue

    if (normSlug) seenSlugs.add(normSlug)
    if (normName) seenNames.add(normName)

    const fallback =
      PUBLIC_SERVICE_FALLBACKS.find(
        (f) =>
          f.slug === service.slug ||
          f.name.toLowerCase() === normName ||
          (f.slug === 'campus-drive' && service.slug === 'campus-recruitment-drive') ||
          (f.slug === 'cv-writing' && service.slug === 'cv-writing-services')
      ) || {}

    result.push({
      ...fallback,
      ...service,
      shortDescription:
        service.shortDescription ||
        fallback.shortDescription ||
        service.description ||
        fallback.description ||
        '',
    })
  }

  return result
}

export function buildServiceFaqs(service = {}) {
  const name = service.name || 'this service'
  const keywordLine = service.keywords || name

  return [
    buildFaq(
      `What does ${name} include?`,
      `Our ${name.toLowerCase()} support is designed around your hiring goal, role type, and delivery timeline. Depending on the service, we manage outreach, shortlisting, coordination, documentation, and follow-through so the process stays practical. The approach is tailored for businesses in Bhubaneswar, Odisha, and across India that want reliable outcomes without unnecessary complexity.`,
    ),
    buildFaq(
      `Who should use ${name.toLowerCase()}?`,
      `This service is a good fit for employers, founders, HR teams, and candidates who need a structured, professional process. If you are comparing job consultancy, permanent staffing, temporary staffing, contract staffing, CV writing, or HR outsourcing, we can help you choose the right scope and avoid paying for unnecessary add-ons.`,
    ),
    buildFaq(
      `Do you support businesses in Odisha and Bhubaneswar?`,
      `Yes. We work with organisations in Bhubaneswar, Odisha, and other Indian locations. Local market understanding matters because role expectations, candidate availability, and timelines can vary. We keep the work location-aware without overusing city names in the copy, so the message stays useful and easy to read.`,
    ),
    buildFaq(
      `How quickly can you start?`,
      `After we understand the requirement, we can usually begin quickly and set a realistic delivery plan. Timelines depend on the role, volume, and service complexity, but the goal is always to move fast while keeping quality checks in place. That balance is especially important for staffing and recruitment work where speed alone is not enough.`,
    ),
    buildFaq(
      `Can you customise the service scope?`,
      `Absolutely. Some clients need full-service support, while others only need help with shortlisting, screening, or a single hiring milestone. We tailor the scope so you only pay for the support you actually need. That flexibility is useful for permanent staffing solutions, temporary staffing solutions, contract staffing, and HR outsourcing projects.`,
    ),
    buildFaq(
      `How do you maintain quality?`,
      `We use a simple quality process that combines requirement capture, profile review, communication checks, and review points before anything is shared. This helps keep candidate fit, hiring trust, and service clarity high. It also protects the experience for teams that want a dependable manpower recruitment agency relationship rather than a transactional vendor.`,
    ),
    buildFaq(
      `Which industries do you cover?`,
      `Our team works across multiple sectors, including services, manufacturing, technology, education, healthcare, and operations-led businesses. If your role needs domain knowledge, we adjust the search and screening criteria accordingly. That makes the service practical for professional job consultancy, recruitment consultant jobs, and broader hiring needs.`,
    ),
    buildFaq(
      `How do I request a quote for ${name.toLowerCase()}?`,
      `You can contact us through the website, call the team, or send a short message with your requirement. Once we understand the scope, we can suggest the most suitable plan and explain how the service will work. Mentioning your location, timeline, and the exact ${keywordLine} need helps us give a faster and more accurate response.`,
    ),
  ]
}
