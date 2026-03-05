export function PostMessageConsole({
  logs,
  status,
  step,
  onStartOver,
}: {
  logs: any[];
  status?: string;
  step?: number;
  onStartOver?: () => void;
}) {
  const hasResult =
    status === "approved" || status === "rejected" || status === "canceled";
  const isRejected = status === "rejected";
  const isCanceled = status === "canceled";

  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-gray-200 h-full min-h-[480px] flex flex-col overflow-hidden">
      <h3 className="font-semibold text-[color:var(--brand-dark)] mb-2 shrink-0">
        Eventos postMessage
      </h3>
      <div className="text-xs mb-2 text-gray-500 shrink-0">
        Status atual: <b>{status || "—"}</b> | Etapa: {step || "—"}
      </div>
      {hasResult && (
        <div
          className={`mb-3 px-3 py-2 rounded-lg text-sm shrink-0 ${
            isRejected
              ? "bg-red-50 text-red-800 border border-red-200"
              : isCanceled
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : "bg-green-50 text-green-800 border border-green-200"
          }`}
          role="alert"
        >
          {isRejected && "Verificação não aprovada. Você pode tentar novamente."}
          {isCanceled && "Processo cancelado. Você pode iniciar novamente."}
          {status === "approved" &&
            "Verificação aprovada. Você pode iniciar um novo processo."}
        </div>
      )}
      <pre className="text-[11px] text-gray-700 bg-gray-50 p-3 rounded flex-1 min-h-0 overflow-auto overflow-x-hidden whitespace-pre-wrap break-words font-mono">
        {logs.length === 0
          ? "Aguardando eventos..."
          : JSON.stringify(logs, null, 2)}
      </pre>
      {hasResult && onStartOver && (
        <button
          type="button"
          onClick={onStartOver}
          className="mt-3 w-full py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] shrink-0"
          aria-label="Fazer novamente"
        >
          Fazer novamente
        </button>
      )}
    </div>
  );
}
