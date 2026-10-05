import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import {
  HiSearch, HiDownload, HiDocumentText, HiUser, HiPhone, HiMail,
  HiCalendar, HiX, HiCheck, HiEye,
} from 'react-icons/hi'
import { adminAPI } from '../../services/api'
import { Badge, Button, EmptyState, Modal, Pagination } from '../../components/ui/index'
import { downloadResumeFile, triggerBlobDownload, detectBlobFormat } from '../../utils/download'

const STATUS_VARIANTS = {
  new:     'blue',
  read:    'gray',
  replied: 'green',
  closed:  'slate',
}

const STATUS_LABELS = {
  new:     'New',
  read:    'Read',
  replied: 'Replied / Contacted',
  closed:  'Closed / Placed',
}

export default function AdminJobSeekerLeads() {
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [selected, setSelected] = useState(null)
  const [noteVal, setNoteVal]   = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-job-seeker-leads', { page, search, status }],
    queryFn:  () => adminAPI.getJobSeekerLeads({
      page,
      limit: 20,
      search: search || undefined,
      status: status || undefined,
    }),
    keepPreviousData: true,
  })

  const leads      = data?.data?.data || []
  const pagination = data?.data?.pagination

  const updateMutation = useMutation({
    mutationFn: ({ id, ...body }) => adminAPI.updateJobSeekerLead(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-job-seeker-leads'] })
      toast.success('Lead updated')
      setSelected(null)
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Update failed'),
  })

  const openLead = (lead) => {
    setSelected(lead)
    setNoteVal(lead.internalNotes || '')
  }

  // Extract resume URL from the `service` field (stored there by the backend)
  const getResumeUrl = (lead) => {
    if (!lead) return null
    if (lead.service && lead.service.startsWith('http')) return lead.service
    return null
  }

  const handleDownloadResume = async (lead) => {
    const resumeUrl = getResumeUrl(lead)
    if (!resumeUrl) return

    try {
      if (lead._id) {
        const response = await adminAPI.downloadJobSeekerLeadResume(lead._id)
        let filename = ''
        const disposition = response.headers?.['content-disposition'] || ''
        const match = disposition.match(/filename="?([^";]+)"?/i)
        if (match && match[1]) {
          filename = match[1]
        }

        const rawBlob = response.data instanceof Blob ? response.data : new Blob([response.data])
        const { ext, mimeType } = await detectBlobFormat(rawBlob, resumeUrl, lead.name)
        if (!filename) {
          filename = `${(lead.name || 'candidate').replace(/[^a-zA-Z0-9_-]/g, '_')}-Resume${ext}`
        }

        const cleanBlob = rawBlob.type === mimeType ? rawBlob : new Blob([rawBlob], { type: mimeType })
        triggerBlobDownload(cleanBlob, filename)
        return
      }
    } catch {
      // Fallback to client-side fetch helper
    }
    downloadResumeFile(resumeUrl, `${lead.name}-Resume`)
  }

  return (
    <>
      <Helmet><title>Job Seeker Leads | Admin | ProLink</title></Helmet>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Job Seeker Leads
            </h1>
            <p className="text-sm text-slate-500">
              {pagination?.total || 0} leads from the homepage registration form
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
              placeholder="Search by name, email or phone"
              className="flex-1 bg-transparent py-2.5 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 border-none outline-none font-medium"
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Leads List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <EmptyState icon={HiUser} title="No leads found" description="Job seekers who register through the homepage form will appear here." />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {leads.map((lead) => {
                const resumeUrl = getResumeUrl(lead)
                return (
                  <div key={lead._id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {lead.name?.[0]?.toUpperCase() || 'L'}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{lead.name}</h3>
                          <Badge variant={STATUS_VARIANTS[lead.status] || 'gray'}>
                            {STATUS_LABELS[lead.status] || lead.status}
                          </Badge>
                          {resumeUrl && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                              <HiDocumentText className="w-3 h-3" /> Resume
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1"><HiMail className="w-3.5 h-3.5" />{lead.email}</span>
                          {lead.phone && <span className="inline-flex items-center gap-1"><HiPhone className="w-3.5 h-3.5" />{lead.phone}</span>}
                          <span className="inline-flex items-center gap-1">
                            <HiCalendar className="w-3.5 h-3.5" />
                            {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        {lead.message && (
                          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">{lead.message}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        {resumeUrl && (
                          <button
                            type="button"
                            onClick={() => handleDownloadResume(lead)}
                            title="Download Resume"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 transition-colors"
                          >
                            <HiDownload className="w-3.5 h-3.5" /> Resume
                          </button>
                        )}
                        <button
                          onClick={() => openLead(lead)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <HiEye className="w-3.5 h-3.5" /> View
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {pagination && (
          <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Job Seeker Lead Details"
        size="lg"
      >
        {selected && (
          <div className="p-6 space-y-5">
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Full Name</p>
                <p className="font-semibold text-slate-900 dark:text-white">{selected.name}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Status</p>
                <Badge variant={STATUS_VARIANTS[selected.status] || 'gray'}>
                  {STATUS_LABELS[selected.status] || selected.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Email</p>
                <a href={`mailto:${selected.email}`} className="text-primary-600 text-sm font-medium hover:underline">{selected.email}</a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Phone</p>
                <a href={`tel:${selected.phone}`} className="text-slate-700 dark:text-slate-300 text-sm">{selected.phone || '—'}</a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Submitted On</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {new Date(selected.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Resume</p>
                {getResumeUrl(selected) ? (
                  <button
                    type="button"
                    onClick={() => handleDownloadResume(selected)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
                  >
                    <HiDownload className="w-4 h-4" /> Download Resume
                  </button>
                ) : (
                  <span className="text-sm text-slate-400">No resume uploaded</span>
                )}
              </div>
            </div>

            {/* Message */}
            {selected.message && (
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Message / Details</p>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </div>
              </div>
            )}

            {/* Internal Notes */}
            <div>
              <label className="label">Internal Notes</label>
              <textarea
                value={noteVal}
                onChange={(e) => setNoteVal(e.target.value)}
                rows={3}
                placeholder="Add internal notes about this lead..."
                className="input-field resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 w-full mb-1">Update Status:</p>
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => updateMutation.mutate({ id: selected._id, status: val, internalNotes: noteVal })}
                  disabled={updateMutation.isPending || selected.status === val}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 ${
                    selected.status === val
                      ? 'bg-slate-200 text-slate-500 dark:bg-slate-700 cursor-default'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {selected.status === val && <HiCheck className="inline w-3 h-3 mr-1" />}
                  {label}
                </button>
              ))}
              <Button
                className="ml-auto"
                onClick={() => updateMutation.mutate({ id: selected._id, internalNotes: noteVal })}
                isLoading={updateMutation.isPending}
                variant="outline"
                size="sm"
              >
                Save Notes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
