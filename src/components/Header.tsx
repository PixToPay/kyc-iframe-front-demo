import { useScrollSection } from "@/hooks/useScrollSection";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { setLocale, supportedLocales, type AppLocale } from "@/i18n/i18n";

export function Header() {
  const currentSection = useScrollSection();
  const isDarkSection = currentSection === "hero";
  const { t, i18n } = useTranslation("landing");

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const currentLocale = (i18n.language || "pt-BR") as AppLocale;

  const options = useMemo(
    () =>
      supportedLocales.map((locale) => {
        const flag =
          locale === "pt-BR"
            ? "circle-flags:br"
            : locale === "en"
              ? "circle-flags:us"
              : "circle-flags:es";
        const label =
          locale === "pt-BR"
            ? t("header.language.ptBR")
            : locale === "en"
              ? t("header.language.en")
              : t("header.language.es");
        const short = locale === "pt-BR" ? "PT" : locale.toUpperCase();
        return { locale, flag, label, short };
      }),
    [t]
  );

  const current = options.find((o) => o.locale === currentLocale) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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
              {isDarkSection ? (
                <picture>
                  <source
                    media="(max-width: 1023px)"
                    srcSet="/assets/logos/pixtopay_mobile_dark.svg"
                  />
                  <img
                    src="/assets/logos/pixtopay_dark_bg.svg"
                    className="h-6 sm:h-8 transition-all duration-300"
                    alt="PixtoPay"
                  />
                </picture>
              ) : (
                <picture>
                  <source
                    media="(max-width: 1023px)"
                    srcSet="/assets/logos/pixtopay_mobile_light.svg"
                  />
                  <img
                    src="/assets/logos/pixtopay_light_bg.svg"
                    className="h-6 sm:h-8 transition-all duration-300"
                    alt="PixtoPay"
                  />
                </picture>
              )}
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
                <span className="hidden sm:inline">
                  {t("header.nav.howItWorks.desktop")}
                </span>
                <span className="sm:hidden">{t("header.nav.howItWorks.mobile")}</span>
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
                <span className="hidden sm:inline">{t("header.nav.demo.desktop")}</span>
                <span className="sm:hidden">{t("header.nav.demo.mobile")}</span>
              </a>

              <div className="relative" ref={rootRef}>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className={`inline-flex items-center gap-2 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-2 ${
                    isDarkSection
                      ? "text-white/90 hover:text-white bg-white/10 hover:bg-white/20"
                      : "text-gray-700 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-200/50"
                  }`}
                  aria-haspopup="listbox"
                  aria-expanded={open}
                  aria-label={t("header.language.label")}
                >
                  <Icon icon={current.flag} className="text-base" aria-hidden />
                  <span className="hidden sm:inline max-w-[9rem] truncate">
                    {current.label}
                  </span>
                  <span className="sm:hidden">{current.short}</span>
                  <Icon
                    icon={open ? "tabler:chevron-up" : "tabler:chevron-down"}
                    className="text-base opacity-80"
                    aria-hidden
                  />
                </button>

                {open && (
                  <div
                    className={`absolute right-0 mt-2 w-52 rounded-xl border shadow-xl overflow-hidden ${
                      isDarkSection
                        ? "bg-[color:var(--brand-dark)]/95 border-white/10"
                        : "bg-white border-gray-200"
                    }`}
                    role="listbox"
                    aria-label={t("header.language.label")}
                  >
                    {options.map((opt) => {
                      const selected = opt.locale === current.locale;
                      return (
                        <button
                          key={opt.locale}
                          type="button"
                          onClick={async () => {
                            setOpen(false);
                            await setLocale(opt.locale);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition ${
                            selected
                              ? isDarkSection
                                ? "bg-white/10 text-white"
                                : "bg-gray-50 text-gray-900"
                              : isDarkSection
                                ? "text-white/80 hover:bg-white/10 hover:text-white"
                                : "text-gray-700 hover:bg-gray-50"
                          }`}
                          role="option"
                          aria-selected={selected}
                        >
                          <Icon icon={opt.flag} className="text-lg shrink-0" aria-hidden />
                          <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                          {selected && (
                            <Icon icon="tabler:check" className="text-base shrink-0" aria-hidden />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
