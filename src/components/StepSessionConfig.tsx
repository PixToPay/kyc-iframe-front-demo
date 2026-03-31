import { CpfForm } from "./CpfForm";
import { OnboardingIdForm } from "./OnboardingIdForm";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

type DemoMode = "iframe" | "redirect";
type FlowType = "onboarding" | "resume" | "liveness";

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
  const { t } = useTranslation("demo");
  const handleChangeFlow = (next: FlowType) => {
    if (next === activeForm) return;
    setActiveForm(next);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--brand-dark)] mb-1">
          {t("config.title")}
        </h2>
        <p className="text-sm text-gray-600">
          {t("config.subtitle")}
        </p>
      </div>

      <section aria-labelledby="config-heading" className="space-y-4">
        <h3 id="config-heading" className="text-sm font-medium text-gray-700">
          {t("config.heading")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("config.integrationMode")}
            </p>
            <div
              className="inline-flex flex-wrap rounded-xl border border-gray-200 p-1 bg-gray-50 cursor-default gap-1"
              role="group"
              aria-label={t("config.integrationModeAria")}
            >
              <button
                type="button"
                onClick={() => setDemoMode("iframe")}
                className={`grow text-center whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer ${TRANSITION} ${segmentButtonClass(demoMode === "iframe")}`}
                aria-pressed={demoMode === "iframe"}
                aria-label={t("config.integrationModeOptions.iframe")}
              >
                {t("config.integrationModeOptions.iframe")}
              </button>
              <button
                type="button"
                onClick={() => setDemoMode("redirect")}
                className={`grow text-center whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer ${TRANSITION} ${segmentButtonClass(demoMode === "redirect")}`}
                aria-pressed={demoMode === "redirect"}
                aria-label={t("config.integrationModeOptions.redirect")}
              >
                {t("config.integrationModeOptions.redirect")}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              {demoMode === "iframe"
                ? t("config.integrationModeHelp.iframe")
                : t("config.integrationModeHelp.redirect")}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("config.flowType")}
            </p>
            <div
              className="inline-flex flex-wrap rounded-xl border border-gray-200 p-1 bg-gray-50 cursor-default gap-1"
              role="group"
              aria-label={t("config.flowTypeAria")}
            >
              <button
                type="button"
                onClick={() => handleChangeFlow("onboarding")}
                className={`grow text-center whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer ${TRANSITION} ${segmentButtonClass(activeForm === "onboarding")}`}
                aria-pressed={activeForm === "onboarding"}
                aria-label={t("config.flowTypeOptions.onboarding")}
              >
                {t("config.flowTypeOptions.onboarding")}
              </button>
              <button
                type="button"
                onClick={() => handleChangeFlow("resume")}
                className={`grow text-center whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer ${TRANSITION} ${segmentButtonClass(activeForm === "resume")}`}
                aria-pressed={activeForm === "resume"}
                aria-label={t("config.flowTypeOptions.resume")}
              >
                {t("config.flowTypeOptions.resume")}
              </button>
              <button
                type="button"
                onClick={() => handleChangeFlow("liveness")}
                className={`grow text-center whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer ${TRANSITION} ${segmentButtonClass(activeForm === "liveness")}`}
                aria-pressed={activeForm === "liveness"}
                aria-label={t("config.flowTypeOptions.liveness")}
              >
                {t("config.flowTypeOptions.liveness")}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              {activeForm === "onboarding"
                ? t("config.flowTypeHelp.onboarding")
                : activeForm === "resume"
                  ? t("config.flowTypeHelp.resume")
                  : t("config.flowTypeHelp.liveness")}
            </p>
          </div>
        </div>

        {guid && (
          <p className="text-xs text-gray-600" role="status">
            {t("config.sessionExistsNotice")}
          </p>
        )}
        {configDirty && (
          <div
            className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
            role="alert"
          >
            <Icon icon="tabler:alert-triangle" className="shrink-0 text-amber-600" aria-hidden />
            {t("config.configDirty")}
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
          showSubmissionId={activeForm === "liveness"}
        />
      )}

      <div className="pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-1 rounded px-1 py-0.5 cursor-pointer transition-colors duration-150"
          aria-label={t("config.reset")}
        >
          <Icon icon="tabler:refresh" className="text-base" aria-hidden />
          {t("config.resetButton")}
        </button>
      </div>
    </div>
  );
}
