import { useTranslation } from "react-i18next";

export type RedirectResult =
  | { isFromRedirect: false }
  | {
      isFromRedirect: true;
      result?: string;
      submissionId?: string;
      state?: string;
      reason?: string;
    };

export function RedirectResultPanel({
  redirectResult,
}: {
  redirectResult: RedirectResult;
}) {
  const { t } = useTranslation("demo");
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : undefined;

  if (!redirectResult.isFromRedirect) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-left">
        <h4 className="font-semibold text-[color:var(--brand-dark)] text-sm mb-1">
          {t("redirectPanel.title")}
        </h4>
        <p className="text-xs text-gray-600">
          {t("redirectPanel.waiting")}
        </p>
      </div>
    );
  }

  const { result, submissionId, state, reason } = redirectResult;
  const isApproved = result === "approved";
  const isRejected = result === "rejected";
  const isCanceled = result === "canceled";

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white text-left space-y-3">
      <div
        className={`rounded-md p-3 text-sm ${
          isApproved
            ? "bg-green-50 text-green-800 border border-green-200"
            : isRejected
              ? "bg-red-50 text-red-800 border border-red-200"
              : isCanceled
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : "bg-gray-50 text-gray-700 border border-gray-200"
        }`}
      >
        {isApproved && <p className="font-medium">{t("redirectPanel.approved")}</p>}
        {isRejected && (
          <p className="font-medium">
            {t("redirectPanel.rejected")}
            {reason && (
              <span className="block text-xs font-normal mt-1">{reason}</span>
            )}
          </p>
        )}
        {isCanceled && <p className="font-medium">{t("redirectPanel.canceled")}</p>}
        {!isApproved && !isRejected && !isCanceled && result && (
          <p className="font-medium">{t("redirectPanel.generic", { result })}</p>
        )}
      </div>

      <div className="text-[11px] text-gray-600 space-y-1">
        {currentUrl && (
          <p className="break-all">
            <span className="font-semibold">{t("redirectPanel.returnUrl")}</span>{" "}
            {currentUrl}
          </p>
        )}
        {submissionId && (
          <p>
            <span className="font-semibold">submissionId:</span> {submissionId}
          </p>
        )}
        {state && (
          <p>
            <span className="font-semibold">state:</span> {state}
          </p>
        )}
        {typeof result === "string" && !isApproved && !isRejected && !isCanceled && (
          <p>
            <span className="font-semibold">result:</span> {result}
          </p>
        )}
      </div>

      <p className="text-[11px] text-gray-500">
        {t("redirectPanel.hint")}
      </p>
    </div>
  );
}
