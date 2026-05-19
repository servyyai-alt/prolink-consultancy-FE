// ============================================================
// src/components/ui/Button.jsx
// ============================================================
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const variants = {
  primary:   'bg-primary-600 hover:bg-primary-700 text-white shadow-primary hover:shadow-lg',
  secondary: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
  ghost:     'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  success:   'bg-green-600 hover:bg-green-700 text-white',
  outline:   'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
}
const sizes = {
  xs:  'px-3 py-1.5 text-xs rounded-lg',
  sm:  'px-4 py-2 text-sm rounded-xl',
  md:  'px-6 py-3 text-sm rounded-xl',
  lg:  'px-8 py-3.5 text-base rounded-xl',
  xl:  'px-10 py-4 text-lg rounded-2xl',
}

export function Button({ children, variant = 'primary', size = 'md', isLoading, className, disabled, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || isLoading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}

// ============================================================
// src/components/ui/Input.jsx
// ============================================================
import { forwardRef } from 'react'

export const Input = forwardRef(function Input(
  { label, error, helperText, leftIcon: LeftIcon, rightIcon: RightIcon, className, required, ...props }, ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'input-field',
            LeftIcon && 'pl-10',
            RightIcon && 'pr-10',
            error && 'border-red-400 focus:ring-red-400',
            className
          )}
          {...props}
        />
        {RightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <RightIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
    </div>
  )
})

// ============================================================
// src/components/ui/Textarea.jsx
// ============================================================
export const Textarea = forwardRef(function Textarea({ label, error, rows = 4, required, className, ...props }, ref) {
  return (
    <div className="w-full">
      {label && <label className="label">{label} {required && <span className="text-red-500">*</span>}</label>}
      <textarea
        ref={ref}
        rows={rows}
        className={clsx('input-field resize-none', error && 'border-red-400 focus:ring-red-400', className)}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
})

// ============================================================
// src/components/ui/Select.jsx
// ============================================================
export const Select = forwardRef(function Select({ label, error, options = [], placeholder, required, className, ...props }, ref) {
  return (
    <div className="w-full">
      {label && <label className="label">{label} {required && <span className="text-red-500">*</span>}</label>}
      <select
        ref={ref}
        className={clsx('input-field', error && 'border-red-400', className)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(({ value, label: l }) => (
          <option key={value} value={value}>{l}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
})

// ============================================================
// src/components/ui/Badge.jsx
// ============================================================
const badgeVariants = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger:  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  gray:    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  purple:  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  teal:    'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

export function Badge({ children, variant = 'gray', className }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', badgeVariants[variant], className)}>
      {children}
    </span>
  )
}

// ============================================================
// src/components/ui/Modal.jsx
// ============================================================
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { HiX } from 'react-icons/hi'

const modalSizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' }

export function Modal({ isOpen, onClose, title, children, size = 'md', hideClose = false }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={clsx('relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full overflow-hidden', modalSizes[size])}>
        {(title || !hideClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            {title && <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>}
            {!hideClose && (
              <button onClick={onClose} className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <HiX className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto max-h-[80vh]">{children}</div>
      </motion.div>
    </div>,
    document.body
  )
}

// ============================================================
// src/components/ui/Skeleton.jsx
// ============================================================
export function Skeleton({ className }) {
  return <div className={clsx('skeleton', className)} />
}

export function JobCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex gap-3">
        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-5/6 rounded" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  )
}

// ============================================================
// src/components/ui/Pagination.jsx
// ============================================================
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <HiChevronLeft className="w-4 h-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">1</button>
          {pages[0] > 2 && <span className="text-slate-400 px-1">…</span>}
        </>
      )}

      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={clsx('w-9 h-9 rounded-lg text-sm font-medium transition-colors',
            p === currentPage
              ? 'bg-primary-600 text-white shadow-primary'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          )}>
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-slate-400 px-1">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">{totalPages}</button>
        </>
      )}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <HiChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ============================================================
// src/components/ui/EmptyState.jsx
// ============================================================
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      {description && <p className="text-slate-500 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  )
}

// ============================================================
// src/components/ui/StatsCard.jsx
// ============================================================
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

export function StatsCard({ label, value, suffix = '', prefix = '', icon: Icon, color = 'primary', change }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const colorMap = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600',
    green:   'bg-green-50 dark:bg-green-900/20 text-green-600',
    amber:   'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    red:     'bg-red-50 dark:bg-red-900/20 text-red-600',
    purple:  'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
  }
  return (
    <div ref={ref} className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', colorMap[color])}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {change !== undefined && (
          <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">
        {prefix}
        {inView ? <CountUp end={value} duration={2} separator="," /> : 0}
        {suffix}
      </p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}
