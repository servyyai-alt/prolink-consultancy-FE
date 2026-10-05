/**
 * Utility to download or view resume files cleanly.
 * Ensures the file is saved with the correct extension (.pdf, .docx)
 * so that the operating system and browser open it with the proper application
 * rather than displaying raw text/PDF stream code.
 */

import toast from 'react-hot-toast'

export const triggerBlobDownload = (blob, filename) => {
  const objectUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000)
}

export const formatResumeFilename = (name = 'resume', url = '') => {
  let cleanName = (name || 'resume')
    .trim()
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .replace(/\s+/g, '_')

  const urlLower = (url || '').toLowerCase()
  const isDocx = urlLower.includes('.docx') || cleanName.toLowerCase().endsWith('.docx')
  const isDoc = (urlLower.includes('.doc') && !isDocx) || cleanName.toLowerCase().endsWith('.doc')
  const ext = isDocx ? '.docx' : isDoc ? '.doc' : '.pdf'

  if (!cleanName.toLowerCase().endsWith('.pdf') && !cleanName.toLowerCase().endsWith('.docx') && !cleanName.toLowerCase().endsWith('.doc')) {
    cleanName = `${cleanName}${ext}`
  }

  return cleanName
}

export const downloadResumeFile = async (url, defaultName = 'resume') => {
  if (!url) {
    toast.error('Resume URL not available')
    return
  }

  const toastId = toast.loading('Downloading resume...')
  const filename = formatResumeFilename(defaultName, url)
  const isDocx = filename.endsWith('.docx')
  const isDoc = filename.endsWith('.doc')
  const mimeType = isDocx
    ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    : isDoc
    ? 'application/msword'
    : 'application/pdf'

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const cleanBlob = blob.type === mimeType ? blob : new Blob([blob], { type: mimeType })
    triggerBlobDownload(cleanBlob, filename)
    toast.success('Resume downloaded!', { id: toastId })
  } catch (err) {
    // Fallback: direct download link
    try {
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.dismiss(toastId)
    } catch {
      toast.error('Failed to download resume', { id: toastId })
    }
  }
}

export const viewResumeFile = async (url, fallbackName = 'resume') => {
  if (!url) return

  const filename = formatResumeFilename(fallbackName, url)
  const isDoc = filename.endsWith('.docx') || filename.endsWith('.doc')
  if (isDoc) {
    // Word files cannot be previewed natively in browser tabs, trigger download
    return downloadResumeFile(url, filename)
  }

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`)
    const blob = await res.blob()
    const pdfBlob = new Blob([blob], { type: 'application/pdf' })
    const objectUrl = window.URL.createObjectURL(pdfBlob)
    window.open(objectUrl, '_blank')
    setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000)
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
