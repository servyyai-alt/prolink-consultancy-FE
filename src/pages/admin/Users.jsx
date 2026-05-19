import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiSearch, HiDotsVertical, HiLockClosed, HiLockOpen, HiShieldCheck, HiFilter } from 'react-icons/hi'
import { adminAPI } from '../../services/api'
import { Pagination, Badge } from '../../components/ui/index'
import toast from 'react-hot-toast'

const ROLE_COLORS = { super_admin: 'danger', admin: 'primary', recruiter: 'purple', employer: 'warning', job_seeker: 'success' }

export default function AdminUsers() {
  const [page,   setPage]   = useState(1)
  const [search, setSearch] = useState('')
  const [role,   setRole]   = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', { page, search, role }],
    queryFn:  () => adminAPI.getUsers({ page, limit: 20, search, role }),
    keepPreviousData: true,
  })

  const users      = data?.data?.data || []
  const pagination = data?.data?.pagination

  const blockMutation = useMutation({
    mutationFn: (id) => adminAPI.toggleBlock(id),
    onSuccess:  () => { qc.invalidateQueries(['admin-users']); toast.success('User status updated') },
    onError:    () => toast.error('Failed to update user'),
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => adminAPI.changeRole(id, { role }),
    onSuccess:  () => { qc.invalidateQueries(['admin-users']); toast.success('Role updated') },
    onError:    () => toast.error('Failed to update role'),
  })

  return (
    <>
      <Helmet><title>Users | Admin | ProLink</title></Helmet>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Users</h1>
            <p className="text-sm text-slate-500">{pagination?.total || 0} total users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-xl px-3">
            <HiSearch className="w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name or email…" className="flex-1 bg-transparent py-2.5 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400" />
          </div>
          <select value={role} onChange={e => { setRole(e.target.value); setPage(1) }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 border-none outline-none font-medium">
            <option value="">All Roles</option>
            {['admin', 'recruiter', 'employer', 'job_seeker'].map(r => (
              <option key={r} value={r}>{r.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {isLoading
                  ? [...Array(8)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(5)].map((_, j) => (
                          <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" /></td>
                        ))}
                      </tr>
                    ))
                  : users.map((user) => (
                      <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {user.avatar?.url
                              ? <img src={user.avatar.url} alt="" className="w-8 h-8 rounded-full object-cover" />
                              : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-bold">{user.firstName?.[0]}</span>
                                </div>
                            }
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            defaultValue={user.role}
                            onChange={e => roleMutation.mutate({ id: user._id, role: e.target.value })}
                            className="text-xs bg-transparent border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 capitalize">
                            {['admin', 'recruiter', 'employer', 'job_seeker'].map(r => (
                              <option key={r} value={r}>{r.replace('_', ' ')}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <Badge variant={user.isBlocked ? 'danger' : user.isActive ? 'success' : 'gray'}>
                              {user.isBlocked ? 'Blocked' : user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            {!user.isVerified && <Badge variant="warning">Unverified</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-500 text-xs">
                          {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => blockMutation.mutate(user._id)}
                            disabled={blockMutation.isLoading}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              user.isBlocked
                                ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                            {user.isBlocked
                              ? <><HiLockOpen className="w-3.5 h-3.5" /> Unblock</>
                              : <><HiLockClosed className="w-3.5 h-3.5" /> Block</>
                            }
                          </button>
                        </td>
                      </motion.tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          {users.length === 0 && !isLoading && (
            <div className="py-16 text-center text-slate-400">No users found</div>
          )}
        </div>

        {pagination && (
          <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        )}
      </div>
    </>
  )
}
