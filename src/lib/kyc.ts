export function buildKycUrl({
  guid,
  step = 1,
  flow,
  lang,
}: {
  guid: string;
  step?: number;
  flow?: string;
  lang?: string;
}) {
  const origin =
    import.meta.env.VITE_KYC_FRONT_ORIGIN || "https://kyc.dev.pixtopay.com";
  const url = new URL(`${origin}/`);
  url.searchParams.set("guid", guid);
  url.searchParams.set("step", String(step));
  const language = (lang || import.meta.env.VITE_LANG || "pt").toString();
  if (language) url.searchParams.set("lang", language);
  if (flow === "kyc-faceindex") url.searchParams.set("onlyliveness", "1");
  return url.toString();
}
