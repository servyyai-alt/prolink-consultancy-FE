import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  HiCalendar,
  HiMail,
  HiPhone,
  HiReply,
  HiSearch,
  HiShieldExclamation,
  HiUser,
} from 'react-icons/hi'

import { adminAPI } from '../../services/api'
import { Badge, Button, EmptyState, Input, Modal, Pagination, Textarea } from '../../components/ui/index'

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

export default function AdminContacts() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [activeContact, setActiveContact] = useState(null)
  const [replyForm, setReplyForm] = useState({
    status: 'read',
    reply: '',
    internalNotes: '',
    isSpam: false,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts', { page, status, search }],
    queryFn: () =>
      adminAPI.getContacts({
        page,
        limit: 12,
        status: status || undefined,
        search: search || undefined,
      }),
    keepPreviousData: true,
  })

  const contacts = data?.data?.data || []
  const pagination = data?.data?.pagination

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminAPI.updateContact(id, payload),
    onSuccess: () => {
      toast.success('Contact inquiry updated')
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
      setActiveContact(null)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Could not update inquiry')
    },
  })

  const openReply = (contact) => {
    setActiveContact(contact)
    setReplyForm({
      status: contact.status === 'new' ? 'read' : contact.status,
      reply: contact.reply || '',
      internalNotes: contact.internalNotes || '',
      isSpam: Boolean(contact.isSpam),
    })
  }

  const quickStatusUpdate = (contact, nextStatus) => {
    updateMutation.mutate({
      id: contact._id,
      payload: {
        status: nextStatus,
        internalNotes: contact.internalNotes || '',
        isSpam: Boolean(contact.isSpam),
      },
    })
  }

  const submitReply = (event) => {
    event.preventDefault()
    if (!activeContact) return

    updateMutation.mutate({
      id: activeContact._id,
      payload: {
        ...replyForm,
        status: replyForm.reply.trim() ? 'replied' : replyForm.status,
      },
    })
  }

  return (
    <>
      <Helmet>
        <title>Contacts | Admin | ProLink</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Inquiries</h1>
            <p className="mt-1 text-sm text-slate-500">{pagination?.total || 0} inquiries received</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[260px_180px]">
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Search name, email, subject"
              leftIcon={HiSearch}
            />

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
              className="input-field"
            >
              <option value="">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <EmptyState
              icon={HiMail}
              title="No contact inquiries found"
              description="No inquiries match the selected filters."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {contacts.map((contact) => (
              <article
                key={contact._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/10">
                      <HiUser className="text-xl text-amber-600 dark:text-amber-400" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{contact.subject}</h3>
                        <Badge variant={STATUS_VARIANTS[contact.status] || 'gray'}>
                          {STATUS_LABELS[contact.status] || contact.status}
                        </Badge>
                        {contact.isSpam && <Badge variant="danger">Spam</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{contact.name}</p>
                    </div>
                  </div>

                  <select
                    value={contact.status}
                    onChange={(event) => quickStatusUpdate(contact, event.target.value)}
                    disabled={updateMutation.isPending}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-amber-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-primary-600">
                    <HiMail className="text-lg text-amber-500" />
                    <span className="truncate">{contact.email}</span>
                  </a>

                  <div className="flex items-center gap-3">
                    <HiPhone className="text-lg text-emerald-500" />
                    <span>{contact.phone || 'Not provided'}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500">
                    <HiCalendar className="text-lg text-slate-400" />
                    <span>
                      {new Date(contact.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {contact.service || 'General'}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {contact.user ? 'Registered user' : 'Guest inquiry'}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {contact.source || 'contact_form'}
                  </span>
                </div>

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {contact.message}
                  </p>
                </div>

                {contact.reply && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-900/10">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Latest reply</p>
                    <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-emerald-900 dark:text-emerald-100">
                      {contact.reply}
                    </p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => openReply(contact)}>
                    <HiReply className="h-4 w-4" />
                    Reply / Manage
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateMutation.mutate({
                        id: contact._id,
                        payload: {
                          status: contact.status,
                          reply: contact.reply || '',
                          internalNotes: contact.internalNotes || '',
                          isSpam: !contact.isSpam,
                        },
                      })
                    }
                    isLoading={updateMutation.isPending}
                  >
                    <HiShieldExclamation className="h-4 w-4" />
                    {contact.isSpam ? 'Unmark Spam' : 'Mark Spam'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        {pagination && (
          <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        )}
      </div>

      <Modal
        isOpen={Boolean(activeContact)}
        onClose={() => setActiveContact(null)}
        title="Manage Contact Inquiry"
        size="lg"
      >
        {activeContact && (
          <form onSubmit={submitReply} className="space-y-5 p-6">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">{activeContact.subject}</h3>
                <Badge variant={STATUS_VARIANTS[activeContact.status] || 'gray'}>
                  {STATUS_LABELS[activeContact.status] || activeContact.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {activeContact.name} · {activeContact.email}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
                {activeContact.message}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Status</label>
                <select
                  value={replyForm.status}
                  onChange={(event) => setReplyForm((prev) => ({ ...prev, status: event.target.value }))}
                  className="input-field"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={replyForm.isSpam}
                  onChange={(event) => setReplyForm((prev) => ({ ...prev, isSpam: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                Mark as spam
              </label>
            </div>

            <Textarea
              label="Reply to user"
              rows={6}
              value={replyForm.reply}
              onChange={(event) => setReplyForm((prev) => ({ ...prev, reply: event.target.value }))}
              placeholder="Write a clear, helpful response. This will be emailed and shown in the user's dashboard."
            />

            <Textarea
              label="Internal notes"
              rows={3}
              value={replyForm.internalNotes}
              onChange={(event) => setReplyForm((prev) => ({ ...prev, internalNotes: event.target.value }))}
              placeholder="Private admin note, not visible to the user."
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" onClick={() => setActiveContact(null)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={updateMutation.isPending}>
                Save and Notify
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}
