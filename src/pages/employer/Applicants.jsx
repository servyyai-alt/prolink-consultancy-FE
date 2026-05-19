import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiSearch, HiDownload, HiCalendar, HiEye } from 'react-icons/hi'
import { applicationAPI, jobAPI } from '../../services/api'
import { Pagination, Badge, Modal, EmptyState } from '../../components/ui/index'
import toast from 'react-hot-toast'

const STATUS_COLOR = { applied:'primary', screening:'warning', shortlisted:'success', interview_scheduled:'purple', offered:'success', hired:'success', rejected:'danger', withdrawn:'gray' }
const NEXT_STATUSES = { applied:['screening','shortlisted','rejected'], screening:['shortlisted','rejected'], shortlisted:['interview_scheduled','rejected'], interview_scheduled:['interviewed','rejected'], interviewed:['offered','rejected'], offered:['hired','rejected'] }

export default function EmpApplicants() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('job') || ''
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)
  const [scheduleModal, setScheduleModal] = useState(null)
  const [interview, setInterview] = useState({ scheduledAt:'', type:'video', link:'', notes:'' })
  const qc = useQueryClient()

  const { data: jobsData } = useQuery({ queryKey: ['my-jobs-list'], queryFn: () => jobAPI.getMyJobs({ limit: 100 }) })
  const myJobs = jobsData?.data?.data || []
  const [selectedJob, setSelectedJob] = useState(jobId || (myJobs[0]?._id || ''))

  const { data, isLoading } = useQuery({
    queryKey: ['job-applicants', selectedJob, { page, status }],
    queryFn: () => selectedJob ? applicationAPI.getJobApplications(selectedJob, { page, limit: 10, status: status||undefined }) : Promise.resolve(null),
    enabled: !!selectedJob,
    keepPreviousData: true,
  })

  const apps = data?.data?.data || []
  const pagination = data?.data?.pagination

  const statusMutation = useMutation({
    mutationFn: ({ id, status, note }) => applicationAPI.updateStatus(id, { status, note }),
    onSuccess: () => { qc.invalidateQueries(['job-applicants']); toast.success('Status updated'); setSelected(null) },
    onError: () => toast.error('Update failed'),
  })

  const interviewMutation = useMutation({
    mutationFn: ({ id, ...data }) => applicationAPI.scheduleInterview(id, data),
    onSuccess: () => { qc.invalidateQueries(['job-applicants']); toast.success('Interview scheduled!'); setScheduleModal(null) },
    onError: () => toast.error('Failed to schedule'),
  })

  return (
    <>
      <Helmet><title>Applicants | Employer | ProLink</title></Helmet>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Applicants</h1>
          <p className="text-sm text-slate-500">{pagination?.total || 0} total applicants</p>
        </div>

        {/* Job selector + filters */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3">
          <select value={selectedJob} onChange={e => { setSelectedJob(e.target.value); setPage(1) }}
            className="input-field flex-1 text-sm">
            <option value="">Select a job…</option>
            {myJobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="input-field sm:w-48 text-sm">
            <option value="">All Statuses</option>
            {['applied','screening','shortlisted','interview_scheduled','offered','hired','rejected'].map(s => (
              <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
            ))}
          </select>
        </div>

        {!selectedJob ? (
          <EmptyState icon={HiSearch} title="Select a Job" description="Choose a job above to view its applicants." />
        ) : isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="card p-5 h-24 animate-pulse bg-slate-100 dark:bg-slate-800" />)}</div>
        ) : apps.length === 0 ? (
          <EmptyState icon={HiSearch} title="No Applicants Yet" description="Applications for this job will appear here." />
        ) : (
          <div className="space-y-3">
            {apps.map((app, i) => (
              <motion.div key={app._id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }}
                className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {app.applicant?.firstName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{app.applicant?.firstName} {app.applicant?.lastName}</p>
                        <p className="text-sm text-slate-500">{app.applicant?.profile?.headline || app.applicant?.email}</p>
                      </div>
                      <Badge variant={STATUS_COLOR[app.status]||'gray'} className="capitalize flex-shrink-0">{app.status?.replace(/_/g,' ')}</Badge>
                    </div>
                    {app.applicant?.profile?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {app.applicant.profile.skills.slice(0,4).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs">{s}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {app.applicant?.profile?.resume?.url && (
                        <a href={app.applicant.profile.resume.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors">
                          <HiDownload className="w-3.5 h-3.5" /> Resume
                        </a>
                      )}
                      {NEXT_STATUSES[app.status]?.includes('interview_scheduled') && (
                        <button onClick={() => setScheduleModal(app._id)}
                          className="flex items-center gap-1 text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors">
                          <HiCalendar className="w-3.5 h-3.5" /> Schedule Interview
                        </button>
                      )}
                      {NEXT_STATUSES[app.status]?.filter(s => s !== 'interview_scheduled').map(nextStatus => (
                        <button key={nextStatus} onClick={() => statusMutation.mutate({ id: app._id, status: nextStatus })}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors capitalize ${
                            nextStatus === 'rejected' ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20' :
                            'text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20'
                          }`}>
                          → {nextStatus.replace(/_/g,' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {pagination && <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />}
      </div>

      {/* Schedule interview modal */}
      <Modal isOpen={!!scheduleModal} onClose={() => setScheduleModal(null)} title="Schedule Interview" size="md">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Date & Time <span className="text-red-500">*</span></label>
              <input type="datetime-local" value={interview.scheduledAt} onChange={e => setInterview(i => ({...i, scheduledAt: e.target.value}))} className="input-field" /></div>
            <div><label className="label">Interview Type</label>
              <select value={interview.type} onChange={e => setInterview(i => ({...i, type: e.target.value}))} className="input-field">
                {['video','phone','in_person','technical'].map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
              </select></div>
          </div>
          <div><label className="label">Meeting Link (if video)</label>
            <input type="url" value={interview.link} onChange={e => setInterview(i => ({...i, link: e.target.value}))} placeholder="https://meet.google.com/…" className="input-field" /></div>
          <div><label className="label">Notes for Candidate</label>
            <textarea value={interview.notes} onChange={e => setInterview(i => ({...i, notes: e.target.value}))} rows={3} placeholder="Preparation tips, documents to bring…" className="input-field resize-none" /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setScheduleModal(null)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 font-semibold text-sm">Cancel</button>
            <button onClick={() => interviewMutation.mutate({ id: scheduleModal, ...interview })}
              disabled={!interview.scheduledAt || interviewMutation.isLoading}
              className="flex-1 btn-primary py-3 disabled:opacity-50">
              {interviewMutation.isLoading ? 'Scheduling…' : 'Schedule Interview'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
