export const splitLegacyJobLocation = (location = '') => {
  if (!location || typeof location !== 'string') {
    return { state: '', district: '', address: '' }
  }

  const parts = location.split(',').map((part) => part.trim()).filter(Boolean)

  if (parts.length >= 3) {
    return {
      address: parts.slice(0, parts.length - 2).join(', '),
      district: parts[parts.length - 2] || '',
      state: parts[parts.length - 1] || '',
    }
  }

  if (parts.length === 2) {
    return {
      address: parts[0] || '',
      district: parts[0] || '',
      state: parts[1] || '',
    }
  }

  if (/^remote\b/i.test(parts[0] || '')) {
    return { address: '', district: '', state: '' }
  }

  return {
    address: '',
    district: '',
    state: parts[0] || '',
  }
}

export const formatJobLocation = (job = {}) => {
  const locationParts = [
    job.address,
    job.district,
    job.state,
  ]
    .map((part) => (typeof part === 'string' ? part.trim() : ''))
    .filter((part, index, arr) => Boolean(part) && arr.indexOf(part) === index)

  if (locationParts.length > 0) {
    return locationParts.join(', ')
  }

  return job.location || ''
}

export const buildJobLocation = ({ address, district, state }) => {
  return [address, district, state]
    .map((part) => (typeof part === 'string' ? part.trim() : ''))
    .filter((part, index, arr) => Boolean(part) && arr.indexOf(part) === index)
    .join(', ')
}
