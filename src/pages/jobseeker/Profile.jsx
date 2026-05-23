import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { getIn, useFormik } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { HiCamera, HiUpload, HiPlus, HiX, HiCheckCircle } from 'react-icons/hi'
import { userAPI } from '../../services/api'
import { updateUser, selectUser } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'
import { optionalIndianMobileSchema, sanitizeIndianMobileInput } from '../../utils/phoneValidation'

const SKILL_SUGGESTIONS = ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'SQL', 'Excel', 'Sales', 'Marketing', 'HR', 'Project Management', 'AutoCAD', 'Tally', 'Leadership']

function ProfileField({ formik, name, label, type = 'text', placeholder, as: Tag = 'input', rows, options }) {
  const touched = getIn(formik.touched, name)
  const error = getIn(formik.errors, name)
  const hasError = touched && error

  return (
    <div>
      <label className="label">{label}</label>
      {Tag === 'select' ? (
        <select
          name={name}
          value={getIn(formik.values, name) || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`input-field ${hasError ? 'border-red-400' : ''}`}
        >
          <option value="">Select...</option>
          {options.map(({ v, l }) => <option key={v} value={v}>{l}</option>)}
        </select>
      ) : Tag === 'textarea' ? (
        <textarea
          name={name}
          value={getIn(formik.values, name) || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={rows || 4}
          placeholder={placeholder}
          className={`input-field resize-none ${hasError ? 'border-red-400' : ''}`}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={getIn(formik.values, name) || ''}
          onBlur={formik.handleBlur}
          placeholder={placeholder}
          maxLength={name === 'phone' ? 10 : undefined}
          onChange={(e) => {
            const value = name === 'phone' ? sanitizeIndianMobileInput(e.target.value) : e.target.value
            formik.setFieldValue(name, value)
          }}
          className={`input-field ${hasError ? 'border-red-400' : ''}`}
        />
      )}
      {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

const cleanValue = (value) => (typeof value === 'string' ? value.trim() : value || '')

const buildJobSeekerPayload = (values, skills = []) => ({
  firstName: cleanValue(values.firstName),
  lastName: cleanValue(values.lastName),
  phone: cleanValue(values.phone),
  profile: {
    headline: cleanValue(values.profile.headline),
    summary: cleanValue(values.profile.summary),
    location: cleanValue(values.profile.location),
    website: cleanValue(values.profile.website),
    linkedin: cleanValue(values.profile.linkedin),
    github: cleanValue(values.profile.github),
    experience: cleanValue(values.profile.experience),
    education: cleanValue(values.profile.education),
    availability: cleanValue(values.profile.availability),
    skills: skills.map(cleanValue).filter(Boolean),
  },
})

const buildJobSeekerUserSnapshot = (user) => buildJobSeekerPayload({
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  phone: user?.phone || '',
  profile: {
    headline: user?.profile?.headline || '',
    summary: user?.profile?.summary || '',
    location: user?.profile?.location || '',
    website: user?.profile?.website || '',
    linkedin: user?.profile?.linkedin || '',
    github: user?.profile?.github || '',
    experience: user?.profile?.experience || '',
    education: user?.profile?.education || '',
    availability: user?.profile?.availability || '',
  },
}, user?.profile?.skills || [])

const hasProfileChanges = (current, original) => JSON.stringify(current) !== JSON.stringify(original)

export default function JSProfile() {
  const dispatch   = useDispatch()
  const user       = useSelector(selectUser)
  const [saving,   setSaving]   = useState(false)
  const [skills,   setSkills]   = useState(user?.profile?.skills || [])
  const [skillInput, setSkillInput] = useState('')
  const [uploading, setUploading] = useState({ avatar: false, resume: false })
  const avatarRef = useRef()
  const resumeRef = useRef()

  useEffect(() => {
    setSkills(user?.profile?.skills || [])
  }, [user?.profile?.skills])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName:   user?.firstName || '',
      lastName:    user?.lastName  || '',
      phone:       user?.phone     || '',
      profile: {
        headline:     user?.profile?.headline     || '',
        summary:      user?.profile?.summary      || '',
        location:     user?.profile?.location     || '',
        website:      user?.profile?.website      || '',
        linkedin:     user?.profile?.linkedin     || '',
        github:       user?.profile?.github       || '',
        experience:   user?.profile?.experience   || '',
        education:    user?.profile?.education    || '',
        availability: user?.profile?.availability || '',
      },
    },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('Enter your first name.'),
      lastName:  Yup.string().trim().required('Enter your last name.'),
      phone:     optionalIndianMobileSchema('Enter a valid 10-digit mobile number.'),
      profile: Yup.object({
        website: Yup.string().trim().url('Enter a valid website URL.'),
        linkedin: Yup.string().trim().url('Enter a valid LinkedIn URL.'),
        github: Yup.string().trim().url('Enter a valid GitHub or portfolio URL.'),
      }),
    }),
    onSubmit: async (values) => {
      setSaving(true)
      try {
        const payload = buildJobSeekerPayload(values, skills)
        const original = buildJobSeekerUserSnapshot(user)

        if (!hasProfileChanges(payload, original)) {
          toast('No changes is there.')
          return
        }

        const { data } = await userAPI.updateProfile(payload)
        dispatch(updateUser(data.data.user))
        toast.success('Profile updated successfully!')
      } catch {
        toast.error('Failed to update profile')
      } finally {
        setSaving(false)
      }
    },
  })

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setUploading(u => ({ ...u, avatar: true }))
    const fd = new FormData()
    fd.append('avatar', file)
    try {
      const { data } = await userAPI.uploadAvatar(fd)
      dispatch(updateUser(data.data.user))
      toast.success('Avatar updated!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(u => ({ ...u, avatar: false })) }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { toast.error('Resume must be under 10MB'); return }
    setUploading(u => ({ ...u, resume: true }))
    const fd = new FormData()
    fd.append('resume', file)
    try {
      const { data } = await userAPI.uploadResume(fd)
      dispatch(updateUser(data.data.user))
      toast.success('Resume uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(u => ({ ...u, resume: false })) }
  }

  const addSkill = (skill) => {
    const s = skill.trim()
    if (s && !skills.includes(s) && skills.length < 20) setSkills([...skills, s])
    setSkillInput('')
  }

  const removeSkill = (s) => setSkills(skills.filter(x => x !== s))

  const F = ({
  name,
  label,
  type = 'text',
  placeholder,
  as: Tag = 'input',
  rows,
  options,
}) => {
  const touched = getIn(formik.touched, name)
  const error = getIn(formik.errors, name)
  const hasError = touched && error

  return (
    <div>
      <label className="label">{label}</label>

      {Tag === 'select' ? (
        <select
          name={name}
          value={getIn(formik.values, name) || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`input-field ${hasError ? 'border-red-400' : ''}`}
        >
          <option value="">Select…</option>

          {options.map(({ v, l }) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      ) : Tag === 'textarea' ? (
        <textarea
          name={name}
          value={getIn(formik.values, name) || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={rows || 4}
          placeholder={placeholder}
          className={`input-field resize-none ${
            hasError ? 'border-red-400' : ''
          }`}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={getIn(formik.values, name) || ''}
          onBlur={formik.handleBlur}
          placeholder={placeholder}
          maxLength={name === 'phone' ? 10 : undefined}
          onChange={(e) => {
            let value = e.target.value

            if (name === 'phone') {
              value = sanitizeIndianMobileInput(value)
            }

            formik.setFieldValue(name, value)
          }}
          className={`input-field ${hasError ? 'border-red-400' : ''}`}
        />
      )}

      {hasError && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

  return (
    <>
      <Helmet><title>My Profile | ProLink</title></Helmet>
      <form onSubmit={formik.handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">My Profile</h1>
            <p className="text-sm text-slate-500">Keep your profile up to date for better job matches</p>
          </div>
          <button type="submit" disabled={saving} className="btn-primary py-2.5">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {/* Avatar + Resume */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="card p-6 flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {user?.avatar?.url
                ? <img src={user.avatar.url} alt="" className="w-24 h-24 rounded-2xl object-cover" />
                : <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">{user?.firstName?.[0]}</span>
                  </div>
              }
              <button type="button" onClick={() => avatarRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-700 transition-colors">
                {uploading.avatar ? <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" /> : <HiCamera className="w-4 h-4" />}
              </button>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <p className="text-xs text-slate-400 text-center">Click camera to update<br />JPG/PNG, max 5MB</p>
          </div>

          {/* Resume */}
          <div className="flex-1">
            <p className="label mb-3">Resume / CV</p>
            <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${user?.profile?.resume?.url ? 'border-green-300 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'}`}>
              {user?.profile?.resume?.url ? (
                <div className="flex items-center gap-3">
                  <HiCheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">Resume uploaded ✓</p>
                    <p className="text-xs text-slate-500 truncate">
                      Uploaded {new Date(user.profile.resume.uploadedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <a href={user.profile.resume.url} target="_blank" rel="noreferrer"
                        className="text-xs text-primary-600 hover:underline font-semibold">View</a>
                      <button type="button" onClick={() => resumeRef.current?.click()} className="text-xs text-slate-500 hover:underline">Update</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <HiUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Upload your resume</p>
                  <p className="text-xs text-slate-400 mt-1">PDF or Word, max 10MB</p>
                  <button type="button" onClick={() => resumeRef.current?.click()}
                    className="mt-3 btn-secondary py-2 text-sm">
                    {uploading.resume ? 'Uploading…' : 'Choose File'}
                  </button>
                </div>
              )}
              <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
            </div>
          </div>
        </motion.div>

        {/* Basic info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProfileField formik={formik} name="firstName" label="First Name" placeholder="Arjun" />
            <ProfileField formik={formik} name="lastName"  label="Last Name"  placeholder="Sharma" />
            <ProfileField formik={formik} name="phone"     label="Phone Number" type="tel" placeholder="98765 43210" />
            <ProfileField formik={formik} name="profile.location" label="Location" placeholder="Chennai, Tamil Nadu" />
          </div>
          <ProfileField formik={formik} name="profile.headline" label="Professional Headline" placeholder="e.g. Full Stack Developer with 3 years of experience" />
          <ProfileField formik={formik} name="profile.summary"  label="Professional Summary" as="textarea" rows={4} placeholder="Write a brief summary about yourself, your experience, and what you're looking for…" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProfileField formik={formik} name="profile.experience" label="Total Experience" placeholder="e.g. 3 years" />
            <ProfileField formik={formik} name="profile.education"  label="Highest Education" placeholder="e.g. B.Tech Computer Science" />
            <ProfileField formik={formik} name="profile.availability" label="Availability" as="select" options={[
              { v: 'immediate',     l: 'Immediate Joiner' },
              { v: 'within_month',  l: 'Within 1 Month' },
              { v: 'flexible',      l: 'Flexible' },
              { v: 'not_looking',   l: 'Not Actively Looking' },
            ]} />
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Skills <span className="text-slate-400 font-normal text-sm">({skills.length}/20)</span></h3>

          <div className="flex gap-2">
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
              placeholder="Type a skill and press Enter…"
              className="input-field flex-1 text-sm" />
            <button type="button" onClick={() => addSkill(skillInput)} className="btn-primary py-3 px-4">
              <HiPlus className="w-4 h-4" />
            </button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors">
                    <HiX className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div>
            <p className="text-xs text-slate-400 mb-2">Suggested skills:</p>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).map(s => (
                <button key={s} type="button" onClick={() => addSkill(s)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600 transition-colors">
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Links */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Online Presence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProfileField formik={formik} name="profile.linkedin" label="LinkedIn Profile" placeholder="https://linkedin.com/in/…" type="url" />
            <ProfileField formik={formik} name="profile.github"   label="GitHub / Portfolio" placeholder="https://github.com/…" type="url" />
            <ProfileField formik={formik} name="profile.website"  label="Personal Website" placeholder="https://yoursite.com" type="url" />
          </div>
        </motion.div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary py-3 px-8">
            {saving ? 'Saving Changes…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </>
  )
}
