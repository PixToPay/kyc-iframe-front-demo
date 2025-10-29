import { useDeviceCheck } from "@/hooks/useDeviceCheck";
import { AlertBanner } from "@/components/AlertBanner";
import { IframeContainer } from "@/components/IframeContainer";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
  validateSearch: (search: Record<string, unknown>) => ({
    guid: search.guid as string,
    flow: search.flow as string,
  }),
});

function DemoPage() {
  const { guid, flow } = Route.useSearch();
  const { isDesktop } = useDeviceCheck();

  if (isDesktop) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto mt-8 space-y-4 text-center"
      >
        <AlertBanner />
        <QRCodeCanvas
          value={window.location.href}
          size={220}
          className="mx-auto mt-4"
        />
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto p-4"
    >
      <IframeContainer guid={guid} flow={flow} />
    </motion.main>
  );
}
