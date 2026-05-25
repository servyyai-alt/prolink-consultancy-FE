export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#faf7f2] via-[#fffaf3] to-[#f6f1e7] dark:from-[#0f0f11] dark:via-[#151518] dark:to-[#101012] px-4">

      {/* Background Glow */}
      <div className="absolute w-[70vw] max-w-[420px] aspect-square rounded-full bg-[#e8b437]/20 blur-3xl animate-pulse" />

      <div className="absolute w-[40vw] max-w-[250px] aspect-square rounded-full bg-[#7a0000]/10 blur-3xl top-[10%] animate-bounce" />

      {/* Floating Particles */}
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#e8b437]/40 animate-ping"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + i * 0.4}s`,
          }}
        />
      ))}

      {/* Main Loader */}
      <div className="relative flex flex-col items-center scale-[0.72] xs:scale-[0.8] sm:scale-90 md:scale-100">

        {/* Head Section */}
        <div className="relative flex items-end justify-center mb-2 sm:mb-3">

          {/* Left Head */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-[#920000] to-[#5f0000] shadow-[0_0_25px_rgba(122,0,0,0.4)] animate-floatSlow" />

          {/* Center Head */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-b from-[#920000] to-[#5f0000] mx-3 sm:mx-4 md:mx-6 -mb-5 sm:-mb-6 md:-mb-8 shadow-[0_0_40px_rgba(122,0,0,0.5)] animate-pulse" />

          {/* Right Head */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-[#920000] to-[#5f0000] shadow-[0_0_25px_rgba(122,0,0,0.4)] animate-floatSlow" />
        </div>

        {/* Body Section */}
        <div className="relative flex items-center justify-center">

          {/* Left Shape */}
          <div className="relative w-20 h-28 sm:w-24 sm:h-36 md:w-32 md:h-44 border-[10px] sm:border-[12px] md:border-[15px] border-[#e8b437] rounded-[60px] md:rounded-[80px] border-r-transparent rotate-[8deg] bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(232,180,55,0.35)] animate-float" />

          {/* Center Shape */}
          <div className="relative z-10 -mx-3 sm:-mx-4 md:-mx-6">

            <div className="w-28 h-40 sm:w-36 sm:h-48 md:w-44 md:h-56 rounded-[70px] md:rounded-[100px] border-[12px] sm:border-[14px] md:border-[16px] border-[#e8b437] bg-white/5 backdrop-blur-md shadow-[0_0_45px_rgba(232,180,55,0.4)]" />

            {/* Tie */}
            <div className="absolute top-10 sm:top-12 md:top-14 left-1/2 -translate-x-1/2 flex flex-col items-center">

              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#7a0000] rotate-45 shadow-lg" />

              <div
                className="
                  w-0 h-0 mt-1
                  border-l-[10px] border-r-[10px]
                  sm:border-l-[12px] sm:border-r-[12px]
                  md:border-l-[14px] md:border-r-[14px]
                  border-t-[28px] sm:border-t-[34px] md:border-t-[38px]
                  border-l-transparent border-r-transparent
                  border-t-[#7a0000]
                  drop-shadow-lg
                "
              />
            </div>
          </div>

          {/* Right Shape */}
          <div className="relative w-20 h-28 sm:w-24 sm:h-36 md:w-32 md:h-44 border-[10px] sm:border-[12px] md:border-[15px] border-[#e8b437] rounded-[60px] md:rounded-[80px] border-l-transparent -rotate-[8deg] bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(232,180,55,0.35)] animate-float" />
        </div>

        {/* Brand Name */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col items-center text-center">

          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black tracking-[4px] sm:tracking-[5px] md:tracking-[6px] uppercase bg-gradient-to-r from-[#7a0000] via-[#a10000] to-[#7a0000] bg-clip-text text-transparent drop-shadow-md">
            PROLINK
          </h1>

          <p className="text-[10px] xs:text-xs sm:text-sm md:text-base tracking-[3px] sm:tracking-[4px] md:tracking-[5px] uppercase text-[#c89b2a] font-semibold mt-1">
            Consultancy
          </p>

          {/* Loader Dots */}
          <div className="flex items-center gap-2 mt-5 sm:mt-6">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-[#e8b437] to-[#f3c85b] shadow-lg animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes floatSlow {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-floatSlow {
            animation: floatSlow 4s ease-in-out infinite;
          }

          /* Extra Small Devices */
          @media (max-width: 380px) {
            .xs\\:scale-\\[0\\.8\\] {
              transform: scale(0.8);
            }
          }
        `}
      </style>
    </div>
  );
}