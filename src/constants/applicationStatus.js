export const APPLICATION_STATUS_ORDER = [
  'applied',
  'screening',
  'shortlisted',
  'interview_scheduled',
  'offered',
  'hired',
]

export const APPLICATION_STATUS_VARIANTS = {
  applied: 'primary',
  screening: 'warning',
  shortlisted: 'teal',
  interview_scheduled: 'purple',
  offered: 'success',
  hired: 'success',
  rejected: 'danger',
  withdrawn: 'gray',
}

export const APPLICATION_STATUS_LABELS = {
  applied: 'Applied',
  screening: 'Screening',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview Scheduled',
  offered: 'Offer Sent',
  hired: 'Hired',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export const APPLICATION_STATUS_DESCRIPTIONS = {
  applied: 'Application received and waiting for review.',
  screening: 'Profile is being reviewed by the hiring team.',
  shortlisted: 'Candidate is shortlisted for the next step.',
  interview_scheduled: 'Interview details have been shared with the candidate.',
  offered: 'Offer stage reached. Follow up with joining details.',
  hired: 'Candidate has been selected and marked as hired.',
  rejected: 'Application was closed as not selected.',
  withdrawn: 'Candidate withdrew this application.',
}

export const APPLICATION_NEXT_STATUSES = {
  applied: ['screening', 'rejected'],
  screening: ['shortlisted', 'rejected'],
  shortlisted: ['interview_scheduled', 'rejected'],
  interview_scheduled: ['offered', 'rejected'],
  offered: ['hired', 'rejected'],
}

export const getApplicationStatusLabel = (status) =>
  APPLICATION_STATUS_LABELS[status] || String(status || '').replace(/_/g, ' ')

export const getApplicationProgress = (status) => {
  if (status === 'rejected' || status === 'withdrawn') return 100

  const index = APPLICATION_STATUS_ORDER.indexOf(status)
  if (index < 0) return 0

  return Math.round(((index + 1) / APPLICATION_STATUS_ORDER.length) * 100)
}
