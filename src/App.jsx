import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './redux/slices/authSlice'
import { selectTheme } from './redux/slices/uiSlice'
import { selectIsLoggedIn, selectRole } from './redux/slices/authSlice'
import PublicLayout from './components/layouts/PublicLayout'
import DashboardLayout from './components/layouts/DashboardLayout'
import AdminLayout from './components/layouts/AdminLayout'
import PageLoader from './components/common/PageLoader'
import ProtectedRoute from './routes/ProtectedRoute'

// Public pages
const Home          = lazy(() => import('./pages/Home'))
const About         = lazy(() => import('./pages/About'))
const Services      = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Jobs          = lazy(() => import('./pages/Jobs'))
const JobDetail     = lazy(() => import('./pages/JobDetail'))
const Blogs         = lazy(() => import('./pages/Blogs'))
const BlogDetail    = lazy(() => import('./pages/BlogDetail'))
const Contact       = lazy(() => import('./pages/Contact'))
const CvWriting     = lazy(() => import('./pages/CvWriting'))
const CampusDrive   = lazy(() => import('./pages/CampusDrive'))
const Events        = lazy(() => import('./pages/Events'))
const Catering      = lazy(() => import('./pages/Catering'))
const Terms         = lazy(() => import('./pages/Terms'))
const Privacy       = lazy(() => import('./pages/Privacy'))

// Auth pages
const Login         = lazy(() => import('./pages/auth/Login'))
const AdminLogin    = lazy(() => import('./pages/auth/AdminLogin'))
const Register      = lazy(() => import('./pages/auth/Register'))
const VerifyOTP     = lazy(() => import('./pages/auth/VerifyOTP'))
const ForgotPassword= lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))

// Job Seeker Dashboard
const JSOverview    = lazy(() => import('./pages/jobseeker/Overview'))
const JSProfile     = lazy(() => import('./pages/jobseeker/Profile'))
const JSApplications= lazy(() => import('./pages/jobseeker/Applications'))
const JSSavedJobs   = lazy(() => import('./pages/jobseeker/SavedJobs'))
const JSInterviews  = lazy(() => import('./pages/jobseeker/Interviews'))

// Employer Dashboard
const EmpOverview   = lazy(() => import('./pages/employer/Overview'))
const EmpPostJob    = lazy(() => import('./pages/employer/PostJob'))
const EmpMyJobs     = lazy(() => import('./pages/employer/MyJobs'))
const EmpApplicants = lazy(() => import('./pages/employer/Applicants'))
const EmpProfile    = lazy(() => import('./pages/employer/Profile'))

// Admin Dashboard
const AdminOverview = lazy(() => import('./pages/admin/Overview'))
const AdminUsers    = lazy(() => import('./pages/admin/Users'))
const AdminProfile  = lazy(() => import('./pages/admin/Profile'))
const AdminJobs     = lazy(() => import('./pages/admin/Jobs'))
const AdminApplications = lazy(() => import('./pages/admin/Applications'))
const AdminContacts = lazy(() => import('./pages/admin/Contacts'))
const AdminBlogs    = lazy(() => import('./pages/admin/Blogs'))
const AdminServices = lazy(() => import('./pages/admin/Services'))
const AdminPayments = lazy(() => import('./pages/admin/Payments'))
const AdminTestimonials = lazy(() => import('./pages/admin/Testimonials'))
const SubmitTestimonial = lazy(() => import('./pages/SubmitTestimonial'))

const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const role = useSelector(selectRole)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    if (isLoggedIn) dispatch(getMe())
  }, [])

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/"          element={<Home />} />
          <Route path="/about"     element={<About />} />
          <Route path="/services"  element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/jobs"      element={<Jobs />} />
          <Route path="/jobs/:slug" element={<JobDetail />} />
          <Route path="/blogs"     element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="/cv-writing" element={<CvWriting />} />
          <Route path="/campus-drive" element={<CampusDrive />} />
          <Route path="/events"    element={<Events />} />
          <Route path="/catering"  element={<Catering />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login"          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/admin/login"    element={isLoggedIn ? <Navigate to={['admin','super_admin','recruiter'].includes(role) ? '/admin' : '/dashboard'} /> : <AdminLogin />} />
        <Route path="/register"       element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/verify-otp"     element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/submit-testimonial" element={
          <ProtectedRoute>
            <SubmitTestimonial />
          </ProtectedRoute>
        } />

        {/* Job Seeker Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['job_seeker']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<JSOverview />} />
          <Route path="profile"      element={<JSProfile />} />
          <Route path="applications" element={<JSApplications />} />
          <Route path="saved-jobs"   element={<JSSavedJobs />} />
          <Route path="interviews"   element={<JSInterviews />} />
        </Route>

        {/* Employer Dashboard */}
        <Route path="/employer" element={
          <ProtectedRoute allowedRoles={['employer']}>
            <DashboardLayout variant="employer" />
          </ProtectedRoute>
        }>
          <Route index element={<EmpOverview />} />
          <Route path="post-job"    element={<EmpPostJob />} />
          <Route path="my-jobs"     element={<EmpMyJobs />} />
          <Route path="applicants"  element={<EmpApplicants />} />
          <Route path="profile"     element={<EmpProfile />} />
        </Route>

        {/* Admin Panel */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin', 'recruiter']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminOverview />} />
          <Route path="profile"      element={<AdminProfile />} />
          <Route path="users"        element={<AdminUsers />} />
          <Route path="jobs"         element={<AdminJobs />} />
          <Route path="jobs/create"  element={<EmpPostJob />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="contacts"     element={<AdminContacts />} />
          <Route path="blogs"        element={<AdminBlogs />} />
          <Route path="services"     element={<AdminServices />} />
          <Route path="payments"     element={<AdminPayments />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
        </Route>

        {/* Redirect /dashboard to role-specific */}
        <Route path="/dashboard" element={
          role === 'employer' ? <Navigate to="/employer" /> :
          ['admin','super_admin','recruiter'].includes(role) ? <Navigate to="/admin" /> :
          <Navigate to="/login" />
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
