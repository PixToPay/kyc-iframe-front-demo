import { useTranslation } from "react-i18next";

export function AlertBanner() {
  const { t } = useTranslation("demo");
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3 rounded-xl flex gap-2 items-center">
      <i className="i-tabler-alert-triangle" />
      <span>{t("mobileOnly.banner")}</span>
    </div>
  );
}
