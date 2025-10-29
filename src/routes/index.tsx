import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { DemoSection } from "@/components/DemoSection";
import { EndToEndFlow } from "@/components/EndToEndFlow";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const handleStart = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Header />
      <Hero onStart={handleStart} />
      <HowItWorks />
      <EndToEndFlow />
      <DemoSection />
      <Footer />
      <ScrollToTop />
    </>
  );
}
