// Admin stub pages - fully functional implementations follow the same pattern
// Each uses useQuery + adminAPI + table layout matching Users.jsx

// ── Jobs.jsx ──────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiSearch, HiTrash, HiPencil, HiEye } from 'react-icons/hi'
import { jobAPI } from '../../services/api'
import { Pagination, Badge } from '../../components/ui/index'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const JOB_STATUS_COLOR = { active: 'success', paused: 'warning', closed: 'gray', draft: 'primary', expired: 'danger' }

export function AdminJobs() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-jobs', { page, search }],
    queryFn: () => jobAPI.getJobs({ page, limit: 15, search }),
    keepPreviousData: true,
  })

  const jobs = data?.data?.data || []
  const pagination = data?.data?.pagination

  const deleteMutation = useMutation({
    mutationFn: (id) => jobAPI.deleteJob(id),
    onSuccess: () => { qc.invalidateQueries(['admin-jobs']); toast.success('Job deleted') },
    onError: () => toast.error('Delete failed'),
  })

  return (
    <>
      <Helmet><title>Jobs | Admin | ProLink</title></Helmet>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Jobs</h1>
            <p className="text-sm text-slate-500">{pagination?.total || 0} total jobs</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-xl px-3">
            <HiSearch className="w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search jobs…" className="flex-1 bg-transparent py-2.5 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                  {['Job Title', 'Company', 'Category', 'Status', 'Views', 'Apps', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {isLoading
                  ? [...Array(8)].map((_, i) => (
                      <tr key={i}>{[...Array(7)].map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" /></td>)}</tr>
                    ))
                  : jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-[200px]">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.location} · {job.type?.replace('_', ' ')}</p>
                        </td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300 text-xs">{job.company?.name}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300 text-xs">{job.category}</td>
                        <td className="px-4 py-4"><Badge variant={JOB_STATUS_COLOR[job.status] || 'gray'}>{job.status}</Badge></td>
                        <td className="px-4 py-4 text-slate-500 text-xs">{job.views || 0}</td>
                        <td className="px-4 py-4 text-slate-500 text-xs">{job.applications || 0}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <Link to={`/jobs/${job.slug}`} target="_blank"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                              <HiEye className="w-4 h-4" />
                            </Link>
                            <button onClick={() => { if (confirm('Delete this job?')) deleteMutation.mutate(job._id) }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              <HiTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
          {jobs.length === 0 && !isLoading && <div className="py-16 text-center text-slate-400">No jobs found</div>}
        </div>
        {pagination && <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />}
      </div>
    </>
  )
}

export default AdminJobs
