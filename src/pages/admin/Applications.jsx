import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiBriefcase, HiCalendar, HiCheckCircle, HiSearch, HiUserGroup } from 'react-icons/hi'
import { adminAPI, applicationAPI } from '../../services/api'
import { Badge, Button, EmptyState, Modal, Pagination } from '../../components/ui/index'
import toast from 'react-hot-toast'
import {
  APPLICATION_NEXT_STATUSES,
  APPLICATION_STATUS_DESCRIPTIONS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_VARIANTS,
  getApplicationProgress,
  getApplicationStatusLabel,
} from '../../constants/applicationStatus'

export default function AdminApplications() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [statusModal, setStatusModal] = useState(null)
  const [statusNote, setStatusNote] = useState('')
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
    mutationFn: ({ id, nextStatus, note }) => applicationAPI.updateStatus(id, { status: nextStatus, note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-applications'] })
      toast.success('Candidate status updated')
      setStatusModal(null)
      setStatusNote('')
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Status update failed'),
  })

  const openStatusModal = (application, nextStatus) => {
    if (nextStatus === 'interview_scheduled') {
      setScheduleModal(application._id)
      return
    }

    setStatusModal({ application, nextStatus })
    setStatusNote('')
  }

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
            {Object.keys(APPLICATION_STATUS_VARIANTS).map((value) => (
              <option key={value} value={value}>{APPLICATION_STATUS_LABELS[value]}</option>
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
                        <Badge variant={APPLICATION_STATUS_VARIANTS[application.status] || 'gray'}>
                          {getApplicationStatusLabel(application.status)}
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

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                    <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                      <span>{APPLICATION_STATUS_DESCRIPTIONS[application.status] || 'Status update available.'}</span>
                      <span>{getApplicationProgress(application.status)}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-primary-600 transition-all"
                        style={{ width: `${getApplicationProgress(application.status)}%` }}
                      />
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
                    {APPLICATION_NEXT_STATUSES[application.status]?.map((nextStatus) => (
                      <button
                        key={nextStatus}
                        type="button"
                        onClick={() => openStatusModal(application, nextStatus)}
                        disabled={statusMutation.isPending}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
                          nextStatus === 'rejected'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20'
                            : nextStatus === 'interview_scheduled'
                            ? 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20'
                            : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20'
                        }`}
                      >
                        {nextStatus === 'interview_scheduled' ? (
                          <span className="inline-flex items-center gap-1.5"><HiCalendar className="h-3.5 w-3.5" /> Schedule Interview</span>
                        ) : (
                          <>Move to {getApplicationStatusLabel(nextStatus)}</>
                        )}
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

      <Modal
        isOpen={!!statusModal}
        onClose={() => setStatusModal(null)}
        title="Update Application Status"
        size="md"
      >
        {statusModal && (
          <div className="space-y-5 p-6">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {statusModal.application.applicant?.firstName} {statusModal.application.applicant?.lastName}
              </p>
              <p className="mt-1 text-sm text-slate-500">{statusModal.application.job?.title || 'Untitled job'}</p>
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
                placeholder="Example: Your profile matches the role requirements. Our team will review your resume in detail next."
                className="input-field resize-none"
              />
              <p className="mt-1 text-xs text-slate-500">This note is stored in the timeline and helps the candidate understand the decision.</p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" onClick={() => setStatusModal(null)}>Cancel</Button>
              <Button
                type="button"
                onClick={() =>
                  statusMutation.mutate({
                    id: statusModal.application._id,
                    nextStatus: statusModal.nextStatus,
                    note: statusNote,
                  })
                }
                isLoading={statusMutation.isPending}
              >
                <HiCheckCircle className="h-4 w-4" />
                Confirm Update
              </Button>
            </div>
          </div>
        )}
      </Modal>

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
