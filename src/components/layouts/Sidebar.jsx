// import React, { memo } from 'react'
// import { NavLink, Link } from 'react-router-dom'
// import {
//   HiLogout,
//   HiSun,
//   HiMoon,
// } from 'react-icons/hi'

// import Logo from '../../assets/logo.jpeg'

// const Sidebar = memo(({
//   mobile = false,
//   navLinks,
//   user,
//   theme,
//   dark = false,
//   onToggleTheme,
//   onLogout,
//   onClose,
// }) => {
//   return (
//     <div
//       className={`
//         flex flex-col h-full
//         ${dark
//           ? 'bg-slate-900 border-slate-800'
//           : 'bg-white border-slate-200'}
//         ${mobile ? '' : 'border-r'}
//       `}
//     >
//       {/* Logo */}
//       <div className="px-6 py-5 border-b border-inherit">
//         <Link
//           to="/"
//           className="flex items-center gap-3"
//           onClick={onClose}
//         >
//           <img
//             src={Logo}
//             alt="Logo"
//             className="h-14 w-auto object-contain"
//           />
//         </Link>
//       </div>

//       {/* User */}
//       <div className="px-4 py-4 border-b border-inherit">
//         <div
//           className={`
//             flex items-center gap-3 p-3 rounded-2xl
//             ${dark ? 'bg-slate-800' : 'bg-slate-100'}
//           `}
//         >
//           {user?.avatar?.url ? (
//             <img
//               src={user.avatar.url}
//               alt="User"
//               className="w-11 h-11 rounded-full object-cover"
//             />
//           ) : (
//             <div className="w-11 h-11 rounded-full bg-primary-600 flex items-center justify-center">
//               <span className="text-white font-bold">
//                 {user?.firstName?.[0] || 'U'}
//               </span>
//             </div>
//           )}

//           <div className="min-w-0">
//             <p
//               className={`
//                 text-sm font-bold truncate
//                 ${dark ? 'text-white' : 'text-slate-900'}
//               `}
//             >
//               {user?.firstName} {user?.lastName}
//             </p>

//             <p className="text-xs text-slate-500 capitalize">
//               {user?.role?.replace('_', ' ')}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
//         {navLinks.map(({ to, icon: Icon, label, end }) => (
//           <NavLink
//             key={to}
//             to={to}
//             end={end}
//             onClick={onClose}
//             className={({ isActive }) =>
//               `
//               flex items-center gap-3
//               px-3 py-2.5 rounded-xl
//               text-sm font-semibold
//               transition-all duration-200

//               ${
//                 isActive
//                   ? dark
//                     ? 'bg-primary-900/30 text-primary-400'
//                     : 'bg-primary-50 text-primary-700'
//                   : dark
//                     ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
//                     : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
//               }
//             `
//             }
//           >
//             <Icon className="w-5 h-5 flex-shrink-0" />
//             {label}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Bottom */}
//       <div className="px-3 py-4 border-t border-inherit space-y-1">
//         <button
//           onClick={onToggleTheme}
//           className={`
//             flex items-center gap-3
//             w-full px-3 py-2.5 rounded-xl
//             text-sm font-semibold transition-all

//             ${
//               dark
//                 ? 'text-slate-300 hover:bg-slate-800'
//                 : 'text-slate-700 hover:bg-slate-100'
//             }
//           `}
//         >
//           {theme === 'dark'
//             ? <HiSun className="w-5 h-5" />
//             : <HiMoon className="w-5 h-5" />
//           }

//           {theme === 'dark'
//             ? 'Light Mode'
//             : 'Dark Mode'}
//         </button>

//         <button
//           onClick={onLogout}
//           className="
//             flex items-center gap-3
//             w-full px-3 py-2.5 rounded-xl
//             text-sm font-semibold
//             text-red-500
//             hover:bg-red-50
//             dark:hover:bg-red-900/20
//             transition-all
//           "
//         >
//           <HiLogout className="w-5 h-5" />
//           Logout
//         </button>
//       </div>
//     </div>
//   )
// })

// Sidebar.displayName = 'Sidebar'

// export default Sidebar

import React, { memo } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  HiLogout,
  HiSun,
  HiMoon,
} from 'react-icons/hi'

import Logo from '../../assets/logo.jpeg'

const Sidebar = memo(({
  mobile = false,
  navLinks,
  user,
  theme,
  dark = false,
  onToggleTheme,
  onLogout,
  onClose,
}) => {
  return (
    <div
      className={`
        flex flex-col h-full
        ${dark
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-slate-200'}
        ${mobile ? '' : 'border-r'}
      `}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-inherit">
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={onClose}
        >
          <img
            src={Logo}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b border-inherit">
        <div
          className={`
            flex items-center gap-3 p-3 rounded-2xl
            ${dark ? 'bg-slate-800' : 'bg-slate-100'}
          `}
        >
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt="User"
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.firstName?.[0] || 'U'}
              </span>
            </div>
          )}

          <div className="min-w-0">
            <p
              className={`
                text-sm font-bold truncate
                ${dark ? 'text-white' : 'text-slate-900'}
              `}
            >
              {user?.firstName} {user?.lastName}
            </p>

            <p className="text-xs text-slate-500 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {navLinks.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
              onClick={onClose}
            className={({ isActive }) =>
              `
              flex items-center gap-3
              px-3 py-2.5 rounded-xl
              text-sm font-semibold
              transition-all duration-200

              ${
                isActive
                  ? dark
                    ? 'bg-primary-900/30 text-primary-400'
                    : 'bg-primary-50 text-primary-700'
                  : dark
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }
            `
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-inherit space-y-1">
        <button
          onClick={onToggleTheme}
          className={`
            flex items-center gap-3
            w-full px-3 py-2.5 rounded-xl
            text-sm font-semibold transition-all

            ${
              dark
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-slate-700 hover:bg-slate-100'
            }
          `}
        >
          {theme === 'dark'
            ? <HiSun className="w-5 h-5" />
            : <HiMoon className="w-5 h-5" />
          }

          {theme === 'dark'
            ? 'Light Mode'
            : 'Dark Mode'}
        </button>

        <button
          onClick={onLogout}
          className="
            flex items-center gap-3
            w-full px-3 py-2.5 rounded-xl
            text-sm font-semibold
            text-red-500
            hover:bg-red-50
            dark:hover:bg-red-900/20
            transition-all
          "
        >
          <HiLogout className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar