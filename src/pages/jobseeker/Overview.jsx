import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { HiBriefcase, HiBookmark, HiCalendar, HiArrowRight } from 'react-icons/hi'
import { applicationAPI, userAPI } from '../../services/api'
import { selectUser } from '../../redux/slices/authSlice'
import { Badge } from '../../components/ui/index'

const APP_STATUS_COLOR = {
  applied: 'primary', screening: 'warning', shortlisted: 'teal', interview_scheduled: 'purple',
  offered: 'success', hired: 'success', rejected: 'danger', withdrawn: 'gray',
}

const CardLink = ({ to, icon: Icon, color, label, value, desc }) => (
  <Link to={to} className="card-hover p-5 flex gap-4 group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </div>
    <HiArrowRight className="w-4 h-4 text-slate-300 ml-auto self-center group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
  </Link>
)

export default function JSOverview() {
  const user = useSelector(selectUser)

  const { data: appsData } = useQuery({
    queryKey: ['my-applications', 1],
    queryFn: () => applicationAPI.getMyApplications({ page: 1, limit: 5 }),
  })

  const { data: interviewsData } = useQuery({
    queryKey: ['my-interviews-count'],
    queryFn: () => applicationAPI.getMyApplications({ status: 'interview_scheduled', limit: 1 }),
  })

  const { data: savedData } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: () => userAPI.getSavedJobs(),
  })

  const applications = appsData?.data?.data || []
  const savedJobs    = savedData?.data?.data?.savedJobs || []
  const totalApps    = appsData?.data?.pagination?.total || 0
  const totalInterviews = interviewsData?.data?.pagination?.total || 0

  const profileCompletion = (() => {
    if (!user) return 0
    let score = 0
    if (user.avatar?.url)             score += 15
    if (user.profile?.headline)        score += 10
    if (user.profile?.summary)         score += 10
    if (user.profile?.skills?.length)  score += 15
    if (user.profile?.resume?.url)     score += 25
    if (user.phone)                    score += 10
    if (user.profile?.location)        score += 10
    if (user.profile?.education)       score += 5
    return score
  })()

  return (
    <>
      <Helmet><title>Dashboard | ProLink</title></Helmet>
      <div className="space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -right-5 bottom-0 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative">
            <h2 className="text-xl font-display font-bold">Good day, {user?.firstName}! 👋</h2>
            <p className="text-primary-200 text-sm mt-1">You have {totalApps} application{totalApps !== 1 ? 's' : ''} in progress.</p>
            <Link to="/jobs" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors">
              Browse New Jobs <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Profile completion */}
        {profileCompletion < 100 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Profile Completion</h3>
                <p className="text-xs text-slate-500">Complete your profile to get better job matches</p>
              </div>
              <span className="text-2xl font-display font-bold text-primary-600">{profileCompletion}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${profileCompletion}%` }} transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {!user?.profile?.resume?.url && (
                <Link to="/dashboard/profile" className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors">
                  📄 Upload Resume
                </Link>
              )}
              {!user?.profile?.headline && (
                <Link to="/dashboard/profile" className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                  ✍️ Add Headline
                </Link>
              )}
              {(!user?.profile?.skills || user.profile.skills.length === 0) && (
                <Link to="/dashboard/profile" className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 dark:bg-violet-900/20 px-3 py-1.5 rounded-full hover:bg-violet-100 transition-colors">
                  🛠 Add Skills
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardLink to="/dashboard/applications" icon={HiBriefcase}    color="bg-primary-50 dark:bg-primary-900/20 text-primary-600"  label="Applications"  value={totalApps}           desc="Total submitted" />
          <CardLink to="/dashboard/saved-jobs"   icon={HiBookmark}     color="bg-amber-50 dark:bg-amber-900/20 text-amber-600"         label="Saved Jobs"    value={savedJobs.length}    desc="Jobs bookmarked" />
          <CardLink to="/dashboard/interviews"   icon={HiCalendar}     color="bg-violet-50 dark:bg-violet-900/20 text-violet-600"      label="Interviews"    value={totalInterviews} desc="Scheduled" />
        </div>

        {/* Recent applications */}
        {/* Recent applications */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15 }}
  className="card overflow-hidden"
>
  <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-700">
    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
      Recent Applications
    </h3>

    <Link
      to="/dashboard/applications"
      className="text-xs sm:text-sm text-primary-600 font-semibold hover:underline"
    >
      View all
    </Link>
  </div>

  {applications.length === 0 ? (
    <div className="py-10 sm:py-12 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
        <HiBriefcase className="w-7 h-7 text-slate-400" />
      </div>

      <p className="text-slate-500 text-sm">No applications yet.</p>

      <Link
        to="/jobs"
        className="btn-primary mt-4 inline-flex text-sm py-2 px-5"
      >
        Browse Jobs
      </Link>
    </div>
  ) : (
    <div className="divide-y divide-slate-100 dark:divide-slate-700">
  {applications.map((app) => (
    <div
      key={app._id}
      className="
        flex flex-col
        sm:flex-row sm:items-center
        gap-3
        px-4 sm:px-5
        py-4
        hover:bg-slate-50 dark:hover:bg-slate-700/50
        transition-colors
      "
    >
      {/* Left */}
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div
          className="
            w-10 h-10 rounded-xl
            bg-primary-50 dark:bg-primary-900/20
            flex items-center justify-center
            font-bold text-primary-600
            flex-shrink-0
          "
        >
          {app.job?.company?.name?.[0] || 'C'}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
            {app.job?.title}
          </p>

          <p className="text-xs text-slate-500 truncate">
            {app.job?.company?.name} · {app.job?.location}
          </p>
        </div>
      </div>

      {/* Right */}
      <div
        className="
          flex items-center justify-between
          sm:flex-col sm:items-end
          flex-shrink-0
          min-w-[120px]
        "
      >
        <Badge
          variant={APP_STATUS_COLOR[app.status] || 'gray'}
          className="
            inline-flex items-center
            whitespace-nowrap
            capitalize text-xs
          "
        >
          {app.status?.replace(/_/g, ' ')}
        </Badge>

        <p className="text-xs text-slate-400 sm:mt-1 whitespace-nowrap">
          {new Date(app.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
          })}
        </p>
      </div>
    </div>
  ))}
</div>
  )}
</motion.div>
      </div>
    </>
  )
}
