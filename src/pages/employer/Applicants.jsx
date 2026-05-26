import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiSearch, HiDownload, HiCalendar, HiCheckCircle } from 'react-icons/hi'
import { applicationAPI, jobAPI } from '../../services/api'
import { Pagination, Badge, Modal, EmptyState, Button } from '../../components/ui/index'
import toast from 'react-hot-toast'
import {
  APPLICATION_NEXT_STATUSES,
  APPLICATION_STATUS_DESCRIPTIONS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_VARIANTS,
  getApplicationProgress,
  getApplicationStatusLabel,
} from '../../constants/applicationStatus'

export default function EmpApplicants() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('job') || ''
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)
  const [statusModal, setStatusModal] = useState(null)
  const [statusNote, setStatusNote] = useState('')
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['job-applicants'] })
      toast.success('Candidate status updated')
      setSelected(null)
      setStatusModal(null)
      setStatusNote('')
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Update failed'),
  })

  const interviewMutation = useMutation({
    mutationFn: ({ id, ...data }) => applicationAPI.scheduleInterview(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['job-applicants'] })
      toast.success('Interview scheduled!')
      setScheduleModal(null)
      setInterview({ scheduledAt:'', type:'video', link:'', notes:'' })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to schedule'),
  })

  const openStatusModal = (application, nextStatus) => {
    if (nextStatus === 'interview_scheduled') {
      setScheduleModal(application._id)
      return
    }

    setStatusModal({ application, nextStatus })
    setStatusNote('')
  }

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
              <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>
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
                      <Badge variant={APPLICATION_STATUS_VARIANTS[app.status]||'gray'} className="capitalize flex-shrink-0">{getApplicationStatusLabel(app.status)}</Badge>
                    </div>
                    <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                        <span>{APPLICATION_STATUS_DESCRIPTIONS[app.status] || 'Status update available.'}</span>
                        <span>{getApplicationProgress(app.status)}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white dark:bg-slate-800">
                        <div className="h-full rounded-full bg-primary-600" style={{ width: `${getApplicationProgress(app.status)}%` }} />
                      </div>
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
                      {APPLICATION_NEXT_STATUSES[app.status]?.map(nextStatus => (
                        <button key={nextStatus} onClick={() => openStatusModal(app, nextStatus)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors capitalize ${
                            nextStatus === 'rejected' ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20' :
                            nextStatus === 'interview_scheduled' ? 'text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20' :
                            'text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20'
                          }`}>
                          {nextStatus === 'interview_scheduled' ? (
                            <span className="inline-flex items-center gap-1"><HiCalendar className="w-3.5 h-3.5" /> Schedule Interview</span>
                          ) : (
                            <>Move to {getApplicationStatusLabel(nextStatus)}</>
                          )}
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

      <Modal isOpen={!!statusModal} onClose={() => setStatusModal(null)} title="Update Candidate Status" size="md">
        {statusModal && (
          <div className="space-y-5 p-6">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {statusModal.application.applicant?.firstName} {statusModal.application.applicant?.lastName}
              </p>
              <p className="mt-1 text-sm text-slate-500">{statusModal.application.applicant?.email}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <Badge variant={APPLICATION_STATUS_VARIANTS[statusModal.application.status] || 'gray'}>
                  {getApplicationStatusLabel(statusModal.application.status)}
                </Badge>
                <span className="text-slate-400">to</span>
                <Badge variant={APPLICATION_STATUS_VARIANTS[statusModal.nextStatus] || 'gray'}>
                  {getApplicationStatusLabel(statusModal.nextStatus)}
                </Badge>
              </div>
            </div>

            <div>
              <label className="label">Update note for candidate</label>
              <textarea
                value={statusNote}
                onChange={(event) => setStatusNote(event.target.value)}
                rows={4}
                placeholder="Example: We reviewed your profile and would like to move you to the next hiring stage."
                className="input-field resize-none"
              />
              <p className="mt-1 text-xs text-slate-500">This note is visible in the candidate timeline.</p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" onClick={() => setStatusModal(null)}>Cancel</Button>
              <Button
                type="button"
                onClick={() => statusMutation.mutate({ id: statusModal.application._id, status: statusModal.nextStatus, note: statusNote })}
                isLoading={statusMutation.isPending}
              >
                <HiCheckCircle className="h-4 w-4" />
                Confirm Update
              </Button>
            </div>
          </div>
        )}
      </Modal>

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
              disabled={!interview.scheduledAt || interviewMutation.isPending}
              className="flex-1 btn-primary py-3 disabled:opacity-50">
              {interviewMutation.isPending ? 'Scheduling…' : 'Schedule Interview'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
