import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { HiUsers, HiBriefcase, HiClipboardList, HiCurrencyRupee, HiMail, HiTrendingUp } from 'react-icons/hi'
import { adminAPI } from '../../services/api'
import { motion } from 'framer-motion'

const COLORS = ['#7f1313', '#f3bc2f', '#b74720', '#2f6b52', '#b91c1c', '#7a5c36']

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function StatCard({ label, value, icon: Icon, color, change, prefix = '' }) {
  const colorMap = {
    blue:   'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    violet: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600',
    green:  'bg-green-50 dark:bg-green-900/20 text-green-600',
    amber:  'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    red:    'bg-red-50 dark:bg-red-900/20 text-red-600',
  }
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            parseFloat(change) >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {parseFloat(change) >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </motion.div>
  )
}

export default function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminAPI.getDashboard(),
    refetchInterval: 60000,
  })

  const stats  = data?.data?.data?.stats
  const charts = data?.data?.data?.charts

  const userTrendData = charts?.userTrend?.map(d => ({
    month: MONTH_NAMES[d._id.month - 1],
    users: d.count,
  })) || []

  const categoryData = charts?.jobsByCategory?.map(d => ({
    name: d._id,
    value: d.count,
  })) || []

  const appStatusData = charts?.applicationsByStatus?.map(d => ({
    name: d._id.replace(/_/g, ' '),
    value: d.count,
  })) || []

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 h-28 animate-pulse">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl mb-3" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <Helmet><title>Admin Dashboard | ProLink</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back. Here's what's happening.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Total Users"       value={stats?.users?.total || 0}    icon={HiUsers}          color="blue"   change={stats?.users?.growth} />
          <StatCard label="Active Jobs"        value={stats?.jobs?.active || 0}    icon={HiBriefcase}      color="violet" />
          <StatCard label="Applications"       value={stats?.applications?.total || 0} icon={HiClipboardList} color="green" />
          <StatCard label="Revenue This Month" value={stats?.revenue?.total || 0}  icon={HiCurrencyRupee}  color="amber"  change={stats?.revenue?.growth} prefix="₹" />
          <StatCard label="Unread Inquiries"   value={stats?.contacts?.unread || 0} icon={HiMail}          color="red" />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User growth */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">User Registrations</h3>
                <p className="text-xs text-slate-500">Last 6 months</p>
              </div>
              <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                <HiTrendingUp className="w-4 h-4" /> Growing
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={userTrendData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7f1313" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#7f1313" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                <Area type="monotone" dataKey="users" stroke="#7f1313" strokeWidth={2.5} fill="url(#colorUsers)" dot={{ r: 4, fill: '#7f1313' }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Application status pie */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Application Status</h3>
            <p className="text-xs text-slate-500 mb-4">Current breakdown</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={appStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {appStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {appStatusData.slice(0, 4).map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-600 dark:text-slate-300 capitalize">{d.name}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{d.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jobs by category */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Jobs by Category</h3>
            <p className="text-xs text-slate-500 mb-4">Active job distribution</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                <Bar dataKey="value" fill="#b74720" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quick stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Overview</h3>
            <div className="space-y-4">
              {[
                { label: 'New Users This Month',     value: stats?.users?.thisMonth || 0,         max: 500,  color: '#7f1313' },
                { label: 'Applications This Month',  value: stats?.applications?.thisMonth || 0,  max: 1000, color: '#f3bc2f' },
                { label: 'Total Jobs',               value: stats?.jobs?.total || 0,              max: 500,  color: '#2f6b52' },
              ].map(({ label, value, max, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-600 dark:text-slate-300">{label}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full" style={{ background: color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'View Users',    href: '/admin/users' },
                  { label: 'Manage Jobs',   href: '/admin/jobs' },
                  { label: 'Check Inbox',   href: '/admin/contacts' },
                  { label: 'Payments',      href: '/admin/payments' },
                ].map(({ label, href }) => (
                  <a key={href} href={href}
                    className="px-3 py-2 text-xs font-semibold text-center rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
