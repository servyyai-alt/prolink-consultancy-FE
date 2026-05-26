import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiCalendar, HiClock, HiEye, HiArrowLeft } from 'react-icons/hi'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { blogAPI } from '../services/api'
import { selectIsLoggedIn, selectUser } from '../redux/slices/authSlice'
import toast from 'react-hot-toast'

const SOCIAL_CONFIG = [
  { key: 'facebook', label: 'Facebook', icon: FaFacebook },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin },
  { key: 'twitter', label: 'Twitter', icon: FaTwitter },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube },
]

export default function BlogDetail() {
  const { slug } = useParams()
  const [comment, setComment] = useState('')
  const qc = useQueryClient()
  const user = useSelector(selectUser)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const { data, isLoading } = useQuery({ queryKey: ['blog', slug], queryFn: () => blogAPI.getBlog(slug) })
  const blog = data?.data?.data?.blog
  const activeSocialLinks = SOCIAL_CONFIG.filter(({ key }) => blog?.socialLinks?.[key])
  const visibleComments = blog?.comments || []
  const approvedCommentsCount = blog?.approvedCommentsCount ?? visibleComments.filter((entry) => entry.status === 'approved' || entry.isApproved).length

  const commentMutation = useMutation({
    mutationFn: (payload) => blogAPI.addComment(blog._id, payload),
    onSuccess: () => {
      toast.success('Comment submitted. It will appear after admin approval.')
      setComment('')
      qc.invalidateQueries({ queryKey: ['blog', slug] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not submit comment')
    },
  })

  const submitComment = (event) => {
    event.preventDefault()
    if (!comment.trim()) {
      toast.error('Please enter your comment')
      return
    }
    commentMutation.mutate({ content: comment.trim() })
  }

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
        {blog.thumbnail?.url && <meta property="og:image" content={blog.thumbnail.url} />}
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
          {activeSocialLinks.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-500 mb-3">Social Media</p>
              <div className="flex flex-wrap gap-3">
                {activeSocialLinks.map(({ key, label, icon: Icon }) => (
                  <a
                    key={key}
                    href={blog.socialLinks[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-primary-600 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Comments</p>
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  Community Discussion
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {approvedCommentsCount} approved {approvedCommentsCount === 1 ? 'comment' : 'comments'}
                  {isLoggedIn ? ' and your pending replies are visible only to you.' : '.'}
                </p>
              </div>
              {!isLoggedIn && (
                <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-900/40 dark:bg-primary-900/20 dark:text-primary-300">
                  Sign in to comment
                </Link>
              )}
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
              {isLoggedIn ? (
                <form onSubmit={submitComment} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500">Your comment will be reviewed by the admin before it goes public.</p>
                    </div>
                  </div>
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={4}
                    maxLength={1000}
                    placeholder="Share your thoughts about this article..."
                    className="input-field resize-none"
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">{comment.trim().length}/1000 characters</p>
                    <button type="submit" disabled={commentMutation.isPending} className="btn-primary px-6 py-3 disabled:opacity-60">
                      {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                  Sign in with your ProLink account to join the discussion on this article.
                </div>
              )}
            </div>

            <div className="space-y-4">
              {visibleComments.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40">
                  No comments yet. Be the first to start the conversation.
                </div>
              ) : (
                visibleComments.map((entry) => {
                  const status = entry.status || (entry.isApproved ? 'approved' : 'pending')
                  const isOwnPending = status !== 'approved' && entry.user?._id === user?._id
                  const displayName = entry.user?.firstName
                    ? `${entry.user.firstName} ${entry.user.lastName || ''}`.trim()
                    : entry.name

                  return (
                    <div key={entry._id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                            {(displayName || 'U').charAt(0)}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-slate-900 dark:text-white">{displayName}</p>
                              {status === 'approved' ? (
                                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                                  Approved
                                </span>
                              ) : (
                                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                                  Pending Review
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                              {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">{entry.content}</p>
                      {isOwnPending && (
                        <p className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-300">
                          This comment is visible only to you until an admin approves it.
                        </p>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
          {blog.relatedPosts?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-500 mb-4">Related Posts</p>
              <div className="grid gap-4 md:grid-cols-2">
                {blog.relatedPosts.map((post) => (
                  <Link key={post._id} to={`/blogs/${post.slug}`} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-primary-400 transition-colors">
                    <div className="h-36 bg-slate-100 dark:bg-slate-800">
                      {post.thumbnail?.url ? (
                        <img src={post.thumbnail.url} alt={post.title} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-primary-600 mb-2">{post.category}</p>
                      <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2">{post.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
