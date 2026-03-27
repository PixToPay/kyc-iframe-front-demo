import common_ptBR from "./locales/pt-BR/common.json";
import common_en from "./locales/en/common.json";
import common_es from "./locales/es/common.json";

import landing_ptBR from "./locales/pt-BR/landing.json";
import landing_en from "./locales/en/landing.json";
import landing_es from "./locales/es/landing.json";

import demo_ptBR from "./locales/pt-BR/demo.json";
import demo_en from "./locales/en/demo.json";
import demo_es from "./locales/es/demo.json";

export const resources = {
  "pt-BR": {
    common: common_ptBR,
    landing: landing_ptBR,
    demo: demo_ptBR,
  },
  en: {
    common: common_en,
    landing: landing_en,
    demo: demo_en,
  },
  es: {
    common: common_es,
    landing: landing_es,
    demo: demo_es,
  },
} as const;

export type AppLocale = keyof typeof resources;

