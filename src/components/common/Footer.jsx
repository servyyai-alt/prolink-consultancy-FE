import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { serviceAPI } from "../../services/api";
import { getServiceRoute } from "../../utils/serviceRoutes";

const footerLinks = {
  company: [
    { label: "About Us", to: "/about" },
    { label: "Blog", to: "/blogs" },
    { label: "Careers", to: "/jobs" },
    { label: "Admin Login", to: "/admin/login" },
    { label: "Contact", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Use", to: "/terms" },
  ],

  candidates: [
    { label: "Browse Jobs", to: "/jobs" },
    { label: "Post Resume", to: "/dashboard/profile" },
    { label: "Career Advice", to: "/blogs" },
    { label: "Campus Drive Info", to: "/campus-drive" },
  ],

  employers: [
    { label: "Post a Job", to: "/employer/post-job" },
    { label: "Browse Candidates", to: "/employer" },
    { label: "Recruitment Solutions", to: "/services/job-consultancy" },
    { label: "Background Verification", to: "/services/background-verification" },
  ],
};

const socials = [
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

const fallbackServices = [
  { slug: "job-consultancy", name: "Job Consultancy" },
  { slug: "campus-drive", name: "Campus Drive" },
  { slug: "background-verification", name: "Background Verification" },
];

export default function Footer() {
  const { data } = useQuery({ queryKey: ["services"], queryFn: serviceAPI.getServices });
  const services = (data?.data?.data?.services?.length ? data.data.data.services : fallbackServices).map((service) => ({
    label: service.name,
    to: getServiceRoute(service.slug),
  }));

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
            <div className="space-y-5 mb-8">

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center             flex-shrink-0">
                  <HiPhone className="w-5 h-5 text-amber-400" />
                </div>
            
                <div className="space-y-1">
                  <a
                    href="tel:+919937047733"
                    className="block text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    +91 99370 47733
                  </a>
            
                  <a
                    href="tel:+917847878898"
                    className="block text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    +91 78478 78898
                  </a>
                </div>
              </div>
            
              {/* Email */}
              <a
                href="mailto:admin@prolinkconsultancy.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <HiMail className="w-5 h-5 text-amber-400" />
                </div>
            
                <span className="text-stone-400 group-hover:text-amber-400 transition-colors break-all">
                  admin@prolinkconsultancy.com
                </span>
              </a>
            
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center             flex-shrink-0">
                  <HiLocationMarker className="w-5 h-5 text-amber-400" />
                </div>
            
                <span className="text-stone-400 leading-relaxed">
                  Bhubaneswar, Khurda, Odisha 751010, India
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
            { title: "Services", links: services },
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

        <p className="text-sm text-stone-600         dark:text-stone-400 text-center md:text-left         leading-relaxed">
          © {new Date().getFullYear()} ProLink Consultancy. 
          All rights reserved. Designed & Developed by{' '}
          <a
            href="https://www.leastactioncompany.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-500         hover:text-amber-400 transition-colors         duration-200 hover:underline"
          >
            Least Action Company Pvt Ltd
          </a>.
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
