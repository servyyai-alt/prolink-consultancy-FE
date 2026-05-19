// ── Job constants ─────────────────────────────────────────────────────────────
export const JOB_TYPES = [
  { value: 'full_time',  label: 'Full Time' },
  { value: 'part_time',  label: 'Part Time' },
  { value: 'contract',   label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance',  label: 'Freelance' },
]

export const LOCATION_TYPES = [
  { value: 'onsite', label: 'On-Site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
]

export const JOB_CATEGORIES = [
  'IT & Software', 'Finance & Banking', 'Marketing & Sales', 'Human Resources',
  'Operations & Logistics', 'Healthcare & Pharma', 'Education & Training',
  'Engineering & Manufacturing', 'Design & Creative', 'Legal & Compliance',
  'Hospitality & Tourism', 'Real Estate', 'Media & Entertainment', 'Other',
]

export const EXPERIENCE_LEVELS = [
  { label: 'Fresher (0–1 yr)', min: 0, max: 1 },
  { label: '1–3 years',        min: 1, max: 3 },
  { label: '3–5 years',        min: 3, max: 5 },
  { label: '5–8 years',        min: 5, max: 8 },
  { label: '8–12 years',       min: 8, max: 12 },
  { label: '12+ years',        min: 12, max: 40 },
]

export const SALARY_RANGES = [
  { label: 'Under ₹3L', min: 0, max: 300000 },
  { label: '₹3L–₹5L',  min: 300000, max: 500000 },
  { label: '₹5L–₹10L', min: 500000, max: 1000000 },
  { label: '₹10L–₹20L',min: 1000000, max: 2000000 },
  { label: '₹20L+',    min: 2000000, max: 100000000 },
]

export const SORT_OPTIONS = [
  { value: '-createdAt',  label: 'Newest First' },
  { value: 'createdAt',   label: 'Oldest First' },
  { value: '-salary.max', label: 'Highest Salary' },
  { value: '-views',      label: 'Most Viewed' },
  { value: '-applications', label: 'Most Applied' },
]

// ── Application status ────────────────────────────────────────────────────────
export const APPLICATION_STATUSES = [
  { value: 'applied',              label: 'Applied',             color: 'primary' },
  { value: 'screening',            label: 'Screening',           color: 'warning' },
  { value: 'shortlisted',          label: 'Shortlisted',         color: 'teal' },
  { value: 'interview_scheduled',  label: 'Interview Scheduled', color: 'purple' },
  { value: 'interviewed',          label: 'Interviewed',         color: 'purple' },
  { value: 'offered',              label: 'Offer Received',      color: 'success' },
  { value: 'hired',                label: 'Hired',               color: 'success' },
  { value: 'rejected',             label: 'Rejected',            color: 'danger' },
  { value: 'withdrawn',            label: 'Withdrawn',           color: 'gray' },
]

// ── User roles ────────────────────────────────────────────────────────────────
export const USER_ROLES = [
  { value: 'job_seeker',  label: 'Job Seeker' },
  { value: 'employer',    label: 'Employer' },
  { value: 'recruiter',   label: 'Recruiter' },
  { value: 'admin',       label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
]

// ── Services ──────────────────────────────────────────────────────────────────
export const SERVICES = [
  { slug: 'job-consultancy',        name: 'Job Consultancy',          icon: '💼' },
  { slug: 'cv-writing',             name: 'CV Writing',               icon: '📄' },
  { slug: 'campus-drive',           name: 'Campus Drive',             icon: '🎓' },
  { slug: 'housekeeping',           name: 'House Keeping',            icon: '🏠' },
  { slug: 'catering',               name: 'Catering Services',        icon: '🍽️' },
  { slug: 'event-management',       name: 'Event Management',         icon: '🎉' },
  { slug: 'plant-setup',            name: 'Plant Set-Up',             icon: '🏭' },
  { slug: 'background-verification',name: 'Background Verification',  icon: '🔍' },
  { slug: 'hr-outsourcing',         name: 'HR Outsourcing',           icon: '👥' },
]

// ── Subscription plans ────────────────────────────────────────────────────────
export const SUBSCRIPTION_PLANS = {
  employer: [
    { id: 'basic',      name: 'Basic',      price: 999,  period: 'month', jobs: 5,  features: ['5 Job Postings', 'Basic Analytics', 'Email Support'] },
    { id: 'premium',    name: 'Premium',    price: 2499, period: 'month', jobs: 20, features: ['20 Job Postings', 'Advanced Analytics', 'Priority Support', 'Featured Listings'] },
    { id: 'enterprise', name: 'Enterprise', price: 4999, period: 'month', jobs: -1, features: ['Unlimited Postings', 'Dedicated Account Manager', 'API Access', 'Custom Branding'] },
  ],
}

// ── CV Writing plans ──────────────────────────────────────────────────────────
export const CV_PLANS = [
  { id: 'basic',    name: 'Basic',    price: 499,  delivery: '3 days', revisions: 1, features: ['ATS Optimized', '1 Page Resume', 'Standard Template', '1 Free Revision'] },
  { id: 'standard', name: 'Standard', price: 999,  delivery: '2 days', revisions: 3, features: ['ATS Optimized', 'Up to 2 Pages', 'Premium Template', 'LinkedIn Optimization', '3 Free Revisions'] },
  { id: 'premium',  name: 'Premium',  price: 1999, delivery: '1 day',  revisions: -1, features: ['ATS Optimized', 'Unlimited Pages', 'Executive Template', 'LinkedIn + Cover Letter', 'Interview Prep Guide', 'Unlimited Revisions'], isPopular: true },
]

// ── Indian cities ─────────────────────────────────────────────────────────────
export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur',
  'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Coimbatore', 'Kochi', 'Noida', 'Gurugram',
  'Remote / Work from Home',
]
