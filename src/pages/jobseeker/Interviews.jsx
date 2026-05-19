import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiCalendar, HiVideoCamera, HiPhone, HiOfficeBuilding, HiCode, HiExternalLink, HiClock } from 'react-icons/hi'
import { applicationAPI } from '../../services/api'
import { Badge, EmptyState } from '../../components/ui/index'
import { Link } from 'react-router-dom'

const INTERVIEW_ICONS = { video: HiVideoCamera, phone: HiPhone, in_person: HiOfficeBuilding, technical: HiCode }
const INTERVIEW_COLORS = { video: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', phone: 'text-green-600 bg-green-50 dark:bg-green-900/20', in_person: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20', technical: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' }

export default function JSInterviews() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-interviews'],
    queryFn: () => applicationAPI.getMyApplications({ status: 'interview_scheduled', limit: 20 }),
  })

  const interviews = (data?.data?.data || []).filter(a => a.interview?.scheduledAt)

  const upcoming = interviews.filter(a => new Date(a.interview.scheduledAt) > new Date())
  const past     = interviews.filter(a => new Date(a.interview.scheduledAt) <= new Date())

  const InterviewCard = ({ app }) => {
    const iType = app.interview?.type
    const Icon  = INTERVIEW_ICONS[iType] || HiCalendar
    const color = INTERVIEW_COLORS[iType] || 'text-slate-600 bg-slate-50'
    const interviewDate = new Date(app.interview.scheduledAt)
    const isToday = interviewDate.toDateString() === new Date().toDateString()

    return (
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
        className="card p-5 flex gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <Link to={`/jobs/${app.job?.slug}`} className="font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors truncate block">{app.job?.title}</Link>
              <p className="text-sm text-slate-500">{app.job?.company?.name}</p>
            </div>
            {isToday && <Badge variant="danger" className="flex-shrink-0">Today!</Badge>}
          </div>
          <div className="flex flex-wrap gap-4 mt-2.5 text-sm">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <HiCalendar className="w-4 h-4 text-slate-400" />
              {interviewDate.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <HiClock className="w-4 h-4 text-slate-400" />
              {interviewDate.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
            </span>
            <Badge variant="primary" className="capitalize">{iType?.replace('_',' ') || 'Interview'}</Badge>
          </div>
          {app.interview?.notes && <p className="mt-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">{app.interview.notes}</p>}
          {app.interview?.link && (
            <a href={app.interview.link} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-full hover:bg-primary-100 transition-colors">
              <HiVideoCamera className="w-4 h-4" /> Join Meeting
            </a>
          )}
          {app.interview?.location && !app.interview?.link && (
            <p className="mt-2 text-sm text-slate-500"><span className="font-semibold">📍 Location:</span> {app.interview.location}</p>
          )}
        </div>
      </motion.div>
    )
  }

  if (isLoading) return (
    <div className="space-y-3">
      {[...Array(3)].map((_,i) => <div key={i} className="card p-5 h-28 animate-pulse bg-slate-100 dark:bg-slate-800" />)}
    </div>
  )

  return (
    <>
      <Helmet><title>Interviews | ProLink</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Interviews</h1>
          <p className="text-sm text-slate-500">{interviews.length} scheduled interview{interviews.length !== 1 ? 's' : ''}</p>
        </div>

        {interviews.length === 0 ? (
          <EmptyState icon={HiCalendar} title="No Interviews Scheduled"
            description="When employers schedule interviews with you, they will appear here."
            action={<Link to="/dashboard/applications" className="btn-primary">View Applications</Link>} />
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">Upcoming ({upcoming.length})</h2>
                {upcoming.sort((a,b) => new Date(a.interview.scheduledAt) - new Date(b.interview.scheduledAt)).map(app => <InterviewCard key={app._id} app={app} />)}
              </div>
            )}
            {past.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-bold text-slate-400 text-sm uppercase tracking-wider">Past ({past.length})</h2>
                {past.sort((a,b) => new Date(b.interview.scheduledAt) - new Date(a.interview.scheduledAt)).map(app => (
                  <div key={app._id} className="opacity-60"><InterviewCard app={app} /></div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Interview tips */}
        <div className="card p-5 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/10 dark:to-blue-900/10 border-primary-100 dark:border-primary-800">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">💡 Interview Tips</h3>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            {['Research the company thoroughly before the interview','Prepare STAR method answers for behavioural questions','Test your video connection 15 minutes early','Have your resume and notes ready to reference','Send a thank-you email within 24 hours after the interview'].map(tip => (
              <li key={tip} className="flex items-start gap-2"><span className="text-primary-600 mt-0.5">•</span>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
