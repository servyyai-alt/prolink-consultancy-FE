// import { Link } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { useInView } from 'react-intersection-observer'
// import { useQuery } from '@tanstack/react-query'
// import CountUp from 'react-countup'
// import { Helmet } from 'react-helmet-async'
// import {
//   HiArrowRight,
//   HiCheckCircle,
//   HiBriefcase,
//   HiUserGroup,
//   HiOfficeBuilding,
//   HiSparkles,
//   HiShieldCheck,
//   HiTrendingUp,
//   HiClock,
//   HiStar,
// } from 'react-icons/hi'
// import { jobAPI } from '../services/api'

// const SIGNATURE_SERVICES = [
//   {
//     title: 'Executive Staffing',
//     description: 'Targeted hiring for growing companies that need capability, speed, and cultural fit.',
//     stat: 'Leadership hires in 21-45 days',
//   },
//   {
//     title: 'Campus & Volume Hiring',
//     description: 'Structured drives, assessment coordination, and onboarding support for scale-ready teams.',
//     stat: '500+ partner institutions and employers',
//   },
//   {
//     title: 'Career Branding',
//     description: 'Premium CV writing, profile positioning, and interview readiness for ambitious professionals.',
//     stat: 'Shortlist-focused candidate presentation',
//   },
// ]

// const IMPACT_NUMBERS = [
//   { value: 10000, suffix: '+', label: 'Successful placements' },
//   { value: 500, suffix: '+', label: 'Hiring partners' },
//   { value: 98, suffix: '%', label: 'Client satisfaction' },
//   { value: 8, suffix: '+', label: 'Years of consultancy expertise' },
// ]

// const DIFFERENTIATORS = [
//   {
//     icon: HiTrendingUp,
//     title: 'Business-first recruitment',
//     description: 'We understand team structure, not just job descriptions, so every shortlist is commercially relevant.',
//   },
//   {
//     icon: HiShieldCheck,
//     title: 'Trust-led candidate filtering',
//     description: 'Profiles are reviewed for capability, intent, and role alignment before they reach your desk.',
//   },
//   {
//     icon: HiClock,
//     title: 'Fast, visible delivery',
//     description: 'Clear communication, practical turnaround, and recruitment momentum without agency noise.',
//   },
// ]

// const CLIENT_PROOF = [
//   {
//     quote: 'ProLink helped us move from reactive hiring to a confident, repeatable recruitment process.',
//     name: 'Arun Prakash',
//     role: 'Managing Director, industrial operations client',
//   },
//   {
//     quote: 'The quality of presentation, follow-up, and candidate fit made the brand feel bigger than a staffing vendor.',
//     name: 'Meera Nair',
//     role: 'HR Head, technology hiring partner',
//   },
//   {
//     quote: 'From resume refinement to offer support, the experience felt premium and deeply personal.',
//     name: 'Vignesh Kumar',
//     role: 'Placed candidate, senior analyst role',
//   },
// ]

// function Reveal({ children, delay = 0 }) {
//   const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 28 }}
//       animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
//       transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
//     >
//       {children}
//     </motion.div>
//   )
// }

// export default function Home() {
//   const { data } = useQuery({
//     queryKey: ['featuredJobs'],
//     queryFn: () => jobAPI.getJobs({ limit: 6, featured: true }),
//     staleTime: 5 * 60 * 1000,
//   })

//   const featuredJobs = data?.data?.data || []

//   return (
//     <>
//       <Helmet>
//         <title>ProLink Consultancy | Premium Staffing, Hiring & Career Solutions</title>
//         <meta
//           name="description"
//           content="ProLink Consultancy delivers premium staffing, recruitment, campus hiring, CV writing, and workforce support for ambitious businesses and professionals."
//         />
//       </Helmet>

//       <section className="relative overflow-hidden bg-[#140f0d] pt-28 pb-20 md:pt-36 md:pb-28">
//         <div className="absolute inset-0 bg-mesh opacity-80" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(243,188,47,0.16),transparent_28%)]" />
//         <div className="page-container relative z-10">
//           <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
//             <Reveal>
//               <div className="max-w-3xl">
//                 <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-amber-100 backdrop-blur">
//                   <HiSparkles className="h-4 w-4 text-accent-400" />
//                   Strategic staffing consultancy for modern businesses
//                 </div>

//                 <h1 className="mt-7 text-5xl font-display font-bold leading-[1.02] text-white md:text-7xl">
//                   Build teams and careers with a consultancy that looks
//                   <span className="block bg-gradient-to-r from-accent-300 via-accent-400 to-white bg-clip-text text-transparent">
//                     premium, moves fast, and delivers trust.
//                   </span>
//                 </h1>

//                 <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300 md:text-xl">
//                   ProLink helps employers hire better talent and helps candidates present themselves with clarity, confidence, and professional polish.
//                 </p>

//                 <div className="mt-8 flex flex-col gap-4 sm:flex-row">
//                   <Link to="/contact" className="btn-primary px-8 py-3.5 text-base">
//                     Book a Consultation <HiArrowRight className="h-4 w-4" />
//                   </Link>
//                   <Link
//                     to="/jobs"
//                     className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
//                   >
//                     Explore Opportunities <HiArrowRight className="h-4 w-4" />
//                   </Link>
//                 </div>

//                 <div className="mt-10 grid gap-4 sm:grid-cols-3">
//                   {[
//                     'Executive & mid-level hiring support',
//                     'Candidate branding and CV advisory',
//                     'Campus, catering, events, and HR services',
//                   ].map((item) => (
//                     <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-stone-200 backdrop-blur">
//                       <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-400/20 text-accent-300">
//                         <HiCheckCircle className="h-4 w-4" />
//                       </div>
//                       {item}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </Reveal>

//             <Reveal delay={0.12}>
//               <div className="relative">
//                 <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
//                   <div className="rounded-[1.5rem] bg-[#f9f3ea] p-6 text-stone-900 shadow-inner">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary-700">Brand Positioning</p>
//                         <h3 className="mt-2 font-sans text-2xl font-extrabold tracking-tight">Consultancy that feels boardroom-ready</h3>
//                       </div>
//                       <div className="relative flex h-16 w-16 items-center justify-center">
//                         <span className="absolute top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary-700" />
//                         <span className="absolute left-1 top-6 h-3 w-3 rounded-full bg-primary-700" />
//                         <span className="absolute right-1 top-6 h-3 w-3 rounded-full bg-primary-700" />
//                         <div className="h-12 w-12 rounded-full border-[6px] border-accent-400" />
//                       </div>
//                     </div>

//                     <div className="mt-8 grid gap-4">
//                       {[
//                         { icon: HiOfficeBuilding, title: 'For employers', text: 'Confident hiring support, talent mapping, and staffing momentum.' },
//                         { icon: HiUserGroup, title: 'For candidates', text: 'Career clarity, CV polish, and role-ready positioning.' },
//                         { icon: HiBriefcase, title: 'For services', text: 'Staffing, events, campus drives, catering, and HR operations.' },
//                       ].map(({ icon: Icon, title, text }) => (
//                         <div key={title} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
//                           <div className="flex items-start gap-4">
//                             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-800">
//                               <Icon className="h-6 w-6" />
//                             </div>
//                             <div>
//                               <h4 className="font-sans text-base font-extrabold">{title}</h4>
//                               <p className="mt-1 text-sm leading-6 text-stone-600">{text}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="absolute -bottom-8 -left-4 rounded-2xl border border-amber-300/20 bg-primary-900 px-5 py-4 text-white shadow-xl">
//                   <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Client Impression</p>
//                   <p className="mt-1 text-lg font-semibold">Professional. Warm. High-trust.</p>
//                 </div>
//               </div>
//             </Reveal>
//           </div>
//         </div>
//       </section>

//       <section className="border-y border-stone-200/80 bg-[#fbf8f2] py-14 dark:border-stone-800 dark:bg-[#191310]">
//         <div className="page-container">
//           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//             {IMPACT_NUMBERS.map((item, index) => {
//               const { ref, inView } = useInView({ triggerOnce: true })
//               return (
//                 <Reveal key={item.label} delay={index * 0.06}>
//                   <div ref={ref} className="rounded-[1.75rem] border border-stone-200/80 bg-white p-6 text-center shadow-card dark:border-stone-800 dark:bg-stone-900">
//                     <div className="text-4xl font-sans font-extrabold text-primary-800 dark:text-accent-300">
//                       {inView ? <CountUp end={item.value} duration={2.4} separator="," /> : 0}{item.suffix}
//                     </div>
//                     <p className="mt-2 text-sm font-medium text-stone-600 dark:text-stone-400">{item.label}</p>
//                   </div>
//                 </Reveal>
//               )
//             })}
//           </div>
//         </div>
//       </section>

//       <section className="section-padding">
//         <div className="page-container">
//           <Reveal>
//             <div className="max-w-3xl">
//               <span className="badge-primary mb-4">Signature Services</span>
//               <h2 className="section-heading">A consultancy experience that feels premium from first impression to final delivery.</h2>
//               <p className="section-subheading mx-0 max-w-3xl text-left">
//                 Your logo already carries authority. Now the website matches it with cleaner hierarchy, richer contrast, and a more executive presentation.
//               </p>
//             </div>
//           </Reveal>

//           <div className="mt-12 grid gap-6 lg:grid-cols-3">
//             {SIGNATURE_SERVICES.map((service, index) => (
//               <Reveal key={service.title} delay={index * 0.08}>
//                 <div className="card p-8">
//                   <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-800 to-primary-700 text-white shadow-primary">
//                     <span className="text-lg font-extrabold">{index + 1}</span>
//                   </div>
//                   <h3 className="font-sans text-2xl font-extrabold text-stone-950 dark:text-white">{service.title}</h3>
//                   <p className="mt-3 text-stone-600 dark:text-stone-400">{service.description}</p>
//                   <div className="mt-6 inline-flex rounded-full bg-accent-100 px-4 py-2 text-sm font-semibold text-primary-800 dark:bg-accent-400/20 dark:text-accent-300">
//                     {service.stat}
//                   </div>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="section-padding bg-[#16110f]">
//         <div className="page-container">
//           <Reveal>
//             <div className="text-center">
//               <span className="inline-flex rounded-full border border-accent-300/20 bg-accent-400/10 px-4 py-2 text-sm font-semibold text-accent-300">
//                 Why Clients Stay
//               </span>
//               <h2 className="mt-5 text-4xl font-display font-bold text-white md:text-5xl">
//                 Not just staffing. A more valuable face for your business.
//               </h2>
//               <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-300">
//                 When a consultancy brand feels refined, reliable, and clear, clients assume the service will be too. That is the standard this redesign is built for.
//               </p>
//             </div>
//           </Reveal>

//           <div className="mt-12 grid gap-6 lg:grid-cols-3">
//             {DIFFERENTIATORS.map(({ icon: Icon, title, description }, index) => (
//               <Reveal key={title} delay={index * 0.08}>
//                 <div className="rounded-[1.8rem] border border-white/8 bg-white/5 p-8 backdrop-blur">
//                   <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-400 text-stone-950 shadow-glow">
//                     <Icon className="h-7 w-7" />
//                   </div>
//                   <h3 className="mt-6 font-sans text-2xl font-extrabold text-white">{title}</h3>
//                   <p className="mt-3 text-stone-300">{description}</p>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="section-padding">
//         <div className="page-container">
//           <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
//             <Reveal>
//               <div>
//                 <span className="badge-primary mb-4">Featured Opportunities</span>
//                 <h2 className="section-heading">Open roles presented with clarity and stronger visual confidence.</h2>
//                 <p className="section-subheading mx-0 max-w-xl text-left">
//                   Your jobs area now sits under a warmer, more premium brand language while still staying usable and conversion-friendly.
//                 </p>
//                 <div className="mt-8 flex gap-4">
//                   <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
//                   <Link to="/employer/post-job" className="btn-secondary">Post a Requirement</Link>
//                 </div>
//               </div>
//             </Reveal>

//             <div className="grid gap-4">
//               {(featuredJobs.length ? featuredJobs : Array.from({ length: 4 }, (_, index) => ({ _id: index, title: 'Premium opportunity', company: { name: 'ProLink Partner' }, location: 'Chennai', type: 'full_time', slug: 'jobs' }))).slice(0, 4).map((job, index) => (
//                 <Reveal key={job._id} delay={index * 0.07}>
//                   <Link to={job.slug ? `/jobs/${job.slug}` : '/jobs'} className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
//                     <div className="flex items-start gap-4">
//                       <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-800 to-primary-700 text-lg font-extrabold text-white shadow-primary">
//                         {(job.company?.name || 'P')[0]}
//                       </div>
//                       <div>
//                         <h3 className="font-sans text-xl font-extrabold text-stone-950 dark:text-white">{job.title}</h3>
//                         <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{job.company?.name} - {job.location}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <span className="badge-gray">{job.type?.replace('_', ' ') || 'Full time'}</span>
//                       <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-800 dark:text-accent-300">
//                         View role <HiArrowRight className="h-4 w-4" />
//                       </span>
//                     </div>
//                   </Link>
//                 </Reveal>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="section-padding bg-[#fbf6ef] dark:bg-[#181210]">
//         <div className="page-container">
//           <Reveal>
//             <div className="text-center">
//               <span className="badge-primary mb-4">Client Reactions</span>
//               <h2 className="section-heading">The kind of polish that makes people say “wow” before the first call.</h2>
//             </div>
//           </Reveal>

//           <div className="mt-12 grid gap-6 lg:grid-cols-3">
//             {CLIENT_PROOF.map((item, index) => (
//               <Reveal key={item.name} delay={index * 0.08}>
//                 <div className="card p-8">
//                   <div className="mb-4 flex gap-1 text-accent-400">
//                     {[...Array(5)].map((_, starIndex) => (
//                       <HiStar key={starIndex} className="h-5 w-5" />
//                     ))}
//                   </div>
//                   <p className="text-lg leading-8 text-stone-700 dark:text-stone-300">“{item.quote}”</p>
//                   <div className="mt-8 border-t border-stone-200 pt-5 dark:border-stone-800">
//                     <p className="font-sans text-base font-extrabold text-stone-950 dark:text-white">{item.name}</p>
//                     <p className="text-sm text-stone-500 dark:text-stone-400">{item.role}</p>
//                   </div>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="section-padding">
//         <div className="page-container">
//           <Reveal>
//             <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-primary-900 via-primary-800 to-[#2a1812] p-10 text-center shadow-2xl md:p-16">
//               <span className="inline-flex rounded-full bg-accent-400 px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-stone-950">
//                 Final Call To Action
//               </span>
//               <h2 className="mt-6 text-4xl font-display font-bold text-white md:text-5xl">
//                 Turn ProLink into the kind of consultancy brand clients trust instantly.
//               </h2>
//               <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-200">
//                 This redesign gives your service business a stronger first impression, warmer brand authority, and a homepage that feels premium instead of generic.
//               </p>
//               <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
//                 <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-400 px-8 py-3.5 font-bold text-stone-950 transition-colors hover:bg-accent-300">
//                   Speak With ProLink <HiArrowRight className="h-4 w-4" />
//                 </Link>
//                 <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-white/10">
//                   Explore Services
//                 </Link>
//               </div>
//             </div>
//           </Reveal>
//         </div>
//       </section>
//     </>
//   )
// }

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup";
import { Helmet } from "react-helmet-async";
import {
  HiArrowRight,
  HiCheckCircle,
  HiBriefcase,
  HiUserGroup,
  HiOfficeBuilding,
  HiShieldCheck,
  HiTrendingUp,
  HiClock,
  HiStar,
  HiPhone,
} from "react-icons/hi";
import { jobAPI } from "../services/api";
import HeroSection from "../assets/video/herosection.mp4";

/* ─── Data ─── */
const SERVICES = [
  {
    num: "01",
    title: "Executive Staffing",
    description:
      "Targeted leadership hiring for growing companies that need capability, speed, and cultural fit.",
    detail: "Leadership hires delivered in 21–45 days",
    icon: HiBriefcase,
  },
  {
    num: "02",
    title: "Campus & Volume Hiring",
    description:
      "Structured drives, assessment coordination, and onboarding support for scale-ready teams.",
    detail: "500+ partner institutions and employers",
    icon: HiUserGroup,
  },
  {
    num: "03",
    title: "Career Branding",
    description:
      "Premium CV writing, profile positioning, and interview readiness for ambitious professionals.",
    detail: "Shortlist-focused candidate presentation",
    icon: HiOfficeBuilding,
  },
];

const STATS = [
  { value: 10000, suffix: "+", label: "Successful Placements" },
  { value: 500, suffix: "+", label: "Hiring Partners" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 8, suffix: "+", label: "Years of Expertise" },
];

const DIFFERENTIATORS = [
  {
    icon: HiTrendingUp,
    title: "Business-first recruitment",
    description:
      "We understand team structure and commercial context — not just job descriptions — so every shortlist is relevant.",
  },
  {
    icon: HiShieldCheck,
    title: "Trust-led candidate filtering",
    description:
      "Profiles are reviewed for capability, intent, and role alignment before they reach your desk.",
  },
  {
    icon: HiClock,
    title: "Fast, visible delivery",
    description:
      "Clear communication, practical turnaround, and recruitment momentum without agency noise.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "ProLink helped us move from reactive hiring to a confident, repeatable recruitment process.",
    name: "Arun Prakash",
    role: "Managing Director, Industrial Operations",
    initials: "AP",
  },
  {
    quote:
      "The quality of presentation, follow-up, and candidate fit made the brand feel bigger than a staffing vendor.",
    name: "Meera Nair",
    role: "HR Head, Technology Hiring Partner",
    initials: "MN",
  },
  {
    quote:
      "From resume refinement to offer support, the experience felt premium and deeply personal.",
    name: "Vignesh Kumar",
    role: "Placed Candidate, Senior Analyst Role",
    initials: "VK",
  },
];

/* ─── Animation wrapper ─── */
function Reveal({ children, delay = 0, className = "" }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section label ─── */
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-8 h-px bg-amber-400" />
      <span className="text-[11px] uppercase tracking-[0.35em] text-amber-500 font-bold">
        {children}
      </span>
    </div>
  );
}

/* ─── Home ─── */
export default function Home() {
  const { data } = useQuery({
    queryKey: ["featuredJobs"],
    queryFn: () => jobAPI.getJobs({ limit: 4, featured: true }),
    staleTime: 5 * 60 * 1000,
  });
  const featuredJobs = data?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>
          ProLink Consultancy | Premium Staffing, Hiring & Career Solutions
        </title>
        <meta
          name="description"
          content="ProLink Consultancy delivers premium staffing, recruitment, campus hiring, CV writing, and workforce support for ambitious businesses and professionals."
        />
      </Helmet>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      {/* <section className="relative bg-[#110b07] overflow-hidden min-h-[92vh] flex items-center">
       
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,rgba(139,42,15,0.18),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(243,188,47,0.07),transparent_50%)]" />

          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
        </div>

        <div className="page-container relative z-10 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

           
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-8 h-px bg-amber-400" />
                  <span className="text-[11px] uppercase tracking-[0.38em] text-amber-400 font-bold">
                    Strategic Staffing Consultancy
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="text-[2.8rem] md:text-[3.6rem] xl:text-[4rem] font-bold leading-[1.06] text-white mb-6"
                  style={{ fontFamily: "'Georgia', serif" }}>
                  Helping businesses hire better.{' '}
                  <span className="text-amber-400">
                    Helping professionals go further.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-lg text-stone-400 leading-relaxed mb-10 max-w-xl">
                  ProLink connects ambitious employers with the right talent, and helps candidates present themselves with clarity, confidence, and professional polish.
                </p>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link to="/contact"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-[15px] transition-colors shadow-lg shadow-amber-400/20">
                    Book a Consultation <HiArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/jobs"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl text-[15px] transition-colors hover:bg-white/5">
                    Explore Jobs <HiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="flex flex-wrap gap-3">
                  {[
                    'Executive & mid-level hiring',
                    'Candidate branding & CV advisory',
                    'Campus, events & HR services',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-stone-400">
                      <HiCheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

       
            <Reveal delay={0.1}>
              <div className="relative">
                
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-1 shadow-2xl">
                  <div className="rounded-xl bg-[#1c1108] p-7">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">Our Approach</p>
                        <h3 className="text-white font-bold text-xl mt-1.5"
                          style={{ fontFamily: "'Georgia', serif" }}>
                          Consultancy that earns trust fast
                        </h3>
                      </div>
                      
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <span className="absolute top-0 left-1/2 w-2.5 h-2.5 rounded-full bg-[#8B2A0F] -translate-x-1/2" />
                        <span className="absolute left-0 top-[14px] w-2.5 h-2.5 rounded-full bg-[#8B2A0F]" />
                        <span className="absolute right-0 top-[14px] w-2.5 h-2.5 rounded-full bg-[#8B2A0F]" />
                        <div className="w-10 h-10 mx-auto mt-1 rounded-full border-[3px] border-amber-400" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { icon: HiOfficeBuilding, title: 'For Employers', text: 'Confident hiring support, talent mapping, and staffing momentum.' },
                        { icon: HiUserGroup,    title: 'For Candidates', text: 'Career clarity, CV polish, and role-ready positioning.' },
                        { icon: HiBriefcase,   title: 'For Services',   text: 'Staffing, events, campus drives, catering, and HR operations.' },
                      ].map(({ icon: Icon, title, text }) => (
                        <div key={title} className="flex items-start gap-4 rounded-xl border border-white/8 bg-white/5 p-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{title}</p>
                            <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                
                <div className="absolute -bottom-5 -left-4 bg-[#8B2A0F] rounded-2xl px-5 py-3 shadow-xl border border-amber-800/30">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-amber-200 font-semibold">Client Feedback</p>
                  <p className="text-white font-bold text-sm mt-0.5">Professional. Warm. High-trust.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

     
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 block">
            <path d="M0 48 C360 0, 1080 0, 1440 48 L1440 48 L0 48Z" fill="rgb(250,246,239)" className="dark:fill-[#100c08]" />
          </svg>
        </div>
      </section> */}

      <section className="relative overflow-hidden min-h-[100vh] flex items-center bg-black">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105"
          >
            <source src={HeroSection} type="video/mp4" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Warm Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#110b07]/60 via-[#110b07]/30 to-[#8B2A0F]/30" />

          {/* Light Glow Effects */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#8B2A0F]/20 blur-3xl rounded-full" />

          {/* Grid Effect */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* ===== Content ===== */}
        <div className="page-container relative z-10 py-24 md:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {/* ===== Left Content ===== */}
            {/* <div>
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-amber-400" />
            <span className="text-[11px] uppercase tracking-[0.38em] text-amber-400 font-bold">
              Strategic Staffing Consultancy
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <h1
            className="text-[2.8rem] md:text-[4rem] xl:text-[4.6rem] font-bold leading-[1.05] text-white mb-6"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Helping businesses hire better.{" "}
            <span className="text-amber-400">
              Helping professionals grow faster.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-lg md:text-xl text-stone-300 leading-relaxed mb-10 max-w-2xl">
            ProLink Consultancy connects ambitious companies with exceptional
            talent while helping professionals unlock better career
            opportunities with confidence and clarity.
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-2xl text-[15px] transition-all duration-300 shadow-2xl shadow-amber-400/20 hover:scale-[1.03]"
            >
              Book a Consultation
              <HiArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-white/20 hover:border-white/40 text-white font-semibold rounded-2xl text-[15px] transition-all duration-300 hover:bg-white/10 backdrop-blur-md"
            >
              Explore Jobs
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="flex flex-wrap gap-4">
            {[
              "Executive & Mid-Level Hiring",
              "CV & Career Branding",
              "Campus & HR Services",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-stone-300 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md"
              >
                <HiCheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </Reveal>
      </div> */}
            <div className="max-w-2xl">
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-px bg-amber-400" />

                  <span className="text-[10px] uppercase tracking-[0.32em] text-amber-400 font-bold">
                    Strategic Staffing Consultancy
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <h1
                  className="
        text-[2.2rem]
        md:text-[3.2rem]
        xl:text-[3.8rem]
        font-bold
        leading-[1.08]
        text-white
        mb-5
      "
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Helping businesses hire better.{" "}
                  <span className="text-amber-400">
                    Helping professionals grow faster.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-base md:text-lg text-stone-300 leading-relaxed mb-8 max-w-xl">
                  ProLink Consultancy connects ambitious companies with
                  exceptional talent while helping professionals unlock better
                  career opportunities with confidence and clarity.
                </p>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link
                    to="/contact"
                    className="
          inline-flex items-center justify-center gap-2.5
          px-7 py-3.5
          bg-amber-400 hover:bg-amber-300
          text-stone-950
          font-bold
          rounded-2xl
          text-[14px]
          transition-all duration-300
          shadow-xl shadow-amber-400/20
          hover:scale-[1.02]
        "
                  >
                    Book a Consultation
                    <HiArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/jobs"
                    className="
          inline-flex items-center justify-center gap-2.5
          px-7 py-3.5
          border border-white/20
          hover:border-white/40
          text-white
          font-semibold
          rounded-2xl
          text-[14px]
          transition-all duration-300
          hover:bg-white/10
          backdrop-blur-md
        "
                  >
                    Explore Jobs
                    <HiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Executive & Mid-Level Hiring",
                    "CV & Career Branding",
                    "Campus & HR Services",
                  ].map((item) => (
                    <div
                      key={item}
                      className="
            flex items-center gap-2
            text-xs md:text-sm
            text-stone-300
            bg-white/5
            border border-white/10
            rounded-full
            px-4 py-2
            backdrop-blur-md
          "
                    >
                      <HiCheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />

                      {item}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* ===== Right Card ===== */}
            <Reveal delay={0.1}>
              <div className="relative">
                {/* Glass Card */}
                <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-1 shadow-2xl">
                  <div className="rounded-3xl p-8 bg-black/20">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">
                          Our Approach
                        </p>

                        <h3
                          className="text-white font-bold text-2xl mt-2"
                          style={{ fontFamily: "'Georgia', serif" }}
                        >
                          Consultancy that builds trust
                        </h3>
                      </div>

                      {/* Decorative */}
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <span className="absolute top-0 left-1/2 w-3 h-3 rounded-full bg-[#8B2A0F] -translate-x-1/2" />
                        <span className="absolute left-0 top-[18px] w-3 h-3 rounded-full bg-[#8B2A0F]" />
                        <span className="absolute right-0 top-[18px] w-3 h-3 rounded-full bg-[#8B2A0F]" />

                        <div className="w-12 h-12 mx-auto mt-1 rounded-full border-[3px] border-amber-400" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          icon: HiOfficeBuilding,
                          title: "For Employers",
                          text: "Smart staffing solutions with reliable talent acquisition support.",
                        },
                        {
                          icon: HiUserGroup,
                          title: "For Candidates",
                          text: "Career guidance, professional CV branding, and placement support.",
                        },
                        {
                          icon: HiBriefcase,
                          title: "Business Services",
                          text: "HR operations, staffing, events, and workforce management solutions.",
                        },
                      ].map(({ icon: Icon, title, text }) => (
                        <div
                          key={title}
                          className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-amber-400" />
                          </div>

                          <div>
                            <p className="text-base font-bold text-white">
                              {title}
                            </p>

                            <p className="text-sm text-stone-300 mt-1 leading-relaxed">
                              {text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-5 -left-4 bg-[#8B2A0F] rounded-2xl px-6 py-4 shadow-2xl border border-amber-800/30 backdrop-blur-xl">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-amber-200 font-semibold">
                    Client Feedback
                  </p>

                  <p className="text-white font-bold text-sm mt-1">
                    Professional. Trusted. People-focused.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ===== Bottom Wave ===== */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-12 block"
          >
            <path
              d="M0 48 C360 0, 1080 0, 1440 48 L1440 48 L0 48Z"
              fill="rgb(250,246,239)"
              className="dark:fill-[#100c08]"
            />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════ */}
      <section className="bg-[#faf6ef] dark:bg-[#100c08] py-16 border-b border-stone-200/60 dark:border-stone-800/40">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-stone-200/60 dark:divide-stone-800/60">
            {STATS.map((item, i) => {
              const { ref, inView } = useInView({ triggerOnce: true });
              return (
                <Reveal key={item.label} delay={i * 0.07}>
                  <div
                    ref={ref}
                    className="text-center py-4 lg:py-0 lg:px-8 first:lg:pl-0 last:lg:pr-0"
                  >
                    <div
                      className="text-4xl xl:text-5xl font-bold text-[#8B2A0F] dark:text-amber-400 mb-2"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {inView ? (
                        <CountUp
                          end={item.value}
                          duration={2.5}
                          separator=","
                        />
                      ) : (
                        "0"
                      )}
                      {item.suffix}
                    </div>
                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                      {item.label}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════ */}
      <section className="section-padding bg-white dark:bg-[#0f0b07]">
        <div className="page-container">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <SectionLabel>Signature Services</SectionLabel>
                <h2
                  className="text-4xl font-bold text-stone-900 dark:text-white leading-tight mb-5"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  A consultancy experience that feels premium from first
                  impression to delivery.
                </h2>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed mb-8">
                  Every engagement is handled with commercial clarity,
                  professional polish, and a focus on outcomes that matter.
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#8B2A0F] dark:text-amber-400 hover:gap-3 transition-all"
                >
                  Explore All Services <HiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <div className="space-y-6">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.08}>
                  <div className="group rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1a1108] hover:border-amber-300/60 dark:hover:border-amber-800/60 hover:bg-amber-50/30 dark:hover:bg-[#1f1309] transition-all p-7">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <span className="text-[11px] font-bold text-amber-500/60 uppercase tracking-[0.3em]">
                          {s.num}
                        </span>
                        <div className="mt-2 w-12 h-12 rounded-xl bg-[#8B2A0F]/10 dark:bg-[#8B2A0F]/20 flex items-center justify-center border border-[#8B2A0F]/20">
                          <s.icon className="w-6 h-6 text-[#8B2A0F] dark:text-amber-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-xl font-bold text-stone-900 dark:text-white mb-2"
                          style={{ fontFamily: "'Georgia', serif" }}
                        >
                          {s.title}
                        </h3>
                        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-4">
                          {s.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B2A0F] dark:text-amber-400 bg-amber-100/80 dark:bg-amber-400/10 px-3 py-1.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {s.detail}
                        </span>
                      </div>
                      <HiArrowRight className="w-5 h-5 text-stone-300 dark:text-stone-700 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHY CHOOSE US (dark band)
      ════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden bg-[#120d08]">
        {/* ===== Background Effects ===== */}
        <div className="absolute inset-0">
          {/* Gradient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full" />

          {/* Radial Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.08),transparent_45%)]" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />
        </div>

        <div className="page-container relative z-10">
          {/* ===== Heading ===== */}
          <Reveal>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="w-10 h-px bg-amber-400" />

                <span className="text-[11px] uppercase tracking-[0.35em] text-amber-400 font-semibold">
                  Why Clients Stay
                </span>

                <span className="w-10 h-px bg-amber-400" />
              </div>

              <h2
                className="
            text-3xl
            md:text-5xl
            xl:text-6xl
            font-bold
            text-white
            leading-tight
            mb-6
          "
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Not just staffing.
                <span className="block mt-2 text-amber-400">
                  A stronger image for your business.
                </span>
              </h2>

              <p className="text-stone-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                When a consultancy brand feels refined, reliable, and
                professional, clients naturally trust the service behind it.
              </p>
            </div>
          </Reveal>

          {/* ===== Cards ===== */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {DIFFERENTIATORS.map(({ icon: Icon, title, description }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div
                  className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                p-8
                transition-all duration-500
                hover:-translate-y-2
                hover:border-amber-500/30
                hover:bg-white/[0.06]
                hover:shadow-[0_20px_80px_rgba(251,191,36,0.08)]
              "
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 blur-3xl rounded-full" />
                  </div>

                  {/* Icon */}
                  <div
                    className="
                  relative
                  w-16 h-16
                  rounded-2xl
                  bg-gradient-to-br
                  from-amber-300
                  to-amber-500
                  flex items-center justify-center
                  mb-7
                  shadow-lg shadow-amber-500/20
                "
                  >
                    <Icon className="w-7 h-7 text-stone-950" />
                  </div>

                  {/* Number */}
                  <div className="absolute top-7 right-7 text-4xl font-bold text-white/5">
                    0{i + 1}
                  </div>

                  {/* Content */}
                  <h3
                    className="
                  text-2xl
                  font-bold
                  text-white
                  mb-4
                  leading-snug
                "
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {title}
                  </h3>

                  <p className="text-stone-400 leading-relaxed text-[15px]">
                    {description}
                  </p>

                  {/* Bottom Line */}
                  <div className="mt-8 w-12 h-[2px] bg-amber-400 rounded-full group-hover:w-24 transition-all duration-500" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED JOBS
      ════════════════════════════════════════ */}
      <section className="section-padding bg-[#faf6ef] dark:bg-[#0f0b07]">
        <div className="page-container">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <Reveal>
              <div>
                <SectionLabel>Featured Opportunities</SectionLabel>
                <h2
                  className="text-4xl font-bold text-stone-900 dark:text-white leading-tight"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Open roles, presented with clarity.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="flex gap-3 flex-shrink-0">
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B2A0F] text-white font-bold rounded-xl text-sm hover:bg-[#a03212] transition-colors"
                >
                  Browse All Jobs
                </Link>
                <Link
                  to="/employer/post-job"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Post a Role
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4">
            {(featuredJobs.length
              ? featuredJobs
              : Array.from({ length: 4 }, (_, i) => ({
                  _id: i,
                  title: "Senior Recruitment Consultant",
                  type: "full_time",
                  company: { name: "ProLink Partner" },
                  location: "Chennai",
                  slug: "jobs",
                }))
            )
              .slice(0, 4)
              .map((job, i) => (
                <Reveal key={job._id} delay={i * 0.06}>
                  <Link
                    to={job.slug ? `/jobs/${job.slug}` : "/jobs"}
                    className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1a1108] hover:border-amber-300/60 dark:hover:border-amber-800/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B2A0F] to-[#5c1c09] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {(job.company?.name || "P")[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 dark:text-white group-hover:text-[#8B2A0F] dark:group-hover:text-amber-400 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-stone-400 mt-0.5">
                          {job.company?.name} · {job.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:flex-shrink-0">
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 capitalize">
                        {job.type?.replace("_", " ") || "Full time"}
                      </span>
                      <span className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-[#8B2A0F] dark:text-amber-400 group-hover:gap-2.5 transition-all">
                        View role <HiArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section className="section-padding bg-white dark:bg-[#100c08]">
        <div className="page-container">
          <Reveal>
            <div className="text-center mb-14">
              <SectionLabel>Client Reactions</SectionLabel>
              <h2
                className="text-4xl font-bold text-stone-900 dark:text-white"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                The polish that makes people say "wow" before the first call.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.09}>
                <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1a1108] p-8 flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <HiStar key={j} className="w-4 h-4 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed flex-1 mb-7 italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-stone-200 dark:border-stone-800 pt-5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B2A0F] to-[#5c1c09] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-900 dark:text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA STRIP
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 bg-[#120c08]">
        {/* ===== Background ===== */}
        <div className="absolute inset-0">
          {/* Main Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B2A0F] via-[#5a1b0a]" />

          {/* Glow Effects */}
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-amber-400/10 blur-[140px] rounded-full translate-x-1/3 -translate-y-1/3" />

          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />

          {/* Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />

          {/* Decorative Rings */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full border border-white/10 -translate-y-1/2 translate-x-1/2" />

          <div className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full border border-white/10 translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="page-container relative z-10">
          <Reveal>
            <div
              className="
          relative
          overflow-hidden
          rounded-[2rem]
          border border-white/10
          bg-white/[0.05]
          backdrop-blur-xl
          px-8 py-12
          md:px-12 md:py-16
          shadow-[0_20px_80px_rgba(0,0,0,0.35)]
        "
            >
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.04] to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
                {/* ===== Left Content ===== */}
                <div className="max-w-2xl text-center xl:text-left">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <span className="w-10 h-px bg-amber-300" />

                    <span className="text-[11px] uppercase tracking-[0.35em] text-amber-300 font-bold">
                      Let's Work Together
                    </span>
                  </div>

                  <h2
                    className="
                text-3xl
                md:text-5xl
                xl:text-6xl
                font-bold
                leading-tight
                text-white
                mb-6
              "
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    Turn ProLink into the consultancy brand
                    <span className="block mt-2 text-amber-300">
                      clients trust instantly.
                    </span>
                  </h2>

                  <p className="text-base md:text-lg text-amber-100/80 leading-relaxed max-w-xl mx-auto xl:mx-0">
                    Premium hiring support, stronger business authority, and a
                    consultancy experience that feels professional from the very
                    first interaction.
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap justify-center xl:justify-start gap-6 mt-8">
                    <div>
                      <h3 className="text-3xl font-bold text-white">500+</h3>
                      <p className="text-sm text-amber-100/70 mt-1">
                        Successful Placements
                      </p>
                    </div>

                    <div className="w-px bg-white/10 hidden sm:block" />

                    <div>
                      <h3 className="text-3xl font-bold text-white">98%</h3>
                      <p className="text-sm text-amber-100/70 mt-1">
                        Client Satisfaction
                      </p>
                    </div>

                    <div className="w-px bg-white/10 hidden sm:block" />

                    <div>
                      <h3 className="text-3xl font-bold text-white">24/7</h3>
                      <p className="text-sm text-amber-100/70 mt-1">
                        Business Support
                      </p>
                    </div>
                  </div>
                </div>

                {/* ===== Right CTA ===== */}
                <div className="flex flex-col gap-4 w-full sm:w-auto">
                  <Link
                    to="/contact"
                    className="
                group
                inline-flex items-center justify-center gap-3
                px-8 py-4
                rounded-2xl
                bg-amber-400
                hover:bg-amber-300
                text-stone-950
                font-bold
                text-[15px]
                transition-all duration-300
                shadow-xl shadow-amber-500/20
                hover:scale-[1.03]
              "
                  >
                    Speak With ProLink
                    <HiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <a
                    href="tel:+919876543210"
                    className="
                inline-flex items-center justify-center gap-3
                px-8 py-4
                rounded-2xl
                border border-white/20
                hover:border-white/40
                bg-white/[0.04]
                hover:bg-white/[0.08]
                backdrop-blur-md
                text-white
                font-semibold
                text-[15px]
                transition-all duration-300
              "
                  >
                    <HiPhone className="w-5 h-5 text-amber-300" />
                    Call Us Now
                  </a>

                  {/* Small Note */}
                  <p className="text-center text-sm text-amber-100/60 mt-2">
                    Quick response • Professional consultation • Trusted support
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
