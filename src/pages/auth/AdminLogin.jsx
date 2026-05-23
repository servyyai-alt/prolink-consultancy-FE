// import { useState } from 'react'
// import { Link, Navigate, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { useFormik } from 'formik'
// import * as Yup from 'yup'
// import { motion } from 'framer-motion'
// import { Helmet } from 'react-helmet-async'

// import {
//   HiEye,
//   HiEyeOff,
//   HiLockClosed,
//   HiMail,
//   HiShieldCheck,
//   HiChip,
//   HiUserGroup,
//   HiBriefcase,
// } from 'react-icons/hi'

// import {
//   clearCredentials,
//   loginUser,
//   selectAuth,
//   selectIsLoggedIn,
//   selectRole,
// } from '../../redux/slices/authSlice'

// import logo from '../../assets/logo.jpeg'

// const ADMIN_ROLES = ['admin', 'super_admin', 'recruiter']

// const STAT_CARDS = [
//   {
//     icon: HiUserGroup,
//     label: 'Platform Users',
//     value: '12.4K+',
//   },
//   {
//     icon: HiBriefcase,
//     label: 'Active Jobs',
//     value: '3.2K+',
//   },
//   {
//     icon: HiChip,
//     label: 'Applications',
//     value: '58K+',
//   },
// ]

// export default function AdminLogin() {
//   const [showPass, setShowPass] = useState(false)

//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const { isLoading } = useSelector(selectAuth)
//   const isLoggedIn = useSelector(selectIsLoggedIn)
//   const role = useSelector(selectRole)

//   if (isLoggedIn) {
//     return (
//       <Navigate
//         to={ADMIN_ROLES.includes(role) ? '/admin' : '/dashboard'}
//         replace
//       />
//     )
//   }

//   const formik = useFormik({
//     initialValues: {
//       email: '',
//       password: '',
//     },

//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email('Invalid email')
//         .required('Email required'),

//       password: Yup.string()
//         .required('Password required'),
//     }),

//     onSubmit: async (values) => {
//       const result = await dispatch(loginUser(values))

//       if (result.error) return

//       const loggedInRole = result.payload?.user?.role

//       if (!ADMIN_ROLES.includes(loggedInRole)) {
//         dispatch(clearCredentials())

//         formik.setStatus(
//           'Only admin and recruiter accounts can access this portal.'
//         )

//         return
//       }

//       navigate('/admin')
//     },
//   })

//   return (
//     <>
//       <Helmet>
//         <title>Admin Login | ProLink Consultancy</title>
//       </Helmet>

//       <div className="relative min-h-screen overflow-hidden bg-[#fffaf5]">

//         {/* Background Glow */}
//         <div className="absolute inset-0 overflow-hidden">

//           <div className="absolute -top-40 -left-32 h-[500px] w-[500px] rounded-full bg-orange-200/40 blur-3xl" />

//           <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-amber-100 blur-3xl" />

//           <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-100/40 blur-3xl" />

//         </div>

//         <div className="relative z-10 flex min-h-screen items-center justify-center p-5 lg:p-10">

//           <motion.div
//             initial={{ opacity: 0, y: 25 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.45 }}
//             className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-orange-100 bg-white/70 shadow-[0_20px_80px_rgba(251,146,60,0.12)] backdrop-blur-2xl lg:grid-cols-[1fr_1.05fr]"
//           >

//             {/* LEFT SECTION */}
//             <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#fff7ed] via-[#fffaf5] to-[#ffffff] p-12 lg:flex lg:flex-col lg:justify-between">

//               {/* Decorative Pattern */}
//               <div
//                 className="absolute inset-0 opacity-[0.05]"
//                 style={{
//                   backgroundImage:
//                     'radial-gradient(circle, #fb923c 1px, transparent 1px)',
//                   backgroundSize: '30px 30px',
//                 }}
//               />

//               {/* Top Content */}
//               <div className="relative z-10">

//                 {/* Logo */}
//                 <Link
//                   to="/"
//                   className="inline-flex items-center rounded-2xl border border-orange-100 bg-white px-5 py-4 shadow-sm"
//                 >
//                   <img
//                     src={logo}
//                     alt="ProLink"
//                     className="h-12 w-auto object-contain"
//                   />
//                 </Link>

//                 {/* Badge */}
//                 <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-orange-700">
//                   <HiShieldCheck className="h-4 w-4" />
//                   Secure Management Portal
//                 </div>

//                 {/* Heading */}
//                 <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900">
//                   ProLink
//                   <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
//                     Admin Dashboard
//                   </span>
//                 </h1>

//                 {/* Description */}
//                 <p className="mt-6 max-w-md text-base leading-8 text-slate-600">
//                   Centralized platform to manage recruiters, users,
//                   job listings, consultancy services, and operational workflows.
//                 </p>

//               </div>

//               {/* Stats */}
//               <div className="relative z-10 space-y-4">

//                 {STAT_CARDS.map(({ icon: Icon, label, value }) => (
//                   <motion.div
//                     whileHover={{ y: -2 }}
//                     key={label}
//                     className="flex items-center justify-between rounded-3xl border border-orange-100 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
//                   >

//                     <div className="flex items-center gap-4">

//                       <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100">

//                         <Icon className="h-6 w-6 text-orange-600" />

//                       </div>

//                       <div>

//                         <p className="text-sm font-medium text-slate-500">
//                           {label}
//                         </p>

//                         <h3 className="text-lg font-semibold text-slate-800">
//                           {value}
//                         </h3>

//                       </div>

//                     </div>

//                     <div className="h-3 w-3 rounded-full bg-green-500" />

//                   </motion.div>
//                 ))}

//               </div>

//               {/* Footer */}
//               <p className="relative z-10 text-sm text-slate-400">
//                 © 2026 ProLink Consultancy. All rights reserved.
//               </p>
//             </div>

//             {/* RIGHT SECTION */}
//             <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">

//               {/* Mobile Logo */}
//               <div className="mb-10 flex justify-center lg:hidden">

//                 <Link
//                   to="/"
//                   className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
//                 >
//                   <img
//                     src={logo}
//                     alt="ProLink"
//                     className="h-12 object-contain"
//                   />
//                 </Link>

//               </div>

//               {/* Icon */}
//               <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-sm">

//                 <HiShieldCheck className="h-8 w-8 text-orange-600" />

//               </div>

//               {/* Heading */}
//               <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
//                 Welcome Back
//               </p>

//               <h2 className="mt-3 text-4xl font-bold text-slate-900">
//                 Sign in to continue
//               </h2>

//               <p className="mt-3 mb-10 text-base leading-7 text-slate-500">
//                 Access the ProLink administration panel securely using your authorized credentials.
//               </p>

//               {/* FORM */}
//               <form
//                 onSubmit={formik.handleSubmit}
//                 className="space-y-6"
//               >

//                 {/* Email */}
//                 <div>

//                   <label className="mb-2.5 block text-sm font-semibold text-slate-700">
//                     Email Address
//                   </label>

//                   <div className="group relative">

//                     <HiMail className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-orange-500" />

//                     <input
//                       {...formik.getFieldProps('email')}
//                       type="email"
//                       placeholder="admin@prolink.com"
//                       className={`h-14 w-full rounded-2xl border bg-white px-14 text-sm font-medium text-slate-700 outline-none transition-all duration-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 ${
//                         formik.touched.email && formik.errors.email
//                           ? 'border-red-400'
//                           : 'border-orange-100'
//                       }`}
//                     />

//                   </div>

//                   {formik.touched.email && formik.errors.email && (
//                     <p className="mt-2 text-xs font-medium text-red-500">
//                       {formik.errors.email}
//                     </p>
//                   )}

//                 </div>

//                 {/* Password */}
//                 <div>

//                   <div className="mb-2.5 flex items-center justify-between">

//                     <label className="text-sm font-semibold text-slate-700">
//                       Password
//                     </label>

//                     <Link
//                       to="/forgot-password"
//                       className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
//                     >
//                       Forgot password?
//                     </Link>

//                   </div>

//                   <div className="group relative">

//                     <HiLockClosed className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-orange-500" />

//                     <input
//                       {...formik.getFieldProps('password')}
//                       type={showPass ? 'text' : 'password'}
//                       placeholder="Enter your password"
//                       className={`h-14 w-full rounded-2xl border bg-white px-14 pr-14 text-sm font-medium text-slate-700 outline-none transition-all duration-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 ${
//                         formik.touched.password && formik.errors.password
//                           ? 'border-red-400'
//                           : 'border-orange-100'
//                       }`}
//                     />

//                     <button
//                       type="button"
//                       onClick={() => setShowPass((p) => !p)}
//                       className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
//                     >
//                       {showPass ? (
//                         <HiEyeOff className="h-5 w-5" />
//                       ) : (
//                         <HiEye className="h-5 w-5" />
//                       )}
//                     </button>

//                   </div>

//                   {formik.touched.password && formik.errors.password && (
//                     <p className="mt-2 text-xs font-medium text-red-500">
//                       {formik.errors.password}
//                     </p>
//                   )}

//                 </div>

//                 {/* Error */}
//                 {formik.status && (
//                   <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

//                     <HiShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />

//                     <p className="text-sm font-medium text-red-600">
//                       {formik.status}
//                     </p>

//                   </div>
//                 )}

//                 {/* Submit */}
//                 <motion.button
//                   whileHover={{ scale: 1.01 }}
//                   whileTap={{ scale: 0.99 }}
//                   type="submit"
//                   disabled={isLoading || formik.isSubmitting}
//                   className="flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
//                 >

//                   {isLoading || formik.isSubmitting ? (
//                     <span className="flex items-center gap-3">

//                       <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

//                       Signing in...

//                     </span>
//                   ) : (
//                     'Login to Admin Dashboard'
//                   )}

//                 </motion.button>

//               </form>

//               {/* Divider */}
//               <div className="my-8 flex items-center gap-4">

//                 <div className="h-px flex-1 bg-orange-100" />

//                 <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
//                   Navigation
//                 </span>

//                 <div className="h-px flex-1 bg-orange-100" />

//               </div>

//               {/* Back Button */}
//               <Link
//                 to="/login"
//                 className="flex h-14 items-center justify-center rounded-2xl border border-orange-100 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-orange-300 hover:text-orange-600 hover:shadow-md"
//               >
//                 ← Back to User Login
//               </Link>

//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </>
//   )
// }

import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  HiEye, HiEyeOff, HiLockClosed, HiMail,
  HiShieldCheck, HiChip, HiUserGroup, HiBriefcase,
} from 'react-icons/hi'
import {
  clearCredentials, loginUser,
  selectAuth, selectIsLoggedIn, selectRole,
} from '../../redux/slices/authSlice'
import logo from '../../assets/logo.jpeg'

const ADMIN_ROLES = ['admin', 'super_admin', 'recruiter']

const STAT_CARDS = [
  { icon: HiUserGroup,  label: 'Total Users',   value: '12,400+' },
  { icon: HiBriefcase,  label: 'Active Jobs',   value: '3,200+'  },
  { icon: HiChip,       label: 'Applications',  value: '58,000+' },
]

export default function AdminLogin() {
  const [showPass, setShowPass] = useState(false)
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { isLoading } = useSelector(selectAuth)
  const isLoggedIn    = useSelector(selectIsLoggedIn)
  const role          = useSelector(selectRole)

  if (isLoggedIn) {
    return <Navigate to={ADMIN_ROLES.includes(role) ? '/admin' : '/dashboard'} replace />
  }

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email:    Yup.string().email('Invalid email').required('Email required'),
      password: Yup.string().required('Password required'),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(loginUser(values))
      if (result.error) return
      const loggedInRole = result.payload?.user?.role
      if (!ADMIN_ROLES.includes(loggedInRole)) {
        dispatch(clearCredentials())
        formik.setStatus('This portal is only for admin and recruiter accounts.')
        return
      }
      navigate('/admin')
    },
  })

  return (
    <>
      <Helmet><title>Admin Login | ProLink</title></Helmet>

      {/* Full-page dark canvas — signals "restricted zone" vs normal login's light slate-50 */}
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-8">

        {/*
          Centred floating card layout.
          Normal login  → edge-to-edge viewport split.
          Admin login   → elevated centred card, narrower (max-w-[900px]), more focused.
        */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-[900px] overflow-hidden rounded-[28px] border border-slate-800 shadow-[0_40px_100px_rgba(0,0,0,0.6)] lg:grid lg:grid-cols-[1fr_1.1fr]"
        >

          {/* ── LEFT: dark info panel ───────────────────────────────── */}
          <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-slate-900">

            {/* Subtle dot-grid overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* Ambient glow blobs — same primary / cyan as normal login */}
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 9, repeat: Infinity }}
              className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-primary-500/15 blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"
            />

            {/* Top: logo + badge */}
            <div className="relative">
              <Link
                to="/"
                className="inline-flex items-center rounded-2xl border border-white/10 bg-white/6 px-4 py-3 backdrop-blur-sm"
              >
                <img src={logo} alt="ProLink" className="h-12 w-auto object-contain" />
              </Link>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-300">
                <HiShieldCheck className="h-3.5 w-3.5" />
                Restricted Access
              </div>

              <h2 className="mt-4 text-3xl font-display font-bold leading-snug text-white">
                ProLink{' '}
                <span className="text-cyan-300">Control Room</span>
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Manage platform operations, users, jobs, and services from a single secure dashboard.
              </p>
            </div>

            {/* Middle: live stat cards — distinct from normal login bullet list */}
            <div className="relative space-y-3">
              {STAT_CARDS.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-5 py-3.5 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500/20">
                      <Icon className="h-4 w-4 text-primary-400" />
                    </div>
                    <span className="text-sm text-slate-300">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>

            <p className="relative text-xs text-slate-600">© 2024 ProLink Consultancy</p>
          </div>

          {/* ── RIGHT: login form ────────────────────────────────────── */}
          <div className="flex flex-col justify-center bg-white px-8 py-12 dark:bg-slate-950 sm:px-12">

            {/* Mobile logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center rounded-[22px] border border-slate-200 bg-white/90 px-4 py-3 shadow-lg dark:border-slate-800 dark:bg-slate-900/90"
              >
                <img src={logo} alt="ProLink" className="h-12 w-auto object-contain" />
              </Link>
            </div>

            {/* Shield icon badge — replaces normal login's plain text eyebrow */}
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/20">
              <HiShieldCheck className="h-6 w-6 text-primary-600" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-600">
              Admin Portal
            </p>
            <h1 className="mt-1.5 text-2xl font-display font-bold text-slate-900 dark:text-white">
              Sign in to continue
            </h1>
            <p className="mt-1 mb-8 text-sm text-slate-500">
              Only admin and recruiter accounts may access this panel.
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    {...formik.getFieldProps('email')}
                    type="email"
                    placeholder="admin@prolink.com"
                    className={`input-field pl-10 ${
                      formik.touched.email && formik.errors.email ? 'border-red-400' : ''
                    }`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="label mb-0">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    {...formik.getFieldProps('password')}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Your password"
                    className={`input-field pl-10 pr-10 ${
                      formik.touched.password && formik.errors.password ? 'border-red-400' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <HiEyeOff className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
                )}
              </div>

              {/* Status error */}
              {formik.status && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800/50 dark:bg-red-900/20">
                  <HiShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-300">{formik.status}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || formik.isSubmitting}
                className="btn-primary w-full py-3.5 mt-1"
              >
                {isLoading || formik.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in…
                  </span>
                ) : (
                  'Login to Admin Panel'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs text-slate-400">or</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Back to user login as a secondary button — cleaner than a plain link */}
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-primary-700 dark:hover:text-primary-400"
            >
              ← Back to user login
            </Link>

          </div>
        </motion.div>
      </div>
    </>
  )
}

