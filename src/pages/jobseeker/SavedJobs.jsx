import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiBriefcase, HiLocationMarker, HiBookmark, HiExternalLink } from 'react-icons/hi'
import { userAPI } from '../../services/api'
import { Badge, EmptyState } from '../../components/ui/index'
import toast from 'react-hot-toast'

export default function JSSavedJobs() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: () => userAPI.getSavedJobs(),
  })

  const savedJobs = data?.data?.data?.savedJobs || []

  const unsaveMutation = useMutation({
    mutationFn: (jobId) => userAPI.saveJob(jobId),
    onSuccess: () => { qc.invalidateQueries(['saved-jobs']); toast.success('Job unsaved') },
  })

  return (
    <>
      <Helmet><title>Saved Jobs | ProLink</title></Helmet>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Saved Jobs</h1>
          <p className="text-sm text-slate-500">{savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <EmptyState icon={HiBookmark} title="No Saved Jobs"
            description="Save jobs while browsing to keep track of opportunities you're interested in."
            action={<Link to="/jobs" className="btn-primary">Browse Jobs</Link>} />
        ) : (
          <div className="space-y-3">
            {savedJobs.map((job, i) => (
              <motion.div key={job._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center font-bold text-primary-700 text-lg flex-shrink-0">
                  {job.company?.name?.[0] || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/jobs/${job.slug}`} className="font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors block truncate">{job.title}</Link>
                      <p className="text-sm text-slate-500">{job.company?.name}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={job.status === 'active' ? 'success' : 'gray'}>{job.status}</Badge>
                      <button onClick={() => unsaveMutation.mutate(job._id)}
                        className="p-1.5 rounded-lg text-amber-500 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 transition-colors">
                        <HiBookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                    {job.location && <span className="flex items-center gap-1"><HiLocationMarker className="w-3.5 h-3.5" />{job.location}</span>}
                    {job.type && <span className="flex items-center gap-1"><HiBriefcase className="w-3.5 h-3.5" />{job.type.replace('_',' ')}</span>}
                    {job.salary?.isVisible && job.salary?.min && (
                      <span className="text-green-600 font-semibold">₹{(job.salary.min/100000).toFixed(1)}L–{(job.salary.max/100000).toFixed(1)}L</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link to={`/jobs/${job.slug}`}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors">
                      <HiExternalLink className="w-3.5 h-3.5" /> View Job
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
