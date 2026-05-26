import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiPencil, HiPlus, HiSearch, HiTrash, HiUpload } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { adminAPI, teamMemberAPI, uploadAPI } from '../../services/api'
import { Badge, Button, EmptyState, Input, Modal, Pagination, Select, Textarea } from '../../components/ui/index'
import ConfirmDialog from '../../components/common/ConfirmDialog'

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  linkedinUrl: '',
  imageUrl: '',
  order: 0,
  isActive: true,
}

export default function AdminTeamMembers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-team-members', { page, search, activeFilter }],
    queryFn: () => adminAPI.getTeamMembers({ page, limit: 12, search: search || undefined, isActive: activeFilter }),
    keepPreviousData: true,
  })

  const members = data?.data?.data || []
  const pagination = data?.data?.pagination

  const saveMutation = useMutation({
    mutationFn: (payload) => {
      const body = {
        name: payload.name.trim(),
        role: payload.role.trim(),
        bio: payload.bio.trim(),
        linkedinUrl: payload.linkedinUrl.trim(),
        image: { url: payload.imageUrl.trim() },
        order: Number(payload.order) || 0,
        isActive: payload.isActive,
      }

      return editing ? teamMemberAPI.update(editing._id, body) : teamMemberAPI.create(body)
    },
    onSuccess: () => {
      toast.success(editing ? 'Team member updated' : 'Team member created')
      qc.invalidateQueries({ queryKey: ['admin-team-members'] })
      qc.invalidateQueries({ queryKey: ['team-members'] })
      setIsOpen(false)
      setEditing(null)
      setForm(emptyForm)
    },
    onError: () => toast.error('Could not save team member'),
  })

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'prolink/team-members')
      const response = await uploadAPI.uploadImage(formData)
      return response.data?.data
    },
    onSuccess: (uploaded) => {
      setForm((prev) => ({ ...prev, imageUrl: uploaded.url }))
      toast.success('Team member image uploaded')
    },
    onError: () => toast.error('Could not upload image'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => teamMemberAPI.delete(id),
    onSuccess: () => {
      toast.success('Team member deleted')
      qc.invalidateQueries({ queryKey: ['admin-team-members'] })
      qc.invalidateQueries({ queryKey: ['team-members'] })
      setMemberToDelete(null)
    },
    onError: () => toast.error('Could not delete team member'),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setIsOpen(true)
  }

  const openEdit = (member) => {
    setEditing(member)
    setForm({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      linkedinUrl: member.linkedinUrl || '',
      imageUrl: member.image?.url || '',
      order: member.order || 0,
      isActive: member.isActive ?? true,
    })
    setIsOpen(true)
  }

  const submit = (e) => {
    e.preventDefault()
    saveMutation.mutate(form)
  }

  const onImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadMutation.mutate(file)
    e.target.value = ''
  }

  return (
    <>
      <Helmet><title>Team Members | Admin | ProLink</title></Helmet>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Team Members</h1>
            <p className="text-sm text-slate-500">{pagination?.total || 0} team member entries</p>
          </div>
          <Button size="sm" onClick={openCreate}>
            <HiPlus className="w-4 h-4" />
            New Member
          </Button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-xl px-3">
            <HiSearch className="w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search team members"
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
          ) : members.length === 0 ? (
            <EmptyState title="No team members found" description="Create a new team member or change the current filters." />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {members.map((member) => (
                <div key={member._id} className="p-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {member.image?.url ? (
                      <img
                        src={member.image.url}
                        alt={member.name}
                        className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
                        {member.name?.[0] || '?'}
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{member.name}</h3>
                        <Badge variant={member.isActive ? 'success' : 'gray'}>{member.isActive ? 'Active' : 'Inactive'}</Badge>
                      </div>
                      <p className="text-sm font-medium text-primary-600">{member.role}</p>
                      {member.bio && <p className="text-sm text-slate-600 dark:text-slate-300">{member.bio}</p>}
                      <p className="text-xs text-slate-500">
                        Order: {member.order || 0}{member.linkedinUrl ? ` | LinkedIn added` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(member)}>
                      <HiPencil className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setMemberToDelete(member)}>
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Team Member' : 'Create Team Member'}>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <Input label="Role" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))} required />
          </div>
          <Textarea label="Bio" rows={4} value={form.bio} onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="LinkedIn URL" value={form.linkedinUrl} onChange={(e) => setForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <Input
              label="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://..."
              helperText="Paste an image URL or upload a file."
            />
            <label className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <HiUpload className="w-4 h-4" />
              {uploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
            </label>
          </div>
          {form.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <img src={form.imageUrl} alt={form.name || 'Team member preview'} className="w-full h-48 object-cover" />
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Display Order" type="number" value={form.order} onChange={(e) => setForm((prev) => ({ ...prev, order: e.target.value }))} />
            <Select
              label="Status"
              value={String(form.isActive)}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.value === 'true' }))}
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={saveMutation.isPending} disabled={uploadMutation.isPending}>
              {editing ? 'Update Member' : 'Create Member'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={() => memberToDelete && deleteMutation.mutate(memberToDelete._id)}
        title="Delete Team Member"
        message={memberToDelete ? `Are you sure you want to delete "${memberToDelete.name}"? This action cannot be undone.` : ''}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
