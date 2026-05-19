import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { cateringAPI } from '../services/api'
import toast from 'react-hot-toast'
import { HiCheckCircle } from 'react-icons/hi'

const MENUS = [
  { name:'Veg Buffet',     price:350,  desc:'Per person — South Indian + North Indian veg spread',     items:['Starters (3)','Dal + Sabzi (2)','Rice + Roti','Dessert (2)','Beverages'] },
  { name:'Non-Veg Buffet', price:550,  desc:'Per person — Full spread with non-veg options',            items:['Veg + Non-veg starters','Main course (5 items)','Biryani','Dessert (3)','Beverages'] },
  { name:'Gourmet Buffet', price:950,  desc:'Per person — Premium multi-cuisine for corporate events',  items:['Live counters','Continental + Indian','Chef special desserts','Welcome drinks','Customisable menu'], isPopular:true },
]

export default function Catering() {
  const formik = useFormik({
    initialValues: { name:'', email:'', phone:'', eventDate:'', guests:'', menuType:'', venue:'', message:'' },
    validationSchema: Yup.object({ name:Yup.string().required(), email:Yup.string().email().required(), phone:Yup.string().required(), guests:Yup.number().min(10).required() }),
    onSubmit: async (v, { resetForm }) => {
      try {
        await cateringAPI.submitInquiry({ ...v, subject:`Catering Inquiry — ${v.menuType}`, service:'Catering Services', message:`Guests: ${v.guests}, Venue: ${v.venue}, Date: ${v.eventDate}. ${v.message}` })
        toast.success('Catering inquiry received! Our team will call you within 2 hours.')
        resetForm()
      } catch { toast.error('Failed. Please try again.') }
    },
  })

  return (
    <>
      <Helmet>
        <title>Catering Services | ProLink Consultancy</title>
        <meta name="description" content="Indoor and outdoor catering services for corporate events, weddings and celebrations across India. Starting ₹350 per person." />
      </Helmet>
      <div className="pt-16">
        <div className="bg-gradient-to-r from-amber-700 to-orange-800 py-16">
          <div className="page-container text-center">
            <h1 className="text-4xl font-display font-bold text-white mb-3">🍽️ Catering Services</h1>
            <p className="text-amber-100 text-lg max-w-xl mx-auto">Indoor & outdoor catering for corporate lunches, large gatherings, weddings and social events across India.</p>
          </div>
        </div>
        <div className="section-padding bg-slate-50 dark:bg-slate-950">
          <div className="page-container">
            <div className="text-center mb-12"><h2 className="section-heading">Menu <span className="gradient-text">Packages</span></h2></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {MENUS.map((m, i) => (
                <motion.div key={m.name} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }}
                  className={`card p-7 flex flex-col relative ${m.isPopular?'border-2 border-primary-500 shadow-primary':''}`}>
                  {m.isPopular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">⭐ Most Popular</div>}
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">{m.name}</h3>
                  <p className="text-3xl font-display font-bold text-amber-600 my-2">₹{m.price}<span className="text-sm text-slate-500 font-normal">/person</span></p>
                  <p className="text-slate-500 text-xs mb-4">{m.desc}</p>
                  <ul className="space-y-2 flex-1 mb-6">
                    {m.items.map(item => <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><HiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}</li>)}
                  </ul>
                  <a href="#inquiry" className={m.isPopular?'btn-primary text-center py-3':'btn-secondary text-center py-3'}>Book Now</a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div id="inquiry" className="section-padding bg-white dark:bg-slate-900">
          <div className="page-container max-w-2xl mx-auto">
            <div className="text-center mb-8"><h2 className="section-heading">Get a <span className="gradient-text">Quote</span></h2></div>
            <div className="card p-8">
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{n:'name',l:'Name',p:'Your name'},{n:'email',l:'Email',t:'email',p:'you@example.com'},{n:'phone',l:'Phone',t:'tel',p:'98765 43210'},{n:'guests',l:'Guest Count',t:'number',p:'Min. 10'},{n:'venue',l:'Venue / Location',p:'Venue name or area'},{n:'eventDate',l:'Event Date',t:'date',p:''}].map(({n,l,p,t='text'}) => (
                    <div key={n}><label className="label">{l}</label>
                      <input {...formik.getFieldProps(n)} type={t} placeholder={p} className={`input-field ${formik.touched[n]&&formik.errors[n]?'border-red-400':''}`} />
                      {formik.touched[n]&&formik.errors[n]&&<p className="mt-1 text-xs text-red-500">{formik.errors[n]}</p>}
                    </div>
                  ))}
                  <div><label className="label">Menu Preference</label>
                    <select {...formik.getFieldProps('menuType')} className="input-field">
                      <option value="">Select menu</option>
                      {MENUS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                      <option value="Custom">Custom / Mixed</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2"><label className="label">Special Requirements</label>
                    <textarea {...formik.getFieldProps('message')} rows={3} placeholder="Dietary requirements, theme, special requests…" className="input-field resize-none" />
                  </div>
                </div>
                <button type="submit" disabled={formik.isSubmitting} className="btn-primary w-full py-3.5">
                  {formik.isSubmitting?'Sending…':'Get Free Quote'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
