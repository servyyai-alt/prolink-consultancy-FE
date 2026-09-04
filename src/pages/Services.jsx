import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'
import { Briefcase } from 'lucide-react'
import { serviceAPI } from '../services/api'
import { getServiceIcon } from '../constants/serviceIcons'
import { getServiceRoute } from '../utils/serviceRoutes'
import SEO from '../components/SEO'
import { mergeServiceCatalog } from '../utils/seoContent'
import { webPageSchema } from '../utils/schema'

export default function Services() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['services'], queryFn: () => serviceAPI.getServices() })
  const services = mergeServiceCatalog(data?.data?.data?.services || [])

  return (
    <>
      <SEO
        title="Recruitment & Staffing Services in Odisha | ProLink Consultancy"
        description="Explore job consultancy, permanent staffing, temporary staffing, contract staffing, CV writing, campus drive, background verification, and HR outsourcing services."
        keywords="recruitment and staffing services, job consultancy, permanent staffing, temporary staffing, contract staffing, CV writing, HR outsourcing"
        schemas={[
          webPageSchema({
            name: 'Recruitment & Staffing Services in Odisha',
            description:
              'Explore job consultancy, permanent staffing, temporary staffing, contract staffing, CV writing, campus drive, background verification, and HR outsourcing services.',
          }),
        ]}
      />
      <div className="pt-16">
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 py-16">
          <div className="page-container text-center">
            <h1 className="text-4xl font-display font-bold text-white mb-3">Recruitment & Staffing Services</h1>
            <p className="text-primary-200 text-lg max-w-2xl mx-auto">Job consultancy, permanent staffing, temporary staffing, contract staffing, CV writing, HR outsourcing, and placement support across Odisha and India.</p>
          </div>
        </div>
        <div className="page-container py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl border border-slate-200/70 bg-white/50 p-7 shadow-sm animate-pulse dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <div className="h-14 w-14 rounded-2xl bg-slate-200 dark:bg-slate-800 mb-4" />
                  <div className="h-5 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800 mb-3" />
                  <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800 mb-2" />
                  <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              ))}
            </div>
          ) : isError || services.length === 0 ? (
            <div className="mx-auto max-w-md rounded-3xl border border-slate-200/80 bg-white/90 p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Briefcase className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No data available</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                No services are currently available. Please check back later.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </>
  )
}
