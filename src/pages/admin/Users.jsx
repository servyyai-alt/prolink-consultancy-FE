import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiLockClosed, HiLockOpen, HiPlus, HiSearch, HiTrash, HiUserAdd, HiCheck } from 'react-icons/hi'
import { adminAPI } from '../../services/api'
import { Badge, Button, EmptyState, Input, Modal, Pagination, Select, Textarea } from '../../components/ui/index'
import { requiredIndianMobileSchema, sanitizeIndianMobileInput } from '../../utils/phoneValidation'
import { selectUser } from '../../redux/slices/authSlice'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import toast from 'react-hot-toast'

const ROLE_COLORS = {
  super_admin: 'danger',
  admin: 'primary',
  recruiter: 'purple',
  employer: 'warning',
  job_seeker: 'success',
}

const ROLE_OPTIONS = [
  { value: 'job_seeker', label: 'Job Seeker' },
  { value: 'employer', label: 'Employer' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'admin', label: 'Admin' },
]

const initialUserValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'job_seeker',
  password: '',
  companyName: '',
  companyWebsite: '',
  companyDescription: '',
  companyLocation: '',
}

const userSchema = Yup.object({
  firstName: Yup.string().trim().min(2, 'First name must be at least 2 characters').max(50, 'Maximum 50 characters').required('First name is required'),
  lastName: Yup.string().trim().min(2, 'Last name must be at least 2 characters').max(50, 'Maximum 50 characters').required('Last name is required'),
  email: Yup.string().trim().email('Enter a valid email address').required('Email is required'),
  phone: requiredIndianMobileSchema('Mobile number is required'),
  role: Yup.string().oneOf(ROLE_OPTIONS.map((option) => option.value), 'Select a valid role').required('Role is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Include at least one uppercase letter')
    .matches(/[a-z]/, 'Include at least one lowercase letter')
    .matches(/\d/, 'Include at least one number')
    .required('Password is required'),
  companyName: Yup.string().when('role', {
    is: 'employer',
    then: (schema) => schema.trim().min(2, 'Company name must be at least 2 characters').required('Company name is required'),
    otherwise: (schema) => schema.strip(),
  }),
  companyWebsite: Yup.string().when('role', {
    is: 'employer',
    then: (schema) => schema.trim().url('Enter a valid website URL').nullable(),
    otherwise: (schema) => schema.strip(),
  }),
  companyDescription: Yup.string().when('role', {
    is: 'employer',
    then: (schema) => schema.trim().min(20, 'Company description must be at least 20 characters').required('Company description is required'),
    otherwise: (schema) => schema.strip(),
  }),
  companyLocation: Yup.string().when('role', {
    is: 'employer',
    then: (schema) => schema.trim().min(2, 'Company location must be at least 2 characters').nullable(),
    otherwise: (schema) => schema.strip(),
  }),
})

function UserFormField({ label, required = false, error, children, helperText }) {
  return (
    <div>
      {children}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
    </div>
  )
}

export default function AdminUsers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const currentUser = useSelector(selectUser)
  const qc = useQueryClient()

  const queryParams = useMemo(() => ({ page, limit: 20, search, role }), [page, search, role])

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', queryParams],
    queryFn: () => adminAPI.getUsers(queryParams),
    keepPreviousData: true,
  })

  const users = data?.data?.data || []
  const pagination = data?.data?.pagination

  const createFormik = useFormik({
    initialValues: initialUserValues,
    validationSchema: userSchema,
    onSubmit: async (values, helpers) => {
      const payload = {
        ...values,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phone: sanitizeIndianMobileInput(values.phone),
        companyName: values.companyName?.trim(),
        companyWebsite: values.companyWebsite?.trim(),
        companyDescription: values.companyDescription?.trim(),
        companyLocation: values.companyLocation?.trim(),
      }

      createUserMutation.mutate(payload, {
        onSuccess: () => {
          helpers.resetForm()
          setIsCreateOpen(false)
        },
      })
    },
  })

  const createUserMutation = useMutation({
    mutationFn: (payload) => adminAPI.createUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User created successfully')
    },
    onError: (error) => {
      const fieldErrors = error?.response?.data?.errors
      if (fieldErrors && typeof fieldErrors === 'object') {
        createFormik.setErrors(fieldErrors)
      }
      toast.error(error?.response?.data?.message || 'Failed to create user')
    },
  })

  const blockMutation = useMutation({
    mutationFn: (id) => adminAPI.toggleBlock(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User status updated')
    },
    onError: () => toast.error('Failed to update user'),
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, approve }) => adminAPI.approveUser(id, { approve }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User approval updated')
    },
    onError: () => toast.error('Failed to update approval'),
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role: nextRole }) => adminAPI.changeRole(id, { role: nextRole }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Role updated')
    },
    onError: () => toast.error('Failed to update role'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User deleted successfully')
    },
    onError: (error) => toast.error(error?.response?.data?.message || 'Failed to delete user'),
  })

  return (
    <>
      <Helmet><title>Users | Admin | ProLink</title></Helmet>

      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Users</h1>
            <p className="text-sm text-slate-500">{pagination?.total || 0} total users</p>
          </div>

          <Button type="button" onClick={() => setIsCreateOpen(true)} className="sm:w-auto">
            <HiPlus className="h-4 w-4" />
            Add New User
          </Button>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 dark:bg-slate-700">
              <HiSearch className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search by name or email"
                className="flex-1 bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>

            <select
              value={role}
              onChange={(event) => {
                setRole(event.target.value)
                setPage(1)
              }}
              className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none dark:bg-slate-700 dark:text-slate-200"
            >
              <option value="">All Roles</option>
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Joined</th>
                  <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {isLoading ? (
                  [...Array(8)].map((_, index) => (
                    <tr key={index}>
                      {[...Array(5)].map((__, cellIndex) => (
                        <td key={cellIndex} className="px-5 py-4">
                          <div className="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  users.map((user) => (
                    (() => {
                      const isCurrentUser = currentUser?._id === user._id
                      const isSuperAdmin = user.role === 'super_admin'
                      const disableDelete = isCurrentUser || isSuperAdmin || deleteMutation.isPending

                      return (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar?.url ? (
                            <img src={user.avatar.url} alt="" className="h-9 w-9 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600">
                              <span className="text-xs font-bold text-white">{user.firstName?.[0]}{user.lastName?.[0]}</span>
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                            {user.phone && <p className="text-xs text-slate-400">{user.phone}</p>}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={user.role}
                          onChange={(event) => roleMutation.mutate({ id: user._id, role: event.target.value })}
                          className="rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 text-xs capitalize text-slate-700 dark:border-slate-600 dark:text-slate-200"
                        >
                          {ROLE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <Badge variant={user.isBlocked ? 'danger' : user.isActive ? 'success' : 'gray'}>
                            {user.isBlocked ? 'Blocked' : user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant={ROLE_COLORS[user.role] || 'gray'} className="w-fit">
                            {user.role.replace('_', ' ')}
                          </Badge>
                          {/* {!user.isVerified && <Badge variant="warning">Unverified</Badge>} */}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => blockMutation.mutate(user._id)}
                            disabled={blockMutation.isPending}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                              user.isBlocked
                                ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                            }`}
                          >
                            {user.isBlocked ? (
                              <>
                                <HiLockOpen className="h-3.5 w-3.5" /> Unblock
                              </>
                            ) : (
                              <>
                                <HiLockClosed className="h-3.5 w-3.5" /> Block
                              </>
                            )}
                          </button>
                          {user.role === 'employer' && (
                            <button
                              type="button"
                              onClick={() => approveMutation.mutate({ id: user._id, approve: !user.isApproved })}
                              disabled={approveMutation.isPending}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                user.isApproved
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                                  : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                              }`}
                            >
                              <HiCheck className="h-3.5 w-3.5" /> {user.isApproved ? 'Unapprove' : 'Approve'}
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={disableDelete}
                            onClick={() => {
                              setUserToDelete(user)
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400"
                            title={isCurrentUser ? 'You cannot delete your own account' : isSuperAdmin ? 'Super admin cannot be deleted' : 'Delete user'}
                          >
                            <HiTrash className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                      )
                    })()
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && users.length === 0 && (
            <EmptyState
              icon={HiUserAdd}
              title="No users found"
              description="Try a different search term or create a new user account from here."
              action={<Button type="button" onClick={() => setIsCreateOpen(true)}>Create User</Button>}
            />
          )}
        </div>

        {pagination && (
          <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        )}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
          createFormik.resetForm()
        }}
        title="Create New User"
        size="lg"
      >
        <form onSubmit={createFormik.handleSubmit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              required
              value={createFormik.values.firstName}
              onChange={createFormik.handleChange}
              onBlur={createFormik.handleBlur}
              name="firstName"
              placeholder="e.g. Priya"
              error={createFormik.touched.firstName && createFormik.errors.firstName}
            />

            <Input
              label="Last Name"
              required
              value={createFormik.values.lastName}
              onChange={createFormik.handleChange}
              onBlur={createFormik.handleBlur}
              name="lastName"
              placeholder="e.g. Nair"
              error={createFormik.touched.lastName && createFormik.errors.lastName}
            />

            <Input
              label="Email"
              required
              type="email"
              value={createFormik.values.email}
              onChange={createFormik.handleChange}
              onBlur={createFormik.handleBlur}
              name="email"
              placeholder="name@example.com"
              error={createFormik.touched.email && createFormik.errors.email}
            />

            <Input
              label="Mobile Number"
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={createFormik.values.phone}
              onChange={(event) => createFormik.setFieldValue('phone', sanitizeIndianMobileInput(event.target.value))}
              onBlur={createFormik.handleBlur}
              name="phone"
              placeholder="9876543210"
              error={createFormik.touched.phone && createFormik.errors.phone}
            />

            <Select
              label="Role"
              required
              name="role"
              value={createFormik.values.role}
              onChange={createFormik.handleChange}
              onBlur={createFormik.handleBlur}
              options={ROLE_OPTIONS}
              error={createFormik.touched.role && createFormik.errors.role}
            />

            <Input
              label="Temporary Password"
              required
              type="password"
              value={createFormik.values.password}
              onChange={createFormik.handleChange}
              onBlur={createFormik.handleBlur}
              name="password"
              placeholder="At least 8 characters"
              error={createFormik.touched.password && createFormik.errors.password}
              helperText="Use uppercase, lowercase, and a number."
            />
          </div>

          {createFormik.values.role === 'employer' && (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Employer Details</h3>
                <p className="text-sm text-slate-500">These details help the employer post jobs immediately after account creation.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Company Name"
                  required
                  name="companyName"
                  value={createFormik.values.companyName}
                  onChange={createFormik.handleChange}
                  onBlur={createFormik.handleBlur}
                  placeholder="e.g. ProLink Industries"
                  error={createFormik.touched.companyName && createFormik.errors.companyName}
                />

                <Input
                  label="Company Website"
                  name="companyWebsite"
                  value={createFormik.values.companyWebsite}
                  onChange={createFormik.handleChange}
                  onBlur={createFormik.handleBlur}
                  placeholder="https://example.com"
                  error={createFormik.touched.companyWebsite && createFormik.errors.companyWebsite}
                />

                <Input
                  label="Company Location"
                  name="companyLocation"
                  value={createFormik.values.companyLocation}
                  onChange={createFormik.handleChange}
                  onBlur={createFormik.handleBlur}
                  placeholder="Chennai"
                  error={createFormik.touched.companyLocation && createFormik.errors.companyLocation}
                />
              </div>

              <Textarea
                label="Company Description"
                required
                name="companyDescription"
                value={createFormik.values.companyDescription}
                onChange={createFormik.handleChange}
                onBlur={createFormik.handleBlur}
                rows={4}
                placeholder="Briefly describe what the company does, its industry, and hiring context."
                error={createFormik.touched.companyDescription && createFormik.errors.companyDescription}
              />
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false)
                createFormik.resetForm()
              }}
            >
              Cancel
            </Button>

            <Button type="submit" isLoading={createUserMutation.isPending}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (!userToDelete) return
          deleteMutation.mutate(userToDelete._id, {
            onSuccess: () => setUserToDelete(null),
          })
        }}
        title="Delete User"
        message={userToDelete ? `Delete ${userToDelete.firstName} ${userToDelete.lastName}? This will also remove related applications, blogs, testimonials, notifications, and close posted jobs.` : ''}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
