import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor - attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prolink_access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401 with refresh token
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => (token ? resolve(token) : reject(error)))
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then((token) => { originalRequest.headers.Authorization = `Bearer ${token}`; return api(originalRequest) })
          .catch((err) => Promise.reject(err))
      }
      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('prolink_refresh_token')
      if (!refreshToken) {
        isRefreshing = false
        localStorage.removeItem('prolink_access_token')
        localStorage.removeItem('prolink_user')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken })
        const newToken = data.data.accessToken
        localStorage.setItem('prolink_access_token', newToken)
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Convenience methods
export const authAPI = {
  register:       (data) => api.post('/auth/register', data),
  login:          (data) => api.post('/auth/login', data),
  verifyOTP:      (data) => api.post('/auth/verify-otp', data),
  resendOTP:      (data) => api.post('/auth/resend-otp', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword:  (token, data) => api.post(`/auth/reset-password/${token}`, data),
  logout:         ()     => api.post('/auth/logout'),
  getMe:          ()     => api.get('/auth/me'),
  refreshToken:   (data) => api.post('/auth/refresh-token', data),
}

export const jobAPI = {
  getJobs:      (params) => api.get('/jobs', { params }),
  getJob:       (slug)   => api.get(`/jobs/${slug}`),
  getCategories:()       => api.get('/jobs/categories'),
  getMyJobs:    (params) => api.get('/jobs/my-jobs', { params }),
  createJob:    (data)   => api.post('/jobs', data),
  updateJob:    (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob:    (id)     => api.delete(`/jobs/${id}`),
}

export const applicationAPI = {
  apply:            (data)   => api.post('/applications', data),
  getMyApplications:(params) => api.get('/applications/my-applications', { params }),
  getJobApplications:(jobId, params) => api.get(`/applications/job/${jobId}`, { params }),
  updateStatus:     (id, data) => api.put(`/applications/${id}/status`, data),
  withdraw:         (id, data) => api.put(`/applications/${id}/withdraw`, data),
  scheduleInterview:(id, data) => api.put(`/applications/${id}/schedule-interview`, data),
}

export const userAPI = {
  getProfile:    ()           => api.get('/users/profile'),
  updateProfile: (data)       => api.put('/users/profile', data),
  changePassword:(data)       => api.put('/users/change-password', data),
  uploadAvatar:  (formData)   => api.post('/users/upload-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadCompanyLogo: (formData) => api.post('/users/upload-company-logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadResume:  (formData)   => api.post('/users/upload-resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  saveJob:       (jobId)      => api.post(`/users/save-job/${jobId}`),
  getSavedJobs:  ()           => api.get('/users/saved-jobs'),
}

export const serviceAPI = {
  getServices: (params)      => api.get('/services', { params }),
  getService:  (slug)        => api.get(`/services/${slug}`),
  create:      (data)        => api.post('/services', data),
  update:      (id, data)    => api.put(`/services/${id}`, data),
  delete:      (id)          => api.delete(`/services/${id}`),
}

export const teamMemberAPI = {
  getTeamMembers: (params)   => api.get('/team-members', { params }),
  create:         (data)     => api.post('/team-members', data),
  update:         (id, data) => api.put(`/team-members/${id}`, data),
  delete:         (id)       => api.delete(`/team-members/${id}`),
}

export const blogAPI = {
  getBlogs:             (params) => api.get('/blogs', { params }),
  getBlog:              (slug) => api.get(`/blogs/${slug}`),
  create:               (data) => api.post('/blogs', data),
  update:               (id, data) => api.put(`/blogs/${id}`, data),
  delete:               (id) => api.delete(`/blogs/${id}`),
  addComment:           (id, data) => api.post(`/blogs/${id}/comments`, data),
  updateCommentStatus:  (blogId, commentId, data) => api.patch(`/blogs/${blogId}/comments/${commentId}`, data),
  deleteComment:        (blogId, commentId) => api.delete(`/blogs/${blogId}/comments/${commentId}`),
}

export const contactAPI = {
  submit:         (data) => api.post('/contact', data),
  getMyInquiries: (params) => api.get('/contact/my-inquiries', { params }),
}

export const testimonialAPI = {
  getTestimonials: (params) => api.get('/testimonials', { params }),
  create:          (data)   => api.post('/testimonials', data),
}

export const cvAPI = {
  getPlans:    ()     => api.get('/cv/plans'),
  createOrder: (data) => api.post('/cv/order', data),
}

export const campusAPI = {
  getDrives: () => api.get('/campus'),
}

export const eventAPI = {
  getEvents: () => api.get('/events'),
}

export const cateringAPI = {
  submitInquiry: (data) => api.post('/catering/inquiry', data),
}

export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const brochureAPI = {
  getAll: () => api.get('/brochures'),
  create: (formData) => api.post('/brochures', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/brochures/${id}`),
}

export const notificationAPI = {
  getAll:      ()   => api.get('/notifications'),
  markAllRead: ()   => api.patch('/notifications/mark-read'),
  markOneRead: (id) => api.patch(`/notifications/${id}/read`),
}

export const adminAPI = {
  getDashboard:      ()       => api.get('/admin/dashboard-stats'),
  getUsers:          (params) => api.get('/admin/users', { params }),
  createUser:        (data)   => api.post('/admin/users', data),
  toggleBlock:       (id)     => api.patch(`/admin/users/${id}/block`),
  changeRole:        (id, data) => api.patch(`/admin/users/${id}/role`, data),
  approveUser:       (id, data) => api.patch(`/admin/users/${id}/approve`, data),
  deleteUser:        (id)     => api.delete(`/admin/users/${id}`),
  getContacts:       (params) => api.get('/admin/contacts', { params }),
  updateContact:     (id, data) => api.patch(`/admin/contacts/${id}`, data),
  getPayments:       (params) => api.get('/admin/payments', { params }),
  getApplications:   (params) => api.get('/admin/applications', { params }),
  getBlogs:          (params) => api.get('/admin/blogs', { params }),
  getServices:       (params) => api.get('/admin/services', { params }),
  getTeamMembers:    (params) => api.get('/admin/team-members', { params }),
  getTestimonials:   (params) => api.get('/admin/testimonials', { params }),
  approveTestimonial:(id)     => api.patch(`/admin/testimonials/${id}/approve`),
  updateTestimonial: (id, data) => api.patch(`/admin/testimonials/${id}`, data),
  deleteTestimonial: (id)     => api.delete(`/admin/testimonials/${id}`),
}

export const paymentAPI = {
  createRazorpayOrder: (data) => api.post('/payments/razorpay/create-order', data),
  verifyRazorpay:      (data) => api.post('/payments/razorpay/verify', data),
  createStripeIntent:  (data) => api.post('/payments/stripe/create-intent', data),
  getMyPayments:       ()     => api.get('/payments/my-payments'),
}

export const analyticsAPI = {
  getEmployer: () => api.get('/analytics/employer'),
}
