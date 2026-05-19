import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiChatAlt2 } from 'react-icons/hi'
import { adminAPI } from '../../services/api'
import { Badge, Button, EmptyState, Pagination } from '../../components/ui/index'
import toast from 'react-hot-toast'

export default function AdminTestimonials() {
  const [page, setPage] = useState(1)
  const [approval, setApproval] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials', { page, approval }],
    queryFn: () => adminAPI.getTestimonials({ page, limit: 12, approval: approval || undefined }),
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
    onError: () => toast.error('Could not approve testimonial'),
  })

  return (
    <>
      <Helmet><title>Testimonials | Admin | ProLink</title></Helmet>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Testimonials</h1>
          <p className="text-sm text-slate-500">{pagination?.total || 0} testimonials in queue</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
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
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="p-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</h3>
                      <Badge variant={testimonial.isApproved ? 'success' : 'warning'}>
                        {testimonial.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                      <Badge>{'★'.repeat(testimonial.rating || 0)}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">
                      {[testimonial.designation, testimonial.company, testimonial.service?.name].filter(Boolean).join(' • ') || 'No service mapped'}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">{testimonial.content}</p>
                  </div>
                  {!testimonial.isApproved && (
                    <Button size="sm" onClick={() => approveMutation.mutate(testimonial._id)} isLoading={approveMutation.isPending}>
                      Approve
                    </Button>
                  )}
                </div>
              ))}
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
