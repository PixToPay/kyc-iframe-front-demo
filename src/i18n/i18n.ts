import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, type AppLocale } from "./resources";

const LOCALE_STORAGE_KEY = "locale";

export const supportedLocales = Object.keys(resources) as AppLocale[];
export const defaultLocale: AppLocale = "pt-BR";
export type { AppLocale };

export function normalizeLocale(value: unknown): AppLocale | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if ((supportedLocales as string[]).includes(trimmed)) return trimmed as AppLocale;

  const lower = trimmed.toLowerCase();
  if (lower === "pt" || lower === "pt-br") return "pt-BR";
  if (lower === "en" || lower.startsWith("en-")) return "en";
  if (lower === "es" || lower.startsWith("es-")) return "es";
  return null;
}

export function getInitialLocale(): AppLocale {
  const fromStorage =
    typeof window !== "undefined"
      ? normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY))
      : null;
  if (fromStorage) return fromStorage;

  const fromEnv = normalizeLocale(import.meta.env.VITE_LANG);
  if (fromEnv) return fromEnv;

  const fromNavigator =
    typeof navigator !== "undefined"
      ? normalizeLocale(navigator.language) ?? normalizeLocale(navigator.languages?.[0])
      : null;
  return fromNavigator ?? defaultLocale;
}

export function persistLocale(locale: AppLocale) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

export async function setLocale(locale: AppLocale) {
  const next = normalizeLocale(locale) ?? defaultLocale;
  await i18n.changeLanguage(next);
  persistLocale(next);
  if (typeof document !== "undefined") document.documentElement.lang = next;
}

if (!i18n.isInitialized) {
  const initialLocale = getInitialLocale();
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLocale,
      fallbackLng: defaultLocale,
      supportedLngs: supportedLocales,
      defaultNS: "common",
      ns: ["common", "landing", "demo"],
      interpolation: { escapeValue: false },
      returnNull: false,
      returnEmptyString: false,
    })
    .catch(() => {});

  if (typeof document !== "undefined") document.documentElement.lang = initialLocale;
}

export { i18n };

