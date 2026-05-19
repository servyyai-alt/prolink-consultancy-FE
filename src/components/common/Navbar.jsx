// import { useState, useEffect, useRef } from 'react'
// import { Link, NavLink, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { motion, AnimatePresence } from 'framer-motion'
// import { HiMenu, HiX, HiChevronDown, HiBell, HiMoon, HiSun, HiUser, HiLogout, HiViewGrid } from 'react-icons/hi'
// import { selectIsLoggedIn, selectUser, logoutUser } from '../../redux/slices/authSlice'
// import { toggleTheme, selectTheme } from '../../redux/slices/uiSlice'
// import { selectUnreadCount } from '../../redux/slices/notificationSlice'

// const services = [
//   { name: 'Job Consultancy',   href: '/services/job-consultancy' },
//   { name: 'CV Writing',        href: '/cv-writing' },
//   { name: 'Campus Drive',      href: '/campus-drive' },
//   { name: 'Event Management',  href: '/events' },
//   { name: 'Catering Services', href: '/catering' },
//   { name: 'HR Outsourcing',    href: '/services/hr-outsourcing' },
//   { name: 'Background Verification', href: '/services/background-verification' },
//   { name: 'Plant Set-Up',      href: '/services/plant-setup' },
// ]

// const navLinks = [
//   { label: 'Home',     to: '/' },
//   { label: 'About',    to: '/about' },
//   { label: 'Jobs',     to: '/jobs' },
//   { label: 'Blogs',    to: '/blogs' },
//   { label: 'Contact',  to: '/contact' },
// ]

// export default function Navbar() {
//   const [scrolled,     setScrolled]     = useState(false)
//   const [mobileOpen,   setMobileOpen]   = useState(false)
//   const [servicesOpen, setServicesOpen] = useState(false)
//   const [profileOpen,  setProfileOpen]  = useState(false)
//   const dropdownRef = useRef(null)
//   const profileRef  = useRef(null)

//   const dispatch    = useDispatch()
//   const navigate    = useNavigate()
//   const isLoggedIn  = useSelector(selectIsLoggedIn)
//   const user        = useSelector(selectUser)
//   const theme       = useSelector(selectTheme)
//   const unreadCount = useSelector(selectUnreadCount)

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20)
//     window.addEventListener('scroll', onScroll, { passive: true })
//     return () => window.removeEventListener('scroll', onScroll)
//   }, [])

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setServicesOpen(false)
//       if (profileRef.current  && !profileRef.current.contains(e.target))  setProfileOpen(false)
//     }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [])

//   const handleLogout = async () => {
//     await dispatch(logoutUser())
//     navigate('/')
//     setProfileOpen(false)
//   }

//   const getDashboardLink = () => {
//     if (!user) return '/login'
//     if (['admin', 'super_admin', 'recruiter'].includes(user.role)) return '/admin'
//     if (user.role === 'employer') return '/employer'
//     return '/dashboard'
//   }

//   return (
//     <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//       scrolled ? 'bg-white/90 dark:bg-stone-950/92 backdrop-blur-xl shadow-sm border-b border-stone-200/70 dark:border-stone-800' 
//                : 'bg-transparent'
//     }`}>
//       <div className="page-container">
//         <div className="flex items-center justify-between h-16 md:h-18">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2.5 group">
//             <div className="relative w-11 h-11 flex items-center justify-center">
//               <span className="absolute top-0 left-1/2 w-2.5 h-2.5 rounded-full bg-primary-700 -translate-x-1/2" />
//               <span className="absolute left-0 top-4 w-2.5 h-2.5 rounded-full bg-primary-700" />
//               <span className="absolute right-0 top-4 w-2.5 h-2.5 rounded-full bg-primary-700" />
//               <div className="w-9 h-9 rounded-full border-[5px] border-accent-400 group-hover:scale-105 transition-transform" />
//             </div>
//             <div className="leading-none">
//               <span className="font-sans font-extrabold text-xl tracking-tight text-stone-950 dark:text-white">
//                 Pro<span className="text-accent-500">l</span>ink
//               </span>
//               <p className="text-[10px] uppercase tracking-[0.32em] text-stone-500 dark:text-stone-400 mt-1">Staffing Consultancy</p>
//             </div>
//           </Link>

//           {/* Desktop Nav */}
//           <nav className="hidden lg:flex items-center gap-1">
//             {navLinks.map(({ label, to }) => (
//               <NavLink key={to} to={to}
//                 className={({ isActive }) => `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
//                   isActive ? 'text-primary-800 bg-accent-100/70 dark:bg-primary-950/40' 
//                            : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-white/70 dark:hover:bg-stone-900'
//                 }`}
//               >{label}</NavLink>
//             ))}

//             {/* Services Dropdown */}
//             <div className="relative" ref={dropdownRef}>
//               <button onClick={() => setServicesOpen(!servicesOpen)}
//                 className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-white/70 dark:hover:bg-stone-900 transition-colors">
//                 Services
//                 <HiChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
//               </button>

//               <AnimatePresence>
//                 {servicesOpen && (
//                   <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
//                     transition={{ duration: 0.15 }}
//                     className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 overflow-hidden">
//                     {services.map((s) => (
//                       <Link key={s.href} to={s.href} onClick={() => setServicesOpen(false)}
//                         className="block px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:text-primary-800 hover:bg-accent-50 dark:hover:bg-primary-950/20 transition-colors font-medium">
//                         {s.name}
//                       </Link>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </nav>

//           {/* Right actions */}
//           <div className="flex items-center gap-2">
//             {/* Theme toggle */}
//             <button onClick={() => dispatch(toggleTheme())}
//               className="p-2 rounded-lg text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-white hover:bg-white/70 dark:hover:bg-stone-900 transition-colors">
//               {theme === 'dark' ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
//             </button>

//             {isLoggedIn ? (
//               <>
//                 {/* Notifications */}
//                 <Link to={`${getDashboardLink()}/notifications`}
//                   className="relative p-2 rounded-lg text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-white hover:bg-white/70 dark:hover:bg-stone-900 transition-colors">
//                   <HiBell className="w-5 h-5" />
//                   {unreadCount > 0 && (
//                     <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
//                       {unreadCount > 9 ? '9+' : unreadCount}
//                     </span>
//                   )}
//                 </Link>

//                 {/* Profile Dropdown */}
//                 <div className="relative" ref={profileRef}>
//                   <button onClick={() => setProfileOpen(!profileOpen)}
//                     className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/70 dark:hover:bg-stone-900 transition-colors">
//                     {user?.avatar?.url
//                       ? <img src={user.avatar.url} alt={user.firstName} className="w-8 h-8 rounded-full object-cover" />
//                       : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center">
//                           <span className="text-white text-sm font-bold">{user?.firstName?.[0]}</span>
//                         </div>
//                     }
//                     <span className="hidden md:block text-sm font-semibold text-stone-700 dark:text-stone-200">
//                       {user?.firstName}
//                     </span>
//                     <HiChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
//                   </button>

//                   <AnimatePresence>
//                     {profileOpen && (
//                       <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
//                         className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2">
//                         <div className="px-4 py-2 border-b border-stone-200 dark:border-stone-800">
//                           <p className="text-sm font-bold text-stone-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
//                           <p className="text-xs text-stone-500 capitalize">{user?.role?.replace('_', ' ')}</p>
//                         </div>
//                         <Link to={getDashboardLink()} onClick={() => setProfileOpen(false)}
//                           className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:text-primary-800 hover:bg-accent-50 dark:hover:bg-primary-950/20 transition-colors">
//                           <HiViewGrid className="w-4 h-4" /> Dashboard
//                         </Link>
//                         <Link to={`${getDashboardLink()}/profile`} onClick={() => setProfileOpen(false)}
//                           className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:text-primary-800 hover:bg-accent-50 dark:hover:bg-primary-950/20 transition-colors">
//                           <HiUser className="w-4 h-4" /> My Profile
//                         </Link>
//                         <button onClick={handleLogout}
//                           className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
//                           <HiLogout className="w-4 h-4" /> Logout
//                         </button>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </>
//             ) : (
//               <div className="hidden md:flex items-center gap-2">
//                 <Link to="/login"    className="btn-ghost text-sm py-2">Sign In</Link>
//                 <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
//               </div>
//             )}

//             {/* Mobile menu toggle */}
//             <button onClick={() => setMobileOpen(!mobileOpen)}
//               className="lg:hidden p-2 rounded-lg text-stone-500 hover:bg-white/70 dark:hover:bg-stone-900 transition-colors">
//               {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
//             className="lg:hidden bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 overflow-hidden">
//             <div className="page-container py-4 flex flex-col gap-1">
//               {navLinks.map(({ label, to }) => (
//                 <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
//                   className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-semibold ${
//                     isActive ? 'text-primary-800 bg-accent-50 dark:bg-primary-950/20' : 'text-stone-700 dark:text-stone-300'
//                   }`}>{label}</NavLink>
//               ))}
//               <div className="border-t border-stone-200 dark:border-stone-800 mt-2 pt-3">
//                 <p className="px-4 py-1 text-xs font-bold text-stone-400 uppercase tracking-wider">Services</p>
//                 {services.map((s) => (
//                   <Link key={s.href} to={s.href} onClick={() => setMobileOpen(false)}
//                     className="block px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:text-primary-800">
//                     {s.name}
//                   </Link>
//                 ))}
//               </div>
//               {!isLoggedIn && (
//                 <div className="flex gap-2 mt-3 pt-3 border-t border-stone-200 dark:border-stone-800">
//                   <Link to="/login"    onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-sm py-2.5 text-center">Sign In</Link>
//                   <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-sm py-2.5 text-center">Register</Link>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   )
// }

import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiMenu, HiX, HiChevronDown, HiBell, HiMoon, HiSun,
  HiUser, HiLogout, HiViewGrid, HiPhone, HiMail,
} from 'react-icons/hi'
import { selectIsLoggedIn, selectUser, logoutUser } from '../../redux/slices/authSlice'
import { toggleTheme, selectTheme } from '../../redux/slices/uiSlice'
import { selectUnreadCount } from '../../redux/slices/notificationSlice'
import Logo from '../../assets/logo.jpeg'

const TOP_BAR_CONTACT = [
  { icon: HiPhone, label: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: HiMail,  label: 'info@prolinkconsultancy.com', href: 'mailto:info@prolinkconsultancy.com' },
]

const services = [
  { name: 'Job Consultancy',        href: '/services/job-consultancy',         desc: 'Executive & mid-level placements' },
  { name: 'CV Writing',             href: '/cv-writing',                        desc: 'Premium profile positioning' },
  { name: 'Campus Drive',           href: '/campus-drive',                      desc: 'Structured volume hiring' },
  { name: 'Event Management',       href: '/events',                            desc: 'Corporate event coordination' },
  { name: 'Catering Services',      href: '/catering',                          desc: 'End-to-end catering support' },
  { name: 'HR Outsourcing',         href: '/services/hr-outsourcing',           desc: 'Managed HR operations' },
  { name: 'Background Verification',href: '/services/background-verification',  desc: 'Trust-led candidate checks' },
  { name: 'Plant Set-Up',           href: '/services/plant-setup',              desc: 'Workforce for new facilities' },
]

const navLinks = [
  { label: 'Home',    to: '/' },
  { label: 'About',   to: '/about' },
  { label: 'Jobs',    to: '/jobs' },
  { label: 'Blogs',   to: '/blogs' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const dropdownRef = useRef(null)
  const profileRef  = useRef(null)

  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const isLoggedIn  = useSelector(selectIsLoggedIn)
  const user        = useSelector(selectUser)
  const theme       = useSelector(selectTheme)
  const unreadCount = useSelector(selectUnreadCount)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setServicesOpen(false)
      if (profileRef.current  && !profileRef.current.contains(e.target))  setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/')
    setProfileOpen(false)
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    if (['admin', 'super_admin', 'recruiter'].includes(user.role)) return '/admin'
    if (user.role === 'employer') return '/employer'
    return '/dashboard'
  }

  return (
    <>
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
              <span>Mon–Sat, 9:00–18:00</span>
              <span className="w-px h-3 bg-stone-700" />
              <span className="text-amber-400 font-semibold tracking-wide">Chennai, Tamil Nadu</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-stone-950/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-stone-200/70 dark:border-stone-800/70'
          : 'bg-white dark:bg-stone-950 border-b border-stone-200/60 dark:border-stone-800/60'
      }`}>
        <div className="page-container">
          <div className="flex items-center justify-between h-[68px]">

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
                <NavLink key={to} to={to}
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
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
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[560px] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden"
                    >
                      {/* Dropdown header */}
                      <div className="bg-gradient-to-r from-[#1a0e07] to-[#2d1608] px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold">Our Services</p>
                          <h3 className="text-white font-bold text-lg mt-0.5">What we do best</h3>
                        </div>
                        <Link to="/services"
                          onClick={() => setServicesOpen(false)}
                          className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 border border-amber-800/60 rounded-lg px-3 py-1.5 hover:bg-amber-400/10 transition-colors">
                          All Services →
                        </Link>
                      </div>

                      {/* Service grid */}
                      <div className="grid grid-cols-2 gap-px bg-stone-100 dark:bg-stone-800 p-px">
                        {services.map((s) => (
                          <Link
                            key={s.href}
                            to={s.href}
                            onClick={() => setServicesOpen(false)}
                            className="group flex items-start gap-3 px-5 py-4 bg-white dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
                          >
                            <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-[#8B2A0F] transition-colors" />
                            <div>
                              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 group-hover:text-[#8B2A0F] dark:group-hover:text-amber-400 transition-colors leading-tight">
                                {s.name}
                              </p>
                              <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{s.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {/* Theme */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {theme === 'dark' ? <HiSun className="w-[18px] h-[18px]" /> : <HiMoon className="w-[18px] h-[18px]" />}
              </button>

              {isLoggedIn ? (
                <>
                  <Link
                    to={`${getDashboardLink()}/notifications`}
                    className="relative p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <HiBell className="w-[18px] h-[18px]" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ml-1"
                    >
                      {user?.avatar?.url
                        ? <img src={user.avatar.url} alt={user.firstName} className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-300/30" />
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
                          ].map(({ icon: Icon, label, to }) => (
                            <Link key={to} to={to} onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:text-[#8B2A0F] dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors">
                              <Icon className="w-4 h-4" /> {label}
                            </Link>
                          ))}
                          <div className="border-t border-stone-200 dark:border-stone-800 mt-1 pt-1">
                            <button onClick={handleLogout}
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
                  <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-semibold ${
                        isActive
                          ? 'text-[#8B2A0F] dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900'
                      }`
                    }>{label}</NavLink>
                ))}

                <div className="border-t border-stone-200 dark:border-stone-800 mt-2 pt-3">
                  <p className="px-4 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-[0.28em]">Services</p>
                  {services.map((s) => (
                    <Link key={s.href} to={s.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-600 dark:text-stone-400 hover:text-[#8B2A0F] dark:hover:text-amber-400 transition-colors">
                      <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                      {s.name}
                    </Link>
                  ))}
                </div>

                {!isLoggedIn && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                    <Link to="/login" onClick={() => setMobileOpen(false)}
                      className="flex-1 py-2.5 text-sm font-semibold text-center border border-stone-300 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}
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
    </>
  )
}