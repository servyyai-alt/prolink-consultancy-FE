import { HiDocumentText, HiExternalLink, HiTrash } from 'react-icons/hi'

const getOpenUrl = (brochure) => brochure?.url || ''

export default function BrochureList({
  brochures = [],
  count = 0,
  isLoading = false,
  variant = 'list',
  onDelete,
  deletingId,
}) {
  const isGrid = variant === 'grid'
  const canDelete = typeof onDelete === 'function'

  return (
    <div className={isGrid ? 'overflow-hidden' : 'card overflow-hidden'}>
      <div className={`${isGrid ? 'mb-5' : 'px-5 py-4 border-b border-slate-100 dark:border-slate-700'} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <HiDocumentText className={isGrid ? 'h-5 w-5 text-[#8B2A0F] dark:text-amber-400' : 'h-5 w-5 text-primary-600'} />
          <h3 className={isGrid ? 'font-bold text-stone-900 dark:text-white' : 'font-bold text-slate-900 dark:text-white'}>Brochures</h3>
        </div>
        <span className={isGrid
          ? 'rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-[#8B2A0F] dark:bg-amber-900/20 dark:text-amber-300'
          : 'rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200'
        }>
          {count} uploaded
        </span>
      </div>

      {isLoading ? (
        <div className={isGrid ? 'py-8 text-center text-sm text-stone-500' : 'px-5 py-8 text-center text-sm text-slate-500'}>Loading brochures...</div>
      ) : brochures.length === 0 ? (
        <div className={isGrid ? 'py-8 text-center text-sm text-stone-500' : 'px-5 py-8 text-center text-sm text-slate-500'}>No brochures uploaded yet.</div>
      ) : isGrid ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {brochures.map((brochure) => (
            <a
              key={brochure._id}
              href={getOpenUrl(brochure)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[92px] items-center justify-between gap-4 rounded-xl border border-amber-900/15 bg-[#fff8ed] px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#8B2A0F]/40 hover:bg-[#fff2dd] hover:shadow-md dark:border-amber-900/30 dark:bg-[#1a1108] dark:hover:bg-[#24170d]"
            >
              <p className="min-w-0 truncate text-base font-bold text-[#3a2112] group-hover:text-[#8B2A0F] dark:text-amber-50 dark:group-hover:text-amber-300">
                {brochure.name}
              </p>
              <HiExternalLink className="h-5 w-5 flex-shrink-0 text-[#8B2A0F] transition-transform group-hover:translate-x-1 dark:text-amber-400" />
            </a>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {brochures.map((brochure) => (
            <div
              key={brochure._id}
              className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <a
                href={getOpenUrl(brochure)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 flex-1 items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/20">
                    <HiDocumentText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{brochure.name}</p>
                    <p className="truncate text-xs text-slate-500">{brochure.fileName}</p>
                  </div>
                </div>
                <HiExternalLink className="h-4 w-4 flex-shrink-0 text-slate-400" />
              </a>
              {canDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(brochure)}
                  disabled={deletingId === brochure._id}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-900/20"
                  aria-label={`Delete ${brochure.name}`}
                >
                  <HiTrash className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
