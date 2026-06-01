import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiBell, HiCheck, HiCheckCircle } from 'react-icons/hi'
import {
  markAllRead,
  markOneRead,
  selectNotifications,
  selectUnreadCount,
} from '../../redux/slices/notificationSlice'
import { notificationAPI } from '../../services/api'

const fallbackLink = (role) => {
  if (role === 'employer') return '/employer'
  if (['admin', 'super_admin', 'recruiter'].includes(role)) return '/admin'
  return '/dashboard'
}

const formatTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function NotificationMenu({ role }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const notifications = useSelector(selectNotifications)
  const unread = useSelector(selectUnreadCount)
  const [open, setOpen] = useState(false)
  const [isMarkingAll, setIsMarkingAll] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      dispatch(markOneRead(notification._id))
      notificationAPI.markOneRead(notification._id).catch(() => {})
    }

    setOpen(false)
    navigate(notification.link || fallbackLink(role))
  }

  const handleMarkAll = async () => {
    if (!unread || isMarkingAll) return
    setIsMarkingAll(true)
    dispatch(markAllRead())
    try {
      await notificationAPI.markAllRead()
    } finally {
      setIsMarkingAll(false)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Notifications"
      >
        <HiBell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[1rem] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Notifications</p>
              <p className="text-xs text-slate-500">{unread} unread</p>
            </div>
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={!unread || isMarkingAll}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-primary-300 dark:hover:bg-primary-900/20"
            >
              <HiCheck className="w-4 h-4" />
              Mark all
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <HiCheckCircle className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">No notifications</p>
                <p className="mt-1 text-xs text-slate-500">You are all caught up.</p>
              </div>
            ) : notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() => handleNotificationClick(notification)}
                className="flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
              >
                <span className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${notification.isRead ? 'bg-slate-300 dark:bg-slate-600' : 'bg-primary-600'}`} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {notification.title}
                  </span>
                  <span className="mt-0.5 block line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {notification.message}
                  </span>
                  <span className="mt-1 block text-[11px] font-medium text-slate-400">
                    {formatTime(notification.createdAt)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
