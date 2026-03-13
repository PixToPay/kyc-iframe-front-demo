import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

const TRUNCATE_VAL = 32;

function fallbackCopy(text: string): Promise<void> {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "absolute";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    return Promise.resolve();
  } finally {
    document.body.removeChild(ta);
  }
}

function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return fallbackCopy(text);
}

function parseParamsFromUrl(url: string): Record<string, string> {
  try {
    const u = new URL(url);
    const o: Record<string, string> = {};
    u.searchParams.forEach((v, k) => {
      o[k] = v;
    });
    return o;
  } catch {
    return {};
  }
}

function ValueCell({
  value,
  paramKey,
  onCopy,
}: {
  value: string;
  paramKey: string;
  onCopy: () => void;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<DOMRect | null>(null);
  const [copied, setCopied] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 800);
    return () => clearTimeout(t);
  }, [copied]);

  const truncated =
    value.length > TRUNCATE_VAL ? `${value.slice(0, TRUNCATE_VAL)}…` : value;
  const isTruncated = value.length > TRUNCATE_VAL;

  const handleCopy = () => {
    copyToClipboard(value).then(() => {
      onCopy();
      setCopied(true);
    });
  };

  const openPopover = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) setPopoverAnchor(rect);
    setPopoverOpen(true);
  };

  return (
    <>
      <td className="py-2 px-3 font-mono text-gray-600 align-top">
        {isTruncated ? (
          <button
            ref={anchorRef}
            type="button"
            onClick={openPopover}
            className="block w-full text-left truncate max-w-[180px] sm:max-w-[240px] text-sm hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-inset rounded cursor-pointer transition-colors duration-150"
            title="Clique para ver valor completo"
            aria-label={`Ver valor completo de ${paramKey}`}
          >
            {truncated}
          </button>
        ) : (
          <span className="block truncate max-w-[180px] sm:max-w-[240px] text-sm">
            {value}
          </span>
        )}
      </td>
      <td className="py-2 px-2 text-right align-top w-12">
        <button
          type="button"
          onClick={handleCopy}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-inset transition-colors duration-150 cursor-pointer"
          title="Copiar valor"
          aria-label={`Copiar valor de ${paramKey}`}
        >
          {copied ? (
            <Icon icon="tabler:check" className="w-4 h-4 text-green-600" aria-hidden />
          ) : (
            <Icon icon="tabler:copy" className="w-4 h-4" aria-hidden />
          )}
        </button>
      </td>
      {popoverOpen &&
        isTruncated &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-40"
              aria-hidden
              onClick={() => {
                setPopoverOpen(false);
                setPopoverAnchor(null);
              }}
            />
            <div
              role="dialog"
              aria-label={`Valor completo de ${paramKey}`}
              className="fixed z-50 rounded-lg border border-gray-200 bg-white p-3 shadow-lg left-4 right-4 sm:left-auto sm:right-auto sm:min-w-[280px] sm:max-w-[360px] transition-opacity duration-150"
              style={
                popoverAnchor
                  ? {
                      top: popoverAnchor.bottom + 6,
                      left: Math.min(
                        Math.max(16, popoverAnchor.left),
                        window.innerWidth - 320
                      ),
                    }
                  : undefined
              }
            >
              <div className="flex items-start justify-between gap-2">
                <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap break-all flex-1 min-w-0">
                  {value}
                </pre>
                <button
                  type="button"
                  onClick={() => {
                    setPopoverOpen(false);
                    setPopoverAnchor(null);
                  }}
                  className="p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] shrink-0 cursor-pointer"
                  aria-label="Fechar"
                >
                  <Icon icon="tabler:x" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}

export function QueryParamsTable({
  url,
  viewMode,
  onCopy,
}: {
  url: string;
  viewMode: "parsed" | "raw";
  onCopy?: () => void;
}) {
  const params = useMemo(() => parseParamsFromUrl(url), [url]);
  const entries = Object.entries(params);

  const copyJson = () => {
    copyToClipboard(JSON.stringify(params, null, 2)).then(() => onCopy?.());
  };

  const copyKeyValue = () => {
    const text = entries.map(([k, v]) => `${k}=${v}`).join("\n");
    copyToClipboard(text).then(() => onCopy?.());
  };

  if (viewMode === "raw") {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-900 p-3 overflow-auto transition-colors duration-150">
        <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-all">
          {url}
        </pre>
        <pre className="text-xs text-emerald-300 font-mono mt-2 whitespace-pre-wrap break-all">
          {JSON.stringify(params, null, 2)}
        </pre>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-500 py-3">
        Nenhum parâmetro de query na URL.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={copyJson}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-1 transition-colors duration-150 cursor-pointer"
          title="Copiar parâmetros como JSON"
          aria-label="Copiar parâmetros como JSON"
        >
          <Icon icon="tabler:copy" className="w-3.5 h-3.5" aria-hidden />
          Copiar JSON
        </button>
        <button
          type="button"
          onClick={copyKeyValue}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-1 transition-colors duration-150 cursor-pointer"
          title="Copiar key=value por linha"
          aria-label="Copiar key=value por linha"
        >
          <Icon icon="tabler:copy" className="w-3.5 h-3.5" aria-hidden />
          Copiar key=value
        </button>
      </div>
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="text-left py-2.5 px-3 font-semibold text-gray-800 text-xs uppercase tracking-wide">
                Parâmetro
              </th>
              <th className="text-left py-2.5 px-3 font-semibold text-gray-800 text-xs uppercase tracking-wide">
                Valor
              </th>
              <th className="w-12 py-2.5 px-2 text-right font-semibold text-gray-800 text-xs uppercase tracking-wide">
                Copiar
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key]) => (
              <tr
                key={key}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors duration-150 group relative"
              >
                <td className="py-2 px-3 font-mono text-gray-800 text-sm">
                  {key}
                </td>
                <ValueCell
                  value={params[key]}
                  paramKey={key}
                  onCopy={() => onCopy?.()}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
