import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiCalendar, HiClock, HiEye, HiArrowLeft } from 'react-icons/hi'
import { blogAPI } from '../services/api'

export default function BlogDetail() {
  const { slug } = useParams()
  const { data, isLoading } = useQuery({ queryKey: ['blog', slug], queryFn: () => blogAPI.getBlog(slug) })
  const blog = data?.data?.data?.blog

  if (isLoading) return (
    <div className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-950 animate-pulse">
      <div className="page-container py-10 max-w-3xl mx-auto space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
        {[...Array(6)].map((_,i) => <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />)}
      </div>
    </div>
  )

  if (!blog) return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-6xl mb-4">📰</div><h2 className="text-xl font-bold mb-2">Article Not Found</h2><Link to="/blogs" className="btn-primary mt-4">Back to Blog</Link></div>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{blog.title} | ProLink Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
      </Helmet>
      <div className="pt-16 min-h-screen bg-white dark:bg-slate-900">
        <div className="page-container py-10 max-w-3xl mx-auto">
          <Link to="/blogs" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors"><HiArrowLeft className="w-4 h-4" />Back to Blog</Link>
          <div className="mb-4">
            <span className="badge-primary">{blog.category}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4 leading-tight">{blog.title}</h1>
          <div className="flex items-center gap-5 text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 font-bold text-sm">{blog.author?.firstName?.[0]}</div>
              <span className="font-medium text-slate-700 dark:text-slate-200">{blog.author?.firstName} {blog.author?.lastName}</span>
            </div>
            <span className="flex items-center gap-1"><HiCalendar className="w-4 h-4" />{new Date(blog.publishedAt||blog.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
            {blog.readTime && <span className="flex items-center gap-1"><HiClock className="w-4 h-4" />{blog.readTime} min read</span>}
            <span className="flex items-center gap-1"><HiEye className="w-4 h-4" />{blog.views||0} views</span>
          </div>
          {blog.thumbnail?.url && <img src={blog.thumbnail.url} alt={blog.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8 shadow-lg" />}
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
            {blog.content}
          </div>
          {blog.tags?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-500 mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(t => <span key={t} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-sm">#{t}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
