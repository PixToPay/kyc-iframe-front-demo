import { useState } from "react";
import { motion } from "framer-motion";

interface OnboardingIdFormProps {
  onGuidGenerated: (guid: string, submissionId?: string) => void;
  onReset?: () => void;
  isProcessStarted?: boolean;
  showSubmissionId?: boolean;
}

export function OnboardingIdForm({
  onGuidGenerated,
  onReset,
  isProcessStarted = false,
  showSubmissionId = false,
}: OnboardingIdFormProps) {
  const [guid, setGuid] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guid.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      onGuidGenerated(
        guid.trim(),
        showSubmissionId && submissionId.trim()
          ? submissionId.trim()
          : undefined
      );
      setIsLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setGuid("");
    setSubmissionId("");
    onReset?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-[color:var(--brand-dark)] mb-4">
        Continuar Sessão KYC
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Digite o ID da sessão (GUID) para continuar
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Onboarding ID (GUID) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: 123e4567-e89b-..."
            value={guid}
            onChange={(e) => setGuid(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:border-transparent outline-none"
            required
          />
        </div>

        {showSubmissionId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submission ID <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: 17e2b47e-283a-4f5a-8e0a-..."
              value={submissionId}
              onChange={(e) => setSubmissionId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Preencha quando a API retornar submission_id para montar a URL de
              liveness (step=6, flow=liveness).
            </p>
          </div>
        )}

        {!isProcessStarted ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || !guid.trim()}
            className="w-full bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
          >
            {isLoading ? "Carregando..." : "Carregar Sessão"}
          </motion.button>
        ) : (
          <div className="space-y-3">
            <div className="w-full bg-green-100 text-green-800 font-semibold py-3 rounded-lg text-center">
              ✅ Sessão Carregada
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
            >
              Inserir Outro ID
            </motion.button>
          </div>
        )}
      </form>
    </motion.div>
  );
}
