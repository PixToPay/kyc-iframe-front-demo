import { useState, useEffect } from "react";

export function useScrollSection() {
  const [currentSection, setCurrentSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById("hero");
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (heroElement) {
        const heroBottom = heroElement.offsetTop + heroElement.offsetHeight;

        if (scrollY < heroBottom) {
          setCurrentSection("hero");
        } else {
          setCurrentSection("light");
        }
      } else {
        setCurrentSection("hero");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return currentSection;
}
