import { Suspense } from "react";
import LoadingHero from "@/components/generating/LoadingHero";

export default function GeneratingPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Suspense fallback={<div className="min-h-screen bg-[#FAF9F7]" />}>
        <LoadingHero />
      </Suspense>
    </main>
  );
}