export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#faf7f2] via-[#fffaf3] to-[#f6f1e7] dark:from-[#0f0f11] dark:via-[#151518] dark:to-[#101012]">

      {/* Animated Glow Effects */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-[#e8b437]/20 blur-3xl animate-pulse" />
      <div className="absolute w-[250px] h-[250px] rounded-full bg-[#7a0000]/10 blur-3xl top-10 animate-bounce" />

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#e8b437]/40 animate-ping"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + i * 0.4}s`,
          }}
        />
      ))}

      <div className="relative flex flex-col items-center">

        {/* Top Head Section */}
        <div className="relative flex items-end justify-center mb-3">

          {/* Left Head */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#920000] to-[#5f0000] shadow-[0_0_30px_rgba(122,0,0,0.4)] animate-floatSlow" />

          {/* Center Head */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[#920000] to-[#5f0000] mx-6 -mb-8 shadow-[0_0_40px_rgba(122,0,0,0.5)] animate-pulse" />

          {/* Right Head */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#920000] to-[#5f0000] shadow-[0_0_30px_rgba(122,0,0,0.4)] animate-floatSlow" />
        </div>

        {/* Body Section */}
        <div className="relative flex items-center justify-center">

          {/* Left Shape */}
          <div className="relative w-32 h-44 border-[15px] border-[#e8b437] rounded-[80px] border-r-transparent rotate-[8deg] bg-white/5 backdrop-blur-sm shadow-[0_0_35px_rgba(232,180,55,0.35)] animate-float" />

          {/* Center Shape */}
          <div className="relative z-10 -mx-6">
            <div className="w-44 h-56 rounded-[100px] border-[16px] border-[#e8b437] bg-white/5 backdrop-blur-md shadow-[0_0_50px_rgba(232,180,55,0.4)]" />

            {/* Tie */}
            <div className="absolute top-14 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-5 h-5 bg-[#7a0000] rotate-45 shadow-lg" />

              <div
                className="w-0 h-0 mt-1
                border-l-[14px] border-r-[14px]
                border-t-[38px]
                border-l-transparent border-r-transparent
                border-t-[#7a0000]
                drop-shadow-lg"
              />
            </div>
          </div>

          {/* Right Shape */}
          <div className="relative w-32 h-44 border-[15px] border-[#e8b437] rounded-[80px] border-l-transparent -rotate-[8deg] bg-white/5 backdrop-blur-sm shadow-[0_0_35px_rgba(232,180,55,0.35)] animate-float" />
        </div>

        {/* Brand Name */}
        <div className="mt-12 flex flex-col items-center">
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-[6px] uppercase bg-gradient-to-r from-[#7a0000] via-[#a10000] to-[#7a0000] bg-clip-text text-transparent drop-shadow-md">
            PROLINK
          </h1>

          <p className="text-sm sm:text-base tracking-[5px] uppercase text-[#c89b2a] font-semibold mt-1">
            Consultancy
          </p>

          {/* Elegant Loader */}
          <div className="flex items-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-[#e8b437] to-[#f3c85b] shadow-lg animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tailwind custom animation */}
      <style>
        {`
          @keyframes float {
            0%,100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes floatSlow {
            0%,100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-floatSlow {
            animation: floatSlow 4s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  )
}