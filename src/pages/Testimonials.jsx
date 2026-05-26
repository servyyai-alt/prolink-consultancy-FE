import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiChatAlt2, HiArrowRight, HiStar } from 'react-icons/hi'
import { testimonialAPI } from '../services/api'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn, selectRole } from '../redux/slices/authSlice'
import { Badge, Button, EmptyState, Pagination } from '../components/ui/index'

export default function Testimonials() {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const role = useSelector(selectRole)
  const canSubmitTestimonial = isLoggedIn && role === 'job_seeker'

  const { data, isLoading } = useQuery({
    queryKey: ['testimonials', { page }],
    queryFn: () => testimonialAPI.getTestimonials({ page, limit: 12 }),
    keepPreviousData: true,
  })

  const testimonials = data?.data?.data || []
  const pagination = data?.data?.pagination

  return (
    <>
      <Helmet><title>Testimonials | ProLink Consultancy</title></Helmet>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full mb-4">
              <HiStar className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Success Stories</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Real feedback from real users
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Read what job seekers and employers say about their experience with ProLink Consultancy
            </p>
          </div>

          {/* CTA Button */}
          {canSubmitTestimonial && (
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/submit-testimonial')}
                className="flex items-center gap-2"
              >
                <HiArrowRight className="w-4 h-4" />
                Share Your Experience
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <EmptyState 
                icon={HiChatAlt2} 
                title="No testimonials yet" 
                description="Be the first to share your experience with ProLink Consultancy."
              />
              {canSubmitTestimonial && (
                <Button 
                  onClick={() => navigate('/submit-testimonial')}
                  className="mt-6"
                >
                  Submit Your Testimonial
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="
                    group
                    relative
                    rounded-3xl
                    border border-slate-200 dark:border-slate-700
                    bg-white dark:bg-slate-900
                    shadow-sm hover:shadow-xl
                    transition-all duration-300
                    overflow-hidden
                    flex flex-col
                  "
                >
                  {/* Top Gradient */}
                  <div className="h-1.5 bg-gradient-to-r from-primary-500 via-amber-500 to-orange-500" />

                  <div className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                    <div className="
                        w-12 h-12 rounded-2xl
                        flex-shrink-0 overflow-hidden
                      ">
                        {testimonial.avatar?.url ? (
                          <img
                            src={testimonial.avatar.url}
                            alt={testimonial.name}
                            className="h-12 w-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                            {testimonial?.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate">
                          {testimonial.name}
                        </h3>

                        <p className="text-sm text-slate-500 truncate">
                          {[testimonial.designation, testimonial.company]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex gap-0.5">
                            {[...Array(testimonial.rating || 5)].map((_, i) => (
                              <HiStar key={i} className="w-3 h-3 text-amber-400 fill-current" />
                            ))}
                          </div>
                          {testimonial.isFeatured && (
                            <Badge variant="info" className="text-xs">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {testimonial.content}
                      </p>
                    </div>

                    {/* Service Tag */}
                    {testimonial.service?.name && (
                      <div className="flex flex-wrap items-center gap-2 pt-5 mt-5 border-t border-slate-100 dark:border-slate-700">
                        <Badge variant="gray" className="text-xs">
                          {testimonial.service.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination 
                currentPage={page} 
                totalPages={pagination.totalPages} 
                onPageChange={setPage}
              />
            </div>
          )}

          {/* Bottom CTA */}
          {canSubmitTestimonial && testimonials.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Have a success story to share?
              </p>
              <Button 
                onClick={() => navigate('/submit-testimonial')}
                className="flex items-center gap-2 mx-auto"
              >
                <HiArrowRight className="w-4 h-4" />
                Submit Your Testimonial
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
