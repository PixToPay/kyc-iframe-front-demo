import { IframeFrame } from "./IframeFrame";
import { PostMessageConsole } from "./PostMessageConsole";
import { CpfForm } from "./CpfForm";
import { usePostMessage } from "@/hooks/usePostMessage";
import { motion } from "framer-motion";
import { useState } from "react";

export function DemoSection({ guid: initialGuid }: { guid?: string }) {
  const [guid, setGuid] = useState<string | undefined>(initialGuid);
  const { logs, status, step, clearLogs } = usePostMessage();

  const handleGuidGenerated = (newGuid: string) => {
    setGuid(newGuid);
  };

  const handleReset = () => {
    setGuid(undefined);
    clearLogs();
  };

  return (
    <section id="demo" className="py-20 bg-[color:var(--muted)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[color:var(--brand-dark)] mb-4">
            Demonstração Interativa
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Veja como funciona a integração do KYC PixtoPay em tempo real. Gere
            uma sessão e acompanhe os eventos via postMessage.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <CpfForm
              onGuidGenerated={handleGuidGenerated}
              onReset={handleReset}
              isProcessStarted={!!guid}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <IframeFrame guid={guid} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <PostMessageConsole logs={logs} status={status} step={step} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
