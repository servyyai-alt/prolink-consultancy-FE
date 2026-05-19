import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiCreditCard } from 'react-icons/hi'
import { adminAPI } from '../../services/api'
import { Badge, EmptyState, Pagination } from '../../components/ui/index'

const STATUS_VARIANTS = { pending: 'warning', completed: 'success', failed: 'danger', refunded: 'gray' }

export default function AdminPayments() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', { page, status, type }],
    queryFn: () => adminAPI.getPayments({ page, limit: 15, status: status || undefined, type: type || undefined }),
    keepPreviousData: true,
  })

  const payments = data?.data?.data || []
  const pagination = data?.data?.pagination

  return (
    <>
      <Helmet><title>Payments | Admin | ProLink</title></Helmet>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Payments</h1>
          <p className="text-sm text-slate-500">{pagination?.total || 0} transactions logged</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 border-none outline-none font-medium"
          >
            <option value="">All statuses</option>
            {Object.keys(STATUS_VARIANTS).map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1) }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 border-none outline-none font-medium"
          >
            <option value="">All payment types</option>
            {['cv_writing', 'subscription', 'event_booking', 'catering', 'campus_drive'].map((value) => (
              <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <EmptyState icon={HiCreditCard} title="No payments found" description="No transactions match the selected filters." />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {payments.map((payment) => (
                <div key={payment._id} className="p-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{payment.description || payment.type.replaceAll('_', ' ')}</h3>
                      <Badge variant={STATUS_VARIANTS[payment.status] || 'gray'}>{payment.status}</Badge>
                      <Badge>{payment.gateway}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">
                      {payment.user?.firstName} {payment.user?.lastName} - {payment.user?.email}
                    </p>
                    <p className="text-xs text-slate-500">
                      Order: {payment.orderId} {payment.paymentId ? `- Payment: ${payment.paymentId}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">Rs {Number(payment.amount || 0).toLocaleString('en-IN')}</p>
                    <p className="text-sm text-slate-500">{payment.currency}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
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
    </>
  )
}
