import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useInView } from 'react-intersection-observer'
import { FaLinkedin } from 'react-icons/fa'
import { Target, Eye, Handshake, Rocket, HeartHandshake } from 'lucide-react'


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
  { year: '2015', title: 'Founded in Chennai', desc: 'ProLink began as a focused recruitment consultancy serving local employers.' },
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
              <div className="mb-12 text-center">
                <h2 className="section-heading">
                  Meet Our <span className="gradient-text">Team</span>
                </h2>
                <p className="section-subheading">The people behind ProLink&apos;s success</p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM.map(({ name, role, bio }, index) => (
                <FadeUp key={name} delay={index * 0.08}>
                  <div className="card group p-6 text-center transition-transform hover:-translate-y-1">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 shadow-primary transition-shadow group-hover:shadow-lg">
                      <span className="text-2xl font-bold text-white">{name[0]}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{name}</h3>
                    <p className="mt-0.5 text-sm font-semibold text-primary-600">{role}</p>
                    <p className="mt-2 text-xs text-slate-500">{bio}</p>
                    <a href="#" className="mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      <FaLinkedin className="h-3.5 w-3.5" /> LinkedIn
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
