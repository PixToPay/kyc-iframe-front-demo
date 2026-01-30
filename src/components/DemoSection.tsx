import { IframeFrame } from "./IframeFrame";
import { PostMessageConsole } from "./PostMessageConsole";
import { CpfForm } from "./CpfForm";
import { OnboardingIdForm } from "./OnboardingIdForm";
import { usePostMessage } from "@/hooks/usePostMessage";
import { motion } from "framer-motion";
import { useState } from "react";

export function DemoSection({ guid: initialGuid }: { guid?: string }) {
  const [guid, setGuid] = useState<string | undefined>(initialGuid);
  const [submissionId, setSubmissionId] = useState<string | undefined>();
  const [activeForm, setActiveForm] = useState<"onboarding" | "liveness">(
    "onboarding"
  );
  const { logs, status, step, clearLogs } = usePostMessage();

  const handleGuidGenerated = (newGuid: string, newSubmissionId?: string) => {
    setGuid(newGuid);
    setSubmissionId(newSubmissionId);
  };

  const handleChangeActiveForm = (newForm: "onboarding" | "liveness") => {
    setActiveForm(newForm);
    handleReset();
  };

  const handleReset = () => {
    setGuid(undefined);
    setSubmissionId(undefined);
    clearLogs();
  };

  return (
    <section id="demo" className="py-20 bg-[color:var(--muted)]">
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[color:var(--brand-dark)] mb-4">
            Demonstração Interativa
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Veja como funciona a integração do KYC PixtoPay em tempo real. Gere
            uma sessão e acompanhe os eventos via postMessage.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)_340px] gap-5 lg:gap-5 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 max-w-[320px] w-full mx-auto lg:mx-0"
          >
            <div className="bg-white rounded-2xl shadow-sm p-1 mb-4 border border-gray-200 flex">
              <button
                onClick={() => handleChangeActiveForm("onboarding")}
                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeForm === "onboarding"
                    ? "bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Novo Cadastro
              </button>
              <button
                onClick={() => handleChangeActiveForm("liveness")}
                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeForm === "liveness"
                    ? "bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tenho ID
              </button>
            </div>

            {activeForm === "onboarding" ? (
              <CpfForm
                onGuidGenerated={handleGuidGenerated}
                onReset={handleReset}
                isProcessStarted={!!guid}
              />
            ) : (
              <OnboardingIdForm
                onGuidGenerated={handleGuidGenerated}
                onReset={handleReset}
                isProcessStarted={!!guid}
                showSubmissionId
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 flex justify-center"
          >
            <IframeFrame
              guid={guid}
              type={activeForm}
              submissionId={activeForm === "liveness" ? submissionId : undefined}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 max-w-[340px] w-full mx-auto lg:mx-0"
          >
            <PostMessageConsole logs={logs} status={status} step={step} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
