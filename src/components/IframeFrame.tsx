import { buildKycUrl } from "@/lib/kyc";

export function IframeFrame({ guid }: { guid?: string }) {
  const src = guid ? buildKycUrl({ guid }) : "about:blank";
  return (
    <div className="relative rounded-4xl bg-black shadow-2xl overflow-hidden border-8 border-gray-800 w-[360px] h-[800px] lg:w-[385px] lg:h-[850px] mx-auto">
      <iframe
        src={src}
        allow="camera; geolocation"
        className="w-full h-full rounded-3xl"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gray-600 rounded-full"></div>
    </div>
  );
}
