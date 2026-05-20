import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  FileText,
  GraduationCap,
  HandPlatter,
  PartyPopper,
  SearchCheck,
  UsersRound,
} from 'lucide-react'

export const SERVICE_ICON_MAP = {
  'job-consultancy': BriefcaseBusiness,
  'cv-writing': FileText,
  'campus-drive': GraduationCap,
  'housekeeping': BadgeCheck,
  'catering': HandPlatter,
  'event-management': PartyPopper,
  'plant-setup': Building2,
  'background-verification': SearchCheck,
  'hr-outsourcing': UsersRound,
}

export function getServiceIcon(slug) {
  return SERVICE_ICON_MAP[slug] || BriefcaseBusiness
}

