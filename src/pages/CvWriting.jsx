import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { HiCheckCircle, HiStar, HiArrowRight, HiUpload } from 'react-icons/hi'
import { CV_PLANS } from '../constants/index'
import { selectIsLoggedIn, selectUser } from '../redux/slices/authSlice'
import { useRazorpay } from '../hooks/index'
import toast from 'react-hot-toast'

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
      <Helmet>
        <title>CV Writing Service | ProLink Consultancy</title>
        <meta name="description" content="Get an ATS-optimised, professionally written CV/resume that lands interviews. Starting from ₹499." />
      </Helmet>
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
                Our certified resume writers craft ATS-optimised CVs that pass automated filters and impress hiring managers.
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
      </div>
    </>
  )
}
