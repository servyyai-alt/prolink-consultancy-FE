import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { userAPI } from '../../services/api'
import { selectUser, updateUser } from '../../redux/slices/authSlice'
import { optionalIndianMobileSchema, sanitizeIndianMobileInput } from '../../utils/phoneValidation'

export default function AdminProfile() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [saving, setSaving] = useState(false)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().min(2, 'First name must be at least 2 characters').required('First name is required'),
      lastName: Yup.string().trim().min(2, 'Last name must be at least 2 characters').required('Last name is required'),
      phone: optionalIndianMobileSchema('Enter a valid 10-digit phone number'),
    }),
    onSubmit: async (values) => {
      setSaving(true)
      try {
        const payload = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          phone: sanitizeIndianMobileInput(values.phone),
        }
        const { data } = await userAPI.updateProfile(payload)
        dispatch(updateUser(data.data.user))
        toast.success('Profile updated successfully')
      } catch {
        toast.error('Failed to update profile')
      } finally {
        setSaving(false)
      }
    },
  })

  return (
    <>
      <Helmet><title>Admin Profile | ProLink</title></Helmet>
      <form onSubmit={formik.handleSubmit} className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">My Profile</h1>
            <p className="text-sm text-slate-500">Update your admin account details here.</p>
          </div>
          <button type="submit" disabled={saving} className="btn-primary py-2.5 px-5">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="card space-y-5 p-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Account Role</p>
            <p className="mt-2 text-lg font-semibold capitalize text-slate-900 dark:text-white">{user?.role?.replace('_', ' ') || 'Admin'}</p>
            <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">First Name</label>
              <input
                {...formik.getFieldProps('firstName')}
                className={`input-field ${formik.touched.firstName && formik.errors.firstName ? 'border-red-400' : ''}`}
                placeholder="First name"
              />
              {formik.touched.firstName && formik.errors.firstName && <p className="mt-1 text-xs text-red-500">{formik.errors.firstName}</p>}
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                {...formik.getFieldProps('lastName')}
                className={`input-field ${formik.touched.lastName && formik.errors.lastName ? 'border-red-400' : ''}`}
                placeholder="Last name"
              />
              {formik.touched.lastName && formik.errors.lastName && <p className="mt-1 text-xs text-red-500">{formik.errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="label">Phone Number</label>
            <input
              {...formik.getFieldProps('phone')}
              type="tel"
              maxLength={10}
              onInput={(event) => {
                event.target.value = sanitizeIndianMobileInput(event.target.value)
              }}
              className={`input-field ${formik.touched.phone && formik.errors.phone ? 'border-red-400' : ''}`}
              placeholder="9876543210"
            />
            {formik.touched.phone && formik.errors.phone && <p className="mt-1 text-xs text-red-500">{formik.errors.phone}</p>}
          </div>
        </div>
      </form>
    </>
  )
}
