"use client";

import Image from "next/image";
import useBookStore from "@/components/store/useBookStore";

export default function SizeCard({
  image,
  title,
  description,
  buttonText,
  selected,
  onClick,
}) {
  const { setSelectedSize } = useBookStore();

  const handleClick = () => {
    // Save selected size in Zustand
    setSelectedSize(title);

    // Execute parent's onClick (to highlight selected card)
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer rounded-[24px] transition-all duration-300 ${
        selected
          ? "border-2 border-[#F4B323] shadow-xl scale-[1.02]"
          : "border border-[#E5E5E5] hover:shadow-lg"
      } bg-white p-6`}
    >
      <div className="bg-white border border-[#F4C542] rounded-[20px] p-6 hover:shadow-lg transition-all duration-300">
        <Image
          src={image}
          alt={title}
          width={360}
          height={240}
          className="w-full h-[220px] object-cover rounded-[16px]"
        />

        <div className="mt-6 text-center">
          <h3 className="text-[20px] font-semibold text-[#111111]">{title}</h3>

          <p className="mt-2 text-[14px] text-[#777777]">{description}</p>

          <button
            type="button"
            className="mt-4 text-[15px] font-medium text-[#F4B323] hover:underline"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
