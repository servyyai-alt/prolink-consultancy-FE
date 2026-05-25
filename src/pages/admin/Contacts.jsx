// import { useState } from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { Helmet } from 'react-helmet-async'
// import { HiMail } from 'react-icons/hi'
// import { adminAPI } from '../../services/api'
// import { Badge, EmptyState, Pagination } from '../../components/ui/index'

// const STATUS_VARIANTS = { new: 'primary', read: 'warning', replied: 'success', closed: 'gray' }

// export default function AdminContacts() {
//   const [page, setPage] = useState(1)
//   const [status, setStatus] = useState('')

//   const { data, isLoading } = useQuery({
//     queryKey: ['admin-contacts', { page, status }],
//     queryFn: () => adminAPI.getContacts({ page, limit: 15, status: status || undefined }),
//     keepPreviousData: true,
//   })

//   const contacts = data?.data?.data || []
//   const pagination = data?.data?.pagination

//   return (
//     <>
//       <Helmet><title>Contacts | Admin | ProLink</title></Helmet>
//       <div className="space-y-5">
//         <div>
//           <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Contacts</h1>
//           <p className="text-sm text-slate-500">{pagination?.total || 0} inquiries received</p>
//         </div>

//         <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
//           <select
//             value={status}
//             onChange={(e) => { setStatus(e.target.value); setPage(1) }}
//             className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 border-none outline-none font-medium"
//           >
//             <option value="">All statuses</option>
//             {Object.keys(STATUS_VARIANTS).map((value) => (
//               <option key={value} value={value}>{value}</option>
//             ))}
//           </select>
//         </div>

//         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
//           {isLoading ? (
//             <div className="p-6 space-y-4">
//               {[...Array(6)].map((_, index) => (
//                 <div key={index} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
//               ))}
//             </div>
//           ) : contacts.length === 0 ? (
//             <EmptyState icon={HiMail} title="No contact inquiries found" description="There are no inquiries for the selected status yet." />
//           ) : (
//             <div className="divide-y divide-slate-100 dark:divide-slate-700">
//               {contacts.map((contact) => (
//                 <div key={contact._id} className="p-5 space-y-3">
//                   <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
//                     <div>
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <h3 className="font-semibold text-slate-900 dark:text-white">{contact.subject}</h3>
//                         <Badge variant={STATUS_VARIANTS[contact.status] || 'gray'}>{contact.status}</Badge>
//                         {contact.isSpam && <Badge variant="danger">Spam</Badge>}
//                       </div>
//                       <p className="text-sm text-slate-500 mt-1">
//                         {contact.name} - {contact.email} {contact.phone ? `- ${contact.phone}` : ''}
//                       </p>
//                     </div>
//                     <div className="text-sm text-slate-500">
//                       {new Date(contact.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2 text-xs text-slate-500">
//                     <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700">{contact.service || 'General'}</span>
//                     <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700">{contact.source || 'contact_form'}</span>
//                   </div>

//                   <div className="rounded-xl border border-slate-100 dark:border-slate-700 p-3 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
//                     {contact.message}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {pagination && (
//           <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
//         )}
//       </div>
//     </>
//   )
// }
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import {
  HiMail,
  HiPhone,
  HiCalendar,
  HiUser,
} from 'react-icons/hi'

import { adminAPI } from '../../services/api'
import { Badge, EmptyState, Pagination } from '../../components/ui/index'

const STATUS_VARIANTS = {
  new: 'primary',
  read: 'warning',
  replied: 'success',
  closed: 'gray',
}

export default function AdminContacts() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts', { page, status }],
    queryFn: () =>
      adminAPI.getContacts({
        page,
        limit: 12,
        status: status || undefined,
      }),
    keepPreviousData: true,
  })

  const contacts = data?.data?.data || []
  const pagination = data?.data?.pagination

  return (
    <>
      <Helmet>
        <title>Contacts | Admin | ProLink</title>
      </Helmet>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Contact Inquiries
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {pagination?.total || 0} inquiries received
            </p>
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">All Status</option>

            {Object.keys(STATUS_VARIANTS).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-60 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <EmptyState
              icon={HiMail}
              title="No contact inquiries found"
              description="No inquiries available for the selected filter."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
              >

                {/* Top */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                      <HiUser className="text-xl text-amber-600 dark:text-amber-400" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {contact.subject}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {contact.name}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      STATUS_VARIANTS[contact.status] || 'gray'
                    }
                  >
                    {contact.status}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="mt-5 space-y-3">

                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <HiMail className="text-amber-500 text-lg" />

                    <span className="truncate">
                      {contact.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <HiPhone className="text-emerald-500 text-lg" />

                    <span>
                      {contact.phone || 'Not Provided'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <HiCalendar className="text-slate-400 text-lg" />

                    <span>
                      {new Date(contact.createdAt).toLocaleDateString(
                        'en-IN',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-5">

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {contact.service || 'General'}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {contact.source || 'contact_form'}
                  </span>

                  {contact.isSpam && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                      Spam
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700">
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 whitespace-pre-wrap line-clamp-4">
                    {contact.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  )
}