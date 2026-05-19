import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 — Page Not Found | ProLink</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center max-w-md">
          <div className="text-8xl font-display font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent mb-4">404</div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">Page Not Found</h1>
          <p className="text-slate-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary py-3 px-8">Go Home</Link>
            <Link to="/jobs" className="btn-secondary py-3 px-8">Browse Jobs</Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}
