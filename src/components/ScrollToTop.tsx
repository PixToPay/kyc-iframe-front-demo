import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center gap-2 font-medium"
          aria-label="Voltar ao topo"
        >
          <i className="i-tabler-arrow-up text-lg"></i>
          <span className="text-sm">Topo</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
