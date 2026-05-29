import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiDocumentText, HiUpload, HiX } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { Button, Input } from '../../components/ui/index'
import BrochureList from '../../components/common/BrochureList'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { brochureAPI } from '../../services/api'

export default function AdminBrochure() {
  const [brochureName, setBrochureName] = useState('')
  const [file, setFile] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const fileInputRef = useRef(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['brochures'],
    queryFn: () => brochureAPI.getAll(),
  })

  const uploadMutation = useMutation({
    mutationFn: (formData) => brochureAPI.create(formData),
    onSuccess: () => {
      toast.success('Brochure uploaded')
      setBrochureName('')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      queryClient.invalidateQueries({ queryKey: ['brochures'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload brochure')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => brochureAPI.delete(id),
    onSuccess: () => {
      toast.success('Brochure deleted')
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ['brochures'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete brochure')
    },
  })

  const brochures = data?.data?.data?.brochures || []
  const count = data?.data?.data?.count || brochures.length

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!brochureName.trim() || !file) {
      toast.error('Please enter brochure name and upload a file')
      return
    }

    const formData = new FormData()
    formData.append('name', brochureName.trim())
    formData.append('file', file)
    uploadMutation.mutate(formData)
  }

  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] || null)
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <>
      <Helmet><title>Brochure | Admin | ProLink</title></Helmet>

      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">Brochure</h1>
          <p className="text-sm text-slate-500">Upload brochure files and view all saved brochure names.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <div className="w-full">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="space-y-5">
              <Input
                label="Brochure Name"
                value={brochureName}
                onChange={(event) => setBrochureName(event.target.value)}
                placeholder="Enter brochure name"
                required
              />

              <div>
                <label className="label">
                  File Upload <span className="text-red-500">*</span>
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-primary-300 hover:bg-primary-50/50 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-primary-700 dark:hover:bg-primary-900/10">
                  <HiUpload className="mb-3 h-8 w-8 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Choose brochure file</span>
                  <span className="mt-1 text-xs text-slate-500">PDF, DOC, DOCX, image, or any brochure document</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>

                {file && (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex min-w-0 items-center gap-2">
                      <HiDocumentText className="h-5 w-5 flex-shrink-0 text-primary-600" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                      aria-label="Remove selected file"
                    >
                      <HiX className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <Button type="submit" isLoading={uploadMutation.isPending}>Submit Brochure</Button>
              </div>
            </div>
          </form>
          </div>
          <BrochureList
            brochures={brochures}
            count={count}
            isLoading={isLoading}
            onDelete={setDeleteTarget}
            deletingId={deleteMutation.isPending ? deleteTarget?._id : null}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
        title="Delete Brochure"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
