export function PostMessageConsole({
  logs,
  status,
  step,
}: {
  logs: any[];
  status?: string;
  step?: number;
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-gray-200 h-[480px] overflow-y-auto text-sm">
      <h3 className="font-semibold text-[color:var(--brand-dark)] mb-2">
        Eventos postMessage
      </h3>
      <div className="text-xs mb-3 text-gray-500">
        Status atual: <b>{status || "—"}</b> | Etapa: {step || "—"}
      </div>
      <pre className="text-[11px] text-gray-700 bg-gray-50 p-3 rounded h-[400px] overflow-auto">
        {logs.length === 0
          ? "Aguardando eventos..."
          : JSON.stringify(logs, null, 2)}
      </pre>
    </div>
  );
}
