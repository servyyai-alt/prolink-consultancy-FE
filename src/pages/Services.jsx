import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { serviceAPI } from '../services/api'
import { getServiceIcon } from '../constants/serviceIcons'
import { getServiceRoute } from '../utils/serviceRoutes'

const FALLBACK = [
  { slug: 'job-consultancy', name: 'Job Consultancy', shortDescription: 'End-to-end recruitment solutions' },
  { slug: 'campus-drive', name: 'Campus Drive', shortDescription: 'College-to-company placement drives' },
  { slug: 'background-verification', name: 'Background Verification', shortDescription: 'Comprehensive background checks' },
]

export default function Services() {
  const { data } = useQuery({ queryKey: ['services'], queryFn: serviceAPI.getServices })
  const services = data?.data?.data?.services?.length ? data.data.data.services : FALLBACK

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
            <p className="text-primary-200 text-lg max-w-2xl mx-auto">Focused consultancy services for hiring, campus recruitment, and candidate verification across India</p>
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
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 via-white to-primary-50 text-[#8B2A0F] shadow-[0_12px_30px_rgba(139,42,15,0.14)] ring-1 ring-white/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:from-[#8B2A0F] group-hover:via-[#a13a18] group-hover:to-[#5c1c09] group-hover:text-white group-hover:shadow-[0_16px_38px_rgba(139,42,15,0.28)] dark:from-amber-400/20 dark:via-stone-900 dark:to-stone-900 dark:text-amber-300 dark:ring-white/10 dark:group-hover:from-amber-400 dark:group-hover:via-amber-500 dark:group-hover:to-[#8B2A0F]">
                      <Icon className="h-7 w-7 drop-shadow-sm" strokeWidth={1.9} />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-white">{service.name}</h3>
                      <p className="text-sm leading-relaxed text-slate-500">{service.shortDescription || service.description}</p>
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
