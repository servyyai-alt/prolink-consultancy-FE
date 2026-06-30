import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { HiCheckCircle, HiStar, HiArrowRight, HiUpload } from 'react-icons/hi'
import { CV_PLANS } from '../constants/index'
import { selectIsLoggedIn, selectUser } from '../redux/slices/authSlice'
import { useRazorpay } from '../hooks/index'
import toast from 'react-hot-toast'
import SEO from '../components/SEO'
import { faqSchema, webPageSchema } from '../utils/schema'

const FAQS = [
  {
    question: 'What is included in professional CV writing services?',
    answer:
      'Our professional CV writing services include resume structure, content rewrites, keyword alignment, ATS formatting, and clearer positioning for your target role. We shape the document so hiring teams can understand your value quickly while keeping the language natural and readable.',
  },
  {
    question: 'Do you write ATS-friendly resumes?',
    answer:
      'Yes. Every CV is designed to be ATS-friendly, which means the formatting is simple enough for applicant tracking systems to parse correctly. We also place relevant keywords and role-specific language carefully so your profile stays readable for humans and machines.',
  },
  {
    question: 'Can you help with executive resume writing services?',
    answer:
      'Yes. We support executive resume writing services for experienced professionals, managers, and leaders who need stronger positioning. The focus is on impact, measurable outcomes, and strategic wording that reflects seniority without sounding overdone.',
  },
  {
    question: 'Is this a good option for professionals in Odisha and Bhubaneswar?',
    answer:
      'Absolutely. We regularly work with candidates looking for CV writing agency support in Odisha and Bhubaneswar. The service is remote-friendly, so you can order from anywhere while still getting local context and market-aware positioning.',
  },
  {
    question: 'How fast can you deliver a CV?',
    answer:
      'Delivery speed depends on the plan you choose and how complete your inputs are, but the process is intentionally streamlined. Once we receive your details, we work through content, formatting, and final review so you can move quickly into applications and interviews.',
  },
  {
    question: 'Do you offer affordable CV writing services?',
    answer:
      'Yes. We offer affordable CV writing services for different experience levels, from freshers to executives. The goal is to keep the service practical and useful, so you get a polished resume without paying for unnecessary extras.',
  },
  {
    question: 'What if I need LinkedIn or cover letter support too?',
    answer:
      'Some plans already include LinkedIn optimisation and cover letter support. If you need extra help, we can guide you toward the right package so your CV, profile, and application story stay aligned across platforms.',
  },
  {
    question: 'How do I order the best CV writing service for professionals?',
    answer:
      'Choose a plan, share your existing resume or work history, and tell us which roles you are targeting. That gives us enough context to tailor the best CV writing service for professionals who want a sharper story, better keywords, and stronger interview conversion.',
  },
]

export default function CvWriting() {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const user = useSelector(selectUser)
  const { initiatePayment } = useRazorpay()
  const [selected, setSelected] = useState(null)

  const handleOrder = async (plan) => {
    if (!isLoggedIn) { toast.error('Please login to order'); return }
    await initiatePayment({
      amount: plan.price,
      type: 'cv_writing',
      description: `CV Writing — ${plan.name} Plan`,
      prefill: { name: user?.firstName + ' ' + user?.lastName, email: user?.email, contact: user?.phone },
      onSuccess: () => toast.success('CV order placed! Our team will contact you shortly.'),
    })
  }

  return (
    <>
      <SEO
        title="Professional CV Writing Services in Odisha | ProLink Consultancy"
        description="Need a CV writing agency in Bhubaneswar or Odisha? ProLink Consultancy offers professional CV writing services, executive resume writing, and ATS-friendly profiles."
        keywords="professional CV writing services, CV writing agency in Bhubaneswar, executive resume writing, ATS resume"
        schemas={[
          webPageSchema({
            name: 'Professional CV Writing Services in Odisha',
            description:
              'ATS-friendly CV writing support, executive resume writing, and profile optimisation for professionals in Odisha and Bhubaneswar.',
          }),
          faqSchema(FAQS),
        ]}
      />
      <div className="pt-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="page-container relative text-center">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
              <span className="badge-primary mb-4">✍️ Professional CV Writing</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
                Get a Resume That <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">Gets You Hired</span>
              </h1>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
                Our certified resume writers craft ATS-optimised CVs that pass automated filters and impress hiring managers. It is a practical CV writing service for professionals in Odisha, Bhubaneswar, and across India.
              </p>
              <div className="flex flex-wrap gap-6 justify-center text-slate-300 text-sm">
                {["98% ATS Pass Rate","3,000+ Resumes Delivered","48hr Turnaround","Industry-Specific Writers"].map(f => (
                  <span key={f} className="flex items-center gap-2"><HiCheckCircle className="w-4 h-4 text-green-400" />{f}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Pricing */}
        <div className="section-padding bg-slate-50 dark:bg-slate-950">
          <div className="page-container">
            <div className="text-center mb-14">
              <h2 className="section-heading">Choose Your <span className="gradient-text">Plan</span></h2>
              <p className="section-subheading">All plans include ATS optimisation and professional formatting</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {CV_PLANS.map((plan, i) => (
                <motion.div key={plan.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }}
                  className={`card p-7 relative flex flex-col ${plan.isPopular ? 'border-2 border-primary-500 shadow-primary' : ''}`}>
                  {plan.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                      ⭐ Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                  <div className="my-4">
                    <span className="text-4xl font-display font-bold text-slate-900 dark:text-white">₹{plan.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-5">Delivery in {plan.delivery} · {plan.revisions === -1 ? 'Unlimited' : plan.revisions} revision{plan.revisions !== 1 ? 's' : ''}</p>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <HiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleOrder(plan)} className={plan.isPopular ? 'btn-primary w-full py-3' : 'btn-secondary w-full py-3'}>
                    Order Now — ₹{plan.price.toLocaleString()}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="section-padding bg-white dark:bg-slate-900">
          <div className="page-container max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-heading">How It <span className="gradient-text">Works</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: 1, icon: '📤', title: 'Upload Resume', desc: 'Share your existing CV or fill in your details' },
                { step: 2, icon: '💳', title: 'Choose & Pay', desc: 'Select your plan and complete secure payment' },
                { step: 3, icon: '✍️', title: 'Expert Writes', desc: 'A certified writer crafts your ATS resume' },
                { step: 4, icon: '📧', title: 'Receive & Apply', desc: 'Get your polished resume and start applying!' },
              ].map(({ step, icon, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl mx-auto mb-3">{icon}</div>
                  <div className="inline-flex w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold items-center justify-center mb-2">{step}</div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="section-padding bg-slate-50 dark:bg-slate-950">
          <div className="page-container max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="section-heading">Frequently Asked <span className="gradient-text">Questions</span></h2>
              <p className="section-subheading">Clear answers about professional CV writing services, ATS resumes, and executive profile support.</p>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details key={faq.question} className="card p-5 group">
                  <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer text-sm flex items-center justify-between gap-3">
                    {faq.question}
                    <HiArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <p className="mt-3 text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
