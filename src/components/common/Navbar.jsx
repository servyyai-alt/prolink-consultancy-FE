import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiMenu, HiX, HiChevronDown, HiMoon, HiSun,
  HiUser, HiLogout, HiViewGrid, HiPhone, HiMail, HiChatAlt2,
  HiDocumentText,
} from 'react-icons/hi'
import { selectIsLoggedIn, selectUser, selectRole, logoutUser } from '../../redux/slices/authSlice'
import { toggleTheme, selectTheme } from '../../redux/slices/uiSlice'
import { serviceAPI } from '../../services/api'
import { getServiceRoute } from '../../utils/serviceRoutes'
import ConfirmDialog from './ConfirmDialog'
import NotificationMenu from './NotificationMenu'
import Logo from '../../assets/logo.jpeg'
import { mergeServiceCatalog } from '../../utils/seoContent'

const TOP_BAR_CONTACT = [
  { icon: HiPhone, label: '+91 99370 47733', href: 'tel:+9199370 47733' },
  { icon: HiMail, label: 'admin@prolinkconsultancy.in', href: 'mailto:admin@prolinkconsultancy.in' },
]

const navLinks = [
  { label: 'Home',         to: '/' },
  { label: 'About',        to: '/about' },
  { label: 'Jobs',         to: '/jobs' },
  { label: 'Blogs',        to: '/blogs' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Contact',      to: '/contact' },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navRef = useRef(null)
  const dropdownRef = useRef(null)
  const profileRef  = useRef(null)

  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const location    = useLocation()
  const isLoggedIn  = useSelector(selectIsLoggedIn)
  const user        = useSelector(selectUser)
  const role        = useSelector(selectRole)
  const theme       = useSelector(selectTheme)
  const canSubmitTestimonial = role === 'job_seeker'
  const { data } = useQuery({ queryKey: ['services'], queryFn: () => serviceAPI.getServices() })
  const services = mergeServiceCatalog(data?.data?.data?.services || [])
  const closeServicesMenu = () => setServicesOpen(false)
  const closeProfileMenu = () => setProfileOpen(false)
  const closeMobileMenu = () => setMobileOpen(false)
  const closeAllMenus = () => {
    closeServicesMenu()
    closeProfileMenu()
    closeMobileMenu()
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) closeServicesMenu()
      if (profileRef.current  && !profileRef.current.contains(e.target))  closeProfileMenu()
    }
    const onEscape = (event) => {
      if (event.key === 'Escape') closeAllMenus()
    }

    document.addEventListener('pointerdown', handler)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('pointerdown', handler)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  useEffect(() => {
    if (!mobileOpen) return undefined

    const closeMobileMenuOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeAllMenus()
      }
    }

    document.addEventListener('pointerdown', closeMobileMenuOutside, true)
    return () => document.removeEventListener('pointerdown', closeMobileMenuOutside, true)
  }, [mobileOpen])

  useEffect(() => {
    closeAllMenus()
  }, [location.pathname])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/')
    closeProfileMenu()
    setShowLogoutConfirm(false)
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    if (['admin', 'super_admin', 'recruiter'].includes(user.role)) return '/admin'
    if (user.role === 'employer') return '/employer'
    return '/dashboard'
  }

  return (
    <div ref={navRef}>
      {/* ── Top info bar ── */}
      <div className="hidden lg:block bg-[#1a1108] border-b border-amber-900/30">
        <div className="page-container">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-6">
              {TOP_BAR_CONTACT.map(({ icon: Icon, label, href }) => (
                <a key={href} href={href}
                  className="flex items-center gap-2 text-xs text-stone-400 hover:text-amber-300 transition-colors">
                  <Icon className="w-3.5 h-3.5 text-amber-500" />
                  {label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <span>Mon–Sat, 9:00 am – 6:00 pm</span>
              <span className="w-px h-3 bg-stone-700" />
              <span className="text-amber-400 font-semibold tracking-wide">Plot no 3010, Palasuni Rasulagarh,Bhubaneswar, Odisha 751025, India</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/10 lg:hidden"
            onPointerDown={closeAllMenus}
            onClick={closeAllMenus}
          />
        )}
      </AnimatePresence>

      {/* ── Main navbar ── */}
      <header className={`sticky top-0 left-0 right-0 z-[70] transition-all duration-300 ${
        scrolled
          ? 'bg-white dark:bg-stone-950/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-stone-200/70 dark:border-stone-800/70'
          : 'bg-white dark:bg-stone-950 border-b border-stone-200/60 dark:border-stone-800/60'
      }`}>
        <div className="page-container">
          <div className="relative flex items-center justify-between h-[68px]">

            {/* Logo */}
            {/* <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <span className="absolute top-0.5 left-1/2 w-2 h-2 rounded-full bg-[#8B2A0F] -translate-x-1/2 group-hover:bg-amber-500 transition-colors" />
                <span className="absolute left-0.5 top-[14px] w-2 h-2 rounded-full bg-[#8B2A0F] group-hover:bg-amber-500 transition-colors" />
                <span className="absolute right-0.5 top-[14px] w-2 h-2 rounded-full bg-[#8B2A0F] group-hover:bg-amber-500 transition-colors" />
                <div className="w-8 h-8 rounded-full border-[3.5px] border-amber-400 group-hover:border-amber-500 transition-colors" />
              </div>
              <div className="leading-none">
                <div className="flex items-baseline gap-0.5">
                  <span className="font-extrabold text-[22px] tracking-tight text-stone-900 dark:text-white leading-none"
                    style={{ fontFamily: "'Georgia', serif" }}>
                    Pro
                  </span>
                  <span className="font-extrabold text-[22px] tracking-tight text-amber-500 leading-none"
                    style={{ fontFamily: "'Georgia', serif" }}>
                    Link
                  </span>
                </div>
                <p className="text-[9px] uppercase tracking-[0.38em] text-stone-400 dark:text-stone-500 mt-[3px]">
                  Consultancy
                </p>
              </div>
            </Link> */}
            <Link
              to="/"
              className="flex items-center gap-3 group flex-shrink-0"
            >
            
              {/* Logo Image */}
              <div className="relative overflow-hidden rounded-xl">
               <img
                 src={Logo}
                 alt="ProLink Consultancy"
                 loading="eager"
                 className="
                   h-16
                   w-auto
                   object-contain
                   transition-all duration-300
                   group-hover:scale-105
                 "
               />
              </div>
            
              {/* Company Name */}
              {/* <div className="leading-none">

              <div className="flex items-baseline gap-1">
          
                <span
                  className="
                    font-extrabold
                    text-[22px]
                    tracking-tight
                    text-stone-900
                    dark:text-white
                    leading-none
                  "
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Pro
                </span>
          
                <span
                  className="
                    font-extrabold
                    text-[22px]
                    tracking-tight
                    text-amber-500
                    leading-none
                  "
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Link
                </span>
              </div>
          
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.32em]
                  text-stone-400
                  dark:text-stone-500
                  mt-1
                "
              >
                Consultancy
              </p>
              </div> */}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(({ label, to }) => (
                <NavLink key={to} to={to} onClick={closeAllMenus}
                  className={({ isActive }) =>
                    `relative px-4 py-2.5 text-[13.5px] font-semibold tracking-wide transition-colors rounded-lg ${
                      isActive
                        ? 'text-[#8B2A0F] dark:text-amber-400'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-amber-400 rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}

              {/* Services Mega-dropdown */}
              <div ref={dropdownRef}>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()} 
                  onClick={() => {
                    closeProfileMenu()
                    setServicesOpen((prev) => !prev)
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-[13.5px] font-semibold tracking-wide transition-colors rounded-lg ${
                    servicesOpen
                      ? 'text-[#8B2A0F] dark:text-amber-400'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  Services
                  <HiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full right-0 mt-3 w-[560px] max-w-[95vw] translate-x-0 rounded-2xl border border-stone-200/80 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900 overflow-hidden z-[9999]"
                    >
                      {/* Dropdown header */}
                      <div className="bg-gradient-to-r from-[#1a0e07] to-[#2d1608] px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold">Our Services</p>
                          <h3 className="text-white font-bold text-lg mt-0.5">What we do best</h3>
                        </div>
                        <Link to="/services"
                          onClick={closeServicesMenu}
                          className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 border border-amber-800/60 rounded-lg px-3 py-1.5 hover:bg-amber-400/10 transition-colors">
                          All Services →
                        </Link>
                      </div>

                      {/* Service grid */}
                      <div className="grid grid-cols-2 gap-px bg-stone-100 dark:bg-stone-800 p-px">
                        {services.length > 0 ? (
                          services.map((s) => (
                            <Link
                              key={s.slug || s.name}
                              to={getServiceRoute(s.slug)}
                              onClick={closeServicesMenu}
                              className="group flex items-start gap-3 px-5 py-4 bg-white dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
                            >
                              <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-[#8B2A0F] transition-colors" />
                              <div>
                                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 group-hover:text-[#8B2A0F] dark:group-hover:text-amber-400 transition-colors leading-tight">
                                  {s.name}
                                </p>
                                <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{s.shortDescription || s.description || 'Professional consultancy support'}</p>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="col-span-2 py-8 text-center text-xs text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900">
                            No services available
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              <Link
                to="/brochures"
                onClick={closeAllMenus}
                className="hidden lg:inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold tracking-wide text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
              >
                <HiDocumentText className="h-4 w-4" />
                Brochure
              </Link>

              {/* Theme */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {theme === 'dark' ? <HiSun className="w-[18px] h-[18px]" /> : <HiMoon className="w-[18px] h-[18px]" />}
              </button>

              {isLoggedIn ? (
                <>
                  <NotificationMenu role={user?.role} />

                  <div className="relative" ref={profileRef}>
                    <button
                    onPointerDown={(e) => e.stopPropagation()} 
                      onClick={() => {
                        closeServicesMenu()
                        setProfileOpen((prev) => !prev)
                      }}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ml-1"
                    >
                      {user?.avatar?.url
                        ? <img src={user.avatar.url} alt={`${user.firstName || 'User'} profile`} loading="lazy" className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-300/30" />
                        : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B2A0F] to-[#5c1c09] flex items-center justify-center ring-2 ring-amber-300/30">
                            <span className="text-white text-sm font-bold">{user?.firstName?.[0]}</span>
                          </div>
                      }
                      <span className="hidden md:block text-[13px] font-semibold text-stone-700 dark:text-stone-200">
                        {user?.firstName}
                      </span>
                      <HiChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 py-2 overflow-hidden"
                        >
                          <div className="px-4 py-3 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
                            <p className="text-sm font-bold text-stone-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-stone-500 capitalize mt-0.5">{user?.role?.replace('_', ' ')}</p>
                          </div>
                          {[
                            { icon: HiViewGrid, label: 'Dashboard', to: getDashboardLink() },
                            { icon: HiUser, label: 'My Profile', to: `${getDashboardLink()}/profile` },
                            ...(canSubmitTestimonial ? [{ icon: HiChatAlt2, label: 'Submit Testimonial', to: '/submit-testimonial' }] : []),
                          ].map(({ icon: Icon, label, to }) => (
                            <Link key={to} to={to} onClick={closeProfileMenu}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:text-[#8B2A0F] dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors">
                              <Icon className="w-4 h-4" /> {label}
                            </Link>
                          ))}
                          <div className="border-t border-stone-200 dark:border-stone-800 mt-1 pt-1">
                            <button onClick={() => { closeAllMenus(); setShowLogoutConfirm(true) }}
                              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              <HiLogout className="w-4 h-4" /> Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2 ml-2">
                  <Link to="/login"
                    className="px-4 py-2 text-[13px] font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800">
                    Sign In
                  </Link>
                  <Link to="/register"
                    className="px-5 py-2 text-[13px] font-bold bg-[#8B2A0F] hover:bg-[#a03212] text-white rounded-lg transition-colors shadow-sm">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ml-1"
              >
                {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 overflow-hidden"
            >
              <div className="page-container py-4 flex flex-col gap-0.5">
                {navLinks.map(({ label, to }) => (
                  <NavLink key={to} to={to} onClickCapture={closeAllMenus}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-semibold ${
                        isActive
                          ? 'text-[#8B2A0F] dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900'
                      }`
                    }>{label}</NavLink>
                ))}

                <NavLink
                  to="/brochures"
                  onClickCapture={closeAllMenus}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-semibold ${
                      isActive
                        ? 'text-[#8B2A0F] dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900'
                    }`
                  }
                >
                  Brochure
                </NavLink>

                <div className="border-t border-stone-200 dark:border-stone-800 mt-2 pt-3">
                  <p className="px-4 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-[0.28em]">Services</p>
                  {services.length > 0 ? (
                    services.map((s) => (
                      <Link key={s.slug || s.name} to={getServiceRoute(s.slug)} onClickCapture={closeAllMenus}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-600 dark:text-stone-400 hover:text-[#8B2A0F] dark:hover:text-amber-400 transition-colors">
                        <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                        {s.name}
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-xs text-stone-400">No services available</p>
                  )}
                </div>

                {!isLoggedIn && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                    <Link to="/login" onClickCapture={closeAllMenus}
                      className="flex-1 py-2.5 text-sm font-semibold text-center border border-stone-300 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors">
                      Sign In
                    </Link>
                    <Link to="/register" onClickCapture={closeAllMenus}
                      className="flex-1 py-2.5 text-sm font-bold text-center bg-[#8B2A0F] text-white rounded-xl hover:bg-[#a03212] transition-colors">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Logout"
      />
    </div>
  )
}
