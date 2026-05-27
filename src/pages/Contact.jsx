// Contact.jsx

import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
} from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'

import { contactAPI } from '../services/api'
import toast from 'react-hot-toast'

import {
  optionalIndianMobileSchema,
  sanitizeIndianMobileInput,
} from '../utils/phoneValidation'

import bgImage from '../assets/contact.png'
import { selectUser } from '../redux/slices/authSlice'

export default function Contact() {
  const user = useSelector(selectUser)

  // CAPTCHA GENERATOR
  const generateCaptcha = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let captcha = ''

    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(
        Math.floor(Math.random() * chars.length)
      )
    }

    return captcha
  }

  // CAPTCHA STATE
  const [captchaText, setCaptchaText] = useState('')

  // GENERATE CAPTCHA ON LOAD
  useEffect(() => {
    setCaptchaText(generateCaptcha())
  }, [])

  const SERVICES = [
    'Job Consultancy',
    'Campus Drive',
    'Background Verification',
    'Other',
  ]

  // FORMIK
  const formik = useFormik({
    initialValues: {
      name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
      email: user?.email || '',
      phone: user?.phone || '',
      subject: '',
      service: '',
      message: '',
      captchaInput: '',
    },

    validationSchema: Yup.object({
      name: Yup.string().required('Name required'),

      phone: optionalIndianMobileSchema(
        'Phone number must be a valid 10-digit mobile number'
      ),

      email: Yup.string()
        .email('Invalid email')
        .required('Email required'),

      subject: Yup.string().required('Subject required'),

      message: Yup.string()
        .min(20, 'Min 20 characters')
        .required('Message required'),

      captchaInput: Yup.string().required(
        'Captcha required'
      ),
    }),

    onSubmit: async (
      values,
      { resetForm, setFieldError }
    ) => {

      // CAPTCHA VALIDATION
      if (
        values.captchaInput.trim() !==
        captchaText.trim()
      ) {

        setFieldError(
          'captchaInput',
          'Captcha does not match'
        )

        return
      }

      try {
        const { captchaInput, ...payload } = values
        await contactAPI.submit(payload)

        toast.success(
          'Message sent! We will get back to you shortly.'
        )

        // RESET FORM
        resetForm({
          values: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            service: '',
            message: '',
            captchaInput: '',
          },
        })

        // NEW CAPTCHA
        setCaptchaText(generateCaptcha())

      } catch {

        toast.error(
          'Failed to send. Please try again.'
        )
      }
    },
  })

  useEffect(() => {
    if (!user) return

    formik.setValues((prev) => ({
      ...prev,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email || '',
      phone: user.phone || '',
    }))
  }, [user])

  return (
    <>
      <Helmet>
        <title>
          Contact Us | ProLink Consultancy
        </title>

        <meta
          name="description"
          content="Get in touch with ProLink Consultancy for Job Consultancy, Campus Drive, and Background Verification services."
        />
      </Helmet>

      <div className="pt-16">

        {/* HERO SECTION */}
        <div
          className="bg-cover bg-center py-14"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        >
          <div className="page-container text-center">

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-display font-bold text-white mb-3"
            >
              Get in Touch
            </motion.h1>

            <p className="text-white/90">
              Our team is ready to help you with any query
            </p>

          </div>
        </div>

        {/* MAIN SECTION */}
        <div className="page-container py-16">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT INFO SECTION */}
            <div className="space-y-5">
            
              {[
                {
                  icon: HiPhone,
                  label: 'Call Us',
                  value: '+91 9937047733',
                  sub: 'Mon–Sat, 9AM–6PM',
                  href: 'tel:+919937047733',
                  color: 'blue',
                },
            
                {
                  icon: HiMail,
                  label: 'Email Us',
                  value: 'admin@prolinkconsultancy.com',
                  sub: 'We reply within 24 hrs',
                  href: 'mailto:admin@prolinkconsultancy.com',
                  color: 'violet',
                },
            
                {
                  icon: HiLocationMarker,
                  label: 'Visit Us',
                  value: 'Bhubaneswar, Khurda,',
                  sub: 'Odisha 751010',
                  color: 'green',
                },
              ].map(
                ({
                  icon: Icon,
                  label,
                  value,
                  sub,
                  href,
                  color,
                }) => (
            
                  <motion.div
                    key={label}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    whileHover={{
                      y: -3,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className={`card p-5 flex gap-4 transition-all duration-300 group cursor-pointer
                   ${
                     color === 'blue'
                       ? 'hover:border-blue-300 dark:hover:border-blue-700'
                       : color === 'violet'
                       ? 'hover:border-violet-300 dark:hover:border-violet-700'
                       : 'hover:border-green-300 dark:hover:border-green-700'
                   }
                 `}
                  >
            
                    {/* ICON */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0             transition-all duration-300 group-hover:scale-110 ${
                        color === 'blue'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                          : color === 'violet'
                          ? 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400'
                          : 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
            
                    {/* CONTENT */}
                    <div className="flex-1">
            
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {label}
                      </p>
            
                      {href ? (
                        <a
                          href={href}
                          className="font-semibold text-slate-900 dark:text-white hover:text-primary-600             dark:hover:text-primary-400 transition-colors text-sm"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {value}
                        </p>
                      )}
            
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5             group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                        {sub}
                      </p>
            
                    </div>
            
                  </motion.div>
                )
              )}
            
              {/* WHATSAPP CARD */}
              <motion.a
                href="https://wa.me/919937047733"
                target="_blank"
                rel="noreferrer"
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                whileHover={{
                  y: -3,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="card p-5 flex gap-4 hover:border-green-300 dark:hover:border-green-700             transition-all duration-300 group cursor-pointer"
              >
            
                {/* ICON */}
                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10             dark:text-green-400 flex items-center justify-center flex-shrink-0 transition-transform             duration-300 group-hover:scale-110">
                  <FaWhatsapp className="w-5 h-5" />
                </div>
            
                {/* CONTENT */}
                <div className="flex-1">
            
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    WhatsApp
                  </p>
            
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    Chat instantly
                  </p>
            
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-0.5             group-hover:underline">
                    Open WhatsApp →
                  </p>
            
                </div>
            
              </motion.a>
            
            </div>

            {/* CONTACT FORM */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 card p-6 sm:p-8"
            >

              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-6">
                Send a Message
              </h2>

              <form
                onSubmit={formik.handleSubmit}
                className="space-y-4"
              >

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {['name', 'email', 'phone'].map(
                    (n) => (

                      <div key={n}>

                        <label className="label capitalize">
                          {n === 'phone'
                            ? 'Phone (optional)'
                            : n}
                        </label>

                        <input
                          {...formik.getFieldProps(n)}
                          type={
                            n === 'email'
                              ? 'email'
                              : n === 'phone'
                              ? 'tel'
                              : 'text'
                          }
                          placeholder={
                            n === 'name'
                              ? 'Your full name'
                              : n === 'email'
                              ? 'you@example.com'
                              : '9876543210'
                          }
                          maxLength={
                            n === 'phone'
                              ? 10
                              : undefined
                          }
                          onInput={(e) => {
                            if (n === 'phone') {
                              e.target.value =
                                sanitizeIndianMobileInput(
                                  e.target.value
                                )
                            }
                          }}
                          className={`input-field ${
                            formik.touched[n] &&
                            formik.errors[n]
                              ? 'border-red-400'
                              : ''
                          }`}
                        />

                        {formik.touched[n] &&
                          formik.errors[n] && (
                            <p className="mt-1 text-xs text-red-500">
                              {formik.errors[n]}
                            </p>
                          )}

                      </div>
                    )
                  )}

                  {/* SERVICE */}
                  <div>

                    <label className="label">
                      Service of Interest
                    </label>

                    <select
                      {...formik.getFieldProps(
                        'service'
                      )}
                      className="input-field"
                    >

                      <option value="">
                        Select a service…
                      </option>

                      {SERVICES.map((s) => (
                        <option
                          key={s}
                          value={s}
                        >
                          {s}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* SUBJECT */}
                  <div className="sm:col-span-2">

                    <label className="label">
                      Subject{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      {...formik.getFieldProps(
                        'subject'
                      )}
                      placeholder="What can we help you with?"
                      className={`input-field ${
                        formik.touched.subject &&
                        formik.errors.subject
                          ? 'border-red-400'
                          : ''
                      }`}
                    />

                    {formik.touched.subject &&
                      formik.errors.subject && (
                        <p className="mt-1 text-xs text-red-500">
                          {formik.errors.subject}
                        </p>
                      )}

                  </div>

                  {/* MESSAGE */}
                  <div className="sm:col-span-2">

                    <label className="label">
                      Message{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <textarea
                      {...formik.getFieldProps(
                        'message'
                      )}
                      rows={5}
                      placeholder="Describe your requirement in detail…"
                      className={`input-field resize-none ${
                        formik.touched.message &&
                        formik.errors.message
                          ? 'border-red-400'
                          : ''
                      }`}
                    />

                    {formik.touched.message &&
                      formik.errors.message && (
                        <p className="mt-1 text-xs text-red-500">
                          {formik.errors.message}
                        </p>
                      )}

                  </div>

                  {/* CAPTCHA */}
                  <div className="space-y-2 sm:col-span-2">

                    <label className="label">
                      Enter Captcha
                    </label>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                      <div className="px-4 py-3 min-w-[160px] flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border rounded-lg text-lg font-bold tracking-[0.3em] select-none">
                        {captchaText}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCaptchaText(
                            generateCaptcha()
                          )
                        }
                        className="px-4 py-3 border rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      >
                        Refresh
                      </button>

                    </div>

                    <input
                      type="text"
                      name="captchaInput"
                      placeholder="Enter captcha"
                      value={
                        formik.values.captchaInput
                      }
                      onChange={(e) => {

                        formik.setFieldValue(
                          'captchaInput',
                          e.target.value
                        )

                        if (
                          formik.errors
                            .captchaInput
                        ) {
                          formik.setFieldError(
                            'captchaInput',
                            ''
                          )
                        }
                      }}
                      onBlur={formik.handleBlur}
                      className={`input-field ${
                        formik.touched
                          .captchaInput &&
                        formik.errors
                          .captchaInput
                          ? 'border-red-400'
                          : ''
                      }`}
                    />

                    {formik.touched
                      .captchaInput &&
                      formik.errors
                        .captchaInput && (
                        <p className="text-xs text-red-500">
                          {
                            formik.errors
                              .captchaInput
                          }
                        </p>
                      )}

                  </div>

                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="btn-primary w-full py-3.5"
                >
                  {formik.isSubmitting
                    ? 'Sending…'
                    : 'Send Message'}
                </button>

              </form>

            </motion.div>

          </div>

        </div>

      </div>
    </>
  )
}
