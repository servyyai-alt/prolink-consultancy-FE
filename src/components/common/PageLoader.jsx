export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute top-1 left-1/2 w-3 h-3 rounded-full bg-primary-700 -translate-x-1/2" />
          <div className="absolute left-1 top-6 w-3 h-3 rounded-full bg-primary-700" />
          <div className="absolute right-1 top-6 w-3 h-3 rounded-full bg-primary-700" />
          <div className="w-12 h-12 rounded-full border-[6px] border-accent-400 border-t-primary-700 animate-spin" />
        </div>
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-accent-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
