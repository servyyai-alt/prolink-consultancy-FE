import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiPencil, HiPlus, HiSearch, HiTrash } from 'react-icons/hi'
import { adminAPI, serviceAPI } from '../../services/api'
import { Badge, Button, EmptyState, Input, Modal, Pagination, Select, Textarea } from '../../components/ui/index'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import toast from 'react-hot-toast'

const createFeature = () => ({ title: '', description: '' })
const createProcess = (step = 1) => ({ step, title: '', description: '' })
const createPricing = () => ({ plan: '', price: '', period: '', featuresText: '', isPopular: false, isActive: true })
const createFaq = () => ({ question: '', answer: '' })

const emptyForm = {
  name: '',
  category: '',
  shortDescription: '',
  description: '',
  icon: '',
  order: 0,
  isActive: true,
  metaTitle: '',
  metaDescription: '',
  features: [createFeature()],
  process: [createProcess(1)],
  pricing: [createPricing()],
  faqs: [createFaq()],
}

export default function AdminServices() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [serviceToDelete, setServiceToDelete] = useState(null)
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
        metaTitle: payload.metaTitle,
        metaDescription: payload.metaDescription,
        features: payload.features
          .filter((item) => item.title.trim() || item.description.trim())
          .map((item) => ({ title: item.title.trim(), description: item.description.trim() })),
        process: payload.process
          .filter((item) => item.title.trim() || item.description.trim())
          .map((item, index) => ({
            step: index + 1,
            title: item.title.trim(),
            description: item.description.trim(),
          })),
        pricing: payload.pricing
          .filter((item) => item.plan.trim())
          .map((item) => ({
            plan: item.plan.trim(),
            price: Number(item.price) || 0,
            period: item.period.trim(),
            features: item.featuresText.split('\n').map((feature) => feature.trim()).filter(Boolean),
            isPopular: item.isPopular,
            isActive: item.isActive,
          })),
        faqs: payload.faqs
          .filter((item) => item.question.trim() || item.answer.trim())
          .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() })),
      }
      return editing ? serviceAPI.update(editing._id, body) : serviceAPI.create(body)
    },
    onSuccess: () => {
      toast.success(editing ? 'Service updated' : 'Service created')
      qc.invalidateQueries({ queryKey: ['admin-services'] })
      qc.invalidateQueries({ queryKey: ['services'] })
      qc.invalidateQueries({ queryKey: ['service'] })
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
      metaTitle: service.metaTitle || '',
      metaDescription: service.metaDescription || '',
      features: service.features?.length
        ? service.features.map((item) => ({ title: item.title || '', description: item.description || '' }))
        : [createFeature()],
      process: service.process?.length
        ? service.process.map((item, index) => ({ step: item.step || index + 1, title: item.title || '', description: item.description || '' }))
        : [createProcess(1)],
      pricing: service.pricing?.length
        ? service.pricing.map((item) => ({
            plan: item.plan || '',
            price: item.price || '',
            period: item.period || '',
            featuresText: item.features?.join('\n') || '',
            isPopular: item.isPopular ?? false,
            isActive: item.isActive ?? true,
          }))
        : [createPricing()],
      faqs: service.faqs?.length
        ? service.faqs.map((item) => ({ question: item.question || '', answer: item.answer || '' }))
        : [createFaq()],
    })
    setIsOpen(true)
  }

  const submit = (e) => {
    e.preventDefault()
    saveMutation.mutate(form)
  }

  const updateListItem = (key, index, field, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    }))
  }

  const addListItem = (key, factory) => {
    setForm((prev) => ({
      ...prev,
      [key]: [...prev[key], factory(prev[key].length + 1)],
    }))
  }

  const removeListItem = (key, index, fallbackFactory) => {
    setForm((prev) => {
      const nextItems = prev[key].filter((_, itemIndex) => itemIndex !== index)
      return {
        ...prev,
        [key]: nextItems.length ? nextItems.map((item, itemIndex) => (
          key === 'process' ? { ...item, step: itemIndex + 1 } : item
        )) : [fallbackFactory(1)],
      }
    })
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
                    <Button variant="danger" size="sm" onClick={() => setServiceToDelete(service)}>
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Service' : 'Create Service'} size="xl">
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
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Meta Title" value={form.metaTitle} onChange={(e) => setForm((prev) => ({ ...prev, metaTitle: e.target.value }))} />
            <Input label="Meta Description" value={form.metaDescription} onChange={(e) => setForm((prev) => ({ ...prev, metaDescription: e.target.value }))} />
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
          <div className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Key Features</h4>
                <p className="text-xs text-slate-500">Show service highlights on the detail page.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addListItem('features', createFeature)}>
                <HiPlus className="w-4 h-4" />
                Add Feature
              </Button>
            </div>
            {form.features.map((feature, index) => (
              <div key={`feature-${index}`} className="grid gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/40 md:grid-cols-[1fr_1.4fr_auto]">
                <Input label="Title" value={feature.title} onChange={(e) => updateListItem('features', index, 'title', e.target.value)} />
                <Input label="Description" value={feature.description} onChange={(e) => updateListItem('features', index, 'description', e.target.value)} />
                <div className="flex items-end">
                  <Button type="button" variant="danger" size="sm" className="w-full" onClick={() => removeListItem('features', index, createFeature)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Process Steps</h4>
                <p className="text-xs text-slate-500">Explain how the service works from start to finish.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addListItem('process', createProcess)}>
                <HiPlus className="w-4 h-4" />
                Add Step
              </Button>
            </div>
            {form.process.map((step, index) => (
              <div key={`process-${index}`} className="grid gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/40 md:grid-cols-[120px_1fr_1.4fr_auto]">
                <Input label="Step" value={step.step} disabled />
                <Input label="Title" value={step.title} onChange={(e) => updateListItem('process', index, 'title', e.target.value)} />
                <Input label="Description" value={step.description} onChange={(e) => updateListItem('process', index, 'description', e.target.value)} />
                <div className="flex items-end">
                  <Button type="button" variant="danger" size="sm" className="w-full" onClick={() => removeListItem('process', index, createProcess)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Pricing Plans</h4>
                <p className="text-xs text-slate-500">Enter one plan per card. Use a new line for each plan feature.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addListItem('pricing', createPricing)}>
                <HiPlus className="w-4 h-4" />
                Add Plan
              </Button>
            </div>
            {form.pricing.map((plan, index) => (
              <div key={`pricing-${index}`} className="space-y-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/40">
                <div className="grid gap-3 md:grid-cols-3">
                  <Input label="Plan Name" value={plan.plan} onChange={(e) => updateListItem('pricing', index, 'plan', e.target.value)} />
                  <Input label="Price" type="number" value={plan.price} onChange={(e) => updateListItem('pricing', index, 'price', e.target.value)} />
                  <Input label="Period" value={plan.period} onChange={(e) => updateListItem('pricing', index, 'period', e.target.value)} placeholder="Per check / Per month / One time" />
                </div>
                <Textarea label="Plan Features" rows={4} value={plan.featuresText} onChange={(e) => updateListItem('pricing', index, 'featuresText', e.target.value)} placeholder={'Feature one\nFeature two\nFeature three'} />
                <div className="grid gap-3 md:grid-cols-3">
                  <Select
                    label="Popular Plan"
                    value={String(plan.isPopular)}
                    onChange={(e) => updateListItem('pricing', index, 'isPopular', e.target.value === 'true')}
                    options={[
                      { value: 'false', label: 'No' },
                      { value: 'true', label: 'Yes' },
                    ]}
                  />
                  <Select
                    label="Plan Status"
                    value={String(plan.isActive)}
                    onChange={(e) => updateListItem('pricing', index, 'isActive', e.target.value === 'true')}
                    options={[
                      { value: 'true', label: 'Active' },
                      { value: 'false', label: 'Inactive' },
                    ]}
                  />
                  <div className="flex items-end">
                    <Button type="button" variant="danger" size="sm" className="w-full" onClick={() => removeListItem('pricing', index, createPricing)}>Remove</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">FAQs</h4>
                <p className="text-xs text-slate-500">Answer the common questions visitors ask before they enquire.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addListItem('faqs', createFaq)}>
                <HiPlus className="w-4 h-4" />
                Add FAQ
              </Button>
            </div>
            {form.faqs.map((faq, index) => (
              <div key={`faq-${index}`} className="grid gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/40 md:grid-cols-[1fr_1.4fr_auto]">
                <Input label="Question" value={faq.question} onChange={(e) => updateListItem('faqs', index, 'question', e.target.value)} />
                <Input label="Answer" value={faq.answer} onChange={(e) => updateListItem('faqs', index, 'answer', e.target.value)} />
                <div className="flex items-end">
                  <Button type="button" variant="danger" size="sm" className="w-full" onClick={() => removeListItem('faqs', index, createFaq)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={saveMutation.isPending}>{editing ? 'Update Service' : 'Create Service'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={() => {
          if (!serviceToDelete) return
          deleteMutation.mutate(serviceToDelete._id, {
            onSuccess: () => setServiceToDelete(null),
          })
        }}
        title="Delete Service"
        message={serviceToDelete ? `Are you sure you want to delete "${serviceToDelete.name}"? This action cannot be undone.` : ''}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
