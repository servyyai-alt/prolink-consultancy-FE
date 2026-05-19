// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Helmet } from 'react-helmet-async'
// import { useFormik } from 'formik'
// import * as Yup from 'yup'
// import { motion } from 'framer-motion'
// import { HiPlus, HiX } from 'react-icons/hi'
// import { jobAPI } from '../../services/api'
// import { JOB_CATEGORIES, JOB_TYPES, LOCATION_TYPES, INDIAN_CITIES } from '../../constants/index'
// import toast from 'react-hot-toast'

// const STEPS = ['Basic Info', 'Job Details', 'Skills & Salary', 'Preview']

// export default function EmpPostJob() {
//   const navigate = useNavigate()
//   const [step, setStep] = useState(0)
//   const [skills, setSkills] = useState([])
//   const [skillInput, setSkillInput] = useState('')

//   const formik = useFormik({
//     initialValues: {
//       title: '', description: '', requirements: '', responsibilities: '',
//       category: '', type: 'full_time', locationType: 'onsite', location: '',
//       'experience.min': 0, 'experience.max': 5,
//       'salary.min': '', 'salary.max': '', 'salary.isVisible': true,
//       openings: 1, education: '', deadline: '',
//       featured: false, urgent: false,
//       'company.name': '', 'company.website': '', 'company.description': '',
//     },
//     validationSchema: Yup.object({
//       title:       Yup.string().min(5).required('Job title required'),
//       description: Yup.string().min(50).required('Description required (min 50 chars)'),
//       category:    Yup.string().required('Category required'),
//       location:    Yup.string().required('Location required'),
//     }),
//     onSubmit: async (values) => {
//       try {
//         const payload = {
//           title: values.title,
//           description: values.description,
//           requirements: values.requirements,
//           responsibilities: values.responsibilities,
//           category: values.category,
//           type: values.type,
//           locationType: values.locationType,
//           location: values.location,
//           experience: { min: Number(values['experience.min']), max: Number(values['experience.max']) },
//           salary: { min: Number(values['salary.min']), max: Number(values['salary.max']), isVisible: values['salary.isVisible'] },
//           openings: Number(values.openings),
//           education: values.education,
//           deadline: values.deadline || undefined,
//           skills,
//           featured: values.featured,
//           urgent: values.urgent,
//           company: { name: values['company.name'], website: values['company.website'], description: values['company.description'] },
//         }
//         await jobAPI.createJob(payload)
//         toast.success('Job posted successfully! 🎉')
//         navigate('/employer/my-jobs')
//       } catch (err) {
//         toast.error(err.response?.data?.message || 'Failed to post job')
//       }
//     },
//   })

//   const addSkill = (s) => {
//     const t = s.trim()
//     if (t && !skills.includes(t) && skills.length < 15) setSkills([...skills, t])
//     setSkillInput('')
//   }

//   const F = ({ name, label, required, as:Tag='input', type='text', placeholder, options, rows }) => (
//     <div>
//       <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
//       {Tag === 'select' ? (
//         <select {...formik.getFieldProps(name)} className={`input-field ${formik.touched[name]&&formik.errors[name]?'border-red-400':''}`}>
//           <option value="">Select…</option>
//           {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
//         </select>
//       ) : Tag === 'textarea' ? (
//         <textarea {...formik.getFieldProps(name)} rows={rows||4} placeholder={placeholder} className={`input-field resize-none ${formik.touched[name]&&formik.errors[name]?'border-red-400':''}`} />
//       ) : (
//         <input {...formik.getFieldProps(name)} type={type} placeholder={placeholder} className={`input-field ${formik.touched[name]&&formik.errors[name]?'border-red-400':''}`} />
//       )}
//       {formik.touched[name]&&formik.errors[name]&&<p className="mt-1 text-xs text-red-500">{formik.errors[name]}</p>}
//     </div>
//   )

//   return (
//     <>
//       <Helmet><title>Post a Job | ProLink Employer</title></Helmet>
//       <div className="max-w-3xl mx-auto space-y-6">
//         <div>
//           <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Post a New Job</h1>
//           <p className="text-sm text-slate-500">Fill in the details to attract the best candidates</p>
//         </div>

//         {/* Step indicator */}
//         <div className="flex gap-2">
//           {STEPS.map((s, i) => (
//             <button key={s} onClick={() => i < step && setStep(i)}
//               className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
//                 i === step ? 'bg-primary-600 text-white shadow-primary' :
//                 i < step   ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 cursor-pointer' :
//                              'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
//               }`}>
//               {i < step ? '✓ ' : ''}{s}
//             </button>
//           ))}
//         </div>

//         <motion.div key={step} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.25 }}>
//           <form onSubmit={formik.handleSubmit}>
//             {/* Step 0: Basic Info */}
//             {step === 0 && (
//               <div className="card p-6 space-y-4">
//                 <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Basic Information</h3>
//                 <F name="title" label="Job Title" required placeholder="e.g. Senior React Developer" />
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <F name="category"    label="Category"    required as="select" options={JOB_CATEGORIES} />
//                   <F name="type"        label="Job Type"    required as="select" options={JOB_TYPES} />
//                   <F name="locationType" label="Work Mode"  required as="select" options={LOCATION_TYPES} />
//                   <F name="location"    label="Location"   required as="select" options={INDIAN_CITIES} />
//                   <F name="openings"    label="No. of Openings" type="number" placeholder="1" />
//                   <F name="education"   label="Education"  placeholder="e.g. B.Tech / Any Graduate" />
//                 </div>
//                 <div className="flex items-center gap-6">
//                   {[{name:'featured',l:'Featured Listing'},{name:'urgent',l:'Mark as Urgent'}].map(({name,l}) => (
//                     <label key={name} className="flex items-center gap-2 cursor-pointer">
//                       <input type="checkbox" {...formik.getFieldProps(name)} checked={formik.values[name]}
//                         className="w-4 h-4 rounded text-primary-600" />
//                       <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{l}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Step 1: Job Details */}
//             {step === 1 && (
//               <div className="card p-6 space-y-4">
//                 <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Job Details</h3>
//                 <F name="description"      label="Job Description"      required as="textarea" rows={6} placeholder="Describe the role, responsibilities, and what makes this position exciting…" />
//                 <F name="requirements"     label="Requirements"          as="textarea" rows={4} placeholder="List minimum qualifications, certifications, experience needed…" />
//                 <F name="responsibilities" label="Key Responsibilities"  as="textarea" rows={4} placeholder="List the day-to-day responsibilities of this role…" />
//                 <F name="deadline"         label="Application Deadline"  type="date" />
//               </div>
//             )}

//             {/* Step 2: Skills & Salary */}
//             {step === 2 && (
//               <div className="card p-6 space-y-5">
//                 <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Skills & Compensation</h3>
//                 {/* Experience */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <F name="experience.min" label="Min Experience (years)" type="number" placeholder="0" />
//                   <F name="experience.max" label="Max Experience (years)" type="number" placeholder="5" />
//                 </div>
//                 {/* Salary */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <F name="salary.min" label="Min Salary (₹/year)" type="number" placeholder="500000" />
//                   <F name="salary.max" label="Max Salary (₹/year)" type="number" placeholder="1000000" />
//                 </div>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input type="checkbox" {...formik.getFieldProps('salary.isVisible')} checked={formik.values['salary.isVisible']}
//                     className="w-4 h-4 rounded text-primary-600" />
//                   <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Show salary to candidates</span>
//                 </label>
//                 {/* Skills */}
//                 <div>
//                   <label className="label">Required Skills</label>
//                   <div className="flex gap-2 mb-3">
//                     <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
//                       onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
//                       placeholder="Type skill and press Enter" className="input-field flex-1 text-sm" />
//                     <button type="button" onClick={() => addSkill(skillInput)} className="btn-primary py-3 px-4"><HiPlus className="w-4 h-4" /></button>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {skills.map(s => (
//                       <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold">
//                         {s}<button type="button" onClick={() => setSkills(skills.filter(x => x !== s))}><HiX className="w-3.5 h-3.5 hover:text-red-500" /></button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 {/* Company info */}
//                 <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-4">
//                   <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Company Info (for this posting)</h4>
//                   <F name="company.name"        label="Company Name"        placeholder="Your company name" />
//                   <F name="company.website"     label="Company Website"     type="url" placeholder="https://yourcompany.com" />
//                   <F name="company.description" label="Company Description" as="textarea" rows={3} placeholder="Brief company overview…" />
//                 </div>
//               </div>
//             )}

//             {/* Step 3: Preview */}
//             {step === 3 && (
//               <div className="card p-6 space-y-4">
//                 <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Preview & Submit</h3>
//                 <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 space-y-3">
//                   <h4 className="text-lg font-bold text-slate-900 dark:text-white">{formik.values.title || 'Job Title'}</h4>
//                   <p className="text-slate-500 text-sm">{formik.values['company.name']} · {formik.values.location}</p>
//                   <div className="flex flex-wrap gap-2">
//                     <span className="badge-primary">{formik.values.category}</span>
//                     <span className="badge-gray">{formik.values.type?.replace('_',' ')}</span>
//                     <span className="badge-gray">{formik.values.locationType}</span>
//                   </div>
//                   {skills.length > 0 && <div className="flex flex-wrap gap-1.5">{skills.map(s => <span key={s} className="px-2.5 py-1 bg-white dark:bg-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">{s}</span>)}</div>}
//                   {formik.values['salary.min'] && (
//                     <p className="text-green-600 font-bold text-sm">₹{Number(formik.values['salary.min']).toLocaleString()} – ₹{Number(formik.values['salary.max']).toLocaleString()} / year</p>
//                   )}
//                 </div>
//                 <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-300">
//                   ✅ Review your job details above before submitting. You can edit after posting.
//                 </div>
//               </div>
//             )}

//             {/* Navigation */}
//             <div className="flex justify-between mt-5">
//               <button type="button" onClick={() => setStep(Math.max(0, step-1))} disabled={step === 0}
//                 className="btn-ghost py-3 px-6 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-40">← Previous</button>
//               {step < STEPS.length - 1 ? (
//                 <button type="button" onClick={() => setStep(step+1)} className="btn-primary py-3 px-8">Next →</button>
//               ) : (
//                 <button type="submit" disabled={formik.isSubmitting} className="btn-primary py-3 px-8">
//                   {formik.isSubmitting ? 'Posting…' : '🚀 Post Job'}
//                 </button>
//               )}
//             </div>
//           </form>
//         </motion.div>
//       </div>
//     </>
//   )
// }

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { HiPlus, HiX } from 'react-icons/hi'
import { jobAPI } from '../../services/api'
import { JOB_CATEGORIES, JOB_TYPES, LOCATION_TYPES, INDIAN_CITIES } from '../../constants/index'
import toast from 'react-hot-toast'

const STEPS = ['Basic Info', 'Job Details', 'Skills & Salary', 'Preview']

// ─── Field component lives OUTSIDE the page component so React never
//     treats it as a new component type between renders, preventing the
//     "loses focus after one keystroke" bug. ─────────────────────────
const F = ({ name, label, required, as: Tag = 'input', type = 'text', placeholder, options, rows, formik }) => (
  <div>
    <label className="label">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>

    {Tag === 'select' ? (
      <select
        {...formik.getFieldProps(name)}
        className={`input-field ${formik.touched[name] && formik.errors[name] ? 'border-red-400' : ''}`}
      >
        <option value="">Select…</option>
        {options.map(o =>
          typeof o === 'string'
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
    ) : Tag === 'textarea' ? (
      <textarea
        {...formik.getFieldProps(name)}
        rows={rows || 4}
        placeholder={placeholder}
        className={`input-field resize-none ${formik.touched[name] && formik.errors[name] ? 'border-red-400' : ''}`}
      />
    ) : (
      <input
        {...formik.getFieldProps(name)}
        type={type}
        placeholder={placeholder}
        className={`input-field ${formik.touched[name] && formik.errors[name] ? 'border-red-400' : ''}`}
      />
    )}

    {formik.touched[name] && formik.errors[name] && (
      <p className="mt-1 text-xs text-red-500">{formik.errors[name]}</p>
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
      title: '', description: '', requirements: '', responsibilities: '',
      category: '', type: 'full_time', locationType: 'onsite', location: '',
      'experience.min': 0, 'experience.max': 5,
      'salary.min': '', 'salary.max': '', 'salary.isVisible': true,
      openings: 1, education: '', deadline: '',
      featured: false, urgent: false,
      'company.name': '', 'company.website': '', 'company.description': '',
    },
    validationSchema: Yup.object({
      title:       Yup.string().min(5).required('Job title required'),
      description: Yup.string().min(50).required('Description required (min 50 chars)'),
      category:    Yup.string().required('Category required'),
      location:    Yup.string().required('Location required'),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          title: values.title,
          description: values.description,
          requirements: values.requirements,
          responsibilities: values.responsibilities,
          category: values.category,
          type: values.type,
          locationType: values.locationType,
          location: values.location,
          experience: { min: Number(values['experience.min']), max: Number(values['experience.max']) },
          salary: {
            min: Number(values['salary.min']),
            max: Number(values['salary.max']),
            isVisible: values['salary.isVisible'],
          },
          openings: Number(values.openings),
          education: values.education,
          deadline: values.deadline || undefined,
          skills,
          featured: values.featured,
          urgent: values.urgent,
          company: {
            name: values['company.name'],
            website: values['company.website'],
            description: values['company.description'],
          },
        }
        await jobAPI.createJob(payload)
        toast.success('Job posted successfully! 🎉')
        navigate('/employer/my-jobs')
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to post job')
      }
    },
  })

  const addSkill = (s) => {
    const t = s.trim()
    if (t && !skills.includes(t) && skills.length < 15) setSkills([...skills, t])
    setSkillInput('')
  }

  return (
    <>
      <Helmet><title>Post a Job | ProLink Employer</title></Helmet>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Post a New Job</h1>
          <p className="text-sm text-slate-500">Fill in the details to attract the best candidates</p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => i < step && setStep(i)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                i === step ? 'bg-primary-600 text-white shadow-primary' :
                i < step   ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 cursor-pointer' :
                              'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {i < step ? '✓ ' : ''}{s}
            </button>
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
          <form onSubmit={formik.handleSubmit}>

            {/* Step 0: Basic Info */}
            {step === 0 && (
              <div className="card p-6 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                  Basic Information
                </h3>
                <F formik={formik} name="title" label="Job Title" required placeholder="e.g. Senior React Developer" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <F formik={formik} name="category"     label="Category"       required as="select" options={JOB_CATEGORIES} />
                  <F formik={formik} name="type"         label="Job Type"        required as="select" options={JOB_TYPES} />
                  <F formik={formik} name="locationType" label="Work Mode"       required as="select" options={LOCATION_TYPES} />
                  <F formik={formik} name="location"     label="Location"       required as="select" options={INDIAN_CITIES} />
                  <F formik={formik} name="openings"     label="No. of Openings" type="number" placeholder="1" />
                  <F formik={formik} name="education"    label="Education"       placeholder="e.g. B.Tech / Any Graduate" />
                </div>
                <div className="flex items-center gap-6">
                  {[{ name: 'featured', l: 'Featured Listing' }, { name: 'urgent', l: 'Mark as Urgent' }].map(({ name, l }) => (
                    <label key={name} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...formik.getFieldProps(name)}
                        checked={formik.values[name]}
                        className="w-4 h-4 rounded text-primary-600"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{l}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Job Details */}
            {step === 1 && (
              <div className="card p-6 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                  Job Details
                </h3>
                <F formik={formik} name="description"      label="Job Description"     required as="textarea" rows={6} placeholder="Describe the role, responsibilities, and what makes this position exciting…" />
                <F formik={formik} name="requirements"     label="Requirements"          as="textarea" rows={4} placeholder="List minimum qualifications, certifications, experience needed…" />
                <F formik={formik} name="responsibilities" label="Key Responsibilities"  as="textarea" rows={4} placeholder="List the day-to-day responsibilities of this role…" />
                <F formik={formik} name="deadline"         label="Application Deadline"  type="date" />
              </div>
            )}

            {/* Step 2: Skills & Salary */}
            {step === 2 && (
              <div className="card p-6 space-y-5">
                <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                  Skills & Compensation
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <F formik={formik} name="experience.min" label="Min Experience (years)" type="number" placeholder="0" />
                  <F formik={formik} name="experience.max" label="Max Experience (years)" type="number" placeholder="5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <F formik={formik} name="salary.min" label="Min Salary (₹/year)" type="number" placeholder="500000" />
                  <F formik={formik} name="salary.max" label="Max Salary (₹/year)" type="number" placeholder="1000000" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...formik.getFieldProps('salary.isVisible')}
                    checked={formik.values['salary.isVisible']}
                    className="w-4 h-4 rounded text-primary-600"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Show salary to candidates</span>
                </label>

                {/* Skills */}
                <div>
                  <label className="label">Required Skills</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
                      placeholder="Type skill and press Enter"
                      className="input-field flex-1 text-sm"
                    />
                    <button type="button" onClick={() => addSkill(skillInput)} className="btn-primary py-3 px-4">
                      <HiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                      <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold">
                        {s}
                        <button type="button" onClick={() => setSkills(skills.filter(x => x !== s))}>
                          <HiX className="w-3.5 h-3.5 hover:text-red-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Company info */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Company Info (for this posting)</h4>
                  <F formik={formik} name="company.name"        label="Company Name"        placeholder="Your company name" />
                  <F formik={formik} name="company.website"     label="Company Website"     type="url" placeholder="https://yourcompany.com" />
                  <F formik={formik} name="company.description" label="Company Description" as="textarea" rows={3} placeholder="Brief company overview…" />
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {step === 3 && (
              <div className="card p-6 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                  Preview & Submit
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{formik.values.title || 'Job Title'}</h4>
                  <p className="text-slate-500 text-sm">{formik.values['company.name']} · {formik.values.location}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge-primary">{formik.values.category}</span>
                    <span className="badge-gray">{formik.values.type?.replace('_', ' ')}</span>
                    <span className="badge-gray">{formik.values.locationType}</span>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map(s => (
                        <span key={s} className="px-2.5 py-1 bg-white dark:bg-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {formik.values['salary.min'] && (
                    <p className="text-green-600 font-bold text-sm">
                      ₹{Number(formik.values['salary.min']).toLocaleString()} – ₹{Number(formik.values['salary.max']).toLocaleString()} / year
                    </p>
                  )}
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-300">
                  ✅ Review your job details above before submitting. You can edit after posting.
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-5">
              <button
                type="button"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="btn-ghost py-3 px-6 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-40"
              >
                ← Previous
              </button>
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={() => setStep(step + 1)} className="btn-primary py-3 px-8">
                  Next →
                </button>
              ) : (
                <button type="submit" disabled={formik.isSubmitting} className="btn-primary py-3 px-8">
                  {formik.isSubmitting ? 'Posting…' : '🚀 Post Job'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </>
  )
}