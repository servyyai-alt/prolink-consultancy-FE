// import { motion } from 'framer-motion'
// import { Helmet } from 'react-helmet-async'
// import { useInView } from 'react-intersection-observer'
// import { FaLinkedin } from 'react-icons/fa'
// import {
//   Target,
//   Eye,
//   Handshake,
//   Rocket,
//   HeartHandshake,
// } from 'lucide-react'

// const TEAM = [
//   {
//     name: 'Ramesh Kumar',
//     role: 'Founder & CEO',
//     img: null,
//     bio: '15+ years in HR & Recruitment across India',
//   },
//   {
//     name: 'Priya Nair',
//     role: 'Head of Operations',
//     img: null,
//     bio: 'Expert in campus recruitment and talent acquisition',
//   },
//   {
//     name: 'Suresh Menon',
//     role: 'Director - BD',
//     img: null,
//     bio: 'Pan-India client network with Fortune 500 companies',
//   },
//   {
//     name: 'Ananya Reddy',
//     role: 'Lead CV Consultant',
//     img: null,
//     bio: 'Certified resume writer with 98% success rate',
//   },
// ]

// const VALUES = [
//   {
//     icon: Target,
//     title: 'Excellence',
//     desc: 'We deliver outstanding results by going beyond expectations on every engagement.',
//   },
//   {
//     icon: Handshake,
//     title: 'Integrity',
//     desc: 'Honest and transparent relationships with clients, candidates, and partners.',
//   },
//   {
//     icon: Rocket,
//     title: 'Innovation',
//     desc: 'Continuously improving processes using technology and modern recruitment strategies.',
//   },
//   {
//     icon: HeartHandshake,
//     title: 'People First',
//     desc: 'Every decision starts with the impact it creates for people and businesses.',
//   },
// ]

// const TIMELINE = [
//   {
//     year: '2015',
//     title: 'Founded in Chennai',
//     desc: 'ProLink started as a small job placement firm with 3 recruiters.',
//   },
//   {
//     year: '2017',
//     title: 'Expanded Pan-India',
//     desc: 'Opened offices in Bengaluru, Hyderabad, and Mumbai.',
//   },
//   {
//     year: '2019',
//     title: 'Launched CV Writing',
//     desc: 'Added professional resume services with 500+ successful profiles.',
//   },
//   {
//     year: '2021',
//     title: 'Digital Platform',
//     desc: 'Launched our online recruitment and staffing ecosystem.',
//   },
//   {
//     year: '2023',
//     title: 'Diversified Services',
//     desc: 'Expanded into Event Management and Corporate Support services.',
//   },
//   {
//     year: '2024',
//     title: '10,000+ Placements',
//     desc: 'Successfully crossed 10,000+ candidate placements across India.',
//   },
// ]

// function FadeUp({ children, delay = 0 }) {
//   const { ref, inView } = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   })

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 40 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={{
//         duration: 0.7,
//         delay,
//         ease: [0.16, 1, 0.3, 1],
//       }}
//     >
//       {children}
//     </motion.div>
//   )
// }

// export default function About() {
//   return (
//     <>
//       <Helmet>
//         <title>About Us | ProLink Consultancy</title>
//         <meta
//           name="description"
//           content="Learn about ProLink Consultancy - India's trusted HR and recruitment partner since 2015."
//         />
//       </Helmet>

//       <div className="overflow-hidden pt-16">
//         <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 py-24">
//           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
//           <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary-500/20 blur-[120px]" />
//           <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />

//           <div className="page-container relative z-10 text-center">
//             <FadeUp>
//               <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold text-primary-300 backdrop-blur-xl">
//                 <Target className="h-4 w-4" />
//                 About ProLink Consultancy
//               </span>

//               <h1 className="mb-6 text-5xl font-black leading-tight text-white md:text-6xl">
//                 India's Trusted
//                 <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
//                   {' '}
//                   Consultancy Partner
//                 </span>
//               </h1>

//               <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
//                 Delivering world-class recruitment, HR solutions, staffing,
//                 career guidance, and business support services across India.
//               </p>
//             </FadeUp>
//           </div>
//         </section>

//         <section className="relative overflow-hidden bg-white section-padding dark:bg-slate-950">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_35%)]" />

//           <div className="page-container relative z-10">
//             <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
//               {[
//                 {
//                   icon: Target,
//                   title: 'Our Mission',
//                   text: 'To empower organizations and individuals with the right talent, the right opportunities, and reliable support services.',
//                 },
//                 {
//                   icon: Eye,
//                   title: 'Our Vision',
//                   text: "To become India's most trusted and innovative consultancy brand delivering excellence across industries.",
//                 },
//               ].map(({ icon: Icon, title, text }, i) => (
//                 <FadeUp key={title} delay={i * 0.1}>
//                   <div className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-700/50 dark:bg-slate-900/60">
//                     <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg transition-transform duration-500 group-hover:scale-110">
//                       <Icon className="h-8 w-8 text-white" />
//                     </div>

//                     <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
//                       {title}
//                     </h3>

//                     <p className="leading-relaxed text-slate-600 dark:text-slate-300">
//                       {text}
//                     </p>
//                   </div>
//                 </FadeUp>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section className="relative overflow-hidden bg-slate-50 section-padding dark:bg-slate-900">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_35%)]" />

//           <div className="page-container relative z-10">
//             <FadeUp>
//               <div className="mb-14 text-center">
//                 <h2 className="mb-4 text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
//                   Our Core
//                   <span className="bg-gradient-to-r from-primary-500 to-blue-500 bg-clip-text text-transparent">
//                     {' '}
//                     Values
//                   </span>
//                 </h2>

//                 <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
//                   Principles that guide our commitment towards clients,
//                   candidates, and long-term partnerships.
//                 </p>
//               </div>
//             </FadeUp>

//             <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
//               {VALUES.map(({ icon: Icon, title, desc }, i) => (
//                 <FadeUp key={title} delay={i * 0.08}>
//                   <div className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/80 p-7 text-center backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-700/50 dark:bg-slate-900/60">
//                     <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg transition-transform duration-500 group-hover:scale-110">
//                       <Icon className="h-8 w-8 text-white" />
//                     </div>

//                     <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
//                       {title}
//                     </h3>

//                     <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
//                       {desc}
//                     </p>
//                   </div>
//                 </FadeUp>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section className="bg-white section-padding dark:bg-slate-950">
//           <div className="page-container mx-auto max-w-4xl">
//             <FadeUp>
//               <div className="mb-14 text-center">
//                 <h2 className="mb-4 text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
//                   Our
//                   <span className="bg-gradient-to-r from-primary-500 to-blue-500 bg-clip-text text-transparent">
//                     {' '}
//                     Journey
//                   </span>
//                 </h2>

//                 <p className="text-lg text-slate-500 dark:text-slate-400">
//                   Milestones that shaped our consultancy success.
//                 </p>
//               </div>
//             </FadeUp>

//             <div className="relative">
//               <div className="absolute bottom-0 left-7 top-0 hidden w-1 rounded-full bg-gradient-to-b from-primary-500 to-blue-500 sm:block" />

//               <div className="space-y-8">
//                 {TIMELINE.map(({ year, title, desc }, i) => (
//                   <FadeUp key={year} delay={i * 0.08}>
//                     <div className="flex gap-6">
//                       <div className="relative z-10 hidden sm:flex">
//                         <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 font-bold text-white shadow-xl">
//                           {year.slice(2)}
//                         </div>
//                       </div>

//                       <div className="relative flex-1 overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700/60 dark:bg-slate-900">
//                         <span className="mb-3 inline-flex rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-600 dark:bg-primary-900/30 sm:hidden">
//                           {year}
//                         </span>

//                         <h3 className="text-xl font-bold text-slate-900 dark:text-white">
//                           {year} - {title}
//                         </h3>

//                         <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
//                           {desc}
//                         </p>
//                       </div>
//                     </div>
//                   </FadeUp>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="relative overflow-hidden bg-slate-50 section-padding dark:bg-slate-900">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_35%)]" />

//           <div className="page-container relative z-10">
//             <FadeUp>
//               <div className="mb-14 text-center">
//                 <h2 className="mb-4 text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
//                   Meet Our
//                   <span className="bg-gradient-to-r from-primary-500 to-blue-500 bg-clip-text text-transparent">
//                     {' '}
//                     Team
//                   </span>
//                 </h2>

//                 <p className="text-lg text-slate-500 dark:text-slate-400">
//                   Dedicated professionals driving ProLink forward.
//                 </p>
//               </div>
//             </FadeUp>

//             <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
//               {TEAM.map(({ name, role, bio }, i) => (
//                 <FadeUp key={name} delay={i * 0.08}>
//                   <div className="group relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/80 p-7 text-center backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-700/50 dark:bg-slate-900/60">
//                     <div className="relative mx-auto mb-5 h-24 w-24">
//                       <div className="absolute inset-0 rotate-6 rounded-3xl bg-gradient-to-br from-primary-500 to-blue-600 transition-transform duration-500 group-hover:rotate-12" />

//                       <div className="relative flex h-full w-full items-center justify-center rounded-3xl bg-slate-900 text-3xl font-bold text-white">
//                         {name[0]}
//                       </div>
//                     </div>

//                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">
//                       {name}
//                     </h3>

//                     <p className="mt-1 font-semibold text-primary-600">
//                       {role}
//                     </p>

//                     <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
//                       {bio}
//                     </p>

//                     <a
//                       href="#"
//                       className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all duration-300 hover:scale-105 dark:bg-blue-900/20"
//                     >
//                       <FaLinkedin className="h-4 w-4" />
//                       Connect
//                     </a>
//                   </div>
//                 </FadeUp>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   )
// }


import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useInView } from 'react-intersection-observer'
import { HiCheckCircle } from 'react-icons/hi'
import { FaLinkedin } from 'react-icons/fa'
import {
  Target,
  Eye,
  Handshake,
  Rocket,
  HeartHandshake,
} from 'lucide-react'


const TEAM = [
  { name: 'Ramesh Kumar',   role: 'Founder & CEO',        img: null, bio: '15+ years in HR & Recruitment across India' },
  { name: 'Priya Nair',     role: 'Head of Operations',   img: null, bio: 'Expert in campus recruitment and talent acquisition' },
  { name: 'Suresh Menon',   role: 'Director – BD',        img: null, bio: 'Pan-India client network with Fortune 500 companies' },
  { name: 'Ananya Reddy',   role: 'Lead CV Consultant',   img: null, bio: 'Certified resume writer with 98% success rate' },
]

const VALUES = [
  {
    icon: Target,
    title: 'Excellence',
    desc: 'We deliver outstanding results by going beyond expectations on every engagement.',
  },
  {
    icon: Handshake,
    title: 'Integrity',
    desc: 'Honest and transparent relationships with clients, candidates, and partners.',
  },
  {
    icon: Rocket,
    title: 'Innovation',
    desc: 'Continuously improving processes using technology and modern recruitment strategies.',
  },
  {
    icon: HeartHandshake,
    title: 'People First',
    desc: 'Every decision starts with the impact it creates for people and businesses.',
  },
]

const TIMELINE = [
  { year: '2015', title: 'Founded in Chennai', desc: 'ProLink started as a small job placement firm with 3 recruiters.' },
  { year: '2017', title: 'Expanded Pan-India', desc: 'Opened offices in Bengaluru, Hyderabad, and Mumbai.' },
  { year: '2019', title: 'Launched CV Writing', desc: 'Added professional resume services, placing 500+ resumes in Year 1.' },
  { year: '2021', title: 'Digital Platform', desc: 'Launched our online portal connecting 5,000+ companies with talent.' },
  { year: '2023', title: 'Diversified Services', desc: 'Added Event Management, Catering and Plant Set-Up divisions.' },
  { year: '2024', title: '10,000+ Placements', desc: 'Crossed the milestone of 10,000 successful candidate placements.' },
]

function FadeUp({ children, delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | ProLink Consultancy</title>
        <meta name="description" content="Learn about ProLink Consultancy — India's trusted HR and recruitment partner since 2015." />
      </Helmet>

      <div className="pt-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="page-container relative text-center">
            <FadeUp>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm font-semibold mb-5">
                 About ProLink
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
                India's Trusted <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">Consultancy Partner</span>
              </h1>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                For nearly a decade, ProLink Consultancy has been connecting top talent with leading companies across India, while delivering world-class HR and business support services.
              </p>
            </FadeUp>
          </div>
        </div>

        {/* Mission & Vision */}
        <section className="section-padding bg-white dark:bg-slate-900">
          <div className="page-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { emoji: <Target />, title: 'Our Mission', text: 'To empower every individual and organization by delivering the right talent, the right services, and the right support — efficiently, ethically, and with care.' },
                { emoji: <Eye />, title: 'Our Vision',  text: 'To be Indias most trusted full-service consultancy, known for excellence in talent placement, HR solutions, and business support across every industry.' },
              ].map(({ emoji, title, text }, i) => (
                <FadeUp key={title} delay={i * 0.1}>
                  <div className="card p-8">
                    <div className="text-4xl mb-4">{emoji}</div>
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{text}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}

         <section className="section-padding bg-gradient-to-b from-slate-50 to-white dark:from-slate-950          dark:to-slate-900 overflow-hidden">
  <div className="page-container">
    <FadeUp>
      <div className="text-center mb-14 max-w-3xl mx-auto">
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary mb-4">
          Our Foundation
        </span>

        <h2 className="section-heading mb-4">
          Our Core <span className="gradient-text">Values</span>
        </h2>

        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed">
          Our values define how we work, collaborate, and create lasting
          impact for businesses and professionals worldwide.
        </p>
      </div>
    </FadeUp>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
      {VALUES.map(({ icon: Icon, title, desc }, i) => (
        <FadeUp key={title} delay={i * 0.08}>
          <div className="group relative h-full rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm p-7 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
            
            {/* Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

            {/* Icon */}
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-8 h-8 text-primary" strokeWidth={2.2} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {title}
              </h3>

              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {desc}
              </p>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 rounded-full" />
          </div>
        </FadeUp>
      ))}
    </div>
  </div>
         </section>
         
        {/* <section className="section-padding bg-slate-50 dark:bg-slate-950">
          <div className="page-container">
            <FadeUp>
              <div className="text-center mb-12">
                <h2 className="section-heading">Our Core <span className="gradient-text">Values</span></h2>
              </div>
            </FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map(({ icon, title, desc }, i) => (
                <FadeUp key={title} delay={i * 0.08}>
                  <div className="card p-6 text-center hover:-translate-y-1 transition-transform">
                    <div className="text-4xl mb-3">{icon}</div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-sm text-slate-500">{desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section> */}

        {/* Timeline */}
        <section className="section-padding bg-white dark:bg-slate-900">
          <div className="page-container max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <h2 className="section-heading">Our <span className="gradient-text">Journey</span></h2>
              </div>
            </FadeUp>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-primary-300 hidden sm:block" />
              <div className="space-y-8">
                {TIMELINE.map(({ year, title, desc }, i) => (
                  <FadeUp key={year} delay={i * 0.06}>
                    <div className="flex gap-6">
                      <div className="relative flex-shrink-0 hidden sm:flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-primary z-10">
                          {year.slice(2)}
                        </div>
                      </div>
                      <div className="card p-5 flex-1">
                        <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1 rounded-full sm:hidden">{year}</span>
                        <p className="font-bold text-slate-900 dark:text-white mt-2 sm:mt-0">{year} — {title}</p>
                        <p className="text-sm text-slate-500 mt-1">{desc}</p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding bg-slate-50 dark:bg-slate-950">
          <div className="page-container">
            <FadeUp>
              <div className="text-center mb-12">
                <h2 className="section-heading">Meet Our <span className="gradient-text">Team</span></h2>
                <p className="section-subheading">The people behind ProLink's success</p>
              </div>
            </FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map(({ name, role, bio }, i) => (
                <FadeUp key={name} delay={i * 0.08}>
                  <div className="card p-6 text-center group hover:-translate-y-1 transition-transform">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-primary group-hover:shadow-lg transition-shadow">
                      <span className="text-white text-2xl font-bold">{name[0]}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{name}</h3>
                    <p className="text-primary-600 text-sm font-semibold mt-0.5">{role}</p>
                    <p className="text-slate-500 text-xs mt-2">{bio}</p>
                    <a href="#" className="inline-flex items-center gap-1 mt-3 text-xs text-blue-600 hover:underline">
                      <FaLinkedin className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
