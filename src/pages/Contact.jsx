// Contact.jsx
import { Helmet } from 'react-helmet-async'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { contactAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Contact() {
  const formik = useFormik({
    initialValues: { name: '', email: '', phone: '', subject: '', service: '', message: '' },
    validationSchema: Yup.object({
      name:    Yup.string().required('Name required'),
      email:   Yup.string().email('Invalid email').required('Email required'),
      subject: Yup.string().required('Subject required'),
      message: Yup.string().min(20, 'Min 20 characters').required('Message required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await contactAPI.submit(values)
        toast.success('Message sent! We will get back to you shortly.')
        resetForm()
      } catch { toast.error('Failed to send. Please try again.') }
    },
  })

  const SERVICES = ['Job Consultancy','Campus Drive', 'HR Outsourcing', 'Background Verification', 'Other']
    // const SERVICES = ['Job Consultancy', 'CV Writing', 'Campus Drive', 'House Keeping', 'Catering Services', 'Event Management', 'Plant Set-Up', 'HR Outsourcing', 'Background Verification', 'Other']

  return (
    <>
      <Helmet>
        <title>Contact Us | ProLink Consultancy</title>
        <meta name="description" content="Get in touch with ProLink Consultancy for job placement, CV writing, campus drives, event management and all HR services." />
      </Helmet>

      <div className="pt-16">
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 py-14">
          <div className="page-container text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Get in Touch</motion.h1>
            <p className="text-primary-200">Our team is ready to help you with any query</p>
          </div>
        </div>

        <div className="page-container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info cards */}
            <div className="space-y-5">
              {[
                { icon: HiPhone, label: 'Call Us', value: '+91 98765 43210', sub: 'Mon–Sat, 9AM–6PM', href: 'tel:+919876543210', color: 'blue' },
                { icon: HiMail, label: 'Email Us', value: 'info@prolinkconsultancy.com', sub: 'We reply within 24 hrs', href: 'mailto:info@prolinkconsultancy.com', color: 'violet' },
                { icon: HiLocationMarker, label: 'Visit Us', value: '123 Business District', sub: 'Chennai, TN 600001', color: 'green' },
              ].map(({ icon: Icon, label, value, sub, href, color }) => (
                <motion.div key={label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="card p-5 flex gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    color === 'blue' ? 'bg-blue-50 text-blue-600' : color === 'violet' ? 'bg-violet-50 text-violet-600' : 'bg-green-50 text-green-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                    {href ? <a href={href} className="font-semibold text-slate-900 dark:text-white hover:text-primary-600 transition-colors text-sm">{value}</a>
                           : <p className="font-semibold text-slate-900 dark:text-white text-sm">{value}</p>}
                    <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                  </div>
                </motion.div>
              ))}

              {/* WhatsApp */}
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                className="card p-5 flex gap-4 hover:border-green-300 hover:-translate-y-0.5 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Chat instantly</p>
                  <p className="text-xs text-green-600 font-semibold mt-0.5 group-hover:underline">Open WhatsApp →</p>
                </div>
              </a>
            </div>

            {/* Contact form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="lg:col-span-2 card p-6 sm:p-8">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-6">Send a Message</h2>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['name', 'email', 'phone'].map(n => (
                    <div key={n} className={n === 'email' ? 'sm:col-span-1' : ''}>
                      <label className="label capitalize">{n === 'phone' ? 'Phone (optional)' : n}</label>
                      <input {...formik.getFieldProps(n)} type={n === 'email' ? 'email' : n === 'phone' ? 'tel' : 'text'}
                        placeholder={n === 'name' ? 'Your full name' : n === 'email' ? 'you@example.com' : '98765 43210'}
                        className={`input-field ${formik.touched[n] && formik.errors[n] ? 'border-red-400' : ''}`} />
                      {formik.touched[n] && formik.errors[n] && <p className="mt-1 text-xs text-red-500">{formik.errors[n]}</p>}
                    </div>
                  ))}
                  <div>
                    <label className="label">Service of Interest</label>
                    <select {...formik.getFieldProps('service')} className="input-field">
                      <option value="">Select a service…</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Subject <span className="text-red-500">*</span></label>
                    <input {...formik.getFieldProps('subject')} placeholder="What can we help you with?"
                      className={`input-field ${formik.touched.subject && formik.errors.subject ? 'border-red-400' : ''}`} />
                    {formik.touched.subject && formik.errors.subject && <p className="mt-1 text-xs text-red-500">{formik.errors.subject}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Message <span className="text-red-500">*</span></label>
                    <textarea {...formik.getFieldProps('message')} rows={5} placeholder="Describe your requirement in detail…"
                      className={`input-field resize-none ${formik.touched.message && formik.errors.message ? 'border-red-400' : ''}`} />
                    {formik.touched.message && formik.errors.message && <p className="mt-1 text-xs text-red-500">{formik.errors.message}</p>}
                  </div>
                </div>

                <button type="submit" disabled={formik.isSubmitting} className="btn-primary w-full py-3.5">
                  {formik.isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
