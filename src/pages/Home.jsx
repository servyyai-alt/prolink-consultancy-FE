import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CountUp from "react-countup";
import { Helmet } from "react-helmet-async";
import {
  HiArrowRight,
  HiChevronDown,
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
    title: "Background Verification",
    description:
      "Structured verification checks that help employers hire with confidence and reduce onboarding risk.",
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
  const [openService, setOpenService] = useState(null);
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
                    "Background Verification",
                    "Campus Drive Solutions",
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
                          text: "Job consultancy, campus hiring, and background verification solutions.",
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
              {SERVICES.map((s, i) => {
                const isOpen = openService === s.title;

                return (
                  <Reveal key={s.title} delay={i * 0.08}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenService(isOpen ? null : s.title)}
                      className={`group w-full rounded-2xl border text-left transition-all p-7 ${
                        isOpen
                          ? "border-amber-300/80 bg-amber-50/50 shadow-lg shadow-amber-900/5 dark:border-amber-800/70 dark:bg-[#1f1309]"
                          : "border-stone-200 bg-stone-50 hover:border-amber-300/60 hover:bg-amber-50/30 dark:border-stone-800 dark:bg-[#1a1108] dark:hover:border-amber-800/60 dark:hover:bg-[#1f1309]"
                      }`}
                    >
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
                        <div className="flex items-start justify-between gap-4">
                          <h3
                            className="text-xl font-bold text-stone-900 dark:text-white"
                            style={{ fontFamily: "'Georgia', serif" }}
                          >
                            {s.title}
                          </h3>
                          <HiChevronDown
                            className={`mt-1 h-5 w-5 flex-shrink-0 text-stone-400 transition-transform ${
                              isOpen ? "rotate-180 text-amber-500" : "group-hover:text-amber-500"
                            }`}
                          />
                        </div>
                        <motion.div
                          initial={false}
                          animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-3 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                            {s.description}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1.5 text-xs font-semibold text-[#8B2A0F] dark:bg-amber-400/10 dark:text-amber-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            {s.detail}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </button>
                </Reveal>
                );
              })}
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
                    href="tel:+9199370 47733"
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
