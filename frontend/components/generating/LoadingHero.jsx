"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProgressBar from "./ProgressBar";
import TipsCard from "./TipsCard";

export default function LoadingHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const designId = searchParams.get("design_id");

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push(
              designId ? `/editor?design_id=${designId}` : "/editor"
            );
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [router, designId]);

  return (
    <section className="py-20">
      <div className="max-w-[780px] mx-auto px-8 text-center">
        <img
          src="/images/Group 1.svg"
          alt="logo"
          className="w-[72px] mx-auto"
        />

        <h1 className="mt-12 text-[52px] leading-[60px] font-medium text-[#111111]">
          Creating your beautiful
          <br />
          MemoryBook...
        </h1>

        <p className="mt-5 text-[18px] leading-8 text-[#666666]">
          Sit back and relax while our AI organizes your photos
          into a beautiful story.
        </p>

        <ProgressBar progress={progress} />

        <TipsCard />
      </div>
    </section>
  );
}