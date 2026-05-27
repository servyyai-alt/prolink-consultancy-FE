// import React, {
//   useState,
//   useCallback,
// } from 'react'

// import {
//   Outlet,
//   useNavigate,
// } from 'react-router-dom'

// import {
//   useDispatch,
//   useSelector,
// } from 'react-redux'

// import {
//   motion,
//   AnimatePresence,
// } from 'framer-motion'

// import {
//   HiViewGrid,
//   HiUsers,
//   HiBriefcase,
//   HiClipboardList,
//   HiMail,
//   HiNewspaper,
//   HiCollection,
//   HiStar,
//   HiMenu,
// } from 'react-icons/hi'

// import Sidebar from './Sidebar'

// import {
//   logoutUser,
//   selectUser,
// } from '../../redux/slices/authSlice'

// import {
//   toggleTheme,
//   selectTheme,
// } from '../../redux/slices/uiSlice'

// import ConfirmDialog from '../common/ConfirmDialog'

// const ADMIN_NAV = [
//   {
//     to: '/admin',
//     icon: HiViewGrid,
//     label: 'Dashboard',
//     end: true,
//   },
//   {
//     to: '/admin/users',
//     icon: HiUsers,
//     label: 'Users',
//   },
//   {
//     to: '/admin/jobs',
//     icon: HiBriefcase,
//     label: 'Jobs',
//   },
//   {
//     to: '/admin/applications',
//     icon: HiClipboardList,
//     label: 'Applications',
//   },
//   {
//     to: '/admin/contacts',
//     icon: HiMail,
//     label: 'Contacts',
//   },
//   {
//     to: '/admin/blogs',
//     icon: HiNewspaper,
//     label: 'Blogs',
//   },
//   {
//     to: '/admin/services',
//     icon: HiCollection,
//     label: 'Services',
//   },
//   {
//     to: '/admin/testimonials',
//     icon: HiStar,
//     label: 'Testimonials',
//   },
// ]

// const AdminLayout = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const user = useSelector(selectUser)
//   const theme = useSelector(selectTheme)

//   const [open, setOpen] = useState(false)

//   const [showLogoutConfirm, setShowLogoutConfirm] =
//     useState(false)

//   const dark = theme === 'dark'

//   const closeSidebar = useCallback(() => {
//     setOpen(false)
//   }, [])

//   const toggleThemeHandler = useCallback(() => {
//     dispatch(toggleTheme())
//   }, [dispatch])

//   const logoutHandler = useCallback(async () => {
//     await dispatch(logoutUser())
//     navigate('/')
//   }, [dispatch, navigate])

//   return (
//     <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
//       {/* Desktop Sidebar */}
//       <div className="hidden lg:block w-64 flex-shrink-0">
//         <Sidebar
//           navLinks={ADMIN_NAV}
//           user={user}
//           theme={theme}
//           dark
//           onToggleTheme={toggleThemeHandler}
//           onLogout={() => setShowLogoutConfirm(true)}
//           onClose={closeSidebar}
//         />
//       </div>

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {open && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={closeSidebar}
//               className="fixed inset-0 bg-black/60 z-40 lg:hidden"
//             />

//             <motion.div
//               initial={{ x: -280 }}
//               animate={{ x: 0 }}
//               exit={{ x: -280 }}
//               transition={{ duration: 0.25 }}
//               className="fixed left-0 top-0 bottom-0 z-50 w-72 lg:hidden"
//             >
//               <Sidebar
//                 mobile
//                 navLinks={ADMIN_NAV}
//                 user={user}
//                 theme={theme}
//                 dark
//                 onToggleTheme={toggleThemeHandler}
//                 onLogout={() => setShowLogoutConfirm(true)}
//                 onClose={closeSidebar}
//               />
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Main */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center gap-4">
//           <button
//             onClick={() => setOpen(true)}
//             className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
//           >
//             <HiMenu className="w-5 h-5" />
//           </button>

//           <h1 className="text-sm font-semibold text-slate-500">
//             Admin Panel
//           </h1>
//         </header>

//         <main className="flex-1 overflow-y-auto p-4 sm:p-6">
//           <Outlet />
//         </main>
//       </div>

//       <ConfirmDialog
//         isOpen={showLogoutConfirm}
//         onClose={() => setShowLogoutConfirm(false)}
//         onConfirm={logoutHandler}
//         title="Logout Confirmation"
//         message="Are you sure you want to logout?"
//         confirmLabel="Logout"
//       />
//     </div>
//   )
// }

// export default AdminLayout

import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiViewGrid, HiUsers, HiBriefcase, HiClipboardList,
  HiMail, HiNewspaper, HiCog, HiCurrencyRupee,
  HiStar, HiLogout, HiMenu, HiMoon, HiSun, HiCollection,
} from 'react-icons/hi'
import { logoutUser, selectUser } from '../../redux/slices/authSlice'
import { toggleTheme, selectTheme } from '../../redux/slices/uiSlice'
import ConfirmDialog from '../common/ConfirmDialog'
import Logo from '../../assets/logo.jpeg'

const ADMIN_NAV = [
  { to: '/admin',             icon: HiViewGrid,      label: 'Dashboard',    end: true },
  { to: '/admin/users',       icon: HiUsers,         label: 'Users' },
  { to: '/admin/jobs',        icon: HiBriefcase,     label: 'Jobs' },
  { to: '/admin/applications',icon: HiClipboardList, label: 'Applications' },
  { to: '/admin/contacts',    icon: HiMail,          label: 'Contacts' },
  { to: '/admin/blogs',       icon: HiNewspaper,     label: 'Blogs' },
  { to: '/admin/services',    icon: HiCollection,    label: 'Services' },
  { to: '/admin/team-members',icon: HiUsers,         label: 'Team' },
  // { to: '/admin/payments',    icon: HiCurrencyRupee, label: 'Payments' },
  { to: '/admin/testimonials',icon: HiStar,          label: 'Testimonials' },
]

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const sidebarRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user     = useSelector(selectUser)
  const theme    = useSelector(selectTheme)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/')
    setShowLogoutConfirm(false)
  }

  useEffect(() => {
    if (!open) return undefined

    const closeOnOutsideTouch = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideTouch, true)
    document.addEventListener('touchstart', closeOnOutsideTouch, true)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideTouch, true)
      document.removeEventListener('touchstart', closeOnOutsideTouch, true)
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="px-6 py-5 border-b border-slate-700">
        {/* <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div>
            <span className="font-display font-bold text-white">ProLink</span>
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Admin Panel</span>
          </div>
        </Link> */}
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
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
               </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {ADMIN_NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive ? 'bg-primary-600 text-white shadow-primary'
                       : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            onClick={() => setOpen(false)}>
            <Icon className="w-4 h-4 flex-shrink-0" />{label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 border-t border-slate-700 pt-3 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">{user?.firstName?.[0]}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.firstName}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button onClick={() => dispatch(toggleTheme())}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
          {theme === 'dark' ? <HiSun className="w-4 h-4" /> : <HiMoon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={() => {
          setOpen(false)
          setShowLogoutConfirm(true)
        }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300">
          <HiLogout className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
      <div className="hidden lg:block w-60 flex-shrink-0"><Sidebar /></div>

      <AnimatePresence>
  {open && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={() => setOpen(false)}
      />

      <motion.div
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        exit={{ x: -260 }}
        ref={sidebarRef}
        className="fixed left-0 top-0 bottom-0 z-50 w-64 lg:hidden shadow-2xl"
      >
        <Sidebar />
      </motion.div>
    </>
  )}
</AnimatePresence>

      <div
        className="flex-1 flex flex-col overflow-hidden"
        
      >
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3.5 flex items-center gap-4">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-500">
            <HiMenu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-slate-500">Admin Panel</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to log out of the admin panel?"
        confirmLabel="Logout"
      />
    </div>
  )
}
