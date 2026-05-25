import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiBriefcase, HiLocationMarker, HiClock, HiX, HiChevronDown } from 'react-icons/hi'
import { applicationAPI } from '../../services/api'
import { Pagination, Badge, Modal, EmptyState } from '../../components/ui/index'
import toast from 'react-hot-toast'

const STATUS_TABS = ['all','applied','screening','shortlisted','interview_scheduled','offered','hired','rejected']
const STATUS_COLOR = { applied:'primary', screening:'warning', shortlisted:'teal', interview_scheduled:'purple', offered:'success', hired:'success', rejected:'danger', withdrawn:'gray' }
const STATUS_LABEL = { applied:'Applied', screening:'Screening', shortlisted:'Shortlisted', interview_scheduled:'Interview Scheduled', offered:'Offered', hired:'Hired', rejected:'Rejected' }

export default function JSApplications() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [withdrawModal, setWithdrawModal] = useState(null)
  const [reason, setReason] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-applications', { page, status }],
    queryFn: () => applicationAPI.getMyApplications({ page, limit: 10, status: status || undefined }),
    keepPreviousData: true,
  })

  const apps = data?.data?.data || []
  const pagination = data?.data?.pagination

  const withdrawMutation = useMutation({
    mutationFn: ({ id, reason }) => applicationAPI.withdraw(id, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-applications'] })
      qc.invalidateQueries({ queryKey: ['my-interviews'] })
      toast.success('Application withdrawn')
      setWithdrawModal(null)
      setReason('')
    },
    onError: () => toast.error('Failed to withdraw'),
  })

  return (
    <>
      <Helmet><title>My Applications | ProLink</title></Helmet>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">My Applications</h1>
          <p className="text-sm text-slate-500">{pagination?.total || 0} total applications</p>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {STATUS_TABS.map(s => (
            <button key={s} onClick={() => { setStatus(s === 'all' ? '' : s); setPage(1) }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all capitalize ${
                (s === 'all' && !status) || status === s
                  ? 'bg-primary-600 text-white shadow-primary'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}>
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : apps.length === 0 ? (
          <EmptyState icon={HiBriefcase} title="No Applications Yet"
            description={status ? `No ${STATUS_LABEL[status] || status.replace(/_/g, ' ')} applications found.` : 'Start applying for jobs to see your applications here.'}
            action={<Link to="/jobs" className="btn-primary">Browse Jobs</Link>} />
        ) : (
          <div className="space-y-3">
            {apps.map((app, i) => (
              <motion.div key={app._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center font-bold text-primary-700 text-lg flex-shrink-0">
                    {app.job?.company?.name?.[0] || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <Link to={`/jobs/${app.job?.slug}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors truncate block">
                          {app.job?.title}
                        </Link>
                        <p className="text-sm text-slate-500 mt-0.5">{app.job?.company?.name}</p>
                      </div>
                      <Badge variant={STATUS_COLOR[app.status] || 'gray'} className="flex-shrink-0 capitalize">
                        {app.status?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2.5 text-xs text-slate-500">
                      {app.job?.location && <span className="flex items-center gap-1"><HiLocationMarker className="w-3.5 h-3.5" />{app.job.location}</span>}
                      {app.job?.type && <span className="flex items-center gap-1"><HiBriefcase className="w-3.5 h-3.5" />{app.job.type.replace('_', ' ')}</span>}
                      <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" />Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* Interview details */}
                    {app.status === 'interview_scheduled' && app.interview?.scheduledAt && (
                      <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                        <p className="text-xs font-bold text-purple-700 dark:text-purple-400">📅 Interview Scheduled</p>
                        <p className="text-xs text-purple-600 dark:text-purple-300 mt-0.5">
                          {new Date(app.interview.scheduledAt).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          {app.interview.type && ` · ${app.interview.type.replace('_', ' ')}`}
                        </p>
                        {app.interview.link && (
                          <a href={app.interview.link} target="_blank" rel="noreferrer"
                            className="text-xs text-purple-600 hover:underline font-semibold mt-1 block">Join Meeting →</a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!['hired', 'rejected', 'withdrawn'].includes(app.status) && (
                  <div className="flex justify-end mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <button onClick={() => setWithdrawModal(app._id)}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-semibold transition-colors">
                      <HiX className="w-3.5 h-3.5" /> Withdraw Application
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {pagination && <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />}
      </div>

      {/* Withdraw confirmation modal */}
      <Modal isOpen={!!withdrawModal} onClose={() => setWithdrawModal(null)} title="Withdraw Application" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">Are you sure you want to withdraw this application? This cannot be undone.</p>
          <div>
            <label className="label">Reason (optional)</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
              placeholder="e.g. Accepted another offer…" className="input-field resize-none text-sm" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setWithdrawModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button onClick={() => withdrawMutation.mutate({ id: withdrawModal, reason })}
              disabled={withdrawMutation.isPending}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-60">
              {withdrawMutation.isPending ? 'Withdrawing…' : 'Yes, Withdraw'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
