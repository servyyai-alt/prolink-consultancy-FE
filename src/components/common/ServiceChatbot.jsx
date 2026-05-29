import { useMemo, useRef, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  HiChatAlt2,
  HiChevronDown,
  HiExternalLink,
  HiMail,
  HiPaperAirplane,
  HiPhone,
  HiSparkles,
  HiX,
} from 'react-icons/hi'
import { serviceAPI } from '../../services/api'
import { getServiceRoute } from '../../utils/serviceRoutes'

const fallbackServices = [
  { slug: 'job-consultancy', name: 'Job Consultancy', shortDescription: 'End-to-end recruitment and placement support' },
  { slug: 'campus-drive', name: 'Campus Drive', shortDescription: 'Structured college-to-company hiring drives' },
  { slug: 'background-verification', name: 'Background Verification', shortDescription: 'Candidate verification and background checks' },
]

const CONTACT = {
  phone: '+91 9437174876',
  email: 'admin@prolinkconsultancy.com',
  address: 'Plot no 3010, Palasuni Rasulagarh, Bhubaneswar, Odisha 751025, India',
  hours: 'Monday to Saturday, 9:00 am to 6:00 pm',
}

const starterMessages = [
  {
    role: 'bot',
    text: 'Hi, I am ProLink Assist. Ask me about our services, pricing, process, contact details, or which service fits your project requirement.',
  },
]

const quickPrompts = [
  'Show all services',
  'How can I contact ProLink?',
  'Which service is right for my project?',
  'Tell me about pricing',
]

const normalize = (value = '') => value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim()

const compactText = (value = '', limit = 260) => {
  const clean = `${value || ''}`.replace(/\s+/g, ' ').trim()
  if (clean.length <= limit) return clean
  return `${clean.slice(0, limit).trim()}...`
}

function formatServiceAnswer(service, intent = 'overview') {
  const pieces = []

  pieces.push(`${service.name}: ${service.shortDescription || compactText(service.description, 150) || 'Professional consultancy support from ProLink.'}`)

  if (intent === 'pricing' && service.pricing?.length) {
    const plans = service.pricing
      .filter((plan) => plan.isActive !== false)
      .slice(0, 3)
      .map((plan) => `${plan.plan}${plan.price ? ` - INR ${Number(plan.price).toLocaleString('en-IN')}` : ''}${plan.period ? `/${plan.period}` : ''}`)
      .join('; ')
    pieces.push(`Pricing plans: ${plans}.`)
  } else if (service.description) {
    pieces.push(compactText(service.description, 280))
  }

  if (service.features?.length) {
    pieces.push(`Key support: ${service.features.slice(0, 3).map((feature) => feature.title).filter(Boolean).join(', ')}.`)
  }

  if (service.process?.length) {
    pieces.push(`Process starts with: ${service.process.slice(0, 2).map((step) => step.title).filter(Boolean).join(' -> ')}.`)
  }

  if (service.faqs?.length && intent === 'faq') {
    pieces.push(`Common question: ${service.faqs[0].question} Answer: ${compactText(service.faqs[0].answer, 180)}`)
  }

  return pieces.filter(Boolean).join(' ')
}

function findService(services, question) {
  const text = normalize(question)
  return services.find((service) => {
    const haystack = normalize([
      service.name,
      service.slug,
      service.category,
      service.shortDescription,
      service.description,
      ...(service.features || []).map((feature) => `${feature.title} ${feature.description}`),
      ...(service.faqs || []).map((faq) => `${faq.question} ${faq.answer}`),
    ].filter(Boolean).join(' '))

    const nameWords = normalize(service.name).split(' ').filter((word) => word.length > 2)
    return haystack.includes(text) || nameWords.some((word) => text.includes(word))
  })
}

function buildResponse(question, services) {
  const text = normalize(question)
  const matchedService = findService(services, question)
  const wantsPricing = /\b(price|pricing|cost|charge|plan|fee|fees|rate|rates)\b/.test(text)
  const wantsProcess = /\b(process|step|steps|how it works|work)\b/.test(text)
  const wantsFaq = /\b(faq|question|doubt)\b/.test(text)

  if (/\b(contact|phone|mobile|email|mail|address|location|visit|call|reach)\b/.test(text)) {
    return {
      text: `You can contact ProLink at ${CONTACT.phone} or ${CONTACT.email}. Office: ${CONTACT.address}. Working hours: ${CONTACT.hours}.`,
      actions: [
        { label: 'Open Contact Page', to: '/contact' },
        { label: 'Call Now', href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
      ],
    }
  }

  if (/\b(all services|services|what do you offer|offerings)\b/.test(text) && !matchedService) {
    return {
      text: `We currently provide ${services.length} service${services.length === 1 ? '' : 's'}: ${services.map((service) => service.name).join(', ')}. Pick one and I can explain details, pricing, or the process.`,
      actions: [{ label: 'View Services', to: '/services' }],
    }
  }

  if (/\b(project|requirement|business|company|need help|recommend|suggest|which service)\b/.test(text) && !matchedService) {
    return {
      text: 'For hiring or placement, start with Job Consultancy. For bulk fresher hiring, Campus Drive is best. For employee checks, choose Background Verification. For HR operations, HR Outsourcing is usually the right fit. Share your exact requirement and I will point you to the closest service.',
      actions: [
        { label: 'Explore Services', to: '/services' },
        { label: 'Discuss Requirement', to: '/contact' },
      ],
    }
  }

  if (matchedService) {
    const intent = wantsPricing ? 'pricing' : wantsProcess ? 'process' : wantsFaq ? 'faq' : 'overview'
    return {
      text: formatServiceAnswer(matchedService, intent),
      actions: [
        { label: `Open ${matchedService.name}`, to: getServiceRoute(matchedService.slug) },
        { label: 'Contact Team', to: '/contact' },
      ],
    }
  }

  if (wantsPricing) {
    const pricedServices = services.filter((service) => service.pricing?.length)
    return {
      text: pricedServices.length
        ? `Pricing depends on the service and scope. Services with listed plans include: ${pricedServices.map((service) => service.name).join(', ')}. Tell me the service name for exact available plans.`
        : 'Pricing depends on your requirement, volume, and timeline. Please contact the team for a custom quote.',
      actions: [{ label: 'Request Quote', to: '/contact' }],
    }
  }

  return {
    text: 'I can help with ProLink services, service details, pricing, process, project requirements, and contact information. Try asking "Tell me about Campus Drive" or "How do I contact ProLink?"',
    actions: [{ label: 'View Services', to: '/services' }],
  }
}

export default function ServiceChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(starterMessages)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: serviceAPI.getServices,
    staleTime: 5 * 60 * 1000,
  })

  const services = useMemo(() => {
    const apiServices = data?.data?.data?.services
    return apiServices?.length ? apiServices : fallbackServices
  }, [data])

  useEffect(() => {
    if (!isOpen) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const sendMessage = (value = input) => {
    const question = value.trim()
    if (!question) return

    const response = buildResponse(question, services)
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: question },
      { role: 'bot', ...response },
    ])
    setInput('')
  }

  const openAction = (action) => {
    if (action.to) {
      navigate(action.to)
      setIsOpen(false)
    }
  }

  return (
    <div className="fixed bottom-2 right-6 z-[80]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="mb-4 flex h-[min(640px,calc(100vh-120px))] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-950"
          >
            <div className="flex items-center justify-between bg-[#1a1108] px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-[#4b1808]">
                  <HiSparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">ProLink Assist</p>
                  <p className="text-xs text-amber-200">{isLoading ? 'Loading services...' : 'Service and contact helper'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close chatbot"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-stone-50 px-4 py-4 dark:bg-stone-900/70">
              {messages.map((message, index) => (
                <div key={index} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-[#8B2A0F] text-white'
                      : 'border border-stone-200 bg-white text-stone-700 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200'
                  }`}>
                    <p>{message.text}</p>
                    {message.actions?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.map((action) => (
                          action.href ? (
                            <a
                              key={action.label}
                              href={action.href}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-[#8B2A0F] transition-colors hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300"
                            >
                              {action.label}
                              <HiExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <button
                              key={action.label}
                              type="button"
                              onClick={() => openAction(action)}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-[#8B2A0F] transition-colors hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300"
                            >
                              {action.label}
                              <HiExternalLink className="h-3.5 w-3.5" />
                            </button>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-950">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="shrink-0 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-[#8B2A0F] dark:border-stone-800 dark:text-stone-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  sendMessage()
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about services or contact..."
                  className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition-colors focus:border-amber-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:bg-stone-900"
                />
                <button
                  type="submit"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#8B2A0F] text-white transition-colors hover:bg-[#a03212]"
                  aria-label="Send message"
                >
                  <HiPaperAirplane className="h-5 w-5 rotate-90" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#8B2A0F] text-white shadow-2xl ring-4 ring-amber-200/40 transition-all hover:bg-[#a03212] hover:scale-105 dark:ring-amber-900/30"
          aria-label={isOpen ? 'Minimize chatbot' : 'Open chatbot'}
        >
          {isOpen ? <HiChevronDown className="h-6 w-6" /> : <HiChatAlt2 className="h-7 w-7" />}
          {!isOpen && (
            <span className="absolute right-12 mr-3 hidden whitespace-nowrap rounded-xl bg-stone-900 px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">
              Need help?
            </span>
          )}
        </button>
      </div>

      {!isOpen && (
        <div className="mt-2 hidden rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 shadow-lg dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300 sm:flex sm:items-center sm:gap-2">
          <HiPhone className="h-3.5 w-3.5 text-amber-500" />
          <span>{CONTACT.phone}</span>
          <HiMail className="h-3.5 w-3.5 text-amber-500" />
        </div>
      )}
    </div>
  )
}
