import { useDeferredValue, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiPencil, HiPlus, HiSearch, HiTrash, HiUpload } from 'react-icons/hi'
import { adminAPI, blogAPI, uploadAPI } from '../../services/api'
import { Badge, Button, EmptyState, Input, Modal, Pagination, Select, Textarea } from '../../components/ui/index'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import toast from 'react-hot-toast'

const emptyForm = {
  title: '',
  category: '',
  excerpt: '',
  content: '',
  tags: '',
  status: 'draft',
  thumbnail: { url: '', public_id: '' },
  socialLinks: { facebook: '', instagram: '', linkedin: '', twitter: '', youtube: '' },
  relatedPosts: [],
}
const STATUS_VARIANTS = { draft: 'warning', published: 'success', archived: 'gray' }
const SOCIAL_FIELDS = ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube']

export default function AdminBlogs() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [blogToDelete, setBlogToDelete] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const deferredSearch = useDeferredValue(search)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs', { page, search: deferredSearch, status }],
    queryFn: () => adminAPI.getBlogs({ page, limit: 10, search: deferredSearch || undefined, status: status || undefined }),
    keepPreviousData: true,
  })

  const { data: relatedOptionsData } = useQuery({
    queryKey: ['admin-blogs-related-options'],
    queryFn: () => adminAPI.getBlogs({ page: 1, limit: 100 }),
  })

  const blogs = data?.data?.data || []
  const pagination = data?.data?.pagination
  const relatedOptions = relatedOptionsData?.data?.data || []

  const saveMutation = useMutation({
    mutationFn: (payload) => {
      const body = {
        title: payload.title,
        category: payload.category,
        excerpt: payload.excerpt,
        content: payload.content,
        tags: payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        status: payload.status,
        thumbnail: payload.thumbnail?.url ? payload.thumbnail : undefined,
        socialLinks: Object.fromEntries(
          Object.entries(payload.socialLinks || {}).map(([key, value]) => [key, value.trim()])
        ),
        relatedPosts: payload.relatedPosts,
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

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'prolink/blogs')
      const response = await uploadAPI.uploadImage(formData)
      return response.data?.data
    },
    onSuccess: (uploaded) => {
      setForm((prev) => ({ ...prev, thumbnail: uploaded }))
      toast.success('Blog image uploaded')
    },
    onError: () => toast.error('Could not upload image'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => blogAPI.delete(id),
    onSuccess: () => {
      toast.success('Blog deleted')
      qc.invalidateQueries({ queryKey: ['admin-blogs'] })
      qc.invalidateQueries({ queryKey: ['admin-blogs-related-options'] })
    },
    onError: () => toast.error('Could not delete blog'),
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
      thumbnail: blog.thumbnail || { url: '', public_id: '' },
      socialLinks: {
        facebook: blog.socialLinks?.facebook || '',
        instagram: blog.socialLinks?.instagram || '',
        linkedin: blog.socialLinks?.linkedin || '',
        twitter: blog.socialLinks?.twitter || '',
        youtube: blog.socialLinks?.youtube || '',
      },
      relatedPosts: (blog.relatedPosts || []).map((post) => post._id || post),
    })
    setIsOpen(true)
  }

  const submit = (e) => {
    e.preventDefault()
    saveMutation.mutate(form)
  }

  const onThumbnailChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadMutation.mutate(file)
    e.target.value = ''
  }

  const toggleRelatedPost = (blogId) => {
    setForm((prev) => ({
      ...prev,
      relatedPosts: prev.relatedPosts.includes(blogId)
        ? prev.relatedPosts.filter((id) => id !== blogId)
        : [...prev.relatedPosts, blogId],
    }))
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
                    {!!blog.relatedPosts?.length && (
                      <p className="text-xs text-slate-500">Related posts: {blog.relatedPosts.map((post) => post.title).join(', ')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(blog)}>
                      <HiPencil className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBlogToDelete(blog)}
                      className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Blog' : 'Create Blog'} size="lg">
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
            <Input label="Category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} required />
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <Input
              label="Blog Image URL"
              value={form.thumbnail?.url || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, thumbnail: { ...prev.thumbnail, url: e.target.value } }))}
              helperText="Paste an image URL or upload a file."
            />
            <label className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <HiUpload className="w-4 h-4" />
              {uploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" className="hidden" onChange={onThumbnailChange} />
            </label>
          </div>
          {form.thumbnail?.url && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <img src={form.thumbnail.url} alt={form.title || 'Blog preview'} className="w-full h-48 object-cover" />
            </div>
          )}
          <Input label="Tags" value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} helperText="Comma-separated tags" />
          <Textarea label="Excerpt" rows={3} value={form.excerpt} onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))} />
          <Textarea label="Content" rows={10} value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} required />
          <div className="space-y-3">
            <p className="label">Social Media Links</p>
            <div className="grid gap-4 md:grid-cols-2">
              {SOCIAL_FIELDS.map((field) => (
                <Input
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form.socialLinks?.[field] || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [field]: e.target.value } }))}
                  placeholder={`https://${field}.com/...`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="label">Related Posts</p>
              <p className="text-xs text-slate-500">Pick related articles to show below the blog details page.</p>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
              {relatedOptions.filter((blog) => blog._id !== editing?._id).length === 0 ? (
                <div className="p-4 text-sm text-slate-500">No other blogs available yet.</div>
              ) : (
                relatedOptions
                  .filter((blog) => blog._id !== editing?._id)
                  .map((blog) => (
                    <label key={blog._id} className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      <input
                        type="checkbox"
                        checked={form.relatedPosts.includes(blog._id)}
                        onChange={() => toggleRelatedPost(blog._id)}
                        className="mt-1 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{blog.title}</p>
                        <p className="text-xs text-slate-500">{blog.category || 'Uncategorized'}</p>
                      </div>
                    </label>
                  ))
              )}
            </div>
          </div>
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
            <Button type="submit" isLoading={saveMutation.isPending} disabled={uploadMutation.isPending}>{editing ? 'Update Blog' : 'Create Blog'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!blogToDelete}
        onClose={() => setBlogToDelete(null)}
        onConfirm={() => {
          if (!blogToDelete) return
          deleteMutation.mutate(blogToDelete._id, {
            onSuccess: () => setBlogToDelete(null),
          })
        }}
        title="Delete Blog"
        message={blogToDelete ? `Are you sure you want to delete "${blogToDelete.title}"? This action will remove the article from the site and admin CMS.` : ''}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
