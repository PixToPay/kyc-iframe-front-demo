import { motion } from "framer-motion";
import { buildKycUrl } from "@/lib/kyc";
import { usePostMessage } from "@/hooks/usePostMessage";
import { StatusPill } from "./StatusPill";
import { StepTimeline } from "./StepTimeline";

interface IframeContainerProps {
  guid: string;
  startStep?: number;
  flow: string;
}

export function IframeContainer({
  guid,
  startStep = 1,
  flow,
}: IframeContainerProps) {
  const src = buildKycUrl({ guid, step: startStep, flow });
  const { status, currentStep } = usePostMessage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="rounded-2xl overflow-hidden shadow-xl bg-white border max-w-[400px] md:max-w-[380px] lg:max-w-[400px] mx-auto w-full">
        <div className="relative w-full aspect-[390/844] overflow-hidden">
          <iframe
            id="kyc-iframe"
            src={src}
            className="absolute inset-0 w-full h-full block overflow-hidden"
            allow="camera; geolocation; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
            referrerPolicy="origin"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <StatusPill status={status} />
        <span className="text-sm text-gray-600">
          Etapa: {currentStep ?? "—"}
        </span>
      </div>
      <StepTimeline
        current={currentStep ?? 0}
        total={flow === "onboarding" ? 8 : 4}
      />
    </motion.div>
  );
}
