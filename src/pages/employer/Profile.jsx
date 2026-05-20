import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { userAPI } from '../../services/api'
import { updateUser, selectUser } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'
import { optionalIndianMobileSchema, sanitizeIndianMobileInput } from '../../utils/phoneValidation'

export default function EmpProfile() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [saving, setSaving] = useState(false)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || '',
      lastName:  user?.lastName  || '',
      phone:     user?.phone     || '',
      'company.name':        user?.company?.name        || '',
      'company.website':     user?.company?.website     || '',
      'company.industry':    user?.company?.industry    || '',
      'company.size':        user?.company?.size        || '',
      'company.location':    user?.company?.location    || '',
      'company.description': user?.company?.description || '',
      'company.gstin':       user?.company?.gstin       || '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(),
      phone: optionalIndianMobileSchema('Invalid phone number'),
      'company.name': Yup.string().required('Company name required'),
    }),
    onSubmit: async (values) => {
      setSaving(true)
      try {
        const payload = {
          firstName: values.firstName, lastName: values.lastName, phone: values.phone,
          company: {
            name: values['company.name'], website: values['company.website'],
            industry: values['company.industry'], size: values['company.size'],
            location: values['company.location'], description: values['company.description'],
            gstin: values['company.gstin'],
          },
        }
        const { data } = await userAPI.updateProfile(payload)
        dispatch(updateUser(data.data.user))
        toast.success('Company profile updated!')
      } catch { toast.error('Update failed') }
      finally { setSaving(false) }
    },
  })

  const F = ({ name, label, as:Tag='input', type='text', placeholder, options, rows }) => (
    <div>
      <label className="label">{label}</label>
      {Tag === 'select' ? (
        <select {...formik.getFieldProps(name)} className="input-field">
          <option value="">Select…</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : Tag === 'textarea' ? (
        <textarea {...formik.getFieldProps(name)} rows={rows||4} placeholder={placeholder} className="input-field resize-none" />
      ) : (
        <input
          {...formik.getFieldProps(name)}
          type={type}
          placeholder={placeholder}
          maxLength={name === 'phone' ? 10 : undefined}
          onInput={(e) => {
            if (name === 'phone') e.target.value = sanitizeIndianMobileInput(e.target.value)
          }}
          className={`input-field ${formik.touched[name]&&formik.errors[name]?'border-red-400':''}`}
        />
      )}
      {formik.touched[name]&&formik.errors[name]&&<p className="mt-1 text-xs text-red-500">{formik.errors[name]}</p>}
    </div>
  )

  return (
    <>
      <Helmet><title>Company Profile | Employer | ProLink</title></Helmet>
      <form onSubmit={formik.handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Company Profile</h1>
          <button type="submit" disabled={saving} className="btn-primary py-2.5">{saving?'Saving…':'Save Changes'}</button>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Contact Person</h3>
          <div className="grid grid-cols-2 gap-4">
            <F name="firstName" label="First Name" placeholder="Your first name" />
            <F name="lastName"  label="Last Name"  placeholder="Your last name" />
          </div>
          <F name="phone" label="Phone" type="tel" placeholder="98765 43210" />
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Company Details</h3>
          <F name="company.name"     label="Company Name *"    placeholder="Your company" />
          <F name="company.website"  label="Website"           type="url" placeholder="https://yourcompany.com" />
          <div className="grid grid-cols-2 gap-4">
            <F name="company.industry" label="Industry" as="select" options={['IT & Software','Finance','Manufacturing','Healthcare','Education','Retail','FMCG','Logistics','Real Estate','Hospitality','Other']} />
            <F name="company.size"     label="Company Size" as="select" options={['1-10','11-50','51-200','201-500','501-1000','1001-5000','5000+']} />
          </div>
          <F name="company.location"    label="Headquarters Location" placeholder="e.g. Chennai, Tamil Nadu" />
          <F name="company.description" label="About the Company" as="textarea" rows={4} placeholder="Tell candidates about your company culture, mission, and what makes you a great place to work…" />
          <F name="company.gstin" label="GSTIN (optional)" placeholder="22AAAAA0000A1Z5" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary py-3 px-8">{saving?'Saving…':'Save Profile'}</button>
        </div>
      </form>
    </>
  )
}
