import { KycDemoStepper } from "./KycDemoStepper";
import { usePostMessage } from "@/hooks/usePostMessage";
import { buildKycUrl } from "@/lib/kyc";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { RedirectResult } from "./RedirectResultPanel";
import { useTranslation } from "react-i18next";

type DemoMode = "iframe" | "redirect";
type FlowType = "onboarding" | "liveness";

export function DemoSection({
  guid: initialGuid,
  redirectResult = { isFromRedirect: false },
  onClearRedirectResult,
}: {
  guid?: string;
  redirectResult?: RedirectResult;
  onClearRedirectResult?: () => void;
}) {
  const { t } = useTranslation("demo");
  const [guid, setGuid] = useState<string | undefined>(initialGuid);
  const [submissionId, setSubmissionId] = useState<string | undefined>();
  const [cpfMasked, setCpfMasked] = useState<string | undefined>();
  const [activeForm, setActiveForm] = useState<FlowType>("onboarding");
  const [demoMode, setDemoMode] = useState<DemoMode>(
    redirectResult.isFromRedirect ? "redirect" : "iframe"
  );
  const [activeStep, setActiveStep] = useState(0);
  const [configDirty, setConfigDirty] = useState(false);
  const step2ContentRef = useRef<HTMLDivElement>(null);
  const { logs, status, step, clearLogs } = usePostMessage();

  useEffect(() => {
    if (redirectResult.isFromRedirect) {
      setDemoMode("redirect");
      setActiveStep(2);
    }
  }, [redirectResult.isFromRedirect]);

  useEffect(() => {
    if (demoMode === "iframe" && activeStep === 2) setActiveStep(1);
  }, [demoMode, activeStep]);

  useEffect(() => {
    if (activeStep === 1) {
      const t = setTimeout(
        () =>
          step2ContentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        150
      );
      return () => clearTimeout(t);
    }
  }, [activeStep]);

  const handleGuidGenerated = (
    newGuid: string,
    newSubmissionId?: string,
    newCpfMasked?: string
  ) => {
    setGuid(newGuid);
    setSubmissionId(newSubmissionId);
    setCpfMasked(newCpfMasked);
    setConfigDirty(false);
    setActiveStep(1);
  };

  const handleReset = () => {
    onClearRedirectResult?.();
    setGuid(undefined);
    setSubmissionId(undefined);
    setCpfMasked(undefined);
    setConfigDirty(false);
    setActiveStep(0);
    clearLogs();
  };

  const sessionValid = !!(guid && !configDirty);

  const openRedirectDemo = () => {
    if (!guid) return;
    const base = `${window.location.origin}${window.location.pathname}`;
    const redirectUrl = `${base}${base.includes("?") ? "&" : "?"}kycRedirect=1`;
    const state = `demo-${Date.now()}`;
    const flow = activeForm === "liveness" ? "kyc-faceindex" : undefined;
    const url = buildKycUrl({
      guid,
      step: 1,
      flow,
      submissionId: activeForm === "liveness" ? submissionId : undefined,
      redirectUrl,
      state,
    });
    window.open(url, "_blank");
  };

  const step1Complete = !!guid;
  const iframeComplete = sessionValid && !!status;
  const step2Complete = redirectResult.isFromRedirect;

  return (
    <section
      id="demo"
      className="py-20 bg-[color:var(--muted)] overflow-x-hidden"
      aria-labelledby="demo-title"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-0 min-w-0">
        <div className="text-center mb-12">
          <h2
            id="demo-title"
            className="text-3xl font-bold text-[color:var(--brand-dark)] mb-4"
          >
            {t("section.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("section.subtitle")}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm"
        >
          <KycDemoStepper
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            step1Complete={step1Complete}
            step2Complete={step2Complete}
            iframeComplete={iframeComplete}
            sessionValid={sessionValid}
            configDirty={configDirty}
            onConfigChange={() => setConfigDirty(true)}
            step2ContentRef={step2ContentRef}
            redirectResult={redirectResult}
            guid={guid}
            submissionId={submissionId}
            cpfMasked={cpfMasked}
            demoMode={demoMode}
            setDemoMode={setDemoMode}
            activeForm={activeForm}
            setActiveForm={setActiveForm}
            onGuidGenerated={handleGuidGenerated}
            onReset={handleReset}
            openRedirectDemo={openRedirectDemo}
            logs={logs}
            status={status}
            step={step}
          />
        </motion.div>
      </div>
    </section>
  );
}
