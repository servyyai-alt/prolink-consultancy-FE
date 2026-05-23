import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { testimonialAPI } from '../services/api'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn, selectUser } from '../redux/slices/authSlice'
import ProtectedRoute from '../routes/ProtectedRoute'
import toast from 'react-hot-toast'

export default function SubmitTestimonial() {
  const navigate = useNavigate()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const user = useSelector(selectUser)

  const formik = useFormik({
    initialValues: {
      name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
      designation: '',
      company: '',
      content: '',
      rating: 5,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name required'),
      content: Yup.string().min(10,'Too short').required('Content required'),
      rating: Yup.number().min(1).max(5),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await testimonialAPI.create(values)
        toast.success('Testimonial submitted — pending approval')
        navigate('/')
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to submit testimonial')
      } finally { setSubmitting(false) }
    },
  })

  if (!isLoggedIn) return <ProtectedRoute><div /></ProtectedRoute>

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto py-12">
        <Helmet><title>Submit Testimonial | ProLink</title></Helmet>
        <h1 className="text-2xl font-display font-bold mb-3">Share your feedback</h1>
        <p className="text-sm text-slate-500 mb-6">Help others by sharing a short testimonial about your experience with ProLink.</p>

        <form onSubmit={formik.handleSubmit} className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-2xl">
          <div>
            <label className="label">Name</label>
            <input {...formik.getFieldProps('name')} className="input-field" />
            {formik.touched.name && formik.errors.name && <p className="text-xs text-red-500">{formik.errors.name}</p>}
          </div>

          <div>
            <label className="label">Designation</label>
            <input {...formik.getFieldProps('designation')} className="input-field" />
          </div>

          <div>
            <label className="label">Company</label>
            <input {...formik.getFieldProps('company')} className="input-field" />
          </div>

          <div>
            <label className="label">Testimonial</label>
            <textarea {...formik.getFieldProps('content')} rows={6} className="input-field resize-none" />
            {formik.touched.content && formik.errors.content && <p className="text-xs text-red-500">{formik.errors.content}</p>}
          </div>

          <div>
            <label className="label">Rating</label>
            <select {...formik.getFieldProps('rating')} className="input-field w-40">
              {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} Star{r>1?'s':''}</option>)}
            </select>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={formik.isSubmitting} className="btn-primary py-2 px-5">{formik.isSubmitting ? 'Submitting…' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}
