import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiPencil, HiPlus, HiSearch } from 'react-icons/hi'
import { adminAPI, blogAPI } from '../../services/api'
import { Badge, Button, EmptyState, Input, Modal, Pagination, Select, Textarea } from '../../components/ui/index'
import toast from 'react-hot-toast'

const emptyForm = { title: '', category: '', excerpt: '', content: '', tags: '', status: 'draft' }
const STATUS_VARIANTS = { draft: 'warning', published: 'success', archived: 'gray' }

export default function AdminBlogs() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs', { page, search, status }],
    queryFn: () => adminAPI.getBlogs({ page, limit: 10, search: search || undefined, status: status || undefined }),
    keepPreviousData: true,
  })

  const blogs = data?.data?.data || []
  const pagination = data?.data?.pagination

  const saveMutation = useMutation({
    mutationFn: (payload) => {
      const body = {
        title: payload.title,
        category: payload.category,
        excerpt: payload.excerpt,
        content: payload.content,
        tags: payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        status: payload.status,
      }
      return editing ? blogAPI.update(editing._id, body) : blogAPI.create(body)
    },
    onSuccess: () => {
      toast.success(editing ? 'Blog updated' : 'Blog created')
      qc.invalidateQueries({ queryKey: ['admin-blogs'] })
      setIsOpen(false)
      setEditing(null)
      setForm(emptyForm)
    },
    onError: () => toast.error('Could not save blog'),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setIsOpen(true)
  }

  const openEdit = (blog) => {
    setEditing(blog)
    setForm({
      title: blog.title || '',
      category: blog.category || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      tags: (blog.tags || []).join(', '),
      status: blog.status || 'draft',
    })
    setIsOpen(true)
  }

  const submit = (e) => {
    e.preventDefault()
    saveMutation.mutate(form)
  }

  return (
    <>
      <Helmet><title>Blogs | Admin | ProLink</title></Helmet>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Blogs</h1>
            <p className="text-sm text-slate-500">{pagination?.total || 0} articles in CMS</p>
          </div>
          <Button size="sm" onClick={openCreate}>
            <HiPlus className="w-4 h-4" />
            New Blog
          </Button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-xl px-3">
            <HiSearch className="w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search blogs"
              className="flex-1 bg-transparent py-2.5 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
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
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <EmptyState title="No blogs found" description="Create the first article or change the filters." />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {blogs.map((blog) => (
                <div key={blog._id} className="p-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{blog.title}</h3>
                      <Badge variant={STATUS_VARIANTS[blog.status] || 'gray'}>{blog.status}</Badge>
                      {blog.isFeatured && <Badge variant="purple">Featured</Badge>}
                    </div>
                    <p className="text-sm text-slate-500">
                      {blog.category} - {blog.author?.firstName} {blog.author?.lastName} - {blog.views || 0} views
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">{blog.excerpt || 'No excerpt yet.'}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openEdit(blog)}>
                    <HiPencil className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {pagination && (
          <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Blog' : 'Create Blog'} size="lg">
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
            <Input label="Category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} required />
          </div>
          <Input label="Tags" value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} helperText="Comma-separated tags" />
          <Textarea label="Excerpt" rows={3} value={form.excerpt} onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))} />
          <Textarea label="Content" rows={10} value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} required />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
          <div className="flex justify-end">
            <Button type="submit" isLoading={saveMutation.isPending}>{editing ? 'Update Blog' : 'Create Blog'}</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
