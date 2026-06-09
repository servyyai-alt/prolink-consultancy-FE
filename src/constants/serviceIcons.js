import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  FileText,
  GraduationCap,
  HandPlatter,
  PartyPopper,
  SearchCheck,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  UsersRound,
} from 'lucide-react'

export const SERVICE_ICON_MAP = {
  'job-consultancy': BriefcaseBusiness,
  'permanent-staffing': UsersRound,
  'temporary-staffing': BriefcaseBusiness,
  'contract-staffing': Building2,
  'cv-writing': FileText,
  'campus-drive': GraduationCap,
  'campus-recruitment-drive': GraduationCap,
  'lean-consulting-services': TrendingUp,
  'corporate-events': PartyPopper,
  'iso-certification-support': ShieldCheck,
  'six-sigma-training-consulting': TrendingUp,
  'housekeeping': BadgeCheck,
  'housekeeping-services': BadgeCheck,
  'catering': HandPlatter,
  'indoor-outdoor-catering-services': HandPlatter,
  'event-management': PartyPopper,
  'wedding-events': PartyPopper,
  'exhibition-events': PartyPopper,
  'plant-setup': Building2,
  'complete-plant-setup-support': Building2,
  'medical-check-up-coordination': Stethoscope,
  'background-verification': SearchCheck,
  'hr-outsourcing': UsersRound,
}

export function getServiceIcon(slug) {
  return SERVICE_ICON_MAP[slug] || BriefcaseBusiness
}
