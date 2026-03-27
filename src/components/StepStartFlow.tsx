import { IframeFrame } from "./IframeFrame";
import { PostMessageConsole } from "./PostMessageConsole";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

type DemoMode = "iframe" | "redirect";
type FlowType = "onboarding" | "liveness";

function maskCpf(cpf: string): string {
  if (!cpf || cpf.replace(/\D/g, "").length < 4) return "***.***.***-**";
  const digits = cpf.replace(/\D/g, "");
  return `***.***.***-${digits.slice(-2)}`;
}

export function StepStartFlow({
  guid,
  submissionId,
  sessionValid,
  demoMode,
  activeForm,
  cpfMasked,
  openRedirectDemo,
  onStartOver,
  logs,
  status,
  step,
}: {
  guid: string | undefined;
  submissionId: string | undefined;
  sessionValid: boolean;
  demoMode: DemoMode;
  activeForm: FlowType;
  cpfMasked?: string;
  openRedirectDemo: () => void;
  onStartOver?: () => void;
  logs: unknown[];
  status?: string;
  step?: number;
}) {
  const { t } = useTranslation("demo");
  const hasSession = sessionValid;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          {t("start.summaryTitle")}
        </p>
        <ul className="text-sm text-gray-600 space-y-1" role="list">
          {activeForm === "onboarding" && (
            <li>
              <span className="font-medium">{t("start.cpfLabel")}</span>{" "}
              {cpfMasked ? maskCpf(cpfMasked) : "—"}
            </li>
          )}
          <li>
            <span className="font-medium">{t("start.modeLabel")}</span>{" "}
            {demoMode === "iframe"
              ? t("start.modeValue.iframe")
              : t("start.modeValue.redirect")}
          </li>
          <li>
            <span className="font-medium">{t("start.flowLabel")}</span>{" "}
            {activeForm === "onboarding"
              ? t("start.flowValue.onboarding")
              : t("start.flowValue.liveness")}
          </li>
          {guid && (
            <li className="font-mono text-xs break-all">
              <span className="font-medium">{t("start.sessionId")}</span> {guid}
            </li>
          )}
          {submissionId && (
            <li className="font-mono text-xs break-all">
              <span className="font-medium">{t("start.submissionId")}</span> {submissionId}
            </li>
          )}
        </ul>
      </div>

      {demoMode === "iframe" ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] lg:items-stretch min-w-0 overflow-hidden">
          <div className="w-full max-w-[430px] mx-auto lg:mx-0 lg:min-w-0">
            {hasSession ? (
              <IframeFrame
                guid={guid}
                type={activeForm}
                submissionId={activeForm === "liveness" ? submissionId : undefined}
              />
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 w-full text-center min-h-[320px] flex flex-col justify-center">
                <Icon
                  icon="tabler:device-mobile"
                  className="mx-auto text-4xl text-gray-300 mb-2"
                  aria-hidden
                />
                <p className="text-sm text-gray-600">
                  {t("start.iframeEmpty")}
                </p>
              </div>
            )}
          </div>
          <div className="min-h-0 min-w-0 flex flex-col lg:h-full overflow-hidden">
            <PostMessageConsole
              logs={logs}
              status={status}
              step={step}
              onStartOver={onStartOver}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          {hasSession ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="button"
                onClick={openRedirectDemo}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--brand-primary)] px-4 py-3 text-sm font-semibold text-[color:var(--brand-dark)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-2 transition"
                aria-label={t("start.redirect.openAria")}
              >
                <Icon icon="tabler:external-link" aria-hidden />
                {t("start.redirect.open")}
              </button>
              <p className="text-sm text-gray-500">
                {t("start.redirect.help")}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">
                {t("start.redirect.needSession")}
              </p>
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
                aria-disabled="true"
              >
                <Icon icon="tabler:external-link" aria-hidden />
                {t("start.redirect.open")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
