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
  phone: '+91 99370 47733',
  email: 'admin@prolinkconsultancy.in',
  address: 'Plot no 3010, Palasuni Rasulagarh, Bhubaneswar, Odisha 751025, India',
  hours: 'Monday to Saturday, 9:00 am to 6:00 pm',
}

const normalize = (value = '') => value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim()

const compactText = (value = '', limit = 260) => {
  const clean = `${value || ''}`.replace(/\s+/g, ' ').trim()
  if (clean.length <= limit) return clean
  return `${clean.slice(0, limit).trim()}...`
}

const formatCurrency = (value) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return value ? `${value}` : ''
  return `INR ${amount.toLocaleString('en-IN')}`
}

const buildServiceSummary = (service) =>
  service.shortDescription || compactText(service.description, 130) || 'Professional consultancy support from ProLink.'

const buildWelcomeMessage = (services) => ({
  kind: 'welcome',
  role: 'bot',
  text: 'Hi, I am ProLink Assist. Ask me about our services, pricing, process, contact details, or which service fits your project requirement.',
  actions: [{ label: 'View Services', to: '/services' }],
  services: services.slice(0, 4).map((service) => ({
    name: service.name,
    description: buildServiceSummary(service),
    to: getServiceRoute(service.slug),
  })),
  suggestions: buildSuggestedQuestions(services),
})

function buildSuggestedQuestions(services) {
  const prompts = ['Show all services', 'How can I contact ProLink?', 'Which service is right for my project?', 'Tell me about pricing']
  const servicePrompts = services.slice(0, 3).flatMap((service) => [
    `Tell me about ${service.name}`,
    `What is the process for ${service.name}?`,
  ])

  return [...servicePrompts, ...prompts].slice(0, 6)
}

function formatServiceAnswer(service, intent = 'overview') {
  const pieces = []

  pieces.push(`${service.name}: ${buildServiceSummary(service)}`)

  if (intent === 'pricing' && service.pricing?.length) {
    const plans = service.pricing
      .filter((plan) => plan.isActive !== false)
      .slice(0, 3)
      .map((plan) => `${plan.plan}${plan.price ? ` - ${formatCurrency(plan.price)}` : ''}${plan.period ? `/${plan.period}` : ''}`)
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

function buildServiceShortcuts(services) {
  return services.slice(0, 6).map((service) => ({
    name: service.name,
    description: buildServiceSummary(service),
    to: getServiceRoute(service.slug),
  }))
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

function buildServiceRecommendations(services, question) {
  const text = normalize(question)

  if (/\b(hiring|recruit|placement|job|candidate)\b/.test(text)) {
    return services.filter((service) => /job|placement|recruit/i.test(service.name)).slice(0, 3)
  }

  if (/\b(campus|college|fresher|drive)\b/.test(text)) {
    return services.filter((service) => /campus/i.test(service.name)).slice(0, 3)
  }

  if (/\b(background|verification|check|screening)\b/.test(text)) {
    return services.filter((service) => /background|verification/i.test(service.name)).slice(0, 3)
  }

  if (/\b(hr|payroll|onboarding|attendance|operations)\b/.test(text)) {
    return services.filter((service) => /hr/i.test(service.name)).slice(0, 3)
  }

  return services.slice(0, 3)
}

function buildResponse(question, services) {
  const text = normalize(question)
  const matchedService = findService(services, question)
  const wantsPricing = /\b(price|pricing|cost|charge|plan|fee|fees|rate|rates)\b/.test(text)
  const wantsProcess = /\b(process|step|steps|how it works|work)\b/.test(text)
  const wantsFaq = /\b(faq|question|doubt)\b/.test(text)
  const wantsHours = /\b(hour|hours|timing|timings|open|close|available)\b/.test(text)
  const wantsRecommendation = /\b(recommend|suggest|best|right service|which service|need help|help me)\b/.test(text)
  const wantsListing = /\b(all services|services|what do you offer|offerings|service list)\b/.test(text)

  if (/\b(contact|phone|mobile|email|mail|address|location|visit|call|reach)\b/.test(text)) {
    return {
      text: `You can contact ProLink at ${CONTACT.phone} or ${CONTACT.email}. Office: ${CONTACT.address}. Working hours: ${CONTACT.hours}.`,
      actions: [
        { label: 'Open Contact Page', to: '/contact' },
        { label: 'Call Now', href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
      ],
      suggestions: ['Show all services', 'Which service is right for my project?', 'Tell me about pricing'],
    }
  }

  if (wantsHours) {
    return {
      text: `Our working hours are ${CONTACT.hours}. If you need to visit the office, the address is ${CONTACT.address}.`,
      actions: [{ label: 'Contact Team', to: '/contact' }],
      suggestions: ['How can I contact ProLink?', 'Show all services', 'Which service is right for my project?'],
    }
  }

  if (wantsListing && !matchedService) {
    return {
      text: `We currently provide ${services.length} service${services.length === 1 ? '' : 's'}: ${services.map((service) => service.name).join(', ')}. Pick one and I can explain details, pricing, or the process.`,
      actions: [{ label: 'View Services', to: '/services' }],
      services: buildServiceShortcuts(services),
      suggestions: buildSuggestedQuestions(services),
    }
  }

  if (wantsRecommendation && !matchedService) {
    const recommendations = buildServiceRecommendations(services, text)
    return {
      text: recommendations.length
        ? `Based on what you shared, these services look most relevant: ${recommendations.map((service) => service.name).join(', ')}. Tell me a little more and I can narrow it down further.`
        : 'Share your requirement and I will point you to the closest service.',
      actions: [
        { label: 'Explore Services', to: '/services' },
        { label: 'Discuss Requirement', to: '/contact' },
      ],
      services: buildServiceShortcuts(recommendations.length ? recommendations : services),
      suggestions: [
        'Tell me about pricing',
        'Show all services',
        'How can I contact ProLink?',
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
      suggestions: [
        `What is the process for ${matchedService.name}?`,
        `Tell me about pricing for ${matchedService.name}`,
        `Does ${matchedService.name} have FAQs?`,
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
      suggestions: ['Which service is right for my project?', 'Show all services', 'How can I contact ProLink?'],
    }
  }

  return {
    text: 'I can help with ProLink services, service details, pricing, process, project requirements, and contact information. Try asking "Tell me about Campus Drive" or "How do I contact ProLink?"',
    actions: [{ label: 'View Services', to: '/services' }],
    services: buildServiceShortcuts(services),
    suggestions: buildSuggestedQuestions(services),
  }
}

export default function ServiceChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => [buildWelcomeMessage(fallbackServices)])
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

  const quickPrompts = useMemo(() => buildSuggestedQuestions(services), [services])

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].kind === 'welcome') {
        return [buildWelcomeMessage(services)]
      }

      return prev
    })
  }, [services])

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
    <div className="fixed bottom-2 left-2 right-2 z-[80] flex justify-end sm:left-auto sm:right-6 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto mb-3 flex h-[min(78dvh,760px)] w-full flex-col overflow-hidden rounded-t-3xl border border-stone-200 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-950 sm:mb-4 sm:h-[min(640px,calc(100dvh-120px))] sm:w-[min(420px,calc(100vw-32px))] sm:max-w-[420px] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between bg-[#1a1108] px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-[#4b1808]">
                  <HiSparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">ProLink Assist</p>
                  <p className="text-xs text-amber-200">{isLoading ? 'Loading services...' : `${services.length} services ready to explore`}</p>
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

            <div className="flex-1 space-y-4 overflow-y-auto bg-stone-50 px-3 py-3 dark:bg-stone-900/70 sm:px-4 sm:py-4">
              {messages.map((message, index) => (
                <div key={index} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={`max-w-[92%] rounded-2xl px-3 py-3 text-sm leading-6 shadow-sm sm:max-w-[86%] sm:px-4 ${
                    message.role === 'user'
                      ? 'bg-[#8B2A0F] text-white'
                      : 'border border-stone-200 bg-white text-stone-700 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200'
                  }`}>
                    <p>{message.text}</p>
                    {message.services?.length > 0 && (
                      <div className="mt-3 grid gap-2">
                        {message.services.map((service) => (
                          <button
                            key={service.to}
                            type="button"
                            onClick={() => sendMessage(`Tell me about ${service.name}`)}
                            className="flex w-full items-start justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-left transition-colors hover:border-amber-300 hover:bg-amber-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-amber-900/20"
                          >
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-stone-900 dark:text-stone-100">{service.name}</span>
                              <span className="block text-xs leading-5 text-stone-500 dark:text-stone-400">{service.description}</span>
                            </span>
                            <HiChevronDown className="mt-0.5 h-4 w-4 shrink-0 -rotate-90 text-amber-500" />
                          </button>
                        ))}
                      </div>
                    )}
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
                    {message.suggestions?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => sendMessage(suggestion)}
                            className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-[#8B2A0F] dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-300"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-950 sm:p-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-[#8B2A0F] dark:border-stone-800 dark:text-stone-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-300"
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

      <div className="pointer-events-auto flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#8B2A0F] text-white shadow-2xl ring-4 ring-amber-200/40 transition-all hover:bg-[#a03212] hover:scale-105 dark:ring-amber-900/30"
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
        <div className="pointer-events-auto mt-2 hidden rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 shadow-lg dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300 sm:flex sm:items-center sm:gap-2">
          <HiPhone className="h-3.5 w-3.5 text-amber-500" />
          <span>{CONTACT.phone}</span>
          <HiMail className="h-3.5 w-3.5 text-amber-500" />
        </div>
      )}
    </div>
  )
}
