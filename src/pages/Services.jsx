import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { serviceAPI } from '../services/api'

const FALLBACK = [
  { slug: 'job-consultancy', name: 'Job Consultancy', icon: '💼', shortDescription: 'End-to-end recruitment solutions' },
  { slug: 'cv-writing', name: 'CV Writing', icon: '📄', shortDescription: 'ATS-optimised resumes that get you shortlisted' },
  { slug: 'campus-drive', name: 'Campus Drive', icon: '🎓', shortDescription: 'College-to-company placement drives' },
  { slug: 'housekeeping', name: 'House Keeping', icon: '🏠', shortDescription: 'Professional housekeeping staff placement' },
  { slug: 'catering', name: 'Catering Services', icon: '🍽️', shortDescription: 'Indoor & outdoor catering for all occasions' },
  { slug: 'event-management', name: 'Event Management', icon: '🎉', shortDescription: 'Corporate and personal event planning' },
  { slug: 'plant-setup', name: 'Plant Set-Up', icon: '🏭', shortDescription: 'Industrial staffing for plant operations' },
  { slug: 'background-verification', name: 'Background Verification', icon: '🔍', shortDescription: 'Comprehensive background checks' },
  { slug: 'hr-outsourcing', name: 'HR Outsourcing', icon: '👥', shortDescription: 'Full-spectrum HR services for businesses' },
]

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.slug || s._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link to={s.slug === 'cv-writing' ? '/cv-writing' : s.slug === 'campus-drive' ? '/campus-drive' : s.slug === 'catering' ? '/catering' : s.slug === 'event-management' ? '/events' : `/services/${s.slug}`}
                  className="card-hover p-7 flex flex-col gap-4 h-full group">
                  <div className="text-4xl">{s.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">{s.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.shortDescription}</p>
                  </div>
                  <span className="text-primary-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <HiArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
