import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import { serviceAPI, contactAPI } from '../services/api'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

export default function ServiceDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useQuery({ queryKey: ['service', slug], queryFn: () => serviceAPI.getService(slug) })
  const service = data?.data?.data?.service

  const formik = useFormik({
    initialValues: { name:'', email:'', phone:'', message:'' },
    validationSchema: Yup.object({ name: Yup.string().required(), email: Yup.string().email().required(), message: Yup.string().min(10).required() }),
    onSubmit: async (v, { resetForm }) => {
      try {
        await contactAPI.submit({ ...v, subject: `Inquiry: ${service?.name}`, service: service?.name })
        toast.success('Inquiry submitted! We will contact you soon.')
        resetForm()
      } catch { toast.error('Failed. Please try again.') }
    },
  })

  if (isLoading) return <div className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>

  if (!service) return (
    <div className="pt-20 min-h-screen flex items-center justify-center text-center">
      <div><div className="text-6xl mb-4">⚠️</div><h2 className="text-xl font-bold mb-2">Service Not Found</h2><Link to="/services" className="btn-primary mt-4">All Services</Link></div>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{service.name} | ProLink Consultancy</title>
        <meta name="description" content={service.shortDescription} />
      </Helmet>
      <div className="pt-16">
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 py-16">
          <div className="page-container">
            <Link to="/services" className="inline-flex items-center gap-1.5 text-primary-200 hover:text-white mb-6 text-sm transition-colors"><HiArrowLeft className="w-4 h-4" />All Services</Link>
            <div className="flex items-center gap-4">
              <div className="text-5xl">{service.icon}</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{service.name}</h1>
                <p className="text-primary-200 mt-1">{service.shortDescription}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="page-container py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {service.description && (
                <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
                  <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4">Overview</h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{service.description}</p>
                </motion.div>
              )}
              {service.features?.length > 0 && (
                <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}>
                  <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-5">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map(f => (
                      <div key={f.title} className="card p-5 flex gap-3">
                        <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div><p className="font-bold text-slate-900 dark:text-white text-sm">{f.title}</p><p className="text-slate-500 text-xs mt-0.5">{f.description}</p></div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {service.pricing?.length > 0 && (
                <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
                  <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-5">Pricing Plans</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {service.pricing.map(p => (
                      <div key={p.plan} className={`card p-5 ${p.isPopular ? 'border-2 border-primary-500' : ''}`}>
                        {p.isPopular && <span className="text-xs font-bold text-primary-600 mb-2 block">⭐ Popular</span>}
                        <h3 className="font-bold text-slate-900 dark:text-white">{p.plan}</h3>
                        <p className="text-2xl font-display font-bold text-primary-600 my-2">₹{p.price?.toLocaleString()}</p>
                        <ul className="space-y-1.5 mt-3">
                          {p.features?.map(f => <li key={f} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300"><HiCheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />{f}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {service.faqs?.length > 0 && (
                <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
                  <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-5">FAQs</h2>
                  <div className="space-y-3">
                    {service.faqs.map(faq => (
                      <details key={faq.question} className="card p-5 group">
                        <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer text-sm flex items-center justify-between">
                          {faq.question}<HiArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                        </summary>
                        <p className="mt-3 text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            {/* Inquiry form */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}>
              <div className="card p-6 sticky top-24">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-5">Get a Free Consultation</h3>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  {[{n:'name',l:'Your Name',t:'text',p:'Full name'},{n:'email',l:'Email',t:'email',p:'you@example.com'},{n:'phone',l:'Phone',t:'tel',p:'98765 43210'}].map(({n,l,t,p}) => (
                    <div key={n}><label className="label text-sm">{l}</label>
                      <input {...formik.getFieldProps(n)} type={t} placeholder={p} className={`input-field text-sm ${formik.touched[n]&&formik.errors[n]?'border-red-400':''}`} />
                      {formik.touched[n]&&formik.errors[n]&&<p className="mt-1 text-xs text-red-500">{formik.errors[n]}</p>}
                    </div>
                  ))}
                  <div><label className="label text-sm">Message</label>
                    <textarea {...formik.getFieldProps('message')} rows={4} placeholder="Tell us about your requirement…" className={`input-field resize-none text-sm ${formik.touched.message&&formik.errors.message?'border-red-400':''}`} />
                    {formik.touched.message&&formik.errors.message&&<p className="mt-1 text-xs text-red-500">{formik.errors.message}</p>}
                  </div>
                  <button type="submit" disabled={formik.isSubmitting} className="btn-primary w-full py-3">
                    {formik.isSubmitting?'Sending…':'Send Inquiry'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
