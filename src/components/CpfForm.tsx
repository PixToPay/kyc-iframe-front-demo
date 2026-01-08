import { useState } from "react";
import { motion } from "framer-motion";
import { validateCPF } from "@/lib/validators";
import { useKycSession } from "@/hooks/useKycSession";

interface CpfFormProps {
  onGuidGenerated: (guid: string) => void;
  onReset?: () => void;
  isProcessStarted?: boolean;
}

export function CpfForm({
  onGuidGenerated,
  onReset,
  isProcessStarted = false,
}: CpfFormProps) {
  const [cpf, setCpf] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync } = useKycSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCPF(cpf)) {
      setError("CPF inválido");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const cpfDigits = cpf.replace(/\D/g, "");
      const params: {
        cpf: string;
        webhook_url?: string;
        transaction_id?: string;
      } = { cpf: cpfDigits };
      
      if (webhookUrl.trim()) {
        params.webhook_url = webhookUrl.trim();
      }
      if (transactionId.trim()) {
        params.transaction_id = transactionId.trim();
      }

      const data = await mutateAsync(params);
      const guid = data?.onboarding_id || data?.guid;
      if (!guid) throw new Error("onboarding_id_missing");
      onGuidGenerated(guid);
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
    setIsLoading(false);
    onReset?.();
  };

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) =>
              setCpf(
                e.target.value
                  .replace(/\D/g, "")
                  .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
              )
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:border-transparent outline-none"
            maxLength={14}
            required
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-[color:var(--brand-primary)] hover:underline flex items-center gap-1"
          >
            {showAdvanced ? "▼" : "▶"} Parâmetros opcionais
          </button>
        </div>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 pt-2 border-t border-gray-200"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="url"
                placeholder="https://webhook.site/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:border-transparent outline-none"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:border-transparent outline-none"
              />
            </div>
          </motion.div>
        )}

        {!isProcessStarted ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
          >
            {isLoading ? "Gerando sessão..." : "Gerar Sessão KYC"}
          </motion.button>
        ) : (
          <div className="space-y-3">
            <div className="w-full bg-green-100 text-green-800 font-semibold py-3 rounded-lg text-center">
              ✅ Sessão KYC Iniciada
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
            >
              Iniciar Novo Processo
            </motion.button>
          </div>
        )}
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>
          💡 <strong>Dica:</strong> Use qualquer CPF válido para testar
        </p>
        <p>Exemplo: 111.444.777-35</p>
      </div>
    </motion.div>
  );
}
