export function buildKycUrl({
  guid,
  step = 1,
  flow,
  lang,
  submissionId,
}: {
  guid: string;
  step?: number;
  flow?: string;
  lang?: string;
  submissionId?: string;
}) {
  const isLiveness =
    flow === "kyc-faceindex" || flow === "liveness";
  const origin =
    import.meta.env.VITE_KYC_FRONT_ORIGIN || "https://kyc.dev.pixtopay.com";
  const url = new URL(`${origin}/${isLiveness ? "verify" : ""}`);
  url.searchParams.set("guid", guid);
  url.searchParams.set("step", String(step));
  const language = (lang || import.meta.env.VITE_LANG || "pt").toString();
  if (language) url.searchParams.set("lang", language);
  if (isLiveness) url.searchParams.set("onlyliveness", "1");
  if (submissionId) url.searchParams.set("submission_id", submissionId);
  return url.toString();
}
