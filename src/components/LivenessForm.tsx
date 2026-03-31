import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { validateCPF } from "@/lib/validators";
import { useLivenessSession } from "@/hooks/useLivenessSession";
import { useTranslation } from "react-i18next";

interface LivenessFormProps {
  onGuidGenerated: (guid: string, submissionId?: string, cpfMasked?: string, redirectUrl?: string) => void;
  onReset?: () => void;
  isProcessStarted?: boolean;
  embedded?: boolean;
}

export function LivenessForm({
  onGuidGenerated,
  onReset,
  isProcessStarted = false,
  embedded = false,
}: LivenessFormProps) {
  const { t } = useTranslation("demo");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cpfTouched, setCpfTouched] = useState(false);
  const { mutateAsync } = useLivenessSession();

  const cpfDigits = cpf.replace(/\D/g, "");
  const cpfValid = validateCPF(cpf);
  const showCpfHelper = cpfTouched && cpfDigits.length >= 11 && !cpfValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpfValid) {
      setError(t("forms.cpf.invalid"));
      setCpfTouched(true);
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const data = await mutateAsync({ cpf: cpfDigits });
      if (!data.guid) throw new Error("guid_missing");
      onGuidGenerated(data.guid, data.submission_id, cpf, data.redirect_url);
    } catch {
      setError(t("forms.liveness.startFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCpf("");
    setError("");
    setCpfTouched(false);
    setIsLoading(false);
    onReset?.();
  };

  const content = (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cpf-liveness" className="block text-sm font-medium text-gray-700 mb-1">
            {t("forms.cpf.label")} <span className="text-red-500">*</span>
          </label>
          <input
            id="cpf-liveness"
            type="text"
            placeholder={t("forms.cpf.placeholder")}
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
            aria-describedby={showCpfHelper || error ? "cpf-liveness-helper" : undefined}
          />
          {(showCpfHelper || error) && (
            <p id="cpf-liveness-helper" className="text-red-500 text-sm mt-1">
              {error || t("forms.cpf.invalid")}
            </p>
          )}
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
                {t("forms.liveness.submitLoading")}
              </>
            ) : (
              t("forms.liveness.submitIdle")
            )}
          </motion.button>
        ) : (
          <div className="space-y-3">
            <div className="w-full bg-green-100 text-green-800 font-semibold py-3 rounded-xl text-center">
              <span className="inline-flex items-center gap-2 justify-center">
                <Icon icon="tabler:circle-check-filled" aria-hidden />
                {t("forms.liveness.started")}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleReset}
              type="button"
              className="w-full bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] font-semibold py-3 rounded-xl hover:opacity-90 cursor-pointer transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:ring-offset-2"
            >
              {t("forms.cpf.startOver")}
            </motion.button>
          </div>
        )}
      </form>

      {!embedded && (
        <div className="mt-4 text-xs text-gray-500">
          <p>
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="tabler:bulb" aria-hidden />
              <strong>{t("forms.cpf.tipLabel")}</strong>
              <span>{t("forms.cpf.tipBody")}</span>
            </span>
          </p>
          <p>{t("forms.cpf.tipExample")}</p>
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
        <p className="text-sm text-gray-600">{t("forms.liveness.subtitle")}</p>
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
        {t("forms.liveness.title")}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{t("forms.liveness.subtitle")}</p>
      {content}
    </motion.div>
  );
}
