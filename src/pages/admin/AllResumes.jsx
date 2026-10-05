import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import {
  HiSearch, HiDownload, HiDocumentText, HiUser,
  HiFilter, HiExternalLink,
} from 'react-icons/hi'
import { adminAPI, userAPI } from '../../services/api'
import { Badge, EmptyState, Pagination } from '../../components/ui/index'
import { downloadResumeFile, triggerBlobDownload, detectBlobFormat } from '../../utils/download'

const AVAILABILITY_LABELS = {
  immediate:    'Immediate',
  within_month: 'Within a month',
  flexible:     'Flexible',
  not_looking:  'Not looking',
}

const AVAILABILITY_VARIANTS = {
  immediate:    'green',
  within_month: 'yellow',
  flexible:     'blue',
  not_looking:  'gray',
}

export default function AdminAllResumes() {
  const [page, setPage]             = useState(1)
  const [search, setSearch]         = useState('')
  const [availability, setAvailability] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-all-resumes', { page, search, availability }],
    queryFn:  () => adminAPI.getAllResumes({
      page,
      limit: 30,
      search: search || undefined,
      availability: availability || undefined,
    }),
    keepPreviousData: true,
  })

  const users      = data?.data?.data || []
  const pagination = data?.data?.pagination

  const handleDownloadResume = async (u) => {
    if (u.userId) {
      try {
        const response = await userAPI.downloadResume(u.userId)
        let filename = ''
        const disposition = response.headers?.['content-disposition'] || ''
        const match = disposition.match(/filename="?([^";]+)"?/i)
        if (match && match[1]) {
          filename = match[1]
        }

        const rawBlob = response.data instanceof Blob ? response.data : new Blob([response.data])
        const { ext, mimeType } = await detectBlobFormat(rawBlob, u.resumeUrl, u.name)
        if (!filename) {
          filename = `${(u.name || 'candidate').replace(/[^a-zA-Z0-9_-]/g, '_')}-Resume${ext}`
        }

        const cleanBlob = rawBlob.type === mimeType ? rawBlob : new Blob([rawBlob], { type: mimeType })
        triggerBlobDownload(cleanBlob, filename)
        return
      } catch (err) {
        console.warn('API resume download failed, falling back to direct download', err)
      }
    }

    if (u.resumeUrl) {
      downloadResumeFile(u.resumeUrl, `${u.name}-Resume`)
    }
  }

  return (
    <>
      <Helmet><title>All Resumes | Admin | ProLink</title></Helmet>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              All Job Seeker Resumes
            </h1>
            <p className="text-sm text-slate-500">
              {pagination?.total || 0} job seekers with uploaded resumes
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-xl px-3">
            <HiSearch className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name, email or headline"
              className="flex-1 bg-transparent py-2.5 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <select
            value={availability}
            onChange={(e) => { setAvailability(e.target.value); setPage(1) }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 border-none outline-none font-medium"
          >
            <option value="">All availability</option>
            {Object.entries(AVAILABILITY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={HiDocumentText}
              title="No resumes found"
              description="Job seekers who upload resumes to their profile will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700 text-left">
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Candidate</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Contact</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400 hidden md:table-cell">Skills</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400 hidden sm:table-cell">Availability</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400 hidden lg:table-cell">Uploaded</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400 text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {users.map((u) => (
                    <tr key={u.userId} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">{u.name?.[0]?.toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                            {u.headline && <p className="text-xs text-slate-500 truncate max-w-[200px]">{u.headline}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-slate-700 dark:text-slate-300">{u.email}</p>
                        {u.phone && <p className="text-xs text-slate-500">{u.phone}</p>}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {u.skills?.slice(0, 4).map((skill) => (
                            <span key={skill} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {u.skills?.length > 4 && (
                            <span className="text-xs text-slate-400">+{u.skills.length - 4}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {u.availability ? (
                          <Badge variant={AVAILABILITY_VARIANTS[u.availability] || 'gray'}>
                            {AVAILABILITY_LABELS[u.availability] || u.availability}
                          </Badge>
                        ) : <span className="text-slate-400 text-xs">Not set</span>}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 hidden lg:table-cell">
                        {u.uploadedAt
                          ? new Date(u.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {u.resumeUrl ? (
                          <button
                            type="button"
                            onClick={() => handleDownloadResume(u)}
                            title="Download Resume"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 transition-colors"
                          >
                            <HiDownload className="w-3.5 h-3.5" />
                            Download
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">No resume</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pagination && (
          <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        )}
      </div>
    </>
  )
}
