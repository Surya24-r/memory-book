"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SizeCard from "./SizeCard";

export default function CustomHero() {
  
  const [selectedSize, setSelectedSize] = useState(null);

  const router = useRouter();

  const sizeCards = [
    {
      id: 1,
      image: "/images/cover13.png",
      title: "8 × 8 inch Classic",
      description: "20 pages · from ₹1,999 · fits 20–80 photos",
      buttonText: "Select Size",
    },
    {
      id: 2,
      image: "/images/cover12.png",
      title: "10 × 10 inch Grand",
      description: "20 pages · from ₹2,499 · fits 20–80 photos",
      buttonText: "Select Size",
    },
    {
      id: 3,
      image: "/images/cover11.png",
      title: "11 × 8.5 inch Landscape",
      description: "20 pages · from ₹2,899 · fits 20–80 photos",
      buttonText: "Select Size",
    },
  ];

  return (
    <section className="w-full pt-16 pb-20">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Heading */}

        <div className="text-center">
          <p className="text-[#F4B323] text-[12px] font-semibold tracking-[4px] uppercase">
            Make It Happen
          </p>

          <h1 className="text-[56px] leading-[64px] font-medium text-[#111111] mt-3">
            Choose your size
          </h1>

          <p className="text-[18px] text-[#666666] mt-4">
            Select the canvas that best fits your story.
          </p>
        </div>

        {/* Toggle Buttons */}

        <div className="flex justify-center gap-4 mt-8">
          <Link href="/templates">
            <button className="flex items-center gap-2 border border-[#E5E5E5] rounded-full px-6 py-3 bg-white hover:bg-[#FFF9E8] transition">
              <Image
                src="/images/templatesicon.svg"
                alt=""
                width={18}
                height={18}
              />
              <span className="text-[15px]">Templates</span>
            </button>
          </Link>

          <Link href="/custom">
            <button className="flex items-center gap-2 border border-[#E5E5E5] rounded-full px-6 py-3 bg-white hover:bg-[#FFF9E8] transition">
              <Image
                src="/images/customicon.svg"
                alt=""
                width={18}
                height={18}
              />
              <span className="text-[15px]">Custom</span>
            </button>
          </Link>
        </div>

        {/* Size Cards */}

        <div className="grid grid-cols-3 gap-8 mt-16">
          {sizeCards.map((card) => (
            <SizeCard
              key={card.id}
              image={card.image}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              selected={selectedSize === card.title}
              onClick={() => setSelectedSize(card.title)}
            />
          ))}
        </div>
        <div className="flex justify-end mt-12">
          <button
            disabled={!selectedSize}
            onClick={() => router.push(`/upload?size=${selectedSize}`)}
            className={`w-[260px] h-[56px] cursor-pointer rounded-full font-medium transition-all ${
              selectedSize
                ? "bg-[#111111] text-white hover:bg-[#222222]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    </section>
  );
}
