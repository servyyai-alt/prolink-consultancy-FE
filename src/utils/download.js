/**
 * Utility to download or view resume files cleanly.
 * Automatically inspects the file's binary magic bytes (signatures)
 * so that DOCX, DOC, and PDF files are accurately detected and named,
 * even when served from extensionless URLs.
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

/**
 * Detect file format accurately from binary magic bytes (or filename/url fallback).
 */
export const detectBlobFormat = async (blob, fallbackUrl = '', fallbackName = '') => {
  let ext = '.pdf'
  let mimeType = 'application/pdf'

  try {
    const header = new Uint8Array(await blob.slice(0, 8).arrayBuffer())

    // 1. Check ZIP / DOCX magic bytes: 0x50, 0x4B (PK\x03\x04)
    if (header[0] === 0x50 && header[1] === 0x4B) {
      ext = '.docx'
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      return { ext, mimeType }
    }

    // 2. Check OLE2 / Legacy DOC magic bytes: 0xD0, 0xCF (\xD0\xCF\x11\xE0)
    if (header[0] === 0xD0 && header[1] === 0xCF) {
      ext = '.doc'
      mimeType = 'application/msword'
      return { ext, mimeType }
    }

    // 3. Check PDF magic bytes: %PDF (0x25, 0x50, 0x44, 0x46)
    if (header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46) {
      ext = '.pdf'
      mimeType = 'application/pdf'
      return { ext, mimeType }
    }
  } catch {
    // ignore
  }

  // Fallback to URL/name inspection
  const combined = `${fallbackUrl} ${fallbackName}`.toLowerCase()
  if (combined.includes('.docx')) {
    ext = '.docx'
    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  } else if (combined.includes('.doc')) {
    ext = '.doc'
    mimeType = 'application/msword'
  }

  return { ext, mimeType }
}

export const downloadResumeFile = async (url, defaultName = 'resume') => {
  if (!url) {
    toast.error('Resume URL not available')
    return
  }

  const toastId = toast.loading('Downloading resume...')
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()

    const { ext, mimeType } = await detectBlobFormat(blob, url, defaultName)
    const cleanBaseName = (defaultName || 'resume')
      .trim()
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/\.(pdf|docx|doc)$/i, '')

    const filename = `${cleanBaseName || 'resume'}${ext}`
    const cleanBlob = blob.type === mimeType ? blob : new Blob([blob], { type: mimeType })
    triggerBlobDownload(cleanBlob, filename)
    toast.success('Resume downloaded!', { id: toastId })
  } catch (err) {
    try {
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.download = defaultName
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

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const { ext, mimeType } = await detectBlobFormat(blob, url, fallbackName)

    if (ext === '.docx' || ext === '.doc') {
      // Word documents cannot be rendered natively inside browser tabs, download instead
      const cleanBaseName = (fallbackName || 'resume')
        .trim()
        .replace(/[^a-zA-Z0-9_\-\s]/g, '')
        .replace(/\s+/g, '_')
        .replace(/\.(pdf|docx|doc)$/i, '')
      const filename = `${cleanBaseName || 'resume'}${ext}`
      const cleanBlob = blob.type === mimeType ? blob : new Blob([blob], { type: mimeType })
      triggerBlobDownload(cleanBlob, filename)
      toast.success('Word document downloaded for viewing')
      return
    }

    const pdfBlob = new Blob([blob], { type: 'application/pdf' })
    const objectUrl = window.URL.createObjectURL(pdfBlob)
    window.open(objectUrl, '_blank')
    setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000)
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
