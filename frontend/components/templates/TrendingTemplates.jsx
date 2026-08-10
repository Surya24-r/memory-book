"use client";

import { useRef, useState, useCallback } from "react";
import TrendingCard from "./TrendingCard";


export default function TrendingTemplates({
  title = "Trending near you",
  items = [
    { id: 1, image: "/images/Container.svg", alt: "Trending 1" },
    { id: 2, image: "/images/Trendingcont.svg", alt: "Trending 2" },
    { id: 3, image: "/images/Container-1.svg", alt: "Trending 3" },
    { id: 4, image: "/images/Container-2.svg", alt: "Trending 4" },
    { id: 5, image: "/images/Container-3.svg", alt: "Trending 5" },
    { id: 6, image: "/images/Container-4.svg", alt: "Trending 6" },
    { id: 7, image: "/images/Container-5.svg", alt: "Trending 7" },
    { id: 8, image: "/images/Container.svg", alt: "Trending 1" },
    { id: 9, image: "/images/Trendingcont.svg", alt: "Trending 2" },
    { id: 10, image: "/images/Container-1.svg", alt: "Trending 3" },
    { id: 11, image: "/images/Container-2.svg", alt: "Trending 4" },
    { id: 12, image: "/images/Container-3.svg", alt: "Trending 5" },
    { id: 13, image: "/images/Container-4.svg", alt: "Trending 6" },
    { id: 14, image: "/images/Container-5.svg", alt: "Trending 7" },
  ],
}) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const scrollByAmount = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  
  const onMouseDown = useCallback((e) => {
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = true;
    setIsPointerDown(true);
    dragStartX.current = e.pageX - el.offsetLeft;
    scrollStartLeft.current = el.scrollLeft;
  }, []);

  const endDrag = useCallback(() => {
    isDragging.current = false;
    setIsPointerDown(false);
  }, []);

  const onMouseMove = useCallback((e) => {
    const el = trackRef.current;
    if (!el || !isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - dragStartX.current;
    el.scrollLeft = scrollStartLeft.current - walk;
  }, []);

  return (
    <section className="w-full bg-[#FAF9F7] py-10">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[32px] font-medium text-[#111111]">{title}</h2>

          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollByAmount(-1)}
              className="w-11 h-11 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center hover:bg-[#FFF8E8] transition"
            >
              ←
            </button>

            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByAmount(1)}
              className="w-11 h-11 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center hover:bg-[#FFF8E8] transition"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          className={`mt-8 flex gap-5 overflow-x-auto scrollbar-hide pb-2 select-none ${
            isPointerDown ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {items.map((item) => (
            <TrendingCard key={item.id} image={item.image} alt={item.alt} />
          ))}
        </div>
      </div>
    </section>
  );
}

