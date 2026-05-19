// ── useDebounce ───────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react'

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// ── useLocalStorage ───────────────────────────────────────────────────────────
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) { console.error(error) }
  }

  return [storedValue, setValue]
}

// ── useClickOutside ───────────────────────────────────────────────────────────
export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// ── useSocket ─────────────────────────────────────────────────────────────────
import { io } from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import { selectAccessToken, selectIsLoggedIn } from '../redux/slices/authSlice'
import { addNotification } from '../redux/slices/notificationSlice'

let socketInstance = null

export function useSocket() {
  const dispatch    = useDispatch()
  const isLoggedIn  = useSelector(selectIsLoggedIn)
  const accessToken = useSelector(selectAccessToken)

  useEffect(() => {
    if (!isLoggedIn || !accessToken) return

    socketInstance = io(import.meta.env.VITE_SOCKET_URL || '', {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    })

    socketInstance.on('connect', () => console.log('🔌 Socket connected'))

    socketInstance.on('notification', (notification) => {
      dispatch(addNotification(notification))
    })

    socketInstance.on('disconnect', () => console.log('🔌 Socket disconnected'))

    return () => {
      if (socketInstance) { socketInstance.disconnect(); socketInstance = null }
    }
  }, [isLoggedIn, accessToken])

  return socketInstance
}

export const getSocket = () => socketInstance

// ── usePagination ─────────────────────────────────────────────────────────────
export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page,  setPage]  = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const goToPage   = useCallback((p) => setPage(p), [])
  const nextPage   = useCallback(() => setPage(p => p + 1), [])
  const prevPage   = useCallback(() => setPage(p => Math.max(1, p - 1)), [])
  const reset      = useCallback(() => setPage(1), [])

  return { page, limit, setPage: goToPage, nextPage, prevPage, setLimit, reset }
}

// ── useRazorpay ───────────────────────────────────────────────────────────────
import { paymentAPI } from '../services/api'
import toast from 'react-hot-toast'

export function useRazorpay() {
  const loadScript = () =>
    new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) { resolve(true); return }
      const script = document.createElement('script')
      script.id  = 'razorpay-script'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload  = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const initiatePayment = async ({ amount, type, referenceId, description, prefill, onSuccess }) => {
    const loaded = await loadScript()
    if (!loaded) { toast.error('Payment gateway failed to load'); return }

    try {
      const { data } = await paymentAPI.createRazorpayOrder({ amount, type, referenceId, description })
      const { orderId, keyId } = data.data

      const options = {
        key:      keyId,
        amount:   amount * 100,
        currency: 'INR',
        name:     'ProLink Consultancy',
        description,
        order_id: orderId,
        prefill,
        theme: { color: '#7f1313' },
        handler: async (response) => {
          try {
            await paymentAPI.verifyRazorpay({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            })
            toast.success('Payment successful!')
            onSuccess?.(response)
          } catch { toast.error('Payment verification failed') }
        },
        modal: { ondismiss: () => toast('Payment cancelled', { icon: '⚠️' }) },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch { toast.error('Failed to initiate payment') }
  }

  return { initiatePayment }
}

// ── useInfiniteScroll ─────────────────────────────────────────────────────────
export function useInfiniteScroll(callback, hasMore) {
  const observer = useRef()
  const lastElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) callback()
    })
    if (node) observer.current.observe(node)
  }, [hasMore, callback])

  return lastElementRef
}
