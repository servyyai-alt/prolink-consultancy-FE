import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { HiBriefcase, HiUserGroup, HiPlusCircle, HiEye } from 'react-icons/hi'
import { analyticsAPI, jobAPI } from '../../services/api'
import { selectUser } from '../../redux/slices/authSlice'
import { Badge } from '../../components/ui/index'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const APP_STATUS_COLOR = { applied:'primary', screening:'warning', shortlisted:'success', interview_scheduled:'purple', offered:'success', hired:'success', rejected:'danger' }

export default function EmpOverview() {
  const user = useSelector(selectUser)

  const { data: analytics } = useQuery({
    queryKey: ['employer-analytics'],
    queryFn: () => analyticsAPI ? analyticsAPI.getEmployer() : Promise.resolve(null),
  })

  const { data: jobsData } = useQuery({
    queryKey: ['my-jobs-overview'],
    queryFn: () => jobAPI.getMyJobs({ limit: 5 }),
  })

  const myJobs     = jobsData?.data?.data || []
  const stats      = analytics?.data?.data
  const appsByStatus = stats?.appsByStatus || []
  const recentApps   = stats?.recentApps || []

  const chartData = appsByStatus.map(s => ({ name: s._id?.replace(/_/g,' '), count: s.count }))

  return (
    <>
      <Helmet><title>Employer Dashboard | ProLink</title></Helmet>
      <div className="space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          className="bg-gradient-to-r from-violet-600 to-primary-700 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="relative">
            <h2 className="text-xl font-display font-bold">Welcome, {user?.company?.name || user?.firstName}! </h2>
            <p className="text-violet-200 text-sm mt-1">Manage your job postings and find the best talent.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link to="/employer/post-job" className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors">
                <HiPlusCircle className="w-4 h-4" /> Post a Job
              </Link>
              <Link to="/employer/applicants" className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors">
                <HiUserGroup className="w-4 h-4" /> View Applicants
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Jobs', value: myJobs.filter(j => j.status === 'active').length, icon: HiBriefcase, color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600' },
            { label: 'Total Jobs', value: myJobs.length, icon: HiBriefcase, color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' },
            { label: 'Total Applicants', value: appsByStatus.reduce((a,s) => a + s.count, 0), icon: HiUserGroup, color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
            { label: 'Hired', value: appsByStatus.find(s => s._id === 'hired')?.count || 0, icon: HiUserGroup, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' },
          ].map(({ label, value, icon:Icon, color }, i) => (
            <motion.div key={label} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
              className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon className="w-5 h-5" /></div>
              <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent jobs */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
            className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white">My Job Postings</h3>
              <Link to="/employer/my-jobs" className="text-xs text-primary-600 font-semibold hover:underline">View all</Link>
            </div>
            {myJobs.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-slate-500 text-sm mb-3">No jobs posted yet</p>
                <Link to="/employer/post-job" className="btn-primary text-sm py-2 px-4">Post First Job</Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {myJobs.map(job => (
                  <div key={job._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{job.title}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><HiEye className="w-3 h-3" />{job.views||0} views</span>
                        <span className="flex items-center gap-1"><HiUserGroup className="w-3 h-3" />{job.applications||0} apps</span>
                      </div>
                    </div>
                    <Badge variant={job.status === 'active' ? 'success' : 'gray'} className="flex-shrink-0 ml-3">{job.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Applications by status chart */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className="card p-5">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Applications by Status</h3>
            <p className="text-xs text-slate-500 mb-4">Current pipeline breakdown</p>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius:10, fontSize:11 }} />
                  <Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No data yet</div>
            )}
          </motion.div>
        </div>

        {/* Recent applicants */}
        {recentApps.length > 0 && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
            className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white">Recent Applicants</h3>
              <Link to="/employer/applicants" className="text-xs text-primary-600 font-semibold hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentApps.map(app => (
                <div key={app._id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {app.applicant?.firstName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{app.applicant?.firstName} {app.applicant?.lastName}</p>
                    <p className="text-xs text-slate-500 truncate">{app.job?.title}</p>
                  </div>
                  <Badge variant={APP_STATUS_COLOR[app.status] || 'gray'} className="flex-shrink-0 text-xs capitalize">{app.status?.replace(/_/g,' ')}</Badge>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}
