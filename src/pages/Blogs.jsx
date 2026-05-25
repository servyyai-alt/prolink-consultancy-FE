import { useDeferredValue, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiSearch, HiCalendar, HiClock, HiEye } from 'react-icons/hi'
import { blogAPI } from '../services/api'
import { Pagination, Skeleton } from '../components/ui/index'

const CATEGORIES = ['All', 'Career Tips', 'Resume Writing', 'Interview Prep', 'Industry News', 'HR Insights', 'Salary Guide']

export default function Blogs() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', { page, category, search: deferredSearch }],
    queryFn: () => blogAPI.getBlogs({ page, limit: 9, category: category||undefined, search: deferredSearch||undefined }),
    keepPreviousData: true,
  })
  const blogs = data?.data?.data || []
  const pagination = data?.data?.pagination

  return (
    <>
      <Helmet>
        <title>Career Blog | ProLink Consultancy</title>
        <meta name="description" content="Career tips, resume writing advice, interview preparation guides and HR insights from ProLink Consultancy." />
      </Helmet>
      <div className="pt-16">
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 py-14">
          <div className="page-container text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Career Blog</h1>
            <p className="text-primary-200 mb-6">Expert insights on careers, resumes, interviews and HR</p>
            <div className="max-w-md mx-auto flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-4">
                <HiSearch className="w-4 h-4 text-white/60" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search articles…" className="flex-1 bg-transparent py-3 text-white placeholder-white/50 outline-none text-sm" />
              </div>
            </div>
          </div>
        </div>
        <div className="page-container py-12">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => { setCategory(c === 'All' ? '' : c); setPage(1) }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  (c === 'All' && !category) || category === c
                    ? 'bg-primary-600 text-white shadow-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}>{c}</button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_,i) => <div key={i} className="card overflow-hidden"><Skeleton className="h-48 rounded-none" /><div className="p-5 space-y-3"><Skeleton className="h-4 rounded w-3/4" /><Skeleton className="h-3 rounded w-full" /><Skeleton className="h-3 rounded w-2/3" /></div></div>)}
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-20 text-center text-slate-400">No articles found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <motion.div key={blog._id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}>
                  <Link to={`/blogs/${blog.slug}`} className="card-hover overflow-hidden flex flex-col group">
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/20 relative overflow-hidden">
                      {blog.thumbnail?.url
                        ? <img src={blog.thumbnail.url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-4xl">📝</div>
                      }
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">{blog.category}</span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">{blog.title}</h3>
                      <p className="text-slate-500 text-sm line-clamp-2 flex-1">{blog.excerpt}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
                        <div className="flex items-center gap-1"><HiCalendar className="w-3.5 h-3.5" />{new Date(blog.publishedAt||blog.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
                        <div className="flex items-center gap-3">
                          {blog.readTime && <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" />{blog.readTime} min</span>}
                          <span className="flex items-center gap-1"><HiEye className="w-3.5 h-3.5" />{blog.views||0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          {pagination && <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />}
        </div>
      </div>
    </>
  )
}
