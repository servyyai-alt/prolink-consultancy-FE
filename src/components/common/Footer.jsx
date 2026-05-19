// import { Link } from 'react-router-dom'
// import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
// import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'

// const footerLinks = {
//   company:   [{ label: 'About Us', to: '/about' }, { label: 'Blog', to: '/blogs' }, { label: 'Careers', to: '/jobs' }, { label: 'Contact', to: '/contact' }],
//   services:  [{ label: 'Job Consultancy', to: '/services/job-consultancy' }, { label: 'CV Writing', to: '/cv-writing' }, { label: 'Campus Drive', to: '/campus-drive' }, { label: 'Event Management', to: '/events' }, { label: 'Catering Services', to: '/catering' }, { label: 'HR Outsourcing', to: '/services/hr-outsourcing' }],
//   jobSeekers:[{ label: 'Browse Jobs', to: '/jobs' }, { label: 'Post Resume', to: '/dashboard/profile' }, { label: 'Salary Guide', to: '/blogs' }, { label: 'Career Advice', to: '/blogs' }],
//   employers: [{ label: 'Post a Job', to: '/employer/post-job' }, { label: 'Browse Candidates', to: '/employer' }, { label: 'Recruitment Solutions', to: '/services/job-consultancy' }, { label: 'Pricing', to: '/cv-writing' }],
// }

// export default function Footer() {
//   return (
//     <footer className="bg-[#120e0d] text-stone-300">
//       {/* CTA Strip */}
//       <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-[#21130d]">
//         <div className="page-container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
//           <div>
//             <h3 className="text-2xl font-display font-bold text-white">Ready to build a stronger workforce?</h3>
//             <p className="text-amber-100/80 mt-1">Recruitment, staffing, and business support designed for ambitious brands.</p>
//           </div>
//           <div className="flex gap-3 flex-shrink-0">
//             <Link to="/jobs"     className="px-5 py-2.5 bg-white text-primary-800 font-bold rounded-xl hover:bg-amber-50 transition-colors">Find Jobs</Link>
//             <Link to="/register" className="px-5 py-2.5 bg-accent-400 text-stone-950 font-bold rounded-xl hover:bg-accent-300 transition-colors">Get Started</Link>
//           </div>
//         </div>
//       </div>

//       {/* Main Footer */}
//       <div className="page-container py-14">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
//           {/* Brand */}
//           <div className="lg:col-span-2">
//             <Link to="/" className="flex items-center gap-2.5 mb-4">
//               <div className="relative w-11 h-11 flex items-center justify-center">
//                 <span className="absolute top-0 left-1/2 w-2.5 h-2.5 rounded-full bg-primary-700 -translate-x-1/2" />
//                 <span className="absolute left-0 top-4 w-2.5 h-2.5 rounded-full bg-primary-700" />
//                 <span className="absolute right-0 top-4 w-2.5 h-2.5 rounded-full bg-primary-700" />
//                 <div className="w-9 h-9 rounded-full border-[5px] border-accent-400" />
//               </div>
//               <div>
//                 <span className="font-sans font-extrabold text-xl text-white">Pro<span className="text-accent-400">l</span>ink</span>
//                 <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mt-1">Staffing Consultancy</p>
//               </div>
//             </Link>
//             <p className="text-slate-400 text-sm leading-relaxed mb-6">
//               Your trusted partner for executive staffing, candidate placement, workforce planning, and operational support across India.
//             </p>
//             <div className="space-y-2.5 text-sm">
//               <a href="tel:+919876543210" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors">
//                 <HiPhone className="w-4 h-4 text-accent-400 flex-shrink-0" />+91 98765 43210
//               </a>
//               <a href="mailto:info@prolinkconsultancy.com" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors">
//                 <HiMail className="w-4 h-4 text-accent-400 flex-shrink-0" />info@prolinkconsultancy.com
//               </a>
//               <p className="flex items-start gap-2.5 text-slate-400">
//                 <HiLocationMarker className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />123 Business District, Chennai, Tamil Nadu 600001
//               </p>
//             </div>
//           </div>

//           {/* Links */}
//           {[
//             { title: 'Company',    links: footerLinks.company },
//             { title: 'Services',   links: footerLinks.services },
//             { title: 'Job Seekers',links: footerLinks.jobSeekers },
//             { title: 'Employers',  links: footerLinks.employers },
//           ].map(({ title, links }) => (
//             <div key={title}>
//               <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">{title}</h4>
//               <ul className="space-y-2.5">
//                 {links.map(({ label, to }) => (
//                   <li key={label}>
//                     <Link to={to} className="text-sm text-slate-400 hover:text-white transition-colors">{label}</Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Bottom bar */}
//       <div className="border-t border-slate-800">
//         <div className="page-container py-5 flex flex-col md:flex-row items-center justify-between gap-4">
//           <p className="text-slate-500 text-sm">© {new Date().getFullYear()} ProLink Consultancy. All rights reserved.</p>
//           <div className="flex items-center gap-4">
//             {[
//               { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
//               { icon: FaTwitter,  href: '#', label: 'Twitter' },
//               { icon: FaFacebook, href: '#', label: 'Facebook' },
//               { icon: FaInstagram,href: '#', label: 'Instagram' },
//               { icon: FaYoutube,  href: '#', label: 'YouTube' },
//             ].map(({ icon: Icon, href, label }) => (
//               <a key={label} href={href} aria-label={label}
//                 className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-900 text-stone-400 hover:bg-accent-400 hover:text-stone-950 transition-all">
//                 <Icon className="w-3.5 h-3.5" />
//               </a>
//             ))}
//           </div>
//           <div className="flex gap-4 text-slate-500 text-xs">
//             <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
//             <Link to="/terms"   className="hover:text-white transition-colors">Terms of Service</Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }


import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiArrowRight,
} from "react-icons/hi";

import Logo from "../../assets/logo.jpeg";

const footerLinks = {
  company: [
    { label: "About Us", to: "/about" },
    { label: "Blog", to: "/blogs" },
    { label: "Careers", to: "/jobs" },
    { label: "Contact", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Use", to: "/terms" },
  ],

  services: [
    { label: "Job Consultancy", to: "/services/job-consultancy" },
    { label: "CV Writing", to: "/cv-writing" },
    { label: "Campus Drive", to: "/campus-drive" },
    { label: "HR Outsourcing", to: "/services/hr-outsourcing" },
  ],

  candidates: [
    { label: "Browse Jobs", to: "/jobs" },
    { label: "Post Resume", to: "/dashboard/profile" },
    { label: "Career Advice", to: "/blogs" },
    { label: "CV Writing Help", to: "/cv-writing" },
  ],

  employers: [
    { label: "Post a Job", to: "/employer/post-job" },
    { label: "Browse Candidates", to: "/employer" },
    { label: "Recruitment Solutions", to: "/services/job-consultancy" },
    { label: "Staffing Support", to: "/services/hr-outsourcing" },
  ],
};

const socials = [
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0b0806] text-stone-400">

      {/* ===== Background Effects ===== */}
      <div className="absolute inset-0">

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#8B2A0F]/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      {/* ===== CTA Section ===== */}
      <div className="relative z-10 border-b border-white/10">

        <div className="page-container py-20">

          <div
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border border-white/10
              bg-gradient-to-br
              from-[#8B2A0F]
              via-[#6b1f0b]
              to-[#120c08]
              px-8 py-12
              md:px-14 md:py-16
            "
          >

            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-400/10 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-10">

              <div className="max-w-2xl text-center xl:text-left">

                <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-amber-300 font-bold mb-5">
                  <span className="w-8 h-px bg-amber-300" />
                  Ready To Begin?
                </span>

                <h3
                  className="
                    text-3xl
                    md:text-5xl
                    font-bold
                    text-white
                    leading-tight
                    mb-5
                  "
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Build a stronger workforce with a consultancy clients trust.
                </h3>

                <p className="text-amber-100/75 text-lg leading-relaxed">
                  Premium staffing solutions, candidate placement, and
                  workforce support designed for modern businesses.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">

                <Link
                  to="/jobs"
                  className="
                    inline-flex items-center justify-center gap-2
                    px-8 py-4
                    rounded-2xl
                    bg-white
                    hover:bg-amber-50
                    text-[#8B2A0F]
                    font-bold
                    transition-all duration-300
                    hover:scale-[1.03]
                  "
                >
                  Find Jobs
                  <HiArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="
                    inline-flex items-center justify-center gap-2
                    px-8 py-4
                    rounded-2xl
                    bg-amber-400
                    hover:bg-amber-300
                    text-stone-950
                    font-bold
                    transition-all duration-300
                    hover:scale-[1.03]
                  "
                >
                  Book Consultation
                  <HiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main Footer ===== */}
      <div className="relative z-10 page-container py-20">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-14">

          {/* ===== Brand ===== */}
          <div className="xl:col-span-2">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-4 mb-7 group"
            >

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md">
                <img
                  src={Logo}
                  alt="ProLink Consultancy"
                  className="
                    h-16
                    w-auto
                    object-contain
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                />
              </div>

              {/* <div>

                <h2
                  className="text-3xl font-bold text-white leading-none"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Pro<span className="text-amber-400">Link</span>
                </h2>

                <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500 mt-2">
                  Consultancy
                </p>
              </div> */}
            </Link>

            <p className="text-stone-500 leading-relaxed mb-8 max-w-sm">
              Your trusted consultancy partner for staffing, workforce
              planning, recruitment support, and candidate success across India.
            </p>

            {/* Contact */}
            <div className="space-y-4 mb-8">

              <a
                href="tel:+919876543210"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <HiPhone className="w-5 h-5 text-amber-400" />
                </div>

                <span className="text-stone-400 group-hover:text-amber-400 transition-colors">
                  +91 98765 43210
                </span>
              </a>

              <a
                href="mailto:info@prolinkconsultancy.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <HiMail className="w-5 h-5 text-amber-400" />
                </div>

                <span className="text-stone-400 group-hover:text-amber-400 transition-colors">
                  info@prolinkconsultancy.com
                </span>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <HiLocationMarker className="w-5 h-5 text-amber-400" />
                </div>

                <span className="text-stone-500 leading-relaxed">
                  Chennai, Tamil Nadu, India
                </span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">

              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="
                    w-11 h-11
                    rounded-xl
                    border border-white/10
                    bg-white/5
                    flex items-center justify-center
                    text-stone-500
                    hover:bg-amber-400
                    hover:text-stone-950
                    hover:border-amber-400
                    transition-all duration-300
                  "
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ===== Links ===== */}
          {[
            { title: "Company", links: footerLinks.company },
            { title: "Services", links: footerLinks.services },
            { title: "Candidates", links: footerLinks.candidates },
            { title: "Employers", links: footerLinks.employers },
          ].map(({ title, links }) => (

            <div key={title}>

              <h4 className="text-white font-bold uppercase tracking-[0.2em] text-sm mb-6">
                {title}
              </h4>

              <ul className="space-y-3">

                {links.map(({ label, to }) => (
                  <li key={label}>

                    <Link
                      to={to}
                      className="
                        text-stone-500
                        hover:text-amber-400
                        transition-all duration-300
                        inline-flex items-center gap-2 group
                      "
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-amber-400 transition-all duration-300" />

                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="relative z-10 border-t border-white/10">

        <div className="page-container py-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-sm text-stone-600 text-center md:text-left">
              © {new Date().getFullYear()} ProLink Consultancy.
              All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-sm text-stone-600">

              <Link
                to="/privacy"
                className="hover:text-amber-400 transition-colors"
              >
                Privacy Policy
              </Link>

              <span className="w-px h-4 bg-white/10" />

              <Link
                to="/terms"
                className="hover:text-amber-400 transition-colors"
              >
                Terms
              </Link>

              <span className="w-px h-4 bg-white/10" />

              <Link
                to="/contact"
                className="hover:text-amber-400 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// import { Link } from 'react-router-dom'
// import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
// import { HiMail, HiPhone, HiLocationMarker, HiArrowRight } from 'react-icons/hi'
// import Logo from '../../assets/logo.jpeg'

// const footerLinks = {
//   company:   [
//     { label: 'About Us',      to: '/about' },
//     { label: 'Blog',          to: '/blogs' },
//     { label: 'Careers',       to: '/jobs' },
//     { label: 'Contact',       to: '/contact' },
//     { label: 'Privacy Policy',to: '/privacy' },
//     { label: 'Terms of Use',  to: '/terms' },
//   ],
//   services:  [
//     { label: 'Job Consultancy',        to: '/services/job-consultancy' },
//     { label: 'CV Writing',             to: '/cv-writing' },
//     { label: 'Campus Drive',           to: '/campus-drive' },
//     { label: 'Event Management',       to: '/events' },
//     { label: 'Catering Services',      to: '/catering' },
//     { label: 'HR Outsourcing',         to: '/services/hr-outsourcing' },
//     { label: 'Background Verification',to: '/services/background-verification' },
//   ],
//   candidates:[
//     { label: 'Browse Jobs',     to: '/jobs' },
//     { label: 'Post Resume',     to: '/dashboard/profile' },
//     { label: 'Career Advice',   to: '/blogs' },
//     { label: 'Salary Guide',    to: '/blogs' },
//     { label: 'CV Writing Help', to: '/cv-writing' },
//   ],
//   employers: [
//     { label: 'Post a Job',             to: '/employer/post-job' },
//     { label: 'Browse Candidates',      to: '/employer' },
//     { label: 'Recruitment Solutions',  to: '/services/job-consultancy' },
//     { label: 'Campus Hiring',          to: '/campus-drive' },
//     { label: 'Staffing Support',       to: '/services/hr-outsourcing' },
//   ],
// }

// const socials = [
//   { icon: FaLinkedin,  href: '#', label: 'LinkedIn' },
//   { icon: FaTwitter,   href: '#', label: 'Twitter' },
//   { icon: FaFacebook,  href: '#', label: 'Facebook' },
//   { icon: FaInstagram, href: '#', label: 'Instagram' },
//   { icon: FaYoutube,   href: '#', label: 'YouTube' },
// ]

// export default function Footer() {
//   return (
//     <footer className="bg-[#0f0a07] text-stone-400">

//       {/* ── CTA banner ── */}
//       <div className="border-b border-[#2a1a0a]">
//         <div className="page-container py-14">
//           <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
//             <div className="max-w-xl">
//               <span className="inline-block text-[10px] uppercase tracking-[0.35em] text-amber-500 font-bold mb-3">
//                 Ready to begin?
//               </span>
//               <h3 className="text-3xl font-bold text-white leading-tight"
//                 style={{ fontFamily: "'Georgia', serif" }}>
//                 Build a stronger workforce with a consultancy that moves fast and delivers trust.
//               </h3>
//               <p className="mt-3 text-stone-400 text-sm leading-relaxed">
//                 Hiring support, candidate placement, and business staffing — done with professionalism from day one.
//               </p>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
//               <Link to="/jobs"
//                 className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#8B2A0F] font-bold rounded-xl hover:bg-amber-50 transition-colors text-sm">
//                 Find Jobs <HiArrowRight className="w-4 h-4" />
//               </Link>
//               <Link to="/contact"
//                 className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 text-stone-950 font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm">
//                 Book a Consultation <HiArrowRight className="w-4 h-4" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Main footer body ── */}
//       <div className="page-container py-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-10 xl:gap-8">

//           {/* Brand column */}
//           <div className="xl:col-span-2">
//             {/* Logo */}
//                         <Link
//                           to="/"
//                           className="flex items-center gap-3 group flex-shrink-0"
//                         >
                        
//                           {/* Logo Image */}
//                           <div className="relative overflow-hidden rounded-xl">
//                           <img
//                             src={Logo}
//                   alt="ProLink Consultancy"
//                   className="
//                     h-12
//                     w-auto
//                     object-contain
//                     transition-all duration-300
//                     group-hover:scale-105
//                   "
//                           />
//                                     </div>
                                  
//                                     {/* Company Name */}
//                                     <div className="leading-none">
                      
//                           <div className="flex items-baseline gap-1">
            
//                   <span
//                     className="
//                       font-extrabold
//                       text-[22px]
//                       tracking-tight
//                       text-white
//                       leading-none
//                     "
//                     style={{ fontFamily: "'Georgia', serif" }}
//                   >
//                     Pro
//                   </span>
            
//                   <span
//                     className="
//                       font-extrabold
//                       text-[22px]
//                       tracking-tight
//                       text-amber-500
//                       leading-none
//                     "
//                     style={{ fontFamily: "'Georgia', serif" }}
//                   >
//                     Link
//                   </span>
//                           </div>
                      
//                           <p
//                   className="
//                     text-[9px]
//                     uppercase
//                     tracking-[0.32em]
//                     text-stone-400
//                     dark:text-stone-500
//                     mt-1
//                   "
//                 >
//                   Consultancy
//                           </p>
//                           </div>
//                         </Link>

//             <p className="text-sm text-stone-500 leading-relaxed mb-6 max-w-xs">
//               Your trusted partner for executive staffing, candidate placement, workforce planning, and operational support across India.
//             </p>

//             <div className="space-y-3 text-sm mb-8">
//               <a href="tel:+919876543210"
//                 className="flex items-center gap-3 text-stone-400 hover:text-amber-400 transition-colors">
//                 <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1c1007] flex items-center justify-center border border-amber-900/30">
//                   <HiPhone className="w-3.5 h-3.5 text-amber-500" />
//                 </span>
//                 +91 98765 43210
//               </a>
//               <a href="mailto:info@prolinkconsultancy.com"
//                 className="flex items-center gap-3 text-stone-400 hover:text-amber-400 transition-colors">
//                 <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1c1007] flex items-center justify-center border border-amber-900/30">
//                   <HiMail className="w-3.5 h-3.5 text-amber-500" />
//                 </span>
//                 info@prolinkconsultancy.com
//               </a>
//               <p className="flex items-start gap-3 text-stone-500">
//                 <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1c1007] flex items-center justify-center border border-amber-900/30">
//                   <HiLocationMarker className="w-3.5 h-3.5 text-amber-500" />
//                 </span>
//                 123 Business District, Chennai, Tamil Nadu 600001
//               </p>
//             </div>

//             {/* Socials */}
//             <div className="flex items-center gap-2">
//               {socials.map(({ icon: Icon, href, label }) => (
//                 <a key={label} href={href} aria-label={label}
//                   className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1c1007] border border-amber-900/20 text-stone-500 hover:bg-amber-400 hover:text-stone-950 hover:border-amber-400 transition-all">
//                   <Icon className="w-3.5 h-3.5" />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Links columns */}
//           {[
//             { title: 'Company',    links: footerLinks.company },
//             { title: 'Services',   links: footerLinks.services },
//             { title: 'Candidates', links: footerLinks.candidates },
//             { title: 'Employers',  links: footerLinks.employers },
//           ].map(({ title, links }) => (
//             <div key={title}>
//               <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-5">
//                 {title}
//               </h4>
//               <ul className="space-y-2.5">
//                 {links.map(({ label, to }) => (
//                   <li key={label}>
//                     <Link to={to}
//                       className="text-sm text-stone-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 group">
//                       <span className="w-0 group-hover:w-2 h-px bg-amber-400 transition-all duration-200" />
//                       {label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Divider ── */}
//       <div className="border-t border-[#1e1208]">
//         <div className="page-container py-5">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-stone-600 text-sm">
//               © {new Date().getFullYear()} ProLink Consultancy. All rights reserved.
//             </p>
//             <div className="flex items-center gap-5 text-xs text-stone-600">
//               <Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
//               <span className="w-px h-3 bg-stone-700" />
//               <Link to="/terms"   className="hover:text-amber-400 transition-colors">Terms of Service</Link>
//               <span className="w-px h-3 bg-stone-700" />
//               <Link to="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }