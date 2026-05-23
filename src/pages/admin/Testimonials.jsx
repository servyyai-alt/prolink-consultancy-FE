import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiChatAlt2, HiSearch } from 'react-icons/hi'
import { adminAPI } from '../../services/api'
import { Badge, Button, EmptyState, Pagination } from '../../components/ui/index'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import toast from 'react-hot-toast'

export default function AdminTestimonials() {
  const [page, setPage] = useState(1)
  const [approval, setApproval] = useState('')
  const [search, setSearch] = useState('')
  const [testimonialToDelete, setTestimonialToDelete] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials', { page, approval, search }],
    queryFn: () => adminAPI.getTestimonials({ page, limit: 12, approval: approval || undefined, search: search || undefined }),
    keepPreviousData: true,
  })

  const testimonials = data?.data?.data || []
  const pagination = data?.data?.pagination

  const approveMutation = useMutation({
    mutationFn: (id) => adminAPI.approveTestimonial(id),
    onSuccess: () => {
      toast.success('Testimonial approved')
      qc.invalidateQueries({ queryKey: ['admin-testimonials'] })
    },
    onError: (error) => toast.error(error?.response?.data?.message || 'Could not approve testimonial'),
  })

  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminAPI.updateTestimonial(id, data),
    onSuccess: () => {
      toast.success('Testimonial updated')
      qc.invalidateQueries({ queryKey: ['admin-testimonials'] })
      setEditingId(null)
    },
    onError: (error) => toast.error(error?.response?.data?.message || 'Could not update testimonial'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteTestimonial(id),
    onSuccess: () => {
      toast.success('Testimonial deleted')
      qc.invalidateQueries({ queryKey: ['admin-testimonials'] })
      setTestimonialToDelete(null)
    },
    onError: (error) => toast.error(error?.response?.data?.message || 'Could not delete testimonial'),
  })

  return (
    <>
      <Helmet><title>Testimonials | Admin | ProLink</title></Helmet>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Testimonials</h1>
          <p className="text-sm text-slate-500">{pagination?.total || 0} testimonials in queue</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-slate-50 px-3 dark:bg-slate-700">
            <HiSearch className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search testimonials"
              className="flex-1 bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder-slate-400 dark:text-white"
            />
          </div>

          <select
            value={approval}
            onChange={(e) => { setApproval(e.target.value); setPage(1) }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 border-none outline-none font-medium"
          >
            <option value="">All testimonials</option>
            <option value="pending">Pending approval</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <EmptyState icon={HiChatAlt2} title="No testimonials found" description="No testimonials match the current filter." />
          ) : (
            // <div className="divide-y divide-slate-100 dark:divide-slate-700">
            //   {testimonials.map((testimonial) => (
            //     <div key={testimonial._id} className="p-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            //       {editingId === testimonial._id ? (
            //         <div className="space-y-3 flex-1">
            //           <input className="input-field" value={editValues.name || ''} onChange={(e) => setEditValues((s) => ({ ...s, name: e.target.value }))} />
            //           <div className="grid grid-cols-2 gap-3">
            //             <input className="input-field" placeholder="Designation" value={editValues.designation || ''} onChange={(e) => setEditValues((s) => ({ ...s, designation: e.target.value }))} />
            //             <input className="input-field" placeholder="Company" value={editValues.company || ''} onChange={(e) => setEditValues((s) => ({ ...s, company: e.target.value }))} />
            //           </div>
            //           <textarea className="input-field resize-none" rows={4} value={editValues.content || ''} onChange={(e) => setEditValues((s) => ({ ...s, content: e.target.value }))} />
            //           <div className="flex items-center gap-3">
            //             <label className="text-sm">Rating</label>
            //             <select value={editValues.rating || 5} onChange={(e) => setEditValues((s) => ({ ...s, rating: Number(e.target.value) }))} className="input-field w-28">
            //               {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r}</option>)}
            //             </select>
            //             <label className="ml-4 text-sm inline-flex items-center gap-2"> <input type="checkbox" checked={Boolean(editValues.isFeatured)} onChange={(e) => setEditValues((s) => ({ ...s, isFeatured: e.target.checked }))} /> Featured</label>
            //             <label className="ml-4 text-sm inline-flex items-center gap-2"> <input type="checkbox" checked={Boolean(editValues.isApproved)} onChange={(e) => setEditValues((s) => ({ ...s, isApproved: e.target.checked }))} /> Approved</label>
            //           </div>
            //         </div>
            //       ) : (
            //         <div className="space-y-2 flex-1">
            //           <div className="flex items-center gap-2 flex-wrap">
            //             <h3 className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</h3>
            //             <Badge variant={testimonial.isApproved ? 'success' : 'warning'}>
            //               {testimonial.isApproved ? 'Approved' : 'Pending'}
            //             </Badge>
            //             <Badge>{'★'.repeat(testimonial.rating || 0)}</Badge>
            //           </div>
            //           <p className="text-sm text-slate-500">
            //             {[testimonial.designation, testimonial.company, testimonial.service?.name].filter(Boolean).join(' • ') || 'No service mapped'}
            //           </p>
            //           <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">{testimonial.content}</p>
            //         </div>
            //       )}
            //       <div className="flex flex-col gap-2">
            //         {editingId === testimonial._id ? (
            //           <>
            //             <Button size="sm" onClick={() => updateMutation.mutate({ id: testimonial._id, data: editValues })} isLoading={updateMutation.isPending}>Save</Button>
            //             <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
            //           </>
            //         ) : (
            //           <>
            //             <div className="flex flex-col gap-2">
            //               <div className="flex gap-2">
            //                 {!testimonial.isApproved && (
            //                   <Button size="sm" onClick={() => approveMutation.mutate(testimonial._id)} isLoading={approveMutation.isPending}>
            //                     Approve
            //                   </Button>
            //                 )}
            //                 {testimonial.isApproved && (
            //                   <Button
            //                     size="sm"
            //                     variant="outline"
            //                     onClick={() => updateMutation.mutate({ id: testimonial._id, data: { isApproved: false } })}
            //                     isLoading={updateMutation.isPending}
            //                   >
            //                     Mark Pending
            //                   </Button>
            //                 )}
            //                 <Button size="sm" variant="ghost" onClick={() => { setEditingId(testimonial._id); setEditValues({ name: testimonial.name, designation: testimonial.designation, company: testimonial.company, content: testimonial.content, rating: testimonial.rating, isFeatured: testimonial.isFeatured, isApproved: testimonial.isApproved }); }}>Edit</Button>
            //               </div>
            //               <div>
            //                 <Button size="sm" variant="danger" onClick={() => setTestimonialToDelete(testimonial)} isLoading={deleteMutation.isPending}>Delete</Button>
            //               </div>
            //             </div>
            //           </>
            //         )}
            //       </div>
            //     </div>
            //   ))}
            // </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 p-5">
  {testimonials.map((testimonial) => (
    <div
      key={testimonial._id}
      className="
        group
        relative
        rounded-3xl
        border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-900
        shadow-sm hover:shadow-xl
        transition-all duration-300
        overflow-hidden
      "
    >
      {/* Top Gradient */}
      <div className="h-1.5 bg-gradient-to-r from-primary-500 via-amber-500 to-orange-500" />

      <div className="p-5 flex flex-col h-full">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="
              w-12 h-12 rounded-2xl
              bg-gradient-to-br from-primary-500 to-orange-500
              flex items-center justify-center
              text-white font-bold text-lg
              flex-shrink-0
            ">
              {testimonial?.name?.charAt(0)?.toUpperCase()}
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white truncate">
                {testimonial.name}
              </h3>

              <p className="text-sm text-slate-500 truncate">
                {[testimonial.designation, testimonial.company]
                  .filter(Boolean)
                  .join(' • ')}
              </p>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant={testimonial.isApproved ? 'success' : 'warning'}>
                  {testimonial.isApproved ? 'Approved' : 'Pending'}
                </Badge>

                <Badge>
                  {'★'.repeat(testimonial.rating || 0)}
                </Badge>

                {testimonial.isFeatured && (
                  <Badge variant="info">Featured</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {editingId === testimonial._id ? (
          <div className="space-y-4 flex-1">
            <input
              className="input-field"
              value={editValues.name || ''}
              placeholder="Name"
              onChange={(e) =>
                setEditValues((s) => ({
                  ...s,
                  name: e.target.value,
                }))
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="input-field"
                placeholder="Designation"
                value={editValues.designation || ''}
                onChange={(e) =>
                  setEditValues((s) => ({
                    ...s,
                    designation: e.target.value,
                  }))
                }
              />

              <input
                className="input-field"
                placeholder="Company"
                value={editValues.company || ''}
                onChange={(e) =>
                  setEditValues((s) => ({
                    ...s,
                    company: e.target.value,
                  }))
                }
              />
            </div>

            <textarea
              className="input-field resize-none"
              rows={5}
              placeholder="Testimonial content"
              value={editValues.content || ''}
              onChange={(e) =>
                setEditValues((s) => ({
                  ...s,
                  content: e.target.value,
                }))
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={editValues.rating || 5}
                onChange={(e) =>
                  setEditValues((s) => ({
                    ...s,
                    rating: Number(e.target.value),
                  }))
                }
                className="input-field"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(editValues.isFeatured)}
                  onChange={(e) =>
                    setEditValues((s) => ({
                      ...s,
                      isFeatured: e.target.checked,
                    }))
                  }
                />
                Featured
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(editValues.isApproved)}
                  onChange={(e) =>
                    setEditValues((s) => ({
                      ...s,
                      isApproved: e.target.checked,
                    }))
                  }
                />
                Approved
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                size="sm"
                onClick={() =>
                  updateMutation.mutate({
                    id: testimonial._id,
                    data: editValues,
                  })
                }
                isLoading={updateMutation.isPending}
              >
                Save Changes
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                {testimonial.content}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-5 mt-5 border-t border-slate-100 dark:border-slate-700">
              {!testimonial.isApproved ? (
                <Button
                  size="sm"
                  onClick={() =>
                    approveMutation.mutate(testimonial._id)
                  }
                  isLoading={approveMutation.isPending}
                >
                  Approve
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateMutation.mutate({
                      id: testimonial._id,
                      data: { isApproved: false },
                    })
                  }
                  isLoading={updateMutation.isPending}
                >
                  Mark Pending
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditingId(testimonial._id)
                  setEditValues({
                    name: testimonial.name,
                    designation: testimonial.designation,
                    company: testimonial.company,
                    content: testimonial.content,
                    rating: testimonial.rating,
                    isFeatured: testimonial.isFeatured,
                    isApproved: testimonial.isApproved,
                  })
                }}
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() =>
                  setTestimonialToDelete(testimonial)
                }
                isLoading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  ))}
</div>
          )}
        </div>

        {pagination && (
          <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!testimonialToDelete}
        onClose={() => setTestimonialToDelete(null)}
        onConfirm={() => {
          if (!testimonialToDelete) return
          deleteMutation.mutate(testimonialToDelete._id)
        }}
        title="Delete Testimonial"
        message={testimonialToDelete ? `Are you sure you want to delete the testimonial from "${testimonialToDelete.name}"? This action cannot be undone.` : ''}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
