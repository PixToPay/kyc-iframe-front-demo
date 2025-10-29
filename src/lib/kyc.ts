export function buildKycUrl({ guid, step = 1 }) {
  const origin =
    import.meta.env.VITE_KYC_FRONT_ORIGIN || "https://kyc.dev.pixtopay.com";
  return `${origin}/?guid=${guid}&step=${step}`;
}
