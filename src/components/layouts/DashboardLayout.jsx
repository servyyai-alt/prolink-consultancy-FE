import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiViewGrid, HiUser, HiBriefcase, HiBookmark, HiCalendar,
  HiLogout, HiMenu, HiX, HiBell, HiSun, HiMoon,
  HiPlusCircle, HiClipboardList, HiUserGroup,
} from 'react-icons/hi'
import { logoutUser, selectUser } from '../../redux/slices/authSlice'
import { toggleTheme, selectTheme } from '../../redux/slices/uiSlice'
import { selectUnreadCount } from '../../redux/slices/notificationSlice'
import { Link } from 'react-router-dom'

const JOB_SEEKER_NAV = [
  { to: '/dashboard',             icon: HiViewGrid,     label: 'Overview',     end: true },
  { to: '/dashboard/profile',     icon: HiUser,         label: 'My Profile' },
  { to: '/dashboard/applications',icon: HiBriefcase,    label: 'Applications' },
  { to: '/dashboard/saved-jobs',  icon: HiBookmark,     label: 'Saved Jobs' },
  { to: '/dashboard/interviews',  icon: HiCalendar,     label: 'Interviews' },
]
const EMPLOYER_NAV = [
  { to: '/employer',              icon: HiViewGrid,     label: 'Overview',     end: true },
  { to: '/employer/post-job',     icon: HiPlusCircle,   label: 'Post a Job' },
  { to: '/employer/my-jobs',      icon: HiBriefcase,    label: 'My Jobs' },
  { to: '/employer/applicants',   icon: HiUserGroup,    label: 'Applicants' },
  { to: '/employer/profile',      icon: HiUser,         label: 'Company Profile' },
]

export default function DashboardLayout({ variant = 'jobseeker' }) {
  const [open, setOpen] = useState(false)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const user      = useSelector(selectUser)
  const theme     = useSelector(selectTheme)
  const unread    = useSelector(selectUnreadCount)
  const navLinks  = variant === 'employer' ? EMPLOYER_NAV : JOB_SEEKER_NAV

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/')
  }

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-900 ${mobile ? '' : 'border-r border-slate-100 dark:border-slate-800'}`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white font-bold text-base">P</span>
          </div>
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">ProLink</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
          {user?.avatar?.url
            ? <img src={user.avatar.url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">{user?.firstName?.[0]}</span>
              </div>
          }
          <div className="min-w-0">
            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                       : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
            onClick={() => setOpen(false)}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3">
        <button onClick={() => dispatch(toggleTheme())}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          {theme === 'dark' ? <HiSun className="w-4 h-4" /> : <HiMoon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
          <HiLogout className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 lg:hidden shadow-2xl">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <HiMenu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Link to={variant === 'employer' ? '/employer/applicants' : '/dashboard/applications'}
              className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <HiBell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
