import { useRef, useState } from 'react'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { getIn, useFormik } from 'formik'
import * as Yup from 'yup'
import { HiCamera } from 'react-icons/hi'
import { userAPI } from '../../services/api'
import { updateUser, selectUser } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'
import { optionalIndianMobileSchema, sanitizeIndianMobileInput } from '../../utils/phoneValidation'

function ProfileField({ formik, name, label, as: Tag = 'input', type = 'text', placeholder, options = [], rows }) {
  const value = getIn(formik.values, name) || ''
  const error = getIn(formik.errors, name)
  const touched = getIn(formik.touched, name)
  const hasError = Boolean(touched && error)

  return (
    <div>
      <label className="label">{label}</label>
      {Tag === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`input-field ${hasError ? 'border-red-400' : ''}`}
        >
          <option value="">Select...</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : Tag === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={rows || 4}
          placeholder={placeholder}
          className={`input-field resize-none ${hasError ? 'border-red-400' : ''}`}
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={(e) => {
            const nextValue = name === 'phone'
              ? sanitizeIndianMobileInput(e.target.value)
              : e.target.value
            formik.setFieldValue(name, nextValue)
          }}
          onBlur={formik.handleBlur}
          type={type}
          placeholder={placeholder}
          maxLength={name === 'phone' ? 10 : undefined}
          className={`input-field ${hasError ? 'border-red-400' : ''}`}
        />
      )}
      {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function EmpProfile() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const logoRef = useRef()

  useEffect(() => {
    let mounted = true
    const fetchProfile = async () => {
      try {
        const { data } = await userAPI.getProfile()
        if (!mounted) return
        if (data?.data?.user) dispatch(updateUser(data.data.user))
      } catch (err) {
        // ignore - will rely on existing store value; optionally show toast
      }
    }
    fetchProfile()
    return () => { mounted = false }
  }, [dispatch])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      company: {
        name: user?.company?.name || '',
        website: user?.company?.website || '',
        industry: user?.company?.industry || '',
        size: user?.company?.size || '',
        location: user?.company?.location || '',
        description: user?.company?.description || '',
        gstin: user?.company?.gstin || '',
      },
    },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('First name is required'),
      phone: optionalIndianMobileSchema('Invalid phone number'),
      company: Yup.object({
        name: Yup.string().trim().required('Company name required'),
      }),
    }),
    onSubmit: async (values) => {
      setSaving(true)
      try {
        const payload = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          phone: sanitizeIndianMobileInput(values.phone),
          company: {
            name: values.company.name.trim(),
            website: values.company.website.trim(),
            industry: values.company.industry,
            size: values.company.size,
            location: values.company.location.trim(),
            description: values.company.description.trim(),
            gstin: values.company.gstin.trim(),
          },
        }

        const { data } = await userAPI.updateProfile(payload)
        dispatch(updateUser(data.data.user))
        toast.success('Company profile updated!')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Update failed')
      } finally {
        setSaving(false)
      }
    },
  })

  return (
    <>
      <Helmet><title>Company Profile | Employer | ProLink</title></Helmet>
      <form onSubmit={formik.handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Company Profile</h1>
          <button type="submit" disabled={saving} className="btn-primary py-2.5">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Contact Person</h3>
          <div className="grid grid-cols-2 gap-4">
            <ProfileField formik={formik} name="firstName" label="First Name" placeholder="Your first name" />
            <ProfileField formik={formik} name="lastName" label="Last Name" placeholder="Your last name" />
          </div>
          <ProfileField formik={formik} name="phone" label="Phone" type="tel" placeholder="98765 43210" />
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Company Details</h3>
          <ProfileField formik={formik} name="company.name" label="Company Name *" placeholder="Your company" />
          <ProfileField formik={formik} name="company.website" label="Website" type="url" placeholder="https://yourcompany.com" />
          <div className="grid grid-cols-2 gap-4">
            <ProfileField formik={formik} name="company.industry" label="Industry" as="select" options={['IT & Software', 'Finance', 'Manufacturing', 'Healthcare', 'Education', 'Retail', 'FMCG', 'Logistics', 'Real Estate', 'Hospitality', 'Other']} />
            <ProfileField formik={formik} name="company.size" label="Company Size" as="select" options={['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+']} />
          </div>
          <ProfileField formik={formik} name="company.location" label="Headquarters Location" placeholder="e.g. Chennai, Tamil Nadu" />
          <ProfileField formik={formik} name="company.description" label="About the Company" as="textarea" rows={4} placeholder="Tell candidates about your company culture, mission, and what makes you a great place to work..." />
          <ProfileField formik={formik} name="company.gstin" label="GSTIN (optional)" placeholder="22AAAAA0000A1Z5" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary py-3 px-8">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </>
  )
}
