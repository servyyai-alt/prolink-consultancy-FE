import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiBriefcase, HiCalendar, HiSearch, HiUserGroup } from 'react-icons/hi'
import { adminAPI, applicationAPI } from '../../services/api'
import { Badge, EmptyState, Modal, Pagination } from '../../components/ui/index'
import toast from 'react-hot-toast'

const STATUS_VARIANTS = {
  applied: 'primary',
  screening: 'warning',
  shortlisted: 'teal',
  interview_scheduled: 'purple',
  offered: 'success',
  hired: 'success',
  rejected: 'danger',
  withdrawn: 'gray',
}
const STATUS_LABELS = {
  applied: 'Applied',
  screening: 'Screening',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview Scheduled',
  offered: 'Offered',
  hired: 'Hired',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}
const NEXT_STATUSES = {
  applied: ['screening', 'rejected'],
  screening: ['shortlisted', 'rejected'],
  shortlisted: ['interview_scheduled', 'rejected'],
  interview_scheduled: ['offered', 'rejected'],
  offered: ['hired', 'rejected'],
}

export default function AdminApplications() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [scheduleModal, setScheduleModal] = useState(null)
  const [interview, setInterview] = useState({ scheduledAt: '', type: 'video', link: '', notes: '' })
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', { page, search, status }],
    queryFn: () => adminAPI.getApplications({ page, limit: 15, search: search || undefined, status: status || undefined }),
    keepPreviousData: true,
  })

  const applications = data?.data?.data || []
  const pagination = data?.data?.pagination

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus }) => applicationAPI.updateStatus(id, { status: nextStatus }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-applications'] })
      toast.success('Application status updated')
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Status update failed'),
  })

  const interviewMutation = useMutation({
    mutationFn: ({ id, ...payload }) => applicationAPI.scheduleInterview(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-applications'] })
      toast.success('Interview scheduled')
      setScheduleModal(null)
      setInterview({ scheduledAt: '', type: 'video', link: '', notes: '' })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to schedule interview'),
  })

  return (
    <>
      <Helmet><title>Applications | Admin | ProLink</title></Helmet>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Applications</h1>
          <p className="text-sm text-slate-500">{pagination?.total || 0} total applications</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-xl px-3">
            <HiSearch className="w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by applicant, employer, company or job"
              className="flex-1 bg-transparent py-2.5 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 border-none outline-none font-medium"
          >
            <option value="">All statuses</option>
            {Object.keys(STATUS_VARIANTS).map((value) => (
              <option key={value} value={value}>{STATUS_LABELS[value]}</option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <EmptyState icon={HiUserGroup} title="No applications found" description="Try a different search term or status filter." />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {applications.map((application) => (
                <div key={application._id} className="p-5 space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {application.applicant?.firstName} {application.applicant?.lastName}
                        </h3>
                        <Badge variant={STATUS_VARIANTS[application.status] || 'gray'}>
                          {STATUS_LABELS[application.status] || application.status.replaceAll('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <HiBriefcase className="w-4 h-4" />
                          {application.job?.title || 'Untitled job'}
                        </span>
                        <span>{application.job?.company?.name || 'Unknown company'}</span>
                        <span>{application.applicant?.email}</span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      Applied {new Date(application.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3 text-sm">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Employer</p>
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        {application.employer?.firstName} {application.employer?.lastName}
                      </p>
                      <p className="text-slate-500">{application.employer?.email}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Role Info</p>
                      <p className="font-medium text-slate-700 dark:text-slate-200">{application.job?.location || 'Not specified'}</p>
                      <p className="text-slate-500">{application.job?.type?.replaceAll('_', ' ') || 'Role type unavailable'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Interview</p>
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        {application.interview?.scheduledAt
                          ? new Date(application.interview.scheduledAt).toLocaleString('en-IN')
                          : 'Not scheduled'}
                      </p>
                      <p className="text-slate-500">{application.interview?.type?.replaceAll('_', ' ') || 'No interview type yet'}</p>
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="rounded-xl border border-slate-100 dark:border-slate-700 p-3 text-sm text-slate-600 dark:text-slate-300">
                      {application.coverLetter}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {NEXT_STATUSES[application.status]?.includes('interview_scheduled') && (
                      <button
                        type="button"
                        onClick={() => setScheduleModal(application._id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-600 transition-colors hover:bg-purple-100 dark:bg-purple-900/20"
                      >
                        <HiCalendar className="h-3.5 w-3.5" />
                        Schedule Interview
                      </button>
                    )}
                    {NEXT_STATUSES[application.status]?.filter((nextStatus) => nextStatus !== 'interview_scheduled').map((nextStatus) => (
                      <button
                        key={nextStatus}
                        type="button"
                        onClick={() => statusMutation.mutate({ id: application._id, nextStatus })}
                        disabled={statusMutation.isPending}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
                          nextStatus === 'rejected'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20'
                            : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20'
                        }`}
                      >
                        Move to {STATUS_LABELS[nextStatus]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {pagination && (
          <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        )}
      </div>

      <Modal isOpen={!!scheduleModal} onClose={() => setScheduleModal(null)} title="Schedule Interview" size="md">
        <div className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Date & Time <span className="text-red-500">*</span></label>
              <input type="datetime-local" value={interview.scheduledAt} onChange={(e) => setInterview((next) => ({ ...next, scheduledAt: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="label">Interview Type</label>
              <select value={interview.type} onChange={(e) => setInterview((next) => ({ ...next, type: e.target.value }))} className="input-field">
                {['video', 'phone', 'in_person', 'technical'].map((type) => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Meeting Link</label>
            <input type="url" value={interview.link} onChange={(e) => setInterview((next) => ({ ...next, link: e.target.value }))} placeholder="https://meet.google.com/..." className="input-field" />
          </div>
          <div>
            <label className="label">Notes for Candidate</label>
            <textarea value={interview.notes} onChange={(e) => setInterview((next) => ({ ...next, notes: e.target.value }))} rows={3} className="input-field resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setScheduleModal(null)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700">Cancel</button>
            <button
              type="button"
              onClick={() => interviewMutation.mutate({ id: scheduleModal, ...interview })}
              disabled={!interview.scheduledAt || interviewMutation.isPending}
              className="btn-primary flex-1 py-3 disabled:opacity-50"
            >
              {interviewMutation.isPending ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
