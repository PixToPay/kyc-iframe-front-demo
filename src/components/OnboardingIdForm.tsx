import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

interface OnboardingIdFormProps {
  onGuidGenerated: (guid: string, submissionId?: string, cpfMasked?: string) => void;
  onReset?: () => void;
  isProcessStarted?: boolean;
  showSubmissionId?: boolean;
  embedded?: boolean;
}

export function OnboardingIdForm({
  onGuidGenerated,
  onReset,
  isProcessStarted = false,
  showSubmissionId = false,
  embedded = false,
}: OnboardingIdFormProps) {
  const { t } = useTranslation("demo");
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

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("forms.onboardingId.label")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t("forms.onboardingId.placeholder")}
            value={guid}
            onChange={(e) => setGuid(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:border-transparent outline-none"
            required
          />
        </div>

        {showSubmissionId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("forms.onboardingId.submissionIdLabel")}{" "}
              <span className="text-gray-400">{t("forms.cpf.optional")}</span>
            </label>
            <input
              type="text"
              placeholder={t("forms.onboardingId.submissionIdPlaceholder")}
              value={submissionId}
              onChange={(e) => setSubmissionId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand-primary)] focus:border-transparent outline-none transition-[border-color,box-shadow] duration-150"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("forms.onboardingId.submissionIdHelp")}
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
            {isLoading ? t("forms.onboardingId.submitLoading") : t("forms.onboardingId.submitIdle")}
          </motion.button>
        ) : (
          <div className="space-y-3">
            <div className="w-full bg-green-100 text-green-800 font-semibold py-3 rounded-lg text-center">
              <span className="inline-flex items-center gap-2 justify-center">
                <Icon icon="tabler:circle-check-filled" aria-hidden />
                {t("forms.onboardingId.started")}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              type="button"
              className="w-full bg-[color:var(--brand-primary)] text-[color:var(--brand-dark)] font-semibold py-3 rounded-xl hover:opacity-90 transition"
            >
              {t("forms.onboardingId.startOver")}
            </motion.button>
          </div>
        )}
      </form>
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
          {t("forms.onboardingId.embeddedHelp")}
        </p>
        {formContent}
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
        {t("forms.onboardingId.title")}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {t("forms.onboardingId.subtitle")}
      </p>
      {formContent}
    </motion.div>
  );
}
