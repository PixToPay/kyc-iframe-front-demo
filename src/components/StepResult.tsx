import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { ReturnUrlBox } from "./ReturnUrlBox";
import { QueryParamsTable } from "./QueryParamsTable";
import type { RedirectResult } from "./RedirectResultPanel";

function CopyToast({
  show,
  message,
}: {
  show: boolean;
  message: string;
}) {
  if (!show) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2.5 rounded-lg text-sm shadow-lg transition-opacity duration-150"
    >
      {message}
    </div>
  );
}

function getStatusConfig(result?: string): {
  variant: "success" | "error" | "warning" | "info";
  label: string;
} {
  if (result === "approved")
    return { variant: "success", label: "Verificação aprovada" };
  if (result === "rejected")
    return { variant: "error", label: "Verificação rejeitada" };
  if (result === "canceled")
    return { variant: "warning", label: "Processo cancelado" };
  if (result) return { variant: "info", label: `Resultado: ${result}` };
  return { variant: "info", label: "Retorno recebido" };
}

const chipClass = {
  success: "bg-green-100 text-green-800 border-green-200",
  error: "bg-red-100 text-red-800 border-red-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
};

export function StepResult({
  redirectResult,
  resultPanelRef,
  onStartOver,
}: {
  redirectResult: RedirectResult;
  resultPanelRef?: React.RefObject<HTMLDivElement | null>;
  onStartOver?: () => void;
}) {
  const [viewMode, setViewMode] = useState<"parsed" | "raw">("parsed");
  const [toast, setToast] = useState({ show: false, message: "" });
  const resultPanelRefInner = useRef<HTMLDivElement>(null);
  const ref = resultPanelRef ?? resultPanelRefInner;

  const showToast = (message: string) => {
    setToast({ show: true, message });
  };

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast((s) => ({ ...s, show: false })), 2500);
    return () => clearTimeout(t);
  }, [toast.show]);

  useEffect(() => {
    if (redirectResult.isFromRedirect && ref?.current) {
      ref.current.focus({ preventScroll: false });
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [redirectResult.isFromRedirect, ref]);

  if (!redirectResult.isFromRedirect) {
    return (
      <div
        className="rounded-xl border border-gray-200 bg-white px-4 py-6 md:px-6 md:py-8 text-center transition-colors duration-150"
        ref={ref as React.RefObject<HTMLDivElement>}
        tabIndex={-1}
      >
        <p className="text-gray-600 mb-1">
          Nenhum resultado recebido ainda.
        </p>
        <p className="text-sm text-gray-500">
          Conclua a verificação no passo 2 para ver o resultado aqui.
        </p>
        <CopyToast show={toast.show} message={toast.message} />
      </div>
    );
  }

  const { result, reason } = redirectResult;
  const status = getStatusConfig(result);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="rounded-xl border border-gray-200 bg-white px-4 py-5 md:px-6 md:py-6 flex flex-col gap-0 transition-colors duration-150"
      tabIndex={-1}
      aria-label="Painel de resultado do redirect"
    >
      <CopyToast show={toast.show} message={toast.message} />

      <header className="flex flex-col gap-2 pb-4">
        <h3 className="text-lg font-semibold text-[color:var(--brand-dark)]">
          Resultado do retorno
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${chipClass[status.variant]}`}
            role="status"
          >
            {status.label}
          </span>
          {reason && result === "rejected" && (
            <span className="text-xs text-gray-600">{reason}</span>
          )}
        </div>
      </header>

      <div className="border-t border-gray-200 pt-4 flex flex-col gap-4">
        <ReturnUrlBox
          url={typeof window !== "undefined" ? window.location.href : ""}
          onCopy={() => showToast("Copiado!")}
        />
      </div>

      <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <label className="text-xs font-medium text-gray-600">
            Parâmetros da URL
          </label>
          <div className="flex rounded-md border border-gray-200 p-0.5 bg-gray-50 w-fit">
            <button
              type="button"
              onClick={() => setViewMode("parsed")}
              className={`px-2.5 py-1 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-1 transition-colors duration-150 ${
                viewMode === "parsed"
                  ? "bg-white text-[color:var(--brand-dark)] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-pressed={viewMode === "parsed"}
              aria-label="Ver tabela de parâmetros"
            >
              Parsed
            </button>
            <button
              type="button"
              onClick={() => setViewMode("raw")}
              className={`px-2.5 py-1 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-1 transition-colors duration-150 ${
                viewMode === "raw"
                  ? "bg-white text-[color:var(--brand-dark)] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-pressed={viewMode === "raw"}
              aria-label="Ver URL e JSON brutos"
            >
              Raw
            </button>
          </div>
        </div>
        <QueryParamsTable
          url={typeof window !== "undefined" ? window.location.href : ""}
          viewMode={viewMode}
          onCopy={() => showToast("Copiado!")}
        />
      </div>

      {onStartOver && (
        <>
          <div className="border-t border-gray-200 mt-2" />
          <div className="pt-4">
            <button
              type="button"
              onClick={onStartOver}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-2 transition-colors duration-150 cursor-pointer"
              aria-label="Fazer novamente"
            >
              <Icon icon="tabler:refresh" className="w-4 h-4" aria-hidden />
              Fazer novamente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
