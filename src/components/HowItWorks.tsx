import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation("landing");

  const integrationMethods = [
    {
      id: "api",
      title: t("howItWorks.methods.api.title"),
      description: t("howItWorks.methods.api.description"),
      icon: "i-tabler-api",
      features: t("howItWorks.methods.api.features", { returnObjects: true }) as string[],
      code: `// Integration example
const response = await fetch('https://api.dev.pixtopay.com/customer/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_PUBLIC_KEY'
  },
  body: JSON.stringify({
    cpf: '00000000272',
    integration_id: 'GUID',
    webhook_url: 'https://webhook.site/...', // optional
    transaction_id: 'GUID' // optional
  })
});
const { onboarding_id } = await response.json();`,
    },
    {
      id: "iframe",
      title: t("howItWorks.methods.iframe.title"),
      description: t("howItWorks.methods.iframe.description"),
      icon: "i-tabler-device-mobile",
      features: t("howItWorks.methods.iframe.features", { returnObjects: true }) as string[],
      code: `// Iframe setup
<iframe 
  src="https://kyc.pixtopay.com/?guid=123"
  onMessage={(event) => {
    if (event.data.type === 'stepUpdate') {
      console.log('Step:', event.data.step);
    }
  }}
/>`,
    },
    {
      id: "redirect",
      title: t("howItWorks.methods.redirect.title"),
      description: t("howItWorks.methods.redirect.description"),
      icon: "i-tabler-external-link",
      features: t("howItWorks.methods.redirect.features", { returnObjects: true }) as string[],
      code: `const url = new URL("https://kyc-front.pixtopay.com.br/");
url.searchParams.set("guid", guid);
url.searchParams.set("redirectUrl", "https://meuapp.com/callback/kyc");
url.searchParams.set("state", "user123_nonce");
window.open(url.toString(), "_blank");`,
    },
    {
      id: "dashboard",
      title: t("howItWorks.methods.dashboard.title"),
      description: t("howItWorks.methods.dashboard.description"),
      icon: "i-tabler-chart-dots",
      features: t("howItWorks.methods.dashboard.features", { returnObjects: true }) as string[],
      code: `// Acesso ao dashboard
https://backoffice.pixtopay.com.br/plataforma/`,
    },
  ];

  const steps = [
    {
      icon: "i-tabler-user-plus",
      title: t("howItWorks.steps.0.title"),
      description: t("howItWorks.steps.0.description"),
      image: "/assets/images/step1-document.svg",
    },
    {
      icon: "i-tabler-shield-check",
      title: t("howItWorks.steps.1.title"),
      description: t("howItWorks.steps.1.description"),
      image: "/assets/images/step2-analysis.svg",
    },
    {
      icon: "i-tabler-chart-line",
      title: t("howItWorks.steps.2.title"),
      description: t("howItWorks.steps.2.description"),
      image: "/assets/images/step3-results.svg",
    },
  ];

  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--brand-dark)] mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="mb-16">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {integrationMethods.map((method, index) => (
              <button
                key={method.id}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2.5 rounded-lg font-medium transition text-sm sm:text-base ${
                  activeTab === index
                    ? "bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {method.title}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-[color:var(--brand-dark)] text-sm mb-2">
                {t("howItWorks.quickCards.embeddedTitle")}
              </h4>
              <p className="text-xs text-gray-600">
                {t("howItWorks.quickCards.embeddedBody")}
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-[color:var(--brand-dark)] text-sm mb-2">
                {t("howItWorks.quickCards.redirectTitle")}
              </h4>
              <p className="text-xs text-gray-600">
                {t("howItWorks.quickCards.redirectBody")}
              </p>
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[color:var(--brand-bg)] rounded-2xl p-8"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <i
                    className={`${integrationMethods[activeTab].icon} text-4xl text-[color:var(--brand-dark)] bg-[color:var(--brand-primary)]/15 border-2 border-[color:var(--brand-primary)] rounded-full p-2`}
                  ></i>
                  <h3 className="text-xl md:text-2xl font-semibold text-[color:var(--brand-dark)]">
                    {integrationMethods[activeTab].title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  {integrationMethods[activeTab].description}
                </p>
                <ul className="space-y-2 mb-6">
                  {integrationMethods[activeTab].features.map(
                    (feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <i className="i-tabler-check text-[color:var(--brand-primary)]"></i>
                        {feature}
                      </li>
                    )
                  )}
                </ul>
                {activeTab === 3 && (
                  <a
                    href="https://backoffice.pixtopay.com.br/plataforma/"
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
                  >
                    {t("howItWorks.methods.dashboard.cta")}
                    <i className="i-tabler-external-link"></i>
                  </a>
                )}
              </div>
              {activeTab === 3 ? (
                <div className="relative rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden bg-white">
                  <div className="aspect-[4/3] w-full">
                    <img
                      src="/assets/images/dash.png"
                      alt="Exemplo de dashboard PixtoPay"
                      className="w-full h-full object-contain opacity-90"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto shadow-lg">
                  <pre className="text-green-400 text-sm">
                    <code>{integrationMethods[activeTab].code}</code>
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
