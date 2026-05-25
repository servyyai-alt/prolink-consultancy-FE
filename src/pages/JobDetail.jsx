import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { HiLocationMarker, HiBriefcase, HiClock, HiCurrencyRupee, HiBookmark, HiShare, HiArrowLeft, HiCheckCircle, HiExclamation, HiCalendar, HiUsers } from 'react-icons/hi'
import { jobAPI, applicationAPI, userAPI } from '../services/api'
import { selectIsLoggedIn, selectUser } from '../redux/slices/authSlice'
import { Badge, Modal } from '../components/ui/index'
import toast from 'react-hot-toast'

export default function JobDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const user = useSelector(selectUser)
  const [applyModal, setApplyModal] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)
  const [saved, setSaved] = useState(false)
  const [applied, setApplied] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['job', slug],
    queryFn: () => jobAPI.getJob(slug),
    enabled: !!slug,
  })

  const job = data?.data?.data?.job
  const similarJobs = data?.data?.data?.similarJobs || []

  const handleApply = async () => {
    if (!isLoggedIn) { navigate('/login', { state: { from: { pathname: `/jobs/${slug}` } } }); return }
    if (user?.role !== 'job_seeker') { toast.error('Only job seekers can apply'); return }
    if (!user?.profile?.resume?.url) { toast.error('Please upload your resume first'); navigate('/dashboard/profile'); return }
    setApplyModal(true)
  }

  const submitApplication = async () => {
    setApplying(true)
    try {
      await applicationAPI.apply({ jobId: job._id, coverLetter })
      setApplied(true); setApplyModal(false)
      toast.success('Application submitted! 🎉')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to apply') }
    finally { setApplying(false) }
  }

  const handleSave = async () => {
    if (!isLoggedIn) { toast.error('Login to save jobs'); return }
    try {
      const { data: res } = await userAPI.saveJob(job._id)
      setSaved(res.data.saved)
      toast.success(res.data.saved ? 'Job saved!' : 'Job unsaved')
    } catch { toast.error('Action failed') }
  }

  if (isLoading) return (
    <div className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-950 animate-pulse">
      <div className="page-container py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_,i) => <div key={i} className="card p-6 h-40 bg-slate-100 dark:bg-slate-800" />)}
        </div>
        <div className="card p-6 h-64 bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  )

  if (isError || !job) return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Job Not Found</h2>
        <Link to="/jobs" className="btn-primary mt-4">Browse All Jobs</Link>
      </div>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{job.title} at {job.company?.name} | ProLink</title>
        <meta name="description" content={`Apply for ${job.title} at ${job.company?.name} in ${job.location}.`} />
      </Helmet>
      <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="page-container py-3.5 flex items-center gap-2 text-sm">
            <Link to="/jobs" className="flex items-center gap-1 text-slate-500 hover:text-primary-600 transition-colors"><HiArrowLeft className="w-4 h-4" />Jobs</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 dark:text-slate-300 truncate">{job.title}</span>
          </div>
        </div>
        <div className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Header */}
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="card p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-700 font-bold text-2xl border border-primary-100 dark:border-primary-800 flex-shrink-0">
                    {job.company?.name?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white">{job.title}</h1>
                        <p className="text-slate-500 mt-0.5">{job.company?.name}</p>
                      </div>
                      <div className="flex gap-2">
                        {job.urgent && <Badge variant="danger"> Urgent</Badge>}
                        {job.featured && <Badge variant="primary"> Featured</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-100 dark:border-slate-700">
                  {[[HiLocationMarker,'Location',job.location],[HiBriefcase,'Type',job.type?.replace('_',' ')],[HiClock,'Mode',job.locationType],[HiUsers,'Openings',`${job.openings}`]].map(([Icon,label,val]) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center"><Icon className="w-4 h-4 text-slate-400" /></div>
                      <div><p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p><p className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">{val}</p></div>
                    </div>
                  ))}
                </div>
                {job.salary?.isVisible && job.salary?.min && (
                  <p className="mt-4 text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                    <HiCurrencyRupee className="w-5 h-5" />₹{(job.salary.min/100000).toFixed(1)}L–₹{(job.salary.max/100000).toFixed(1)}L / year
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mt-5">
                  {applied ? (
                    <div className="flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold rounded-xl">
                      <HiCheckCircle className="w-5 h-5" />Applied Successfully
                    </div>
                  ) : (
                    <button onClick={handleApply} disabled={job.status!=='active'} className="btn-primary py-3 px-8 disabled:opacity-50">
                      {job.status!=='active' ? 'Position Closed' : 'Apply Now'}
                    </button>
                  )}
                  <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold transition-all text-sm ${saved ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <HiBookmark className="w-4 h-4" />{saved?'Saved':'Save'}
                  </button>
                </div>
              </motion.div>
              {/* Description */}
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }} className="card p-6">
                <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4">Job Description</h2>
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{job.description}</p>
              </motion.div>
              {/* Skills */}
              {job.skills?.length > 0 && (
                <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="card p-6">
                  <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(s => <span key={s} className="px-3.5 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-sm font-semibold rounded-xl border border-primary-100 dark:border-primary-800">{s}</span>)}
                  </div>
                </motion.div>
              )}
              {/* Similar jobs */}
              {similarJobs.length > 0 && (
                <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }} className="card p-6">
                  <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4">Similar Jobs</h2>
                  <div className="space-y-3">
                    {similarJobs.map(sj => (
                      <Link key={sj._id} to={`/jobs/${sj.slug}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center font-bold text-primary-600">{sj.company?.name?.[0]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-primary-600 truncate">{sj.title}</p>
                          <p className="text-xs text-slate-500">{sj.company?.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            {/* Sidebar */}
            <div className="space-y-5">
              <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.08 }} className="card p-5">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Job Overview</h3>
                <div className="space-y-3">
                  {[
                    ['Posted', new Date(job.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})],
                    ['Category', job.category],
                    ['Education', job.education||'Not specified'],
                    ['Views', `${job.views||0} people`],
                    ['Applications', `${job.applications||0} applied`],
                  ].map(([k,v]) => (
                    <div key={k} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{k}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-right max-w-[160px] truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              {!applied && job.status==='active' && (
                <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.14 }}
                  className="card p-5 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/10 border-primary-100 dark:border-primary-800">
                  <p className="font-bold text-slate-900 dark:text-white mb-1">Don't miss this!</p>
                  <p className="text-xs text-slate-500 mb-4">Apply now and increase your chances.</p>
                  <button onClick={handleApply} className="btn-primary w-full py-3">Apply Now</button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Apply Modal */}
      <Modal isOpen={applyModal} onClose={() => setApplyModal(false)} title={`Apply — ${job?.title}`} size="md">
        <div className="p-6 space-y-4">
          {user?.profile?.resume?.url ? (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-700 dark:text-green-400 text-sm">
              <HiCheckCircle className="w-4 h-4" /><span className="font-medium">Resume attached ✓</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-700 text-sm">
              <HiExclamation className="w-4 h-4" /><span>No resume. <Link to="/dashboard/profile" className="font-semibold underline">Upload first</Link></span>
            </div>
          )}
          <div>
            <label className="label">Cover Letter <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} rows={5}
              placeholder="Introduce yourself and explain why you're a good fit…" className="input-field resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={()=>setApplyModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button onClick={submitApplication} disabled={applying||!user?.profile?.resume?.url} className="btn-primary flex-1 py-3 disabled:opacity-50">
              {applying?'Submitting…':'Submit Application'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
