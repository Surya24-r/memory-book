"use client";

import { useRef } from "react";

export default function UploadArea({ onUpload }) {
  const inputRef = useRef(null);

  const openFilePicker = () => {
    inputRef.current.click();
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <>
      <div
        onClick={openFilePicker}
        className="mt-8 h-[310px] rounded-[28px] border-2 border-dashed border-[#E0E0E0] bg-white flex flex-col justify-center items-center cursor-pointer hover:border-[#F4B323] transition-all"
      >
        <div className="w-14 h-14 rounded-full bg-[#F4B323] flex items-center justify-center">
          <span className="text-[28px] font-light text-[#111111] leading-none mb-0.5">+</span>
        </div>

        <h2 className="mt-6 text-[32px] font-serif font-normal text-[#111111] tracking-tight">
          Drop photos here or click to browse
        </h2>

        <p className="mt-2 text-[15px] text-[#888888]">
          JPG, PNG, HEIC • up to 20 MB each
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}