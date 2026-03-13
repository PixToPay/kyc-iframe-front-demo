import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { DemoSection } from "@/components/DemoSection";
import { EndToEndFlow } from "@/components/EndToEndFlow";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: IndexPage,
  validateSearch: (search: Record<string, unknown>) => ({
    kycRedirect: search.kycRedirect as string | undefined,
    kycResult: (search.kyc_result ?? search.result) as string | undefined,
    kycSubmissionId: (search.kyc_submissionId ??
      search.submissionId) as string | undefined,
    kycState: (search.kyc_state ?? search.state) as string | undefined,
    kycReason: (search.kyc_reason ?? search.reason) as string | undefined,
  }),
});

function IndexPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const hasRedirect =
    search.kycRedirect === "1" || typeof search.kycResult === "string";

  const handleStart = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  const clearRedirectFromUrl = () => {
    navigate({
      to: "/",
      search: {
        kycRedirect: undefined,
        kycResult: undefined,
        kycSubmissionId: undefined,
        kycState: undefined,
        kycReason: undefined,
      },
      replace: true,
    });
  };

  useEffect(() => {
    if (hasRedirect) {
      document
        .getElementById("demo")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hasRedirect]);

  const redirectResult = hasRedirect
    ? {
        isFromRedirect: true as const,
        result: search.kycResult,
        submissionId: search.kycSubmissionId,
        state: search.kycState,
        reason: search.kycReason,
      }
    : { isFromRedirect: false as const };

  return (
    <>
      <Header />
      <Hero onStart={handleStart} />
      <HowItWorks />
      <EndToEndFlow />
      <DemoSection
        redirectResult={redirectResult}
        onClearRedirectResult={clearRedirectFromUrl}
      />
      <Footer />
      <ScrollToTop />
    </>
  );
}
