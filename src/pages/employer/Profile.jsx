import { useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { getIn, useFormik } from 'formik'
import * as Yup from 'yup'
import { HiCamera } from 'react-icons/hi'
import { userAPI } from '../../services/api'
import { updateUser, selectUser } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'
import { optionalIndianMobileSchema, sanitizeIndianMobileInput } from '../../utils/phoneValidation'

function CompanyField({ formik, name, label, as: Tag = 'input', type = 'text', placeholder, options, rows }) {
  const touched = getIn(formik.touched, name)
  const error = getIn(formik.errors, name)
  const hasError = touched && error

  return (
    <div>
      <label className="label">{label}</label>
      {Tag === 'select' ? (
        <select {...formik.getFieldProps(name)} className={`input-field ${hasError ? 'border-red-400' : ''}`}>
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : Tag === 'textarea' ? (
        <textarea {...formik.getFieldProps(name)} rows={rows || 4} placeholder={placeholder} className={`input-field resize-none ${hasError ? 'border-red-400' : ''}`} />
      ) : (
        <input
          {...formik.getFieldProps(name)}
          type={type}
          placeholder={placeholder}
          maxLength={name === 'phone' ? 10 : undefined}
          onInput={(e) => {
            if (name === 'phone') e.target.value = sanitizeIndianMobileInput(e.target.value)
          }}
          className={`input-field ${hasError ? 'border-red-400' : ''}`}
        />
      )}
      {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

const cleanValue = (value) => (typeof value === 'string' ? value.trim() : value || '')

const buildCompanyPayload = (values) => ({
  firstName: cleanValue(values.firstName),
  lastName: cleanValue(values.lastName),
  phone: cleanValue(values.phone),
  company: {
    name: cleanValue(values.company.name),
    website: cleanValue(values.company.website),
    industry: cleanValue(values.company.industry),
    size: cleanValue(values.company.size),
    location: cleanValue(values.company.location),
    description: cleanValue(values.company.description),
    gstin: cleanValue(values.company.gstin),
  },
})

const buildCompanyUserSnapshot = (user) => buildCompanyPayload({
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
})

const hasProfileChanges = (current, original) => JSON.stringify(current) !== JSON.stringify(original)

export default function EmpProfile() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const logoRef = useRef()

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || '',
      lastName:  user?.lastName  || '',
      phone:     user?.phone     || '',
      company: {
        name:        user?.company?.name        || '',
        website:     user?.company?.website     || '',
        industry:    user?.company?.industry    || '',
        size:        user?.company?.size        || '',
        location:    user?.company?.location    || '',
        description: user?.company?.description || '',
        gstin:       user?.company?.gstin       || '',
      },
    },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('Enter the contact first name.'),
      lastName: Yup.string().trim().required('Enter the contact last name.'),
      phone: optionalIndianMobileSchema('Enter a valid 10-digit mobile number.'),
      company: Yup.object({
        name: Yup.string().trim().required('Enter the company name.'),
        website: Yup.string().trim().url('Enter a valid website URL.'),
      }),
    }),
    onSubmit: async (values) => {
      setSaving(true)
      try {
        const payload = buildCompanyPayload(values)
        const original = buildCompanyUserSnapshot(user)

        if (!hasProfileChanges(payload, original)) {
          toast('No changes is there.')
          return
        }

        const { data } = await userAPI.updateProfile(payload)
        dispatch(updateUser(data.data.user))
        toast.success('Company profile updated!')
      } catch {
        toast.error('Update failed')
      } finally {
        setSaving(false)
      }
    },
  })

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo must be under 5MB')
      e.target.value = ''
      return
    }

    setUploadingLogo(true)
    const fd = new FormData()
    fd.append('logo', file)
    try {
      const { data } = await userAPI.uploadCompanyLogo(fd)
      dispatch(updateUser(data.data.user))
      toast.success('Company logo updated!')
    } catch {
      toast.error('Logo upload failed')
    } finally {
      setUploadingLogo(false)
      e.target.value = ''
    }
  }

  const F = ({ name, label, as: Tag = 'input', type = 'text', placeholder, options, rows }) => {
    const touched = getIn(formik.touched, name)
    const error = getIn(formik.errors, name)
    const hasError = touched && error

    return (
      <div>
        <label className="label">{label}</label>
        {Tag === 'select' ? (
          <select {...formik.getFieldProps(name)} className={`input-field ${hasError ? 'border-red-400' : ''}`}>
            <option value="">Select...</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : Tag === 'textarea' ? (
          <textarea {...formik.getFieldProps(name)} rows={rows || 4} placeholder={placeholder} className={`input-field resize-none ${hasError ? 'border-red-400' : ''}`} />
        ) : (
          <input
            {...formik.getFieldProps(name)}
            type={type}
            placeholder={placeholder}
            maxLength={name === 'phone' ? 10 : undefined}
            onInput={(e) => {
              if (name === 'phone') e.target.value = sanitizeIndianMobileInput(e.target.value)
            }}
            className={`input-field ${hasError ? 'border-red-400' : ''}`}
          />
        )}
        {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Company Profile | Employer | ProLink</title></Helmet>
      <form onSubmit={formik.handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Company Profile</h1>
          <button type="submit" disabled={saving} className="btn-primary py-2.5">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>

        <div className="card p-6 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            {user?.company?.logo?.url
              ? <img src={user.company.logo.url} alt="" className="w-24 h-24 rounded-2xl object-cover" />
              : <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">{user?.company?.name?.[0] || user?.firstName?.[0]}</span>
                </div>
            }
            <button type="button" onClick={() => logoRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-700 transition-colors">
              {uploadingLogo ? <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" /> : <HiCamera className="w-4 h-4" />}
            </button>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Company Logo</h3>
            <p className="text-sm text-slate-500">Upload a JPG, PNG, or WebP image. The Cloudinary URL is saved to your company profile.</p>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Contact Person</h3>
          <div className="grid grid-cols-2 gap-4">
            <CompanyField formik={formik} name="firstName" label="First Name" placeholder="Your first name" />
            <CompanyField formik={formik} name="lastName"  label="Last Name"  placeholder="Your last name" />
          </div>
          <CompanyField formik={formik} name="phone" label="Phone" type="tel" placeholder="98765 43210" />
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Company Details</h3>
          <CompanyField formik={formik} name="company.name"     label="Company Name *"    placeholder="Your company" />
          <CompanyField formik={formik} name="company.website"  label="Website"           type="url" placeholder="https://yourcompany.com" />
          <div className="grid grid-cols-2 gap-4">
            <CompanyField formik={formik} name="company.industry" label="Industry" as="select" options={['IT & Software','Finance','Manufacturing','Healthcare','Education','Retail','FMCG','Logistics','Real Estate','Hospitality','Other']} />
            <CompanyField formik={formik} name="company.size"     label="Company Size" as="select" options={['1-10','11-50','51-200','201-500','501-1000','1001-5000','5000+']} />
          </div>
          <CompanyField formik={formik} name="company.location"    label="Headquarters Location" placeholder="e.g. Chennai, Tamil Nadu" />
          <CompanyField formik={formik} name="company.description" label="About the Company" as="textarea" rows={4} placeholder="Tell candidates about your company culture, mission, and what makes you a great place to work..." />
          <CompanyField formik={formik} name="company.gstin" label="GSTIN (optional)" placeholder="22AAAAA0000A1Z5" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary py-3 px-8">{saving ? 'Saving...' : 'Save Profile'}</button>
        </div>
      </form>
    </>
  )
}
