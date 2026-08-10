"use client";

import { useState } from "react";
import TemplateCard from "./TemplateCard";

export default function MoreTemplates() {
  const categories = [
    "All",
    "Wedding",
    "Baby",
    "Birthday",
    "Travel",
    "Family",
    "Festivals",
  ];

  const templates = [
    {
      id: 1,
      image: "/images/mothert.svg",
      category: "Wedding",
    },
    {
      id: 2,
      image: "/images/morenew.svg",
      category: "Wedding",
    },
    {
      id: 3,
      image: "/images/pragt.svg",
      category: "Travel",
    },
    {
      id: 4,
      image: "/images/festt.svg",
      category: "Baby",
    },
    {
      id: 5,
      image: "/images/birthday.svg",
      category: "Birthday",
    },
    {
      id: 6,
      image: "/images/familyt.svg",
      category: "Family",
    },
    {
      id: 7,
      image: "/images/mothert.svg",
      category: "Festivals",
    },
    {
      id: 8,
      image: "/images/fathert.svg",
      category: "Wedding",
    },
    {
      id: 9,
      image: "/images/marraigeorder.svg",
      category: "Travel",
    },
    {
      id: 10,
      image: "/images/couplet.svg",
      category: "Birthday",
    },
    {
        id:11,
        image:"/images/Container-1.svg",
        category:"Wedding",
    },
    {
        id:12,
        image:"/images/Container-2.svg",
        category:"Birthday"
    },
     {
        id:13,
        image:"/images/Container-5.svg",
        category:"Baby"
    }
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTemplates =
    activeCategory === "All"
      ? templates
      : templates.filter(
          (template) => template.category === activeCategory
        );

  return (
    <section className="w-full bg-[#FAF9F7] py-16">
      <div className="max-w-[1280px] mx-auto px-8">

        

        <div className="flex items-center justify-between">
          <h2 className="text-[32px] font-medium text-[#111111]">
            More templates for you
          </h2>

    

          <div className="flex items-center gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-black text-white"
                    : "bg-white border border-[#E5E5E5] text-[#555555] hover:bg-[#F3F3F3]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Gallery */}

        <div className="columns-5 gap-5 mt-10">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              image={template.image}
              alt={template.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 