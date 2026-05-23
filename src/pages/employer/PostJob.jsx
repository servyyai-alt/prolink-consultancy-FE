import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { HiPlus, HiX } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { jobAPI } from '../../services/api'
import { selectRole, selectUser } from '../../redux/slices/authSlice'
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  LOCATION_TYPES,
  INDIAN_CITIES,
} from '../../constants/index'

const STEPS = ['Basic Info', 'Job Details', 'Skills & Salary', 'Preview']
const ADMIN_ROLES = ['admin', 'super_admin', 'recruiter']

const websiteRegex = /^(https?:\/\/)?([\w-])+\.{1}[a-zA-Z]{2,}(\/.*)?$/i

const F = ({
  name,
  label,
  required,
  as: Tag = 'input',
  type = 'text',
  placeholder,
  options = [],
  rows,
  formik,
}) => {
  const value = formik.getFieldProps(name).value ?? ''
  const error = formik.getFieldMeta(name).touched ? formik.getFieldMeta(name).error : ''

  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {Tag === 'select' ? (
        <select
          {...formik.getFieldProps(name)}
          value={value}
          className={`input-field ${error ? 'border-red-400' : ''}`}
        >
          <option value="">Select...</option>
          {options.map((o) =>
            typeof o === 'string' ? (
              <option key={o} value={o}>
                {o}
              </option>
            ) : (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            )
          )}
        </select>
      ) : Tag === 'textarea' ? (
        <textarea
          {...formik.getFieldProps(name)}
          value={value}
          rows={rows || 4}
          placeholder={placeholder}
          className={`input-field resize-none ${error ? 'border-red-400' : ''}`}
        />
      ) : (
        <input
          {...formik.getFieldProps(name)}
          value={value}
          type={type}
          placeholder={placeholder}
          className={`input-field ${error ? 'border-red-400' : ''}`}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function EmpPostJob() {
  const navigate = useNavigate()
  const role = useSelector(selectRole)
  const user = useSelector(selectUser)
  const isAdminFlow = ADMIN_ROLES.includes(role)

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const editSlug = params.get('slug')
  const [editingJobId, setEditingJobId] = useState(null)

  const [step, setStep] = useState(0)
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      requirements: '',
      responsibilities: '',
      category: '',
      type: 'full_time',
      locationType: 'onsite',
      location: '',
      experience: {
        min: 0,
        max: 5,
      },
      salary: {
        min: '',
        max: '',
        isVisible: true,
      },
      openings: 1,
      education: '',
      deadline: '',
      featured: false,
      urgent: false,
      company: {
        name: user?.company?.name || '',
        website: user?.company?.website || '',
        description: user?.company?.description || '',
      },
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().min(5, 'Job title must be at least 5 characters').max(100, 'Maximum 100 characters allowed').required('Job title required'),
      description: Yup.string().trim().min(50, 'Description must be at least 50 characters').required('Description required'),
      requirements: Yup.string().trim().min(20, 'Requirements must be at least 20 characters').required('Requirements required'),
      responsibilities: Yup.string().trim().min(20, 'Responsibilities must be at least 20 characters').required('Responsibilities required'),
      category: Yup.string().required('Category required'),
      type: Yup.string().required('Job type required'),
      locationType: Yup.string().required('Location type required'),
      location: Yup.string().required('Location required'),
      openings: Yup.number().min(1, 'Minimum 1 opening required').max(1000, 'Too many openings').required('Openings required'),
      education: Yup.string().trim().required('Education required'),
      deadline: Yup.date().nullable().test('future-date', 'Deadline must be future date', (value) => {
        if (!value) return true
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return new Date(value) >= today
      }),
      experience: Yup.object({
        min: Yup.number().min(0, 'Minimum experience cannot be negative').required('Minimum experience required'),
        max: Yup.number().min(Yup.ref('min'), 'Max experience must be greater than min experience').required('Maximum experience required'),
      }),
      salary: Yup.object({
        min: Yup.number().min(1, 'Minimum salary should be greater than 1LPA').required('Minimum salary required'),
        max: Yup.number().min(Yup.ref('min'), 'Maximum salary must be greater than minimum salary').required('Maximum salary required'),
      }),
      company: Yup.object({
        name: Yup.string().trim().min(2, 'Company name too short').required('Company name required'),
        website: Yup.string().nullable().test('valid-url', 'Enter valid website URL', (value) => !value || websiteRegex.test(value)),
        description: Yup.string().trim().min(20, 'Company description too short').required('Company description required'),
      }),
    }),
    onSubmit: async (values) => {
      try {
        if (skills.length === 0) {
          toast.error('Please add at least one skill')
          return
        }

        const clean = (v) => (typeof v === 'string' ? v.trim() : v)

        const payload = {
          title: clean(values.title),
          description: clean(values.description),
          requirements: clean(values.requirements),
          responsibilities: clean(values.responsibilities),
          category: values.category,
          type: values.type,
          locationType: values.locationType,
          location: values.location,
          experience: {
            min: Number(values.experience.min),
            max: Number(values.experience.max),
          },
          salary: {
            min: Number(values.salary.min),
            max: Number(values.salary.max),
            isVisible: values.salary.isVisible,
          },
          openings: Number(values.openings),
          education: clean(values.education),
          deadline: values.deadline || undefined,
          skills,
          featured: values.featured,
          urgent: values.urgent,
          company: {
            name: clean(values.company.name),
            website: clean(values.company.website),
            description: clean(values.company.description),
          },
        }

        if (editingJobId) {
          await jobAPI.updateJob(editingJobId, payload)
          toast.success('Job updated successfully!')
          navigate(isAdminFlow ? '/admin/jobs' : '/employer/my-jobs')
        } else {
          await jobAPI.createJob(payload)
          toast.success('Job posted successfully!')
          navigate(isAdminFlow ? '/admin/jobs' : '/employer/my-jobs')
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          toast.error('Your session has expired. Please sign in again.')
          navigate('/login')
          return
        }

        toast.error(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to post job'
        )
      }
    },
  })

  useEffect(() => {
    let mounted = true
    const fetchJob = async () => {
      if (!editSlug) return
      try {
        const { data } = await jobAPI.getJob(editSlug)
        if (!mounted) return
        const job = data.data.job
        if (!job) return
        setEditingJobId(job._id)
        setSkills(job.skills || [])
        formik.setValues({
          title: job.title || '',
          description: job.description || '',
          requirements: job.requirements || '',
          responsibilities: job.responsibilities || '',
          category: job.category || '',
          type: job.type || 'full_time',
          locationType: job.locationType || 'onsite',
          location: job.location || '',
          experience: { min: job.experience?.min || 0, max: job.experience?.max || 5 },
          salary: { min: job.salary?.min || '', max: job.salary?.max || '', isVisible: job.salary?.isVisible !== false },
          openings: job.openings || 1,
          education: job.education || '',
          deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
          featured: !!job.featured,
          urgent: !!job.urgent,
          company: {
            name: job.company?.name || user?.company?.name || '',
            website: job.company?.website || user?.company?.website || '',
            description: job.company?.description || user?.company?.description || '',
          },
        })
      } catch (e) {
        // ignore
      }
    }
    fetchJob()
    return () => { mounted = false }
  }, [editSlug])

  const addSkill = (value) => {
    const nextSkill = value.trim()

    if (!nextSkill) {
      toast.error('Skill cannot be empty')
      return
    }

    if (nextSkill.length < 2) {
      toast.error('Skill too short')
      return
    }

    if (skills.includes(nextSkill)) {
      toast.error('Skill already added')
      return
    }

    if (skills.length >= 15) {
      toast.error('Maximum 15 skills allowed')
      return
    }

    setSkills((prev) => [...prev, nextSkill])
    setSkillInput('')
  }

  const validateStep = async () => {
    let fields = []

    if (step === 0) {
      fields = ['title', 'category', 'type', 'locationType', 'location', 'openings', 'education']
    }

    if (step === 1) {
      fields = ['description', 'requirements', 'responsibilities', 'deadline']
    }

    if (step === 2) {
      fields = ['experience.min', 'experience.max', 'salary.min', 'salary.max', 'company.name', 'company.description']
    }

    const errors = await formik.validateForm()
    fields.forEach((field) => formik.setFieldTouched(field, true))

    const hasError = (field) => field.split('.').reduce((obj, key) => obj?.[key], errors)
    const stepErrors = fields.filter((field) => hasError(field))

    if (step === 2 && skills.length === 0) {
      toast.error('Please add at least one skill')
      return
    }

    if (stepErrors.length === 0) {
      setStep((prev) => prev + 1)
    }
  }

  return (
    <>
      <Helmet>
        <title>{isAdminFlow ? 'Create Job | ProLink Admin' : 'Post a Job | ProLink Employer'}</title>
      </Helmet>

      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            {isAdminFlow ? 'Create a New Job' : 'Post a New Job'}
          </h1>
          <p className="text-sm text-slate-500">Fill in the details to attract the best candidates</p>
        </div>

        <div className="flex gap-2">
          {STEPS.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => index < step && setStep(index)}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                index === step
                  ? 'bg-primary-600 text-white shadow-primary'
                  : index < step
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
              }`}
            >
              {index < step ? 'Done ' : ''}
              {label}
            </button>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <form onSubmit={formik.handleSubmit}>
            {step === 0 && (
              <div className="card space-y-4 p-6">
                <h3 className="font-bold">Basic Information</h3>

                <F formik={formik} name="title" label="Job Title" required placeholder="e.g. Senior React Developer" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <F formik={formik} name="category" label="Category" required as="select" options={JOB_CATEGORIES} />
                  <F formik={formik} name="type" label="Job Type" required as="select" options={JOB_TYPES} />
                  <F formik={formik} name="locationType" label="Work Mode" required as="select" options={LOCATION_TYPES} />
                  <F formik={formik} name="location" label="Location" required as="select" options={INDIAN_CITIES} />
                  <F formik={formik} name="openings" label="No. of Openings" type="number" />
                  <F formik={formik} name="education" label="Education" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="card space-y-4 p-6">
                <h3 className="font-bold">Job Details</h3>

                <F formik={formik} name="description" label="Job Description" required as="textarea" rows={6} />
                <F formik={formik} name="requirements" label="Requirements" required as="textarea" rows={4} />
                <F formik={formik} name="responsibilities" label="Responsibilities" required as="textarea" rows={4} />
                <F formik={formik} name="deadline" label="Deadline" type="date" />
              </div>
            )}

            {step === 2 && (
              <div className="card space-y-5 p-6">
                <h3 className="font-bold">Skills & Salary</h3>

                <div className="grid grid-cols-2 gap-4">
                  <F formik={formik} name="experience.min" label="Min Experience" type="number" />
                  <F formik={formik} name="experience.max" label="Max Experience" type="number" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <F formik={formik} name="salary.min" label="Min Salary" placeholder="Min Salary / Year" type="number" />
                  <F formik={formik} name="salary.max" label="Max Salary" placeholder="Max Salary / Year" type="number" />
                </div>

                <div>
                  <label className="label">Required Skills</label>
                  <div className="mb-3 flex gap-2">
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkill(skillInput)
                        }
                      }}
                      className="input-field flex-1"
                    />
                    <button type="button" onClick={() => addSkill(skillInput)} className="btn-primary px-4">
                      <HiPlus />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill} className="flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1">
                        {skill}
                        <button type="button" onClick={() => setSkills((prev) => prev.filter((item) => item !== skill))}>
                          <HiX />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <F formik={formik} name="company.name" label="Company Name" />
                <F formik={formik} name="company.website" label="Company Website" />
                <F formik={formik} name="company.description" label="Company Description" as="textarea" rows={3} />
              </div>
            )}

            {step === 3 && (
              <div className="card space-y-6 p-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Preview & Submit</h3>
                  <p className="mt-1 text-sm text-slate-500">Review all job details before publishing.</p>
                </div>

                <div className="rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 to-primary-100 p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{formik.values.title || 'Job Title'}</h2>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                          {formik.values.company.name || 'Company Name'} • {formik.values.location}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="badge-primary">{formik.values.category}</span>
                        <span className="badge-gray">{formik.values.type?.replace('_', ' ')}</span>
                        <span className="badge-gray capitalize">{formik.values.locationType}</span>
                        {formik.values.urgent && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">Urgent</span>}
                        {formik.values.featured && <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Featured</span>}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                      <p className="mb-1 text-xs text-slate-500">Salary Range</p>
                      <h4 className="text-lg font-bold text-green-600">
                        Rs.{Number(formik.values.salary.min || 0).toLocaleString()} - Rs.{Number(formik.values.salary.max || 0).toLocaleString()}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">per year</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="mb-1 text-xs text-slate-500">Experience</p>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {formik.values.experience.min} - {formik.values.experience.max} Years
                    </h4>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="mb-1 text-xs text-slate-500">Openings</p>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{formik.values.openings} Positions</h4>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="mb-1 text-xs text-slate-500">Education</p>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{formik.values.education}</h4>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="mb-1 text-xs text-slate-500">Deadline</p>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{formik.values.deadline || 'No Deadline'}</h4>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <span key={skill} className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No skills added</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Job Description</h4>
                  <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800">
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">{formik.values.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Requirements</h4>
                  <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800">
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">{formik.values.requirements}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Responsibilities</h4>
                  <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800">
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">{formik.values.responsibilities}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Company Information</h4>
                  <div className="space-y-3 rounded-xl bg-slate-50 p-5 dark:bg-slate-800">
                    <div>
                      <p className="text-xs text-slate-500">Company Name</p>
                      <h5 className="font-semibold text-slate-900 dark:text-white">{formik.values.company.name}</h5>
                    </div>

                    {formik.values.company.website && (
                      <div>
                        <p className="text-xs text-slate-500">Website</p>
                        <a href={formik.values.company.website} target="_blank" rel="noreferrer" className="text-sm text-primary-600 hover:underline">
                          {formik.values.company.website}
                        </a>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-slate-500">Description</p>
                      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{formik.values.company.description}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Please verify all details carefully before posting this job. Once published, candidates will be able to view and apply immediately.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-between">
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                disabled={step === 0}
                className="btn-ghost px-6 py-3"
              >
                Previous
              </button>

              {step < STEPS.length - 1 ? (
                <button type="button" onClick={validateStep} className="btn-primary px-8 py-3">
                  Next
                </button>
              ) : (
                <button type="submit" disabled={formik.isSubmitting} className="btn-primary px-8 py-3">
                  {formik.isSubmitting ? 'Posting Job...' : 'Post Job'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </>
  )
}
