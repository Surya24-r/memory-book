"use client";

import PerfectCard from "./PerfectCard";

export default function PerfectSize() {
  const covers = [
    {
      id: 1,
      image: "/images/custom1.png",
      title: "Timeless Romance",
      pages: "20 Pages",
      price: "From ₹1,999",
    },
    {
      id: 2,
      image: "/images/custom2.png",
      title: "Our Journey",
      pages: "24 Pages",
      price: "From ₹2,099",
    },
    {
      id: 3,
      image: "/images/custom3.png",
      title: "Forever Together",
      pages: "20 Pages",
      price: "From ₹2,299",
    },
    {
      id: 4,
      image: "/images/custom4.png",
      title: "Classic Wedding",
      pages: "28 Pages",
      price: "From ₹2,499",
    },
    {
      id: 5,
      image: "/images/custom5.png",
      title: "Golden Moments",
      pages: "20 Pages",
      price: "From ₹1,999",
    },
    {
      id: 6,
      image: "/images/custom6.png",
      title: "Vintage Memories",
      pages: "24 Pages",
      price: "From ₹2,299",
    },
    {
      id: 7,
      image: "/images/custom7.png",
      title: "Love Story",
      pages: "20 Pages",
      price: "From ₹2,199",
    },
    {
      id: 8,
      image: "/images/custom8.png",
      title: "Elegant Day",
      pages: "24 Pages",
      price: "From ₹2,499",
    },
  ];

  return (
    <section className="w-full py-20">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[#F4B323] text-[12px] font-semibold tracking-[4px] uppercase">
              Pick The Perfect Size
            </p>

            <h2 className="mt-3 text-[42px] leading-[50px] font-medium text-[#111111]">
              Start creating your memory book
            </h2>
          </div>

         
        </div>

        <div className="grid grid-cols-4 gap-8">
          {covers.map((cover) => (
            <PerfectCard
              key={cover.id}
              image={cover.image}
              title={cover.title}
              pages={cover.pages}
              price={cover.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
