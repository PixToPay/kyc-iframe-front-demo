import { CpfForm } from "./CpfForm";
import { OnboardingIdForm } from "./OnboardingIdForm";
import { Icon } from "@iconify/react";

type DemoMode = "iframe" | "redirect";
type FlowType = "onboarding" | "liveness";

const segmentButtonClass = (active: boolean) =>
  active
    ? "bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] border-[color:var(--brand-primary)] shadow-sm"
    : "bg-white border-gray-200 text-gray-500 hover:text-gray-700";

const TRANSITION = "transition-[background-color,border-color,box-shadow] duration-[150ms]";

export function StepSessionConfig({
  demoMode,
  setDemoMode,
  activeForm,
  setActiveForm,
  onGuidGenerated,
  onReset,
  guid,
  configDirty = false,
}: {
  demoMode: DemoMode;
  setDemoMode: (m: DemoMode) => void;
  activeForm: FlowType;
  setActiveForm: (f: FlowType) => void;
  onGuidGenerated: (guid: string, submissionId?: string, cpfMasked?: string) => void;
  onReset: () => void;
  guid: string | undefined;
  configDirty?: boolean;
}) {
  const handleChangeFlow = (next: FlowType) => {
    if (next === activeForm) return;
    setActiveForm(next);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--brand-dark)] mb-1">
          Iniciar Demonstração KYC
        </h2>
        <p className="text-sm text-gray-600">
          Configure o modo e o tipo de fluxo e gere uma sessão para testar.
        </p>
      </div>

      <section aria-labelledby="config-heading" className="space-y-4">
        <h3 id="config-heading" className="text-sm font-medium text-gray-700">
          Configurações
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Modo de integração
            </p>
            <div
              className="inline-flex rounded-xl border border-gray-200 p-1 bg-gray-50 cursor-default"
              role="group"
              aria-label="Modo de integração"
            >
              <button
                type="button"
                onClick={() => setDemoMode("iframe")}
                className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer ${TRANSITION} ${segmentButtonClass(demoMode === "iframe")}`}
                aria-pressed={demoMode === "iframe"}
                aria-label="Embedded (Iframe)"
              >
                Embedded / Iframe
              </button>
              <button
                type="button"
                onClick={() => setDemoMode("redirect")}
                className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer ${TRANSITION} ${segmentButtonClass(demoMode === "redirect")}`}
                aria-pressed={demoMode === "redirect"}
                aria-label="Redirect (Nova aba)"
              >
                Redirect / Nova aba
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              {demoMode === "iframe"
                ? "Abre a verificação aqui na página."
                : "Abre em outra aba e retorna com parâmetros na URL."}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Tipo de fluxo
            </p>
            <div
              className="inline-flex rounded-xl border border-gray-200 p-1 bg-gray-50 cursor-default"
              role="group"
              aria-label="Tipo de fluxo"
            >
              <button
                type="button"
                onClick={() => handleChangeFlow("onboarding")}
                className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer ${TRANSITION} ${segmentButtonClass(activeForm === "onboarding")}`}
                aria-pressed={activeForm === "onboarding"}
                aria-label="Novo cadastro"
              >
                Novo cadastro
              </button>
              <button
                type="button"
                onClick={() => handleChangeFlow("liveness")}
                className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer ${TRANSITION} ${segmentButtonClass(activeForm === "liveness")}`}
                aria-pressed={activeForm === "liveness"}
                aria-label="Tenho ID"
              >
                Tenho ID
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              {activeForm === "onboarding"
                ? "Inicia um fluxo do zero."
                : "Continua um fluxo usando identificador existente."}
            </p>
          </div>
        </div>

        {guid && (
          <p className="text-xs text-gray-600" role="status">
            Você já gerou uma sessão. Alterar configurações pode exigir gerar uma nova sessão.
          </p>
        )}
        {configDirty && (
          <div
            className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
            role="alert"
          >
            <Icon icon="tabler:alert-triangle" className="shrink-0 text-amber-600" aria-hidden />
            Configuração mudou. Gere uma nova sessão para aplicar.
          </div>
        )}
      </section>

      {activeForm === "onboarding" ? (
        <CpfForm
          embedded
          demoMode={demoMode}
          onGuidGenerated={onGuidGenerated}
          onReset={onReset}
          isProcessStarted={!!guid}
        />
      ) : (
        <OnboardingIdForm
          embedded
          onGuidGenerated={onGuidGenerated}
          onReset={onReset}
          isProcessStarted={!!guid}
          showSubmissionId
        />
      )}

      <div className="pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-1 rounded px-1 py-0.5 cursor-pointer transition-colors duration-150"
          aria-label="Reiniciar demonstração"
        >
          <Icon icon="tabler:refresh" className="text-base" aria-hidden />
          Reiniciar demonstração
        </button>
      </div>
    </div>
  );
}
