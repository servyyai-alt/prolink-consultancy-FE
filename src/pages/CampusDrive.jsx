import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { contactAPI } from '../services/api'
import toast from 'react-hot-toast'
import { HiCheckCircle, HiAcademicCap, HiBriefcase, HiCalendar } from 'react-icons/hi'
import { requiredIndianMobileSchema, sanitizeIndianMobileInput } from '../utils/phoneValidation'

const STATS = [{ v:'500+', l:'Colleges Partnered' },{ v:'200+', l:'Companies Hiring' },{ v:'15,000+', l:'Students Placed' },{ v:'92%', l:'Placement Rate' }]

export default function CampusDrive() {
  const formik = useFormik({
    initialValues: { name:'', email:'', phone:'', collegeName:'', message:'' },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      phone: requiredIndianMobileSchema('Phone number is required'),
      collegeName: Yup.string().required('College name is required'),
    }),
    onSubmit: async (v, { resetForm }) => {
      try {
        await contactAPI.submit({ ...v, subject:'Campus Drive Registration', service:'Campus Drive' })
        toast.success('Registration submitted! We will be in touch soon.')
        resetForm()
      } catch { toast.error('Failed. Please try again.') }
    },
  })

  return (
    <>
      <Helmet>
        <title>Campus Drive | ProLink Consultancy</title>
        <meta name="description" content="Register your college for campus drives and placement support. ProLink connects 500+ colleges with 200+ hiring companies." />
      </Helmet>
      <div className="pt-16">
        <div className="bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="page-container relative text-center">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm font-semibold mb-5">🎓 Campus Recruitment</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">Bridging <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">Colleges & Companies</span></h1>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">ProLink organises pan-India campus drives connecting fresh graduates with top employers across every industry.</p>
            </motion.div>
          </div>
        </div>
        {/* Stats */}
        <div className="bg-white dark:bg-slate-900 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="page-container grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ v, l }) => (
              <div key={l} className="text-center">
                <p className="text-3xl font-display font-bold text-primary-600">{v}</p>
                <p className="text-slate-500 text-sm mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Main content */}
        <div className="section-padding bg-slate-50 dark:bg-slate-950">
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">How Campus Drive Works</h2>
                <div className="space-y-5">
                  {[
                    { icon: HiAcademicCap, title:'College Registration', desc:'Register your institution and share placement requirements' },
                    { icon: HiBriefcase, title:'Company Matching', desc:'We match your students with relevant hiring companies' },
                    { icon: HiCalendar, title:'Drive Scheduling', desc:'We coordinate and organise the entire placement drive' },
                    { icon: HiCheckCircle, title:'Placement Success', desc:'Support from offer letter to onboarding' },
                  ].map(({ icon:Icon, title, desc }, i) => (
                    <div key={title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0 text-primary-600"><Icon className="w-5 h-5" /></div>
                      <div><p className="font-bold text-slate-900 dark:text-white">{title}</p><p className="text-slate-500 text-sm">{desc}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Registration form */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-5">Register Your College</h3>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  {[{n:'name',l:'Contact Person',p:'Your name'},{n:'email',l:'Email',p:'you@college.edu',t:'email'},{n:'phone',l:'Phone',p:'98765 43210',t:'tel'},{n:'collegeName',l:'College / University Name',p:'e.g. IIT Madras'}].map(({n,l,p,t='text'}) => (
                    <div key={n}><label className="label">{l}</label>
                      <input
                        {...formik.getFieldProps(n)}
                        type={t}
                        placeholder={p}
                        maxLength={n === 'phone' ? 10 : undefined}
                        onInput={(e) => {
                          if (n === 'phone') e.target.value = sanitizeIndianMobileInput(e.target.value)
                        }}
                        className={`input-field ${formik.touched[n]&&formik.errors[n]?'border-red-400':''}`}
                      />
                      {formik.touched[n]&&formik.errors[n]&&<p className="mt-1 text-xs text-red-500">{formik.errors[n]}</p>}
                    </div>
                  ))}
                  <div><label className="label">Requirements / Message</label>
                    <textarea {...formik.getFieldProps('message')} rows={3} placeholder="Branches, batch size, preferred companies…" className="input-field resize-none" />
                  </div>
                  <button type="submit" disabled={formik.isSubmitting} className="btn-primary w-full py-3">
                    {formik.isSubmitting?'Submitting…':'Register Now'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
