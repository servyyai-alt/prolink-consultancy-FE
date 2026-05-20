import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { serviceAPI } from '../services/api'
import { getServiceIcon } from '../constants/serviceIcons'

const FALLBACK = [
  { slug: 'job-consultancy', name: 'Job Consultancy', shortDescription: 'End-to-end recruitment solutions' },
  { slug: 'cv-writing', name: 'CV Writing', shortDescription: 'ATS-optimised resumes that get you shortlisted' },
  { slug: 'campus-drive', name: 'Campus Drive', shortDescription: 'College-to-company placement drives' },
  { slug: 'housekeeping', name: 'House Keeping', shortDescription: 'Professional housekeeping staff placement' },
  { slug: 'catering', name: 'Catering Services', shortDescription: 'Indoor & outdoor catering for all occasions' },
  { slug: 'event-management', name: 'Event Management', shortDescription: 'Corporate and personal event planning' },
  { slug: 'plant-setup', name: 'Plant Set-Up', shortDescription: 'Industrial staffing for plant operations' },
  { slug: 'background-verification', name: 'Background Verification', shortDescription: 'Comprehensive background checks' },
  { slug: 'hr-outsourcing', name: 'HR Outsourcing', shortDescription: 'Full-spectrum HR services for businesses' },
]

const getServiceRoute = (slug) => (
  slug === 'cv-writing' ? '/cv-writing'
    : slug === 'campus-drive' ? '/campus-drive'
    : slug === 'catering' ? '/catering'
    : slug === 'event-management' ? '/events'
    : `/services/${slug}`
)

export default function Services() {
  const { data } = useQuery({ queryKey: ['services'], queryFn: serviceAPI.getServices })
  const services = data?.data?.data?.services || FALLBACK

  return (
    <>
      <Helmet>
        <title>Our Services | ProLink Consultancy</title>
        <meta name="description" content="ProLink Consultancy offers 9 comprehensive services: Job Placement, CV Writing, Campus Drive, Event Management, Catering, HR Outsourcing and more." />
      </Helmet>
      <div className="pt-16">
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 py-16">
          <div className="page-container text-center">
            <h1 className="text-4xl font-display font-bold text-white mb-3">Our Services</h1>
            <p className="text-primary-200 text-lg max-w-2xl mx-auto">Comprehensive consultancy services for candidates and businesses across India</p>
          </div>
        </div>
        <div className="page-container py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = getServiceIcon(service.slug)

              return (
                <motion.div key={service.slug || service._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link
                    to={getServiceRoute(service.slug)}
                    className="card-hover group flex h-full flex-col gap-4 p-7"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100 transition-colors group-hover:bg-primary-600 group-hover:text-white group-hover:ring-primary-600 dark:bg-primary-900/20 dark:text-primary-300 dark:ring-primary-800">
                      <Icon className="h-7 w-7" strokeWidth={1.9} />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-white">{service.name}</h3>
                      <p className="text-sm leading-relaxed text-slate-500">{service.shortDescription}</p>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-primary-600 transition-all group-hover:gap-2">
                      Learn more <HiArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
