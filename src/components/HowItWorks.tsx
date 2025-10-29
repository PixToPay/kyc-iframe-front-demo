import { motion } from "framer-motion";
import { useState } from "react";

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0);

  const integrationMethods = [
    {
      id: "api",
      title: "Integração Direta via API",
      description: "Use nosso front-end diretamente no seu sistema",
      icon: "i-tabler-api",
      features: [
        "Controle total da interface",
        "Customização completa do design",
        "Integração nativa com seu sistema",
        "Máxima flexibilidade",
      ],
      code: `// Exemplo de integração
const response = await fetch('/api/kyc/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cpf: '12345678901' })
});
const { sessionId } = await response.json();`,
    },
    {
      id: "iframe",
      title: "Iframe com PostMessage",
      description: "Integração rápida via iframe com eventos em tempo real",
      icon: "i-tabler-device-mobile",
      features: [
        "Implementação em minutos",
        "Eventos postMessage em tempo real",
        "Interface pré-construída",
        "Fácil manutenção",
      ],
      code: `// Configuração do iframe
<iframe 
  src="https://kyc.pixtopay.com/?guid=123"
  onMessage={(event) => {
    if (event.data.type === 'stepUpdate') {
      console.log('Etapa:', event.data.step);
    }
  }}
/>`,
    },
    {
      id: "dashboard",
      title: "Dashboard de Gerenciamento",
      description: "Controle completo via backoffice da PixtoPay",
      icon: "i-tabler-chart-dots",
      features: [
        "Relatórios em tempo real",
        "Gestão de verificações",
        "Análise de conversão",
        "Configurações avançadas",
      ],
      code: `// Acesso ao dashboard
https://backoffice.pixtopay.com.br/plataforma/`,
    },
  ];

  const steps = [
    {
      icon: "i-tabler-user-plus",
      title: "Usuário inicia verificação",
      description: "Captura de documentos e selfie com biometria facial",
      image: "/assets/images/step1-document.svg",
    },
    {
      icon: "i-tabler-shield-check",
      title: "Análise automática",
      description: "IA verifica autenticidade e similaridade facial",
      image: "/assets/images/step2-analysis.svg",
    },
    {
      icon: "i-tabler-chart-line",
      title: "Resultados no dashboard",
      description: "Status, métricas e dados de compliance em tempo real",
      image: "/assets/images/step3-results.svg",
    },
  ];

  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[color:var(--brand-dark)] mb-4">
            Como funciona
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Três formas de integrar o KYC PixtoPay ao seu sistema, desde
            implementação rápida até controle total.
          </p>
        </div>

        <div className="mb-16">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {integrationMethods.map((method, index) => (
              <button
                key={method.id}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  activeTab === index
                    ? "bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {method.title}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[color:var(--brand-bg)] rounded-2xl p-8"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <i
                    className={`${integrationMethods[activeTab].icon} text-3xl text-[color:var(--brand-primary)]`}
                  ></i>
                  <h3 className="text-xl font-semibold text-[color:var(--brand-dark)]">
                    {integrationMethods[activeTab].title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
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
                {activeTab === 2 && (
                  <a
                    href="https://backoffice.pixtopay.com.br/plataforma/"
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
                  >
                    Acessar Dashboard
                    <i className="i-tabler-external-link"></i>
                  </a>
                )}
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  <code>{integrationMethods[activeTab].code}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
