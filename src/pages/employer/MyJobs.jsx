import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiEye, HiPencil, HiTrash, HiUserGroup, HiPlusCircle } from 'react-icons/hi'
import { jobAPI } from '../../services/api'
import { Pagination, Badge, EmptyState } from '../../components/ui/index'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import toast from 'react-hot-toast'

const STATUS_COLOR = { active:'success', paused:'warning', closed:'gray', draft:'primary', expired:'danger' }

export default function EmpMyJobs() {
  const [page, setPage]   = useState(1)
  const [status, setStatus] = useState('')
  const [jobToDelete, setJobToDelete] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-jobs', { page, status }],
    queryFn: () => jobAPI.getMyJobs({ page, limit: 10, status: status || undefined }),
    keepPreviousData: true,
  })

  const jobs = data?.data?.data || []
  const pagination = data?.data?.pagination

  const deleteMutation = useMutation({
    mutationFn: (id) => jobAPI.deleteJob(id),
    onSuccess: () => { qc.invalidateQueries(['my-jobs']); toast.success('Job deleted') },
    onError: () => toast.error('Delete failed'),
  })

  return (
    <>
      <Helmet><title>My Jobs | Employer | ProLink</title></Helmet>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">My Job Postings</h1>
            <p className="text-sm text-slate-500">{pagination?.total || 0} total jobs</p>
          </div>
          <Link to="/employer/post-job" className="btn-primary py-2.5 text-sm">
            <HiPlusCircle className="w-4 h-4" /> Post New Job
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all','active','paused','closed','draft'].map(s => (
            <button key={s} onClick={() => { setStatus(s === 'all' ? '' : s); setPage(1) }}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                (s === 'all' && !status) || status === s ? 'bg-primary-600 text-white shadow-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>{s}</button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="card p-5 h-20 animate-pulse bg-slate-100 dark:bg-slate-800" />)}</div>
        ) : jobs.length === 0 ? (
          <EmptyState icon={HiPlusCircle} title="No Jobs Posted Yet"
            description="Post your first job and start receiving applications from top candidates."
            action={<Link to="/employer/post-job" className="btn-primary">Post a Job</Link>} />
        ) : (
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <motion.div key={job._id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }}
                className="card p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link to={`/jobs/${job.slug}`} target="_blank" className="font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors truncate">{job.title}</Link>
                    <Badge variant={STATUS_COLOR[job.status] || 'gray'}>{job.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><HiEye className="w-3.5 h-3.5" />{job.views||0} views</span>
                    <span className="flex items-center gap-1"><HiUserGroup className="w-3.5 h-3.5" />{job.applications||0} applicants</span>
                    <span>{job.location} · {job.type?.replace('_',' ')}</span>
                  </div>
                </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/employer/applicants?job=${job._id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs font-bold rounded-lg hover:bg-primary-100 transition-colors">
                    <HiUserGroup className="w-3.5 h-3.5" /> Applicants
                  </Link>
                  <Link to={`/employer/post-job?slug=${job.slug}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                    <HiPencil className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setJobToDelete(job)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {pagination && <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />}
      </div>

      <ConfirmDialog
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={() => {
          if (!jobToDelete) return
          deleteMutation.mutate(jobToDelete._id, {
            onSuccess: () => setJobToDelete(null),
          })
        }}
        title="Delete Job"
        message={jobToDelete ? `Are you sure you want to delete "${jobToDelete.title}"? This will close the job and hide it from candidates.` : ''}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
