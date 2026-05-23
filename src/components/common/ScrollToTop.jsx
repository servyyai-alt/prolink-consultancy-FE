import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // Auto Scroll Top on Route Change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  // Show Button on Scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Manual Scroll Top
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <button
        onClick={handleScrollTop}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl border border-[#f0c040]/30 bg-gradient-to-br from-[#f0c040] to-[#d9a520] hover:scale-110 transition-all duration-300"
      >
        {/* Glow Effect */}
        <span className="absolute inset-0 rounded-full bg-[#800000]/20 blur-md group-hover:blur-lg transition-all duration-300"></span>

        {/* Icon */}
        <ChevronUp
          size={28}
          className="relative text-[#800000] group-hover:-translate-y-1 transition-transform duration-300"
        />
      </button>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { ChevronUp } from "lucide-react";

// const ScrollToTop = () => {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const toggleVisibility = () => {
//       if (window.scrollY > 300) {
//         setVisible(true);
//       } else {
//         setVisible(false);
//       }
//     };

//     window.addEventListener("scroll", toggleVisibility);

//     return () => {
//       window.removeEventListener("scroll", toggleVisibility);
//     };
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <div
//       className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
//         visible
//           ? "opacity-100 translate-y-0"
//           : "opacity-0 translate-y-4 pointer-events-none"
//       }`}
//     >
//       <button
//         onClick={scrollToTop}
//         className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl border border-[#f0c040]/30 bg-gradient-to-br from-[#f0c040] to-[#d9a520] hover:scale-110 transition-all duration-300"
//       >
//         {/* Glow Effect */}
//         <span className="absolute inset-0 rounded-full bg-[#800000]/20 blur-md group-hover:blur-lg transition-all duration-300"></span>

//         {/* Icon */}
//         <ChevronUp
//           size={28}
//           className="relative text-[#800000] group-hover:-translate-y-1 transition-transform duration-300"
//         />
//       </button>
//     </div>
//   );
// };

// export default ScrollToTop;