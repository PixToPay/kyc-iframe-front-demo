import { buildKycUrl } from "@/lib/kyc";

export function IframeFrame({
  guid,
  type,
  submissionId,
}: {
  guid?: string;
  type?: "onboarding" | "liveness";
  submissionId?: string;
}) {
  const isLiveness = type === "liveness";
  const src = guid
    ? buildKycUrl({
        guid,
        step: 1,
        flow: isLiveness ? "kyc-faceindex" : undefined,
        submissionId: isLiveness ? submissionId : undefined,
      })
    : "about:blank";

  return (
    <div className="relative bg-black shadow-2xl overflow-hidden border-8 border-gray-800 rounded-[28px] mx-auto w-full max-w-[430px] md:max-w-[430px] lg:max-w-[430px]">
      <div className="relative w-full aspect-[390/844] overflow-hidden">
        <iframe
          key={guid ? `${guid}-${type ?? ""}-${submissionId ?? ""}` : "blank"}
          src={src}
          allow="camera; geolocation"
          className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden"
          referrerPolicy="origin"
        />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-600/80 rounded-full"></div>
      </div>
    </div>
  );
}
