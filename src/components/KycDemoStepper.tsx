import { useRef } from "react";
import { Icon } from "@iconify/react";
import { StepSessionConfig } from "./StepSessionConfig";
import { StepStartFlow } from "./StepStartFlow";
import { StepResult } from "./StepResult";
import type { RedirectResult } from "./RedirectResultPanel";

type DemoMode = "iframe" | "redirect";
type FlowType = "onboarding" | "liveness";

const STEPS_IFRAME = [
  { id: 0, label: "Configurar sessão" },
  { id: 1, label: "Iniciar verificação" },
] as const;

const STEPS_REDIRECT = [
  { id: 0, label: "Configurar sessão" },
  { id: 1, label: "Iniciar verificação" },
  { id: 2, label: "Resultado do retorno" },
] as const;

export function KycDemoStepper({
  activeStep,
  setActiveStep,
  step1Complete,
  step2Complete,
  iframeComplete,
  sessionValid,
  configDirty,
  onConfigChange,
  step2ContentRef,
  redirectResult,
  guid,
  submissionId,
  cpfMasked,
  demoMode,
  setDemoMode,
  activeForm,
  setActiveForm,
  onGuidGenerated,
  onReset,
  openRedirectDemo,
  logs,
  status,
  step,
}: {
  activeStep: number;
  setActiveStep: (n: number) => void;
  step1Complete: boolean;
  step2Complete: boolean;
  iframeComplete: boolean;
  sessionValid: boolean;
  configDirty?: boolean;
  onConfigChange?: () => void;
  step2ContentRef?: React.RefObject<HTMLDivElement | null>;
  redirectResult: RedirectResult;
  guid: string | undefined;
  submissionId: string | undefined;
  cpfMasked: string | undefined;
  demoMode: DemoMode;
  setDemoMode: (m: DemoMode) => void;
  activeForm: FlowType;
  setActiveForm: (f: FlowType) => void;
  onGuidGenerated: (guid: string, submissionId?: string, cpfMasked?: string) => void;
  onReset: () => void;
  openRedirectDemo: () => void;
  logs: unknown[];
  status?: string;
  step?: number;
}) {
  const resultPanelRef = useRef<HTMLDivElement>(null);
  const isIframe = demoMode === "iframe";
  const steps = isIframe ? STEPS_IFRAME : STEPS_REDIRECT;

  const canGoTo = (target: number) => {
    if (target === 0) return true;
    if (target === 1) return sessionValid;
    if (target === 2) return !isIframe && step2Complete;
    return false;
  };

  const isStepCompleted = (stepId: number) => {
    if (isIframe) {
      return (stepId === 0 && step1Complete) || (stepId === 1 && iframeComplete);
    }
    return (
      (stepId === 0 && step1Complete) ||
      (stepId === 1 && step2Complete) ||
      (stepId === 2 && step2Complete)
    );
  };

  return (
    <div className="space-y-8">
      <nav
        className="flex flex-wrap items-center gap-2 sm:gap-4"
        aria-label="Progresso da demonstração KYC"
      >
        {steps.map((s, i) => {
          const completed = isStepCompleted(s.id);
          const current = activeStep === s.id;
          const clickable = canGoTo(s.id);

          return (
            <div key={s.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => clickable && setActiveStep(s.id)}
                disabled={!clickable}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-2 ${
                  current
                    ? "bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)]"
                    : completed
                      ? "bg-green-100 text-green-800 border border-green-200 cursor-pointer"
                      : clickable
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                        : "bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
                aria-current={current ? "step" : undefined}
                aria-label={`${s.label}${completed ? ", concluído" : ""}`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    current
                      ? "bg-[color:var(--brand-dark)]/20"
                      : completed
                        ? "bg-green-200"
                        : "bg-gray-200"
                  }`}
                  aria-hidden
                >
                  {completed && !current ? (
                    <Icon icon="tabler:check" className="text-sm" />
                  ) : (
                    s.id + 1
                  )}
                </span>
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <span
                  className="hidden sm:inline h-px w-4 bg-gray-200"
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </nav>

      <div className="min-h-[320px]">
        {activeStep === 0 && (
          <StepSessionConfig
            demoMode={demoMode}
            setDemoMode={(m) => {
              setDemoMode(m);
              onConfigChange?.();
            }}
            activeForm={activeForm}
            setActiveForm={(f) => {
              setActiveForm(f);
              onConfigChange?.();
            }}
            onGuidGenerated={onGuidGenerated}
            onReset={onReset}
            guid={guid}
            configDirty={configDirty}
          />
        )}
        {activeStep === 1 && (
          <div ref={step2ContentRef}>
            <StepStartFlow
              guid={guid}
              submissionId={submissionId}
              sessionValid={sessionValid}
              demoMode={demoMode}
              activeForm={activeForm}
              cpfMasked={cpfMasked}
              openRedirectDemo={openRedirectDemo}
            onStartOver={onReset}
            logs={logs}
              status={status}
              step={step}
            />
          </div>
        )}
        {!isIframe && activeStep === 2 && (
          <StepResult
            redirectResult={redirectResult}
            resultPanelRef={resultPanelRef}
            onStartOver={onReset}
          />
        )}
      </div>
    </div>
  );
}
