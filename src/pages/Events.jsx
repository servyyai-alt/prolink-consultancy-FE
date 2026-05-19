import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { contactAPI } from '../services/api'
import toast from 'react-hot-toast'
import { HiCheckCircle } from 'react-icons/hi'

const EVENT_TYPES = ['Corporate Event','Conference / Seminar','Product Launch','Team Outing','Exhibition','Award Ceremony','Other']
const PACKAGES = [
  { name:'Silver', price:49999, features:['Up to 100 guests','Basic décor','Catering (veg)','AV setup','1 coordinator'] },
  { name:'Gold',   price:99999, features:['Up to 250 guests','Premium décor','Catering (veg + non-veg)','Full AV + lighting','2 coordinators','Photography'], isPopular:true },
  { name:'Platinum',price:199999,features:['Unlimited guests','Luxury décor','Gourmet catering','Full production','Dedicated team','Photo + video','Post-event report'] },
]

export default function Events() {
  const formik = useFormik({
    initialValues: { name:'', email:'', phone:'', eventType:'', date:'', guests:'', message:'' },
    validationSchema: Yup.object({ name:Yup.string().required(), email:Yup.string().email().required(), phone:Yup.string().required(), eventType:Yup.string().required() }),
    onSubmit: async (v, { resetForm }) => {
      try {
        await contactAPI.submit({ ...v, subject:`Event Inquiry: ${v.eventType}`, service:'Event Management', message: `Guests: ${v.guests}, Date: ${v.date}. ${v.message}` })
        toast.success('Inquiry received! Our events team will contact you within 24 hours.')
        resetForm()
      } catch { toast.error('Failed. Please try again.') }
    },
  })

  return (
    <>
      <Helmet>
        <title>Event Management | ProLink Consultancy</title>
        <meta name="description" content="ProLink Event Management — corporate events, conferences, product launches and more. End-to-end planning across India." />
      </Helmet>
      <div className="pt-16">
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 py-16">
          <div className="page-container text-center">
            <h1 className="text-4xl font-display font-bold text-white mb-3">Event Management</h1>
            <p className="text-primary-200 text-lg max-w-xl mx-auto">From intimate gatherings to large-scale corporate events — we handle it all, flawlessly.</p>
          </div>
        </div>
        {/* Packages */}
        <div className="section-padding bg-slate-50 dark:bg-slate-950">
          <div className="page-container">
            <div className="text-center mb-12"><h2 className="section-heading">Event <span className="gradient-text">Packages</span></h2></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {PACKAGES.map((pkg, i) => (
                <motion.div key={pkg.name} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }}
                  className={`card p-7 flex flex-col relative ${pkg.isPopular?'border-2 border-primary-500 shadow-primary':''}`}>
                  {pkg.isPopular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">⭐ Most Popular</div>}
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">{pkg.name}</h3>
                  <p className="text-3xl font-display font-bold text-primary-600 my-3">₹{(pkg.price/1000).toFixed(0)}K<span className="text-sm font-normal text-slate-500"> onwards</span></p>
                  <ul className="space-y-2 flex-1 mb-6">
                    {pkg.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><HiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{f}</li>)}
                  </ul>
                  <a href="#inquiry" className={pkg.isPopular?'btn-primary text-center py-3':'btn-secondary text-center py-3'}>Book Now</a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        {/* Inquiry form */}
        <div id="inquiry" className="section-padding bg-white dark:bg-slate-900">
          <div className="page-container max-w-2xl mx-auto">
            <div className="text-center mb-8"><h2 className="section-heading">Book a <span className="gradient-text">Consultation</span></h2></div>
            <div className="card p-8">
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{n:'name',l:'Your Name',p:'Full name'},{n:'email',l:'Email',t:'email',p:'you@company.com'},{n:'phone',l:'Phone',t:'tel',p:'98765 43210'},{n:'guests',l:'Expected Guests',t:'number',p:'100'}].map(({n,l,p,t='text'}) => (
                    <div key={n}><label className="label">{l}</label>
                      <input {...formik.getFieldProps(n)} type={t} placeholder={p} className={`input-field ${formik.touched[n]&&formik.errors[n]?'border-red-400':''}`} />
                      {formik.touched[n]&&formik.errors[n]&&<p className="mt-1 text-xs text-red-500">{formik.errors[n]}</p>}
                    </div>
                  ))}
                  <div><label className="label">Event Type</label>
                    <select {...formik.getFieldProps('eventType')} className={`input-field ${formik.touched.eventType&&formik.errors.eventType?'border-red-400':''}`}>
                      <option value="">Select event type</option>
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Preferred Date</label><input {...formik.getFieldProps('date')} type="date" className="input-field" /></div>
                  <div className="sm:col-span-2"><label className="label">Additional Details</label>
                    <textarea {...formik.getFieldProps('message')} rows={3} placeholder="Venue preference, special requirements…" className="input-field resize-none" />
                  </div>
                </div>
                <button type="submit" disabled={formik.isSubmitting} className="btn-primary w-full py-3.5">
                  {formik.isSubmitting?'Sending…':'Send Event Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
