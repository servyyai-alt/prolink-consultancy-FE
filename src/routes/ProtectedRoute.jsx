import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn, selectRole } from '../redux/slices/authSlice'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const role       = useSelector(selectRole)
  const location   = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to proper dashboard
    if (['admin', 'super_admin', 'recruiter'].includes(role)) return <Navigate to="/admin" replace />
    if (role === 'employer') return <Navigate to="/employer" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}
