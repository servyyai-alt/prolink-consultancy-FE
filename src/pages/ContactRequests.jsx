import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiChatAlt2, HiClock, HiMail, HiOfficeBuilding } from 'react-icons/hi'
import { Badge, EmptyState, Pagination } from '../components/ui'
import { contactAPI } from '../services/api'

const STATUS_VARIANTS = {
  new: 'primary',
  read: 'warning',
  replied: 'success',
  closed: 'gray',
}

const STATUS_LABELS = {
  new: 'New',
  read: 'In Review',
  replied: 'Replied',
  closed: 'Closed',
}

export default function ContactRequests() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['my-contact-inquiries', { page, status }],
    queryFn: () => contactAPI.getMyInquiries({ page, limit: 10, status: status || undefined }),
    keepPreviousData: true,
  })

  const inquiries = data?.data?.data || []
  const pagination = data?.data?.pagination

  return (
    <>
      <Helmet>
        <title>Contact Requests | ProLink</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support Requests</h1>
            <p className="mt-1 text-sm text-slate-500">Track your contact inquiries, replies, and latest updates from the ProLink team.</p>
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <EmptyState
              icon={HiChatAlt2}
              title="No support requests yet"
              description="Once you submit a contact form while signed in, you'll be able to track its status and replies here."
            />
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <article key={inquiry._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{inquiry.subject}</h2>
                      <Badge variant={STATUS_VARIANTS[inquiry.status] || 'gray'}>
                        {STATUS_LABELS[inquiry.status] || inquiry.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <HiOfficeBuilding className="text-base" />
                        {inquiry.service || 'General inquiry'}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <HiClock className="text-base" />
                        {new Date(inquiry.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Source: {inquiry.source || 'contact_form'}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Your message</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">{inquiry.message}</p>
                </div>

                {inquiry.reply ? (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-900/10">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">Reply from ProLink</span>
                      {inquiry.repliedAt && (
                        <span className="text-emerald-600/80 dark:text-emerald-300/80">
                          {new Date(inquiry.repliedAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-emerald-900 dark:text-emerald-100">{inquiry.reply}</p>
                  </div>
                ) : (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                    <HiMail className="text-base" />
                    No admin reply yet. We’ll update this request as soon as our team responds.
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {pagination && (
          <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        )}
      </div>
    </>
  )
}
