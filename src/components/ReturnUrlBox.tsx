import { useState } from "react";
import { Icon } from "@iconify/react";

const TRUNCATE_LEN = 48;

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

export function ReturnUrlBox({
  url,
  onCopy,
}: {
  url: string;
  onCopy?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const truncated =
    url.length > TRUNCATE_LEN && !expanded
      ? `${url.slice(0, TRUNCATE_LEN)}…`
      : url;
  const canExpand = url.length > TRUNCATE_LEN;

  const handleCopy = () => {
    copyToClipboard(url).then(() => onCopy?.());
  };

  const handleOpen = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">
        URL de retorno
      </label>
      <div className="flex items-stretch gap-1 rounded-lg border border-gray-200 bg-gray-50/50 transition-[border-color,box-shadow] duration-150 focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-gray-200">
        <input
          type="text"
          readOnly
          value={truncated}
          className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm font-mono text-gray-800 truncate border-0 rounded-l-lg outline-none"
          aria-label="URL de retorno (somente leitura)"
        />
        <div className="flex items-center border-l border-gray-200 pl-1 pr-1 py-1 gap-0.5">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-inset transition-colors duration-150 cursor-pointer"
            title="Copiar URL"
            aria-label="Copiar URL"
          >
            <Icon icon="tabler:copy" className="w-4 h-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={handleOpen}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-inset transition-colors duration-150 cursor-pointer"
            title="Abrir URL em nova aba"
            aria-label="Abrir URL em nova aba"
          >
            <Icon icon="tabler:external-link" className="w-4 h-4" aria-hidden />
          </button>
          {canExpand && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-inset transition-colors duration-150 cursor-pointer"
              title={expanded ? "Recolher URL" : "Expandir URL"}
              aria-label={expanded ? "Recolher URL" : "Expandir URL"}
              aria-expanded={expanded}
            >
              <Icon
                icon={expanded ? "tabler:chevron-up" : "tabler:chevron-down"}
                className="w-4 h-4 transition-transform duration-150"
                aria-hidden
              />
            </button>
          )}
        </div>
      </div>
      {canExpand && (
        <div
          className={`overflow-hidden transition-all duration-150 ease-out ${
            expanded ? "max-h-[40rem] opacity-100" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!expanded}
        >
          <div className="mt-1 px-3 py-2 rounded-lg bg-gray-100 border border-gray-200">
            <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-all">
              {url}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
