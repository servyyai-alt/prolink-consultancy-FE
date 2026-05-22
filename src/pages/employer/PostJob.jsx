import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { HiPlus, HiX } from 'react-icons/hi'
import { jobAPI } from '../../services/api'
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  LOCATION_TYPES,
  INDIAN_CITIES,
} from '../../constants/index'
import toast from 'react-hot-toast'

const STEPS = [
  'Basic Info',
  'Job Details',
  'Skills & Salary',
  'Preview',
]

const F = ({
  name,
  label,
  required,
  as: Tag = 'input',
  type = 'text',
  placeholder,
  options,
  rows,
  formik,
}) => (
  <div>
    <label className="label">
      {label}
      {required && (
        <span className="text-red-500 ml-0.5">*</span>
      )}
    </label>

    {Tag === 'select' ? (
      <select
        {...formik.getFieldProps(name)}
        className={`input-field ${
          formik.touched[name] && formik.errors[name]
            ? 'border-red-400'
            : ''
        }`}
      >
        <option value="">Select…</option>

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
        rows={rows || 4}
        placeholder={placeholder}
        className={`input-field resize-none ${
          formik.touched[name] && formik.errors[name]
            ? 'border-red-400'
            : ''
        }`}
      />
    ) : (
      <input
        {...formik.getFieldProps(name)}
        type={type}
        placeholder={placeholder}
        className={`input-field ${
          formik.touched[name] && formik.errors[name]
            ? 'border-red-400'
            : ''
        }`}
      />
    )}

    {formik.touched[name] && formik.errors[name] && (
      <p className="mt-1 text-xs text-red-500">
        {formik.errors[name]}
      </p>
    )}
  </div>
)

export default function EmpPostJob() {
  const navigate = useNavigate()

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

      'experience.min': 0,
      'experience.max': 5,

      'salary.min': '',
      'salary.max': '',
      'salary.isVisible': true,

      openings: 1,
      education: '',
      deadline: '',

      featured: false,
      urgent: false,

      'company.name': '',
      'company.website': '',
      'company.description': '',
    },

    validationSchema: Yup.object({
      title: Yup.string()
        .trim()
        .min(5, 'Job title must be at least 5 characters')
        .max(100, 'Maximum 100 characters allowed')
        .required('Job title required'),

      description: Yup.string()
        .trim()
        .min(50, 'Description must be at least 50 characters')
        .required('Description required'),

      requirements: Yup.string()
        .trim()
        .min(20, 'Requirements must be at least 20 characters')
        .required('Requirements required'),

      responsibilities: Yup.string()
        .trim()
        .min(20, 'Responsibilities must be at least 20 characters')
        .required('Responsibilities required'),

      category: Yup.string().required(
        'Category required'
      ),

      type: Yup.string().required(
        'Job type required'
      ),

      locationType: Yup.string().required(
        'Location type required'
      ),

      location: Yup.string().required(
        'Location required'
      ),

      openings: Yup.number()
        .min(1, 'Minimum 1 opening required')
        .max(1000, 'Too many openings')
        .required('Openings required'),

      education: Yup.string()
        .trim()
        .required('Education required'),

      deadline: Yup.date()
        .nullable()
        .test(
          'future-date',
          'Deadline must be future date',
          function (value) {
            if (!value) return true

            const today = new Date()
            today.setHours(0, 0, 0, 0)

            return new Date(value) >= today
          }
        ),

      'experience.min': Yup.number()
        .min(
          0,
          'Minimum experience cannot be negative'
        )
        .required('Minimum experience required'),

      'experience.max': Yup.number()
        .min(
          Yup.ref('experience.min'),
          'Max experience must be greater than min experience'
        )
        .required('Maximum experience required'),

      'salary.min': Yup.number()
        .min(
          1,
          'Minimum salary should be greater than 1LPA'
        )
        .required('Minimum salary required'),

      'salary.max': Yup.number()
        .min(
          Yup.ref('salary.min'),
          'Maximum salary must be greater than minimum salary'
        )
        .required('Maximum salary required'),

      'company.name': Yup.string()
        .trim()
        .min(2, 'Company name too short')
        .required('Company name required'),

      'company.website': Yup.string()
        .nullable()
        .test(
          'valid-url',
          'Enter valid website URL',
          function (value) {
            if (!value) return true

            return /^(https?:\/\/)?([\w-])+\.{1}[a-zA-Z]{2,}(\/.*)?$/i.test(
              value
            )
          }
        ),

      'company.description': Yup.string()
        .trim()
        .min(
          20,
          'Company description too short'
        )
        .required(
          'Company description required'
        ),
    }),

    onSubmit: async (values) => {
      try {
        if (skills.length === 0) {
          toast.error(
            'Please add at least one skill'
          )
          return
        }

        const clean = (v) =>
          typeof v === 'string' ? v.trim() : v

        const payload = {
          title: clean(values.title),

          description: clean(
            values.description
          ),

          requirements: clean(
            values.requirements
          ),

          responsibilities: clean(
            values.responsibilities
          ),

          category: values.category,
          type: values.type,
          locationType: values.locationType,
          location: values.location,

          experience: {
            min: Number(
              values['experience.min']
            ),
            max: Number(
              values['experience.max']
            ),
          },

          salary: {
            min: Number(values['salary.min']),
            max: Number(values['salary.max']),
            isVisible:
              values['salary.isVisible'],
          },

          openings: Number(values.openings),

          education: clean(values.education),

          deadline:
            values.deadline || undefined,

          skills,

          featured: values.featured,
          urgent: values.urgent,

          company: {
            name: clean(
              values['company.name']
            ),

            website: clean(
              values['company.website']
            ),

            description: clean(
              values['company.description']
            ),
          },
        }

        await jobAPI.createJob(payload)

        toast.success(
          'Job posted successfully! '
        )

        navigate('/employer/my-jobs')
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to post job'
        )
      }
    },
  })

  const addSkill = (s) => {
    const t = s.trim()

    if (!t) {
      toast.error('Skill cannot be empty')
      return
    }

    if (t.length < 2) {
      toast.error('Skill too short')
      return
    }

    if (skills.includes(t)) {
      toast.error('Skill already added')
      return
    }

    if (skills.length >= 15) {
      toast.error(
        'Maximum 15 skills allowed'
      )
      return
    }

    setSkills([...skills, t])
    setSkillInput('')
  }

  const validateStep = async () => {
    let fields = []

    if (step === 0) {
      fields = [
        'title',
        'category',
        'type',
        'locationType',
        'location',
        'openings',
        'education',
      ]
    }

    if (step === 1) {
      fields = [
        'description',
        'requirements',
        'responsibilities',
        'deadline',
      ]
    }

    if (step === 2) {
      fields = [
        'experience.min',
        'experience.max',
        'salary.min',
        'salary.max',
        'company.name',
        'company.description',
      ]
    }
   
     const errors = await formik.validateForm()
   
     // mark touched
     fields.forEach((field) => {
       formik.setFieldTouched(field, true)
     })
   
     // nested field checker
     const hasError = (field) => {
       return field.split('.').reduce((obj, key) => obj?.[key], errors)
     }
   
     const stepErrors = fields.filter((field) =>
       hasError(field)
     )
   
     // skills validation
     if (step === 2 && skills.length === 0) {
       toast.error('Please add at least one skill')
       return
     }
   
     // move next step
     if (stepErrors.length === 0) {
       setStep((prev) => prev + 1)
     }
   }

  return (
    <>
      <Helmet>
        <title>
          Post a Job | ProLink Employer
        </title>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            Post a New Job
          </h1>

          <p className="text-sm text-slate-500">
            Fill in the details to attract the
            best candidates
          </p>
        </div>

        {/* Step Indicator */}

        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                i < step && setStep(i)
              }
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                i === step
                  ? 'bg-primary-600 text-white shadow-primary'
                  : i < step
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {i < step ? '✓ ' : ''}
              {s}
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
            {/* STEP 0 */}

            {step === 0 && (
              <div className="card p-6 space-y-4">
                <h3 className="font-bold">
                  Basic Information
                </h3>

                <F
                  formik={formik}
                  name="title"
                  label="Job Title"
                  required
                  placeholder="e.g. Senior React Developer"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <F
                    formik={formik}
                    name="category"
                    label="Category"
                    required
                    as="select"
                    options={JOB_CATEGORIES}
                  />

                  <F
                    formik={formik}
                    name="type"
                    label="Job Type"
                    required
                    as="select"
                    options={JOB_TYPES}
                  />

                  <F
                    formik={formik}
                    name="locationType"
                    label="Work Mode"
                    required
                    as="select"
                    options={LOCATION_TYPES}
                  />

                  <F
                    formik={formik}
                    name="location"
                    label="Location"
                    required
                    as="select"
                    options={INDIAN_CITIES}
                  />

                  <F
                    formik={formik}
                    name="openings"
                    label="No. of Openings"
                    type="number"
                  />

                  <F
                    formik={formik}
                    name="education"
                    label="Education"
                  />
                </div>
              </div>
            )}

            {/* STEP 1 */}

            {step === 1 && (
              <div className="card p-6 space-y-4">
                <h3 className="font-bold">
                  Job Details
                </h3>

                <F
                  formik={formik}
                  name="description"
                  label="Job Description"
                  required
                  as="textarea"
                  rows={6}
                />

                <F
                  formik={formik}
                  name="requirements"
                  label="Requirements"
                  required
                  as="textarea"
                  rows={4}
                />

                <F
                  formik={formik}
                  name="responsibilities"
                  label="Responsibilities"
                  required
                  as="textarea"
                  rows={4}
                />

                <F
                  formik={formik}
                  name="deadline"
                  label="Deadline"
                  type="date"
                />
              </div>
            )}

            {/* STEP 2 */}

            {step === 2 && (
              <div className="card p-6 space-y-5">
                <h3 className="font-bold">
                  Skills & Salary
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <F
                    formik={formik}
                    name="experience.min"
                    label="Min Experience"
                    type="number"
                  />

                  <F
                    formik={formik}
                    name="experience.max"
                    label="Max Experience"
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <F
                    formik={formik}
                    name="salary.min"
                    label="Min Salary"
                    placeholder="Min Salary / Year"
                    type="number"
                  />

                  <F
                    formik={formik}
                    name="salary.max"
                    label="Max Salary"
                    type="number"
                    placeholder="Max Salary / Year"
                  />
                </div>

                {/* Skills */}

                <div>
                  <label className="label">
                    Required Skills
                  </label>

                  <div className="flex gap-2 mb-3">
                    <input
                      value={skillInput}
                      onChange={(e) =>
                        setSkillInput(
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkill(skillInput)
                        }
                      }}
                      className="input-field flex-1"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        addSkill(skillInput)
                      }
                      className="btn-primary px-4"
                    >
                      <HiPlus />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="flex items-center gap-2 px-3 py-1 bg-primary-100 rounded-full"
                      >
                        {s}

                        <button
                          type="button"
                          onClick={() =>
                            setSkills(
                              skills.filter(
                                (x) => x !== s
                              )
                            )
                          }
                        >
                          <HiX />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Company */}

                <F
                  formik={formik}
                  name="company.name"
                  label="Company Name"
                />

                <F
                  formik={formik}
                  name="company.website"
                  label="Company Website"
                />

                <F
                  formik={formik}
                  name="company.description"
                  label="Company Description"
                  as="textarea"
                  rows={3}
                />
              </div>
            )}

            {/* STEP 3 */}

            {step === 3 && (
               <div className="card p-6 space-y-6">
    <div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Preview & Submit
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Review all job details before publishing.
      </p>
    </div>

    {/* Job Header */}

    <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-primary-100 dark:border-slate-700">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {formik.values.title || 'Job Title'}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 mt-1">
              {formik.values['company.name'] ||
                'Company Name'}{' '}
              • {formik.values.location}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="badge-primary">
              {formik.values.category}
            </span>

            <span className="badge-gray">
              {formik.values.type?.replace(
                '_',
                ' '
              )}
            </span>

            <span className="badge-gray capitalize">
              {formik.values.locationType}
            </span>

            {formik.values.urgent && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                Urgent
              </span>
            )}

            {formik.values.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Salary */}

        <div className="bg-white dark:bg-slate-800 rounded-xl px-5 py-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 mb-1">
            Salary Range
          </p>

          <h4 className="text-lg font-bold text-green-600">
            ₹{Number(formik.values['salary.min'] || 0).toLocaleString()}
            {' - '}₹{Number(formik.values['salary.max'] || 0).toLocaleString()}
          </h4>

          <p className="text-xs text-slate-500 mt-1">
            per year
          </p>
        </div>
      </div>
    </div>

    {/* Overview Grid */}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
        <p className="text-xs text-slate-500 mb-1">
          Experience
        </p>

          <h4 className="font-semibold text-slate-900 dark:text-white">
          {formik.values['experience.min']} - {formik.values['experience.max']} Years
        </h4>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
        <p className="text-xs text-slate-500 mb-1">
          Openings
        </p>

        <h4 className="font-semibold text-slate-900 dark:text-white">
          {formik.values.openings} Positions
        </h4>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
        <p className="text-xs text-slate-500 mb-1">
          Education
        </p>

        <h4 className="font-semibold text-slate-900 dark:text-white">
          {formik.values.education}
        </h4>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
        <p className="text-xs text-slate-500 mb-1">
          Deadline
        </p>

        <h4 className="font-semibold text-slate-900 dark:text-white">
          {formik.values.deadline || 'No Deadline'}
        </h4>
      </div>
    </div>

    {/* Skills */}

    <div className="space-y-3">
      <h4 className="font-semibold text-slate-900 dark:text-white">
        Required Skills
      </h4>

      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium border border-primary-100 dark:border-primary-800"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No skills added
          </p>
        )}
      </div>
    </div>

    {/* Description */}

    <div className="space-y-3">
      <h4 className="font-semibold text-slate-900 dark:text-white">
        Job Description
      </h4>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5">
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-line">
          {formik.values.description}
        </p>
      </div>
    </div>

    {/* Requirements */}

    <div className="space-y-3">
      <h4 className="font-semibold text-slate-900 dark:text-white">
        Requirements
      </h4>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5">
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-line">
          {formik.values.requirements}
        </p>
      </div>
    </div>

    {/* Responsibilities */}

    <div className="space-y-3">
      <h4 className="font-semibold text-slate-900 dark:text-white">
        Responsibilities
      </h4>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5">
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-line">
          {formik.values.responsibilities}
        </p>
      </div>
    </div>

    {/* Company */}

    <div className="space-y-3">
      <h4 className="font-semibold text-slate-900 dark:text-white">
        Company Information
      </h4>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 space-y-3">
        <div>
          <p className="text-xs text-slate-500">
            Company Name
          </p>

            <h5 className="font-semibold text-slate-900 dark:text-white">
            {formik.values['company.name']}
          </h5>
        </div>

        {formik.values['company.website'] && (
          <div>
            <p className="text-xs text-slate-500">
              Website
            </p>

            <a
              href={formik.values['company.website']}
              target="_blank"
              rel="noreferrer"
              className="text-primary-600 text-sm hover:underline"
            >
              {formik.values['company.website']}
            </a>
          </div>
        )}

        <div>
          <p className="text-xs text-slate-500">
            Description
          </p>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-7">
            {formik.values['company.description']}
          </p>
        </div>
      </div>
    </div>

    {/* Warning */}

    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
      <p className="text-sm text-amber-700 dark:text-amber-300">
        Please verify all details carefully before
        posting this job. Once published,
        candidates will be able to view and
        apply immediately.
      </p>
    </div>
               </div>
             )}
            {/* Navigation */}

            <div className="flex justify-between mt-5">
              <button
                type="button"
                onClick={() =>
                  setStep(Math.max(0, step - 1))
                }
                disabled={step === 0}
                className="btn-ghost py-3 px-6"
              >
                ← Previous
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={validateStep}
                  className="btn-primary py-3 px-8"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={
                    formik.isSubmitting
                  }
                  className="btn-primary py-3 px-8"
                >
                  {formik.isSubmitting
                    ? 'Posting Job...'
                    : ' Post Job'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </>
  )
}