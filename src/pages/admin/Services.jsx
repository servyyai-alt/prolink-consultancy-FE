import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiPencil, HiPlus, HiSearch, HiTrash } from 'react-icons/hi'
import { adminAPI, serviceAPI } from '../../services/api'
import { Badge, Button, EmptyState, Input, Modal, Pagination, Select, Textarea } from '../../components/ui/index'
import toast from 'react-hot-toast'

const emptyForm = { name: '', category: '', shortDescription: '', description: '', icon: '', order: 0, isActive: true }

export default function AdminServices() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services', { page, search, activeFilter }],
    queryFn: () => adminAPI.getServices({ page, limit: 12, search: search || undefined, isActive: activeFilter }),
    keepPreviousData: true,
  })

  const services = data?.data?.data || []
  const pagination = data?.data?.pagination

  const saveMutation = useMutation({
    mutationFn: (payload) => {
      const body = {
        name: payload.name,
        category: payload.category,
        shortDescription: payload.shortDescription,
        description: payload.description,
        icon: payload.icon,
        order: Number(payload.order) || 0,
        isActive: payload.isActive,
      }
      return editing ? serviceAPI.update(editing._id, body) : serviceAPI.create(body)
    },
    onSuccess: () => {
      toast.success(editing ? 'Service updated' : 'Service created')
      qc.invalidateQueries({ queryKey: ['admin-services'] })
      setIsOpen(false)
      setEditing(null)
      setForm(emptyForm)
    },
    onError: () => toast.error('Could not save service'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => serviceAPI.delete(id),
    onSuccess: () => {
      toast.success('Service deleted')
      qc.invalidateQueries({ queryKey: ['admin-services'] })
    },
    onError: () => toast.error('Could not delete service'),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setIsOpen(true)
  }

  const openEdit = (service) => {
    setEditing(service)
    setForm({
      name: service.name || '',
      category: service.category || '',
      shortDescription: service.shortDescription || '',
      description: service.description || '',
      icon: service.icon || '',
      order: service.order || 0,
      isActive: service.isActive ?? true,
    })
    setIsOpen(true)
  }

  const submit = (e) => {
    e.preventDefault()
    saveMutation.mutate(form)
  }

  return (
    <>
      <Helmet><title>Services | Admin | ProLink</title></Helmet>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Services</h1>
            <p className="text-sm text-slate-500">{pagination?.total || 0} service entries</p>
          </div>
          <Button size="sm" onClick={openCreate}>
            <HiPlus className="w-4 h-4" />
            New Service
          </Button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-xl px-3">
            <HiSearch className="w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search services"
              className="flex-1 bg-transparent py-2.5 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <select
            value={activeFilter}
            onChange={(e) => { setActiveFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 border-none outline-none font-medium"
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <EmptyState title="No services found" description="Create a new service or change the current filters." />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {services.map((service) => (
                <div key={service._id} className="p-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{service.name}</h3>
                      <Badge variant={service.isActive ? 'success' : 'gray'}>{service.isActive ? 'Active' : 'Inactive'}</Badge>
                      {service.category && <Badge>{service.category}</Badge>}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{service.shortDescription || service.description}</p>
                    <p className="text-xs text-slate-500">Slug: {service.slug || 'Generated on save'} - Order: {service.order || 0}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(service)}>
                      <HiPencil className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => window.confirm(`Delete ${service.name}?`) && deleteMutation.mutate(service._id)}>
                      <HiTrash className="w-4 h-4" />
                      Delete
                    </Button>
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Service' : 'Create Service'}>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <Input label="Category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} />
          </div>
          <Input label="Short Description" value={form.shortDescription} onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))} />
          <Textarea label="Description" rows={6} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Icon" value={form.icon} onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))} helperText="Emoji or icon string" />
            <Input label="Order" type="number" value={form.order} onChange={(e) => setForm((prev) => ({ ...prev, order: e.target.value }))} />
          </div>
          <Select
            label="Status"
            value={String(form.isActive)}
            onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.value === 'true' }))}
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
          />
          <div className="flex justify-end">
            <Button type="submit" isLoading={saveMutation.isPending}>{editing ? 'Update Service' : 'Create Service'}</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
