import { useScrollSection } from "@/hooks/useScrollSection";

export function Header() {
  const currentSection = useScrollSection();
  const isDarkSection = currentSection === "hero";

  return (
    <header className="fixed top-0 w-full z-50 px-2 sm:px-4 pt-2 sm:pt-4">
      <div className="max-w-6xl mx-auto">
        <div
          className={`backdrop-blur-md border rounded-2xl px-3 sm:px-6 py-3 sm:py-4 shadow-xl transition-all duration-300 ${
            isDarkSection
              ? "bg-white/10 border-white/20"
              : "bg-white/90 border-gray-200/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <img
                src={
                  isDarkSection
                    ? "/assets/logos/pixtopay_dark_bg.svg"
                    : "/assets/logos/pixtopay_light_bg.svg"
                }
                className="h-6 sm:h-8 transition-all duration-300"
                alt="PixtoPay"
              />
              <div
                className={`w-px h-4 sm:h-6 transition-all duration-300 ${
                  isDarkSection ? "bg-white/60" : "bg-gray-400"
                }`}
              ></div>
              <img
                src="/assets/logos/kyc.svg"
                className="h-6 sm:h-8 transition-all duration-300"
                alt="KYC"
              />
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`text-xs sm:text-sm transition-all duration-300 hover:cursor-pointer ${
                  isDarkSection
                    ? "text-white/70 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="hidden sm:inline">Como Funciona</span>
                <span className="sm:hidden">Como</span>
              </a>
              <a
                href="#demo"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("demo")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`text-xs sm:text-sm font-medium transition-all duration-300 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg backdrop-blur-sm hover:cursor-pointer ${
                  isDarkSection
                    ? "text-white/90 hover:text-white bg-white/10 hover:bg-white/20"
                    : "text-gray-700 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-200/50"
                }`}
              >
                <span className="hidden sm:inline">Demonstração →</span>
                <span className="sm:hidden">Demo →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
