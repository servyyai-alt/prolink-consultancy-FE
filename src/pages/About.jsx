import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useInView } from 'react-intersection-observer'
import { useQuery } from '@tanstack/react-query'
import { FaLinkedin } from 'react-icons/fa'
import { Target, Eye, Handshake, Rocket, HeartHandshake } from 'lucide-react'
import { teamMemberAPI } from '../services/api'


const TEAM = [
  { name: 'Ramesh Kumar', role: 'Founder & CEO', bio: '15+ years in HR and recruitment across India.' },
  { name: 'Priya Nair', role: 'Head of Operations', bio: 'Expert in campus recruitment and talent acquisition.' },
  { name: 'Suresh Menon', role: 'Director - BD', bio: 'Leads strategic partnerships with employers across sectors.' },
  { name: 'Ananya Reddy', role: 'Lead Verification Specialist', bio: 'Focused on compliant background screening and hiring trust.' },
]

const VALUES = [
  { icon: Target, title: 'Excellence', desc: 'We deliver polished, outcome-focused work on every engagement.' },
  { icon: Handshake, title: 'Integrity', desc: 'Honest communication and dependable execution shape every relationship.' },
  { icon: Rocket, title: 'Innovation', desc: 'We improve recruitment workflows with practical, modern thinking.' },
  { icon: HeartHandshake, title: 'People First', desc: 'We keep both business outcomes and human impact in view.' },
]

const TIMELINE = [
  { year: '2015', title: 'Founded in Odisha', desc: 'ProLink began as a focused recruitment consultancy serving local employers.' },
  { year: '2017', title: 'Expanded Pan-India', desc: 'Client partnerships grew across Bengaluru, Hyderabad, Mumbai, and beyond.' },
  { year: '2019', title: 'Stronger Job Consultancy', desc: 'Candidate placement services expanded across more roles and industries.' },
  { year: '2021', title: 'Digital Platform', desc: 'Online hiring workflows made ProLink faster and easier to engage with.' },
  { year: '2023', title: 'Verification Services', desc: 'Background verification support launched for more confident hiring.' },
  { year: '2024', title: '10,000+ Placements', desc: 'A major milestone reflecting years of consistent delivery and trust.' },
]

function FadeUp({ children, delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  const { data } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => teamMemberAPI.getTeamMembers(),
  })

  const teamMembers = data?.data?.data?.teamMembers?.length ? data.data.data.teamMembers : TEAM

  return (
    <>
      <Helmet>
        <title>About Us | ProLink Consultancy</title>
        <meta name="description" content="Learn about ProLink Consultancy — India's trusted HR and recruitment partner since 2015." />
      </Helmet>

      <div className="pt-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 py-20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="page-container relative text-center">
            <FadeUp>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/20 px-4 py-2 text-sm font-semibold text-primary-300">
                About ProLink
              </span>
              <h1 className="mb-5 text-4xl font-display font-bold text-white md:text-5xl">
                India&apos;s Trusted <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">Consultancy Partner</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-300">
                For nearly a decade, ProLink Consultancy has connected top talent with leading companies through job consultancy, campus drives, and trusted background verification.
              </p>
            </FadeUp>
          </div>
        </div>

        <section className="section-padding bg-white dark:bg-slate-900">
          <div className="page-container">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[
                {
                  icon: Target,
                  title: 'Our Mission',
                  text: 'To empower organizations and professionals with the right talent, the right services, and the right support - delivered efficiently and ethically.',
                },
                {
                  icon: Eye,
                  title: 'Our Vision',
                  text: 'To be India\'s most trusted consultancy for talent placement, campus hiring, and background verification across industries.',
                },
              ].map(({ icon: Icon, title, text }, index) => (
                <FadeUp key={title} delay={index * 0.08}>
                  <div className="card p-8">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h2 className="mb-3 text-xl font-display font-bold text-slate-900 dark:text-white">{title}</h2>
                    <p className="leading-relaxed text-slate-600 dark:text-slate-300">{text}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-gradient-to-b from-slate-50 to-white section-padding dark:from-slate-950 dark:to-slate-900">
          <div className="page-container">
            <FadeUp>
              <div className="mx-auto mb-14 max-w-3xl text-center">
                <span className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                  Our Foundation
                </span>
                <h2 className="section-heading mb-4">
                  Our Core <span className="gradient-text">Values</span>
                </h2>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
                  These principles define how we collaborate, communicate, and create long-term value for businesses and professionals.
                </p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map(({ icon: Icon, title, desc }, index) => (
                <FadeUp key={title} delay={index * 0.08}>
                  <div className="group relative h-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition duration-500 group-hover:opacity-100" />
                    <div className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110 dark:bg-primary/20">
                      <Icon className="h-8 w-8 text-primary" strokeWidth={2.2} />
                    </div>
                    <div className="relative z-10 text-center">
                      <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 w-0 rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500 group-hover:w-full" />
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white dark:bg-slate-900">
          <div className="page-container mx-auto max-w-3xl">
            <FadeUp>
              <div className="mb-12 text-center">
                <h2 className="section-heading">
                  Our <span className="gradient-text">Journey</span>
                </h2>
              </div>
            </FadeUp>

            <div className="relative">
              <div className="absolute bottom-0 left-6 top-0 hidden w-0.5 bg-gradient-to-b from-primary-500 to-primary-300 sm:block" />
              <div className="space-y-8">
                {TIMELINE.map(({ year, title, desc }, index) => (
                  <FadeUp key={year} delay={index * 0.06}>
                    <div className="flex gap-6">
                      <div className="relative hidden flex-shrink-0 sm:flex">
                        <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white shadow-primary">
                          {year.slice(2)}
                        </div>
                      </div>
                      <div className="card flex-1 p-5">
                        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-600 dark:bg-primary-900/20 sm:hidden">
                          {year}
                        </span>
                        <p className="mt-2 font-bold text-slate-900 dark:text-white sm:mt-0">
                          {year} - {title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{desc}</p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

      <section className="section-padding bg-slate-50 dark:bg-slate-950">
        <div className="page-container">

    <FadeUp>
      <div className="mb-14 text-center">

        <span className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
          Our Professionals
        </span>

        <h2 className="section-heading">
          Meet Our <span className="gradient-text">Team</span>
        </h2>

        <p className="section-subheading">
          The passionate professionals behind ProLink&apos;s success
        </p>

      </div>
    </FadeUp>

    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">

      {teamMembers.map(
        (
          {
            _id,
            name,
            role,
            bio,
            linkedinUrl,
            image,
          },
          index
        ) => (

          <FadeUp
            key={_id || `${name}-${index}`}
            delay={index * 0.08}
          >

            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/70">

              {/* PRIMARY GLOW */}
              <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

              {/* SECONDARY GLOW */}
              <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20" />

              {/* SHINE EFFECT */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />

              {/* TOP BORDER */}
              <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-primary via-blue-500 to-primary transition-all duration-500 group-hover:w-full" />

              <div className="relative z-10 text-center">

                {/* IMAGE */}
                {image?.url ? (
                  <div className="relative mx-auto mb-5 w-fit">

                    <img
                      src={image.url}
                      alt={name}
                      className="h-24 w-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-primary"
                    />

                    <div className="absolute inset-0 rounded-3xl ring-2 ring-primary/20 transition-all duration-500 group-hover:ring-primary/40" />

                  </div>
                ) : (
                  <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-primary">

                    <span className="text-3xl font-bold text-white">
                      {name[0]}
                    </span>

                  </div>
                )}

                {/* NAME */}
                <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-primary dark:text-white">
                  {name}
                </h3>

                {/* ROLE */}
                <div className="mt-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold tracking-wide text-primary dark:border-primary/30 dark:bg-primary/20">
                  {role}
                </div>

                {/* BIO */}
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {bio}
                </p>

                {/* LINKEDIN BUTTON */}
                {linkedinUrl ? (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                  >
                    <FaLinkedin className="h-4 w-4" />
                    Connect
                  </a>
                ) : null}

              </div>

              {/* BOTTOM BORDER */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary via-blue-500 to-primary transition-all duration-500 group-hover:w-full" />

            </div>

          </FadeUp>
        )
      )}

    </div>
        </div>
      </section>
      </div>
    </>
  )
}
