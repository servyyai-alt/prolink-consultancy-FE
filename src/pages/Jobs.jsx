import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiSearch, HiLocationMarker, HiFilter, HiX, HiBookmark, HiBriefcase, HiClock } from 'react-icons/hi'
import { jobAPI, userAPI } from '../services/api'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from '../redux/slices/authSlice'
import { Pagination, Badge, JobCardSkeleton, EmptyState } from '../components/ui/index'
import toast from 'react-hot-toast'
import jobsBg from "../assets/jobs.png";


const JOB_TYPES    = ['full_time', 'part_time', 'contract', 'internship', 'freelance']
const LOCATION_TYPES = ['onsite', 'remote', 'hybrid']
const CATEGORIES   = ['IT & Software', 'Finance', 'Marketing', 'HR', 'Sales', 'Operations', 'Healthcare', 'Education', 'Engineering', 'Design', 'Legal', 'Other']
const EXP_RANGES   = [{ label: 'Fresher (0-1 yr)', min: 0, max: 1 }, { label: '1-3 years', min: 1, max: 3 }, { label: '3-5 years', min: 3, max: 5 }, { label: '5-8 years', min: 5, max: 8 }, { label: '8+ years', min: 8, max: 30 }]

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const [filters, setFilters] = useState({
    search:       searchParams.get('search')   || '',
    location:     searchParams.get('location') || '',
    category:     searchParams.get('category') || '',
    type:         searchParams.get('type')     || '',
    locationType: searchParams.get('locationType') || '',
    minExp:       searchParams.get('minExp')   || '',
    maxExp:       searchParams.get('maxExp')   || '',
    sort:         searchParams.get('sort')     || '-createdAt',
  })
  const [page, setPage]           = useState(1)
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [filtersOpen, setFiltersOpen] = useState(false)

  const queryParams = { ...filters, page, limit: 12 }
  Object.keys(queryParams).forEach(k => !queryParams[k] && delete queryParams[k])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobs', queryParams],
    queryFn: () => jobAPI.getJobs(queryParams),
    keepPreviousData: true,
  })

  const jobs = data?.data?.data || []
  const pagination = data?.data?.pagination

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const resetFilters = () => {
    setFilters({ search: '', location: '', category: '', type: '', locationType: '', minExp: '', maxExp: '', sort: '-createdAt' })
    setPage(1)
  }

  const handleSaveJob = async (jobId, e) => {
    e.preventDefault()
    if (!isLoggedIn) { toast.error('Please login to save jobs'); return }
    try {
      const { data } = await userAPI.saveJob(jobId)
      setSavedJobs(prev => {
        const next = new Set(prev)
        data.data.saved ? next.add(jobId) : next.delete(jobId)
        return next
      })
      toast.success(data.data.saved ? 'Job saved!' : 'Job unsaved')
    } catch { toast.error('Failed to save job') }
  }

  const hasFilters = Object.entries(filters).some(([k, v]) => v && k !== 'sort')

  return (
    <>
      <Helmet>
        <title>Browse Jobs | ProLink Consultancy</title>
        <meta name="description" content="Explore thousands of job opportunities across India. Filter by category, location, experience, and salary." />
      </Helmet>

      <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Search Header */}
        <div
  className="bg-cover bg-center pt-10 pb-16 relative"
  style={{ backgroundImage: `url(${jobsBg})` }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/20"></div>

  <div className="page-container relative z-10">
    <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
      Find Your <span className="text-primary-300">Dream Job</span>
    </h1>

    <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row gap-2">
      <div className="flex-1 flex items-center gap-2 px-4">
        <HiSearch className="w-5 h-5 text-slate-400 flex-shrink-0" />

        <input
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder="Job title, skills, or company…"
          className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400 py-3"
        />
      </div>

      <div className="flex items-center gap-2 px-4 border-l border-slate-100 dark:border-slate-700">
        <HiLocationMarker className="w-5 h-5 text-slate-400 flex-shrink-0" />

        <input
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
          placeholder="City or state…"
          className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400 py-3 w-40"
        />
      </div>

      <button className="btn-primary rounded-xl px-8">
        Search Jobs
      </button>
    </div>
  </div>
</div>

        <div className="page-container -mt-6 pb-16">
          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <aside className={`w-64 flex-shrink-0 hidden lg:block`}>
              <div className="card p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">Filters</h3>
                  {hasFilters && (
                    <button onClick={resetFilters} className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                      <HiX className="w-3 h-3" /> Clear all
                    </button>
                  )}
                </div>

                {/* Job Type */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Job Type</p>
                  <div className="space-y-2">
                    {JOB_TYPES.map(t => (
                      <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={filters.type === t} onChange={() => updateFilter('type', filters.type === t ? '' : t)}
                          className="w-4 h-4 rounded text-primary-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-300 capitalize group-hover:text-primary-600">{t.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Type */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Work Mode</p>
                  <div className="space-y-2">
                    {LOCATION_TYPES.map(t => (
                      <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={filters.locationType === t} onChange={() => updateFilter('locationType', filters.locationType === t ? '' : t)}
                          className="w-4 h-4 rounded text-primary-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-300 capitalize group-hover:text-primary-600">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Experience</p>
                  <div className="space-y-2">
                    {EXP_RANGES.map(({ label, min, max }) => (
                      <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox"
                          checked={filters.minExp === String(min) && filters.maxExp === String(max)}
                          onChange={() => {
                            if (filters.minExp === String(min)) { updateFilter('minExp', ''); updateFilter('maxExp', '') }
                            else { updateFilter('minExp', String(min)); updateFilter('maxExp', String(max)) }
                          }}
                          className="w-4 h-4 rounded text-primary-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary-600">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Category</p>
                  <select value={filters.category} onChange={e => updateFilter('category', e.target.value)}
                    className="input-field text-sm">
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </aside>

            {/* Job Listings */}
            <div className="flex-1 min-w-0">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-5 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 shadow-sm relative z-10">
  <p className="text-sm text-slate-500">
    {isLoading ? '...' : (
      <>
        <span className="font-bold text-slate-900 dark:text-white">
          {pagination?.total || 0}
        </span>{" "}
        jobs found
      </>
    )}
  </p>

  <div className="flex items-center gap-3 relative z-20">
    <button
      onClick={() => setFiltersOpen(true)}
      className="lg:hidden btn-ghost text-sm py-1.5 px-3"
    >
      <HiFilter className="w-4 h-4" /> Filters
    </button>

    <select
      value={filters.sort}
      onChange={(e) => updateFilter("sort", e.target.value)}
      className="text-sm bg-transparent border-none outline-none text-slate-600 dark:text-slate-300 font-medium cursor-pointer relative z-30"
    >
      <option value="-createdAt">Newest First</option>
      <option value="createdAt">Oldest First</option>
      <option value="-salary.max">Highest Salary</option>
      <option value="-views">Most Viewed</option>
    </select>
  </div>
</div>

              {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
                </div>
              ) : isError ? (
                <div className="card p-10 text-center text-red-500">Failed to load jobs. Please try again.</div>
              ) : jobs.length === 0 ? (
                <EmptyState icon={HiBriefcase} title="No Jobs Found"
                  description="Try adjusting your filters or search query to find more results."
                  action={<button onClick={resetFilters} className="btn-primary">Clear Filters</button>}
                />
              ) : (
                <div className="space-y-4">
                  {jobs.map((job, i) => (
                    <motion.div key={job._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <Link to={`/jobs/${job.slug}`} className="card-hover p-5 flex gap-4 group">
                        {/* Company logo */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 flex items-center justify-center flex-shrink-0 font-bold text-xl text-primary-600">
                          {job.company?.logo ? <img src={job.company.logo} alt={job.company.name} className="w-10 h-10 object-contain rounded-lg" /> : job.company?.name?.[0]}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{job.title}</h3>
                              <p className="text-slate-500 text-sm mt-0.5">{job.company?.name}</p>
                            </div>
                            <button onClick={(e) => handleSaveJob(job._id, e)}
                              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${savedJobs.has(job._id) ? 'text-primary-600 bg-primary-50' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'}`}>
                              <HiBookmark className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2.5">
                            <span className="flex items-center gap-1 text-xs text-slate-500"><HiLocationMarker className="w-3 h-3" />{job.location}</span>
                            <span className="flex items-center gap-1 text-xs text-slate-500"><HiBriefcase className="w-3 h-3" />{job.type?.replace('_', ' ')}</span>
                            <span className="flex items-center gap-1 text-xs text-slate-500"><HiClock className="w-3 h-3" />{job.experience?.min}-{job.experience?.max} yrs</span>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex flex-wrap gap-1.5">
                              {job.skills?.slice(0, 3).map(s => <Badge key={s} variant="gray">{s}</Badge>)}
                              {job.skills?.length > 3 && <Badge variant="gray">+{job.skills.length - 3}</Badge>}
                            </div>
                            {job.salary?.isVisible && job.salary?.min && (
                              <span className="text-sm font-bold text-green-600 dark:text-green-400 flex-shrink-0">
                                ₹{(job.salary.min / 100000).toFixed(1)}L – {(job.salary.max / 100000).toFixed(1)}L
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {pagination && (
                <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
