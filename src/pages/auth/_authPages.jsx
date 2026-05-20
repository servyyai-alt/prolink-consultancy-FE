import { useState, useRef } from 'react'
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  loginUser, registerUser, verifyOTP as verifyOTPThunk,
  selectAuth,
} from '../../redux/slices/authSlice'
import { authAPI } from '../../services/api'
import { HiEye, HiEyeOff, HiMail, HiLockClosed, HiUser, HiPhone } from 'react-icons/hi'
import toast from 'react-hot-toast'
import logo from '../../assets/logo.jpeg'
import authImage from '../../assets/login.jpg'
import registerImage from '../../assets/register.jpg'
// import registerImage from '../../assets/web-logo.jpeg'

const AuthShell = ({
  children,
  title,
  subtitle,
  image = authImage,
  panelTitle = <>Your gateway to <span className="text-primary-300">10,000+</span> opportunities</>,
  panelPoints = ['Free job applications', 'ATS-optimised resumes', 'Real-time interview tracking', 'Pan-India company network'],
}) => (
  <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
    {/* Left panel */}
    <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden isolate">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover scale-[1.06]"
      />
      <div className="absolute inset-0 bg-slate-950/35" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/45 via-slate-950/20 to-primary-950/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_30%)]" />
      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
      <Link to="/" className="relative inline-flex items-center self-start rounded-[28px] border border-white/20 bg-white/12 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.28)] backdrop-blur-xl">
        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-white/18 to-transparent opacity-70" />
        <img
          src={logo}
          alt="ProLink Consultancy"
          className="relative h-16 w-auto object-contain drop-shadow-[0_10px_24px_rgba(15,23,42,0.35)]"
        />
      </Link>
      <div className="relative max-w-xl rounded-[32px] border border-white/15 bg-black/15 p-8 backdrop-blur-md">
        <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">
          ProLink Consultancy
        </div>
        <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight drop-shadow-[0_8px_26px_rgba(15,23,42,0.4)]">{panelTitle}</h2>
        <div className="space-y-3">
          {panelPoints.map(f => (
            <div key={f} className="flex items-center gap-3 text-white/90 text-sm">
              <div className="w-5 h-5 rounded-full bg-primary-500/40 flex items-center justify-center flex-shrink-0">✓</div>{f}
            </div>
          ))}
        </div>
      </div>
      <p className="relative text-primary-300 text-xs">© 2024 ProLink Consultancy. All rights reserved.</p>
    </div>

    {/* Right panel */}
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="lg:hidden flex justify-center mb-8">
          <Link to="/" className="inline-flex items-center rounded-[24px] border border-slate-200 bg-white/90 px-4 py-3 shadow-lg shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20">
            <img
              src={logo}
              alt="ProLink Consultancy"
              className="h-14 w-auto object-contain"
            />
          </Link>
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-1">{title}</h1>
        <p className="text-slate-500 mb-8">{subtitle}</p>
        {children}
      </motion.div>
    </div>
  </div>
)

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export function Login() {
  const [showPass, setShowPass] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoading } = useSelector(selectAuth)
  const from = location.state?.from?.pathname || '/dashboard'

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email:    Yup.string().email('Invalid email').required('Email required'),
      password: Yup.string().required('Password required'),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(loginUser(values))
      if (!result.error) {
        const role = result.payload?.user?.role
        if (['admin', 'super_admin', 'recruiter'].includes(role)) navigate('/admin')
        else if (role === 'employer') navigate('/employer')
        else navigate(from)
      }
    },
  })

  return (
    <AuthShell
      title="Welcome back "
      subtitle="Sign in to your ProLink account"
      image={authImage}
      panelTitle={<>Step into your next <span className="text-primary-300">career move</span></>}
      panelPoints={['Free job applications', 'ATS-optimised resumes', 'Real-time interview tracking', 'Pan-India company network']}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input {...formik.getFieldProps('email')} type="email" placeholder="you@example.com"
              className={`input-field pl-10 ${formik.touched.email && formik.errors.email ? 'border-red-400' : ''}`} />
          </div>
          {formik.touched.email && formik.errors.email && <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0">Password</label>
            <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline font-semibold">Forgot password?</Link>
          </div>
          <div className="relative">
            <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input {...formik.getFieldProps('password')} type={showPass ? 'text' : 'password'} placeholder="Your password"
              className={`input-field pl-10 pr-10 ${formik.touched.password && formik.errors.password ? 'border-red-400' : ''}`} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPass ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>}
        </div>

        <button type="submit" disabled={isLoading || formik.isSubmitting}
          className="btn-primary w-full py-3.5 mt-2">
          {isLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing in…</span> : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one free</Link>
      </p>
    </AuthShell>
  )
}

// ── REGISTER ─────────────────────────────────────────────────────────────────
export function Register() {
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { isLoading } = useSelector(selectAuth)

  const formik = useFormik({
    initialValues: { firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', role: 'job_seeker' },
    validationSchema: Yup.object({
      firstName:       Yup.string().min(2).required('First name required'),
      lastName:        Yup.string().min(2).required('Last name required'),
      email:           Yup.string().email('Invalid email').required('Email required'),
      phone:           Yup.string().matches(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
      password:        Yup.string().min(8, 'Min 8 characters').matches(/(?=.*[A-Z])(?=.*[0-9])/, 'Must have uppercase + number').required(),
      confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required(),
      role:            Yup.string().oneOf(['job_seeker', 'employer']).required(),
    }),
    onSubmit: async (values) => {
      const { confirmPassword, ...data } = values
      const result = await dispatch(registerUser(data))
      if (!result.error) navigate('/verify-otp')
    },
  })

  const f = (name) => ({ ...formik.getFieldProps(name), id: name })
  const e = (name) => formik.touched[name] && formik.errors[name]

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join 10,000+ professionals on ProLink"
      image={registerImage}
      panelTitle={<>Build your profile for <span className="text-primary-300">better opportunities</span></>}
      panelPoints={['Quick account setup', 'Employer and job seeker access', 'Track interviews in one place', 'Connect with trusted companies']}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {['firstName', 'lastName'].map(n => (
            <div key={n}>
              <label className="label capitalize">{n.replace(/([A-Z])/g, ' $1')}</label>
              <input {...f(n)} placeholder={n === 'firstName' ? 'Arjun' : 'Sharma'}
                className={`input-field ${e(n) ? 'border-red-400' : ''}`} />
              {e(n) && <p className="mt-1 text-xs text-red-500">{e(n)}</p>}
            </div>
          ))}
        </div>

        <div>
          <label className="label">Email Address</label>
          <input {...f('email')} type="email" placeholder="you@example.com"
            className={`input-field ${e('email') ? 'border-red-400' : ''}`} />
          {e('email') && <p className="mt-1 text-xs text-red-500">{e('email')}</p>}
        </div>

        <div>
          <label className="label">Phone (optional)</label>
          <input {...f('phone')} type="tel" placeholder="98765 43210"
            className={`input-field ${e('phone') ? 'border-red-400' : ''}`} />
          {e('phone') && <p className="mt-1 text-xs text-red-500">{e('phone')}</p>}
        </div>

        <div>
          <label className="label">I am a…</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ value: 'job_seeker', label: ' Job Seeker' }, { value: 'employer', label: ' Employer' }].map(({ value, label }) => (
              <button key={value} type="button" onClick={() => formik.setFieldValue('role', value)}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                  formik.values.role === value
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-300'
                }`}>{label}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input {...f('password')} type={showPass ? 'text' : 'password'} placeholder="Min 8 chars, 1 uppercase, 1 number"
              className={`input-field pr-10 ${e('password') ? 'border-red-400' : ''}`} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              {showPass ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
            </button>
          </div>
          {e('password') && <p className="mt-1 text-xs text-red-500">{e('password')}</p>}
        </div>

        <div>
          <label className="label">Confirm Password</label>
        
          <div className="relative">
            <input
              {...f('confirmPassword')}
              type={showConfirmPass ? 'text' : 'password'}
              placeholder="Confirm your password"
              className={`input-field pr-10 ${
                e('confirmPassword') ? 'border-red-400' : ''
              }`}
            />
        
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showConfirmPass ? (
                <HiEyeOff className="w-4 h-4" />
              ) : (
                <HiEye className="w-4 h-4" />
              )}
            </button>
          </div>
        
          {e('confirmPassword') && (
            <p className="mt-1 text-xs text-red-500">
              {e('confirmPassword')}
            </p>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5">
          {isLoading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating Account…</span> : 'Create Free Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        By creating an account you agree to our{' '}
        <Link to="/terms"   className="text-primary-600 hover:underline">Terms</Link> &amp;{' '}
        <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
      </p>
      <p className="mt-3 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  )
}

// ── VERIFY OTP ────────────────────────────────────────────────────────────────
export function VerifyOTP() {
  const [otp,     setOtp]     = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resent,  setResent]  = useState(false)
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pendingEmail } = useSelector(selectAuth)

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) refs[i + 1].current?.focus()
  }
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus()
  }
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (paste.length === 6) {
      setOtp(paste.split(''))
      refs[5].current?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { toast.error('Enter complete OTP'); return }
    setLoading(true)
    const result = await dispatch(verifyOTPThunk({ email: pendingEmail, otp: code }))
    setLoading(false)
    if (!result.error) navigate('/dashboard')
  }

  const handleResend = async () => {
    try {
      await authAPI.resendOTP({ email: pendingEmail })
      setResent(true)
      toast.success('OTP resent!')
      setTimeout(() => setResent(false), 30000)
    } catch { toast.error('Failed to resend OTP') }
  }

  return (
    <AuthShell title="Verify your email 📧" subtitle={`We sent a 6-digit code to ${pendingEmail || 'your email'}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
              className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all ${
                digit ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 focus:border-primary-400'
              }`}
            />
          ))}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? 'Verifying…' : 'Verify Email'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Didn't receive the code?{' '}
        <button onClick={handleResend} disabled={resent} className="text-primary-600 font-semibold hover:underline disabled:opacity-50">
          {resent ? 'Resent! Check inbox' : 'Resend OTP'}
        </button>
      </p>
    </AuthShell>
  )
}

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
export function ForgotPassword() {
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({ email: Yup.string().email('Invalid email').required() }),
    onSubmit: async ({ email }) => {
      setLoading(true)
      try {
        await authAPI.forgotPassword({ email })
        setSent(true)
      } catch { toast.error('Request failed') }
      finally { setLoading(false) }
    },
  })

  return (
    <AuthShell title="Reset your password 🔐" subtitle="Enter your email and we'll send a reset link">
      {sent ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-3xl">📬</div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Check your inbox!</h3>
          <p className="text-slate-500 text-sm">If that email is registered, a reset link has been sent. Valid for 30 minutes.</p>
          <Link to="/login" className="btn-primary mt-6 w-full py-3">Back to Login</Link>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email Address</label>
            <input {...formik.getFieldProps('email')} type="email" placeholder="you@example.com" className="input-field" />
            {formik.touched.email && formik.errors.email && <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
          <Link to="/login" className="block text-center text-sm text-primary-600 hover:underline font-semibold">← Back to Login</Link>
        </form>
      )}
    </AuthShell>
  )
}

// ── RESET PASSWORD ────────────────────────────────────────────────────────────
export function ResetPassword() {
  const { token } = useParams()
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      password:        Yup.string().min(8).matches(/(?=.*[A-Z])(?=.*[0-9])/, 'Must have uppercase + number').required(),
      confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required(),
    }),
    onSubmit: async ({ password }) => {
      setLoading(true)
      try {
        await authAPI.resetPassword(token, { password })
        toast.success('Password reset successfully!')
        navigate('/login')
      } catch (e) { toast.error(e.response?.data?.message || 'Reset failed') }
      finally { setLoading(false) }
    },
  })

  return (
    <AuthShell title="Set new password 🔑" subtitle="Create a strong password for your account">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {['password', 'confirmPassword'].map(name => (
          <div key={name}>
            <label className="label capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
            <div className="relative">
              <input {...formik.getFieldProps(name)} type={showPass ? 'text' : 'password'}
                placeholder={name === 'password' ? 'New password' : 'Confirm password'} className="input-field pr-10" />
              {name === 'password' && (
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              )}
            </div>
            {formik.touched[name] && formik.errors[name] && <p className="mt-1 text-xs text-red-500">{formik.errors[name]}</p>}
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>
    </AuthShell>
  )
}
