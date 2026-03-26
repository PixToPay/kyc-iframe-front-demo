import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { validateCPF } from "@/lib/validators";
import { useKycSession } from "@/hooks/useKycSession";

type DemoMode = "iframe" | "redirect";

interface CpfFormProps {
  onGuidGenerated: (guid: string, submissionId?: string, cpfMasked?: string) => void;
  onReset?: () => void;
  isProcessStarted?: boolean;
  embedded?: boolean;
  /** Controla textos auxiliares por tipo de demonstração */
  demoMode?: DemoMode;
}

export function CpfForm({
  onGuidGenerated,
  onReset,
  isProcessStarted = false,
  embedded = false,
  demoMode = "iframe",
}: CpfFormProps) {
  const [cpf, setCpf] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cpfTouched, setCpfTouched] = useState(false);
  const { mutateAsync } = useKycSession();

  const cpfDigits = cpf.replace(/\D/g, "");
  const cpfValid = validateCPF(cpf);
  const showCpfHelper = cpfTouched && cpfDigits.length >= 11 && !cpfValid;
  const optionalFilled =
    (webhookUrl.trim() ? 1 : 0) + (transactionId.trim() ? 1 : 0);
  const optionalLabel =
    optionalFilled === 0
      ? "(0 preenchidos)"
      : optionalFilled === 1
        ? "(1 preenchido)"
        : "(2 preenchidos)";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpfValid) {
      setError("CPF inválido");
      setCpfTouched(true);
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const params: {
        cpf: string;
        webhook_url?: string;
        transaction_id?: string;
      } = { cpf: cpfDigits };

      if (webhookUrl.trim()) params.webhook_url = webhookUrl.trim();
      if (transactionId.trim()) params.transaction_id = transactionId.trim();

      const data = await mutateAsync(params);
      const guid = data?.onboarding_id || data?.guid;
      if (!guid) throw new Error("onboarding_id_missing");
      onGuidGenerated(guid, undefined, cpf);
    } catch (err) {
      setError("Não foi possível iniciar a sessão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCpf("");
    setWebhookUrl("");
    setTransactionId("");
    setShowAdvanced(false);
    setError("");
    setCpfTouched(false);
    setIsLoading(false);
    onReset?.();
  };

  const content = (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cpf-demo" className="block text-sm font-medium text-gray-700 mb-1">
            CPF <span className="text-red-500">*</span>
          </label>
          <input
            id="cpf-demo"
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => {
              setCpf(
                e.target.value
                  .replace(/\D/g, "")
                  .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
              );
              setError("");
            }}
            onBlur={() => setCpfTouched(true)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:border-transparent outline-none transition-[border-color,box-shadow] duration-150"
            maxLength={14}
            required
            aria-invalid={showCpfHelper || !!error}
            aria-describedby={showCpfHelper || error ? "cpf-helper" : undefined}
          />
          {(showCpfHelper || error) && (
            <p id="cpf-helper" className="text-red-500 text-sm mt-1">
              {error || "Digite um CPF válido."}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[color:var(--brand-primary)] transition-colors duration-150 cursor-pointer"
            aria-expanded={showAdvanced}
            aria-controls="optional-params"
            id="optional-params-toggle"
          >
            <span>Parâmetros opcionais</span>
            <span className="text-gray-500">{optionalLabel}</span>
            <Icon
              icon={showAdvanced ? "tabler:chevron-up" : "tabler:chevron-down"}
              className="text-lg text-gray-500 shrink-0"
              aria-hidden
            />
          </button>
          <div
            id="optional-params"
            role="region"
            aria-labelledby="optional-params-toggle"
            className={showAdvanced ? "border-t border-gray-200 bg-white" : "hidden"}
          >
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://webhook.site/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:border-transparent outline-none transition-[border-color,box-shadow] duration-150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="GUID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:border-transparent outline-none transition-[border-color,box-shadow] duration-150"
                />
              </div>
            </div>
          </div>
        </div>

        {!isProcessStarted ? (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading || !cpfValid}
            className="w-full inline-flex items-center justify-center gap-2 bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <Icon icon="tabler:loader-2" className="text-lg animate-spin" aria-hidden />
                Gerando…
              </>
            ) : (
              "Gerar Sessão KYC"
            )}
          </motion.button>
        ) : (
          <div className="space-y-3">
            <div className="w-full bg-green-100 text-green-800 font-semibold py-3 rounded-xl text-center">
              ✅ Sessão KYC Iniciada
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleReset}
              type="button"
              className="w-full bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] font-semibold py-3 rounded-xl hover:opacity-90 cursor-pointer transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-2"
            >
              Gerar nova sessão
            </motion.button>
          </div>
        )}
      </form>

      {!embedded && (
        <div className="mt-4 text-xs text-gray-500">
          <p>
            💡 <strong>Dica:</strong> Use qualquer CPF válido para testar
          </p>
          <p>Exemplo: 111.444.777-35</p>
        </div>
      )}
    </>
  );

  if (embedded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="space-y-2"
      >
        <p className="text-sm text-gray-600">
          Digite um CPF válido para gerar uma sessão de demonstração.
        </p>
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-[color:var(--brand-dark)] mb-4">
        Iniciar Demonstração KYC
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Digite um CPF válido para gerar uma sessão de demonstração
      </p>
      {content}
    </motion.div>
  );
}
