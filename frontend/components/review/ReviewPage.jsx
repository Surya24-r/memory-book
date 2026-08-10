"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useEditorStore,
  COVER_LAYOUTS,
} from "@/components/store/useEditorStore";

const PRICE_PER_PAGE = 150;

function getGridStyle(layoutId) {
  const layout =
    COVER_LAYOUTS.find((l) => l.id === layoutId) || COVER_LAYOUTS[0];
  const [cols, rows] = layout.template;
  return {
    display: "grid",
    gridTemplateColumns: cols,
    gridTemplateRows: rows,
    gap: "6px",
    width: "100%",
    height: "100%",
  };
}

function CoverPhoto({ photo }) {
  if (!photo) return <div className="w-full h-full bg-black/5" />;

  const zoom = photo.zoom || 1;
  const panX = photo.panX || 0;
  const panY = photo.panY || 0;

  return (
    <div className="w-full h-full overflow-hidden">
      <img
        src={photo.url}
        alt=""
        className="w-full h-full object-cover"
        style={{
          transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px) rotate(${photo.rotation || 0}deg)`,
          filter: photo.isBW ? "grayscale(100%)" : "none",
        }}
      />
    </div>
  );
}

function CoverText({ text }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${text.x}%`,
        top: `${text.y}%`,
        width: `${text.width}px`,
        maxWidth: "90%",
      }}
    >
      <div
        style={{
          fontFamily: text.fontFamily,
          fontSize: `${text.fontSize}px`,
          color: text.color,
          fontWeight: text.fontWeight,
          fontStyle: text.fontStyle,
          textAlign: text.textAlign,
          lineHeight: 1.3,
          wordBreak: "break-word",
        }}
      >
        {text.content}
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const router = useRouter();

  const designId = useEditorStore((s) => s.designId);
  const bookTitle = useEditorStore((s) => s.bookTitle);
  const bookSize = useEditorStore((s) => s.bookSize);
  const cover = useEditorStore((s) => s.cover);
  const selectedThemeId = useEditorStore((s) => s.selectedThemeId);
  const themes = useEditorStore((s) => s.themes);
  const spreads = useEditorStore((s) => s.spreads);

  const theme = themes.find((t) => t.id === selectedThemeId) || themes[1];
  const frontCover = cover.front;
  const layout =
    COVER_LAYOUTS.find((l) => l.id === frontCover.layoutId) || COVER_LAYOUTS[0];

  const [understandLowQuality, setUnderstandLowQuality] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const totalPages = 2 + spreads.length * 2;
  const pricePerBook = totalPages * PRICE_PER_PAGE;
  const total = pricePerBook * quantity;

  const handleBackToEdit = () => {
    router.push(`/editor?design_id=${designId}`);
  };

  const handleContinueToPayment = () => {
    // TODO: wire to actual payment/checkout route once it exists
    router.push(`/payment?design_id=${designId}`);
  };

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => q + 1);

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <div className="max-w-[1280px] mx-auto px-8 py-14">
        <p className="text-[13px] font-semibold tracking-wide text-[#F6BE24] uppercase">
          Your Book
        </p>
        <h1 className="mt-2 text-[40px] leading-[48px] font-serif text-[#111111]">
          One last look.
        </h1>

        <div className="mt-10 flex flex-col lg:flex-row gap-10">
          {/* Cover Preview */}
          <div className="flex-1">
            <div
              className="w-full max-w-[700px] rounded-lg shadow-xl overflow-hidden p-3"
              style={{
                background: theme.colors[0],
                aspectRatio: bookSize.ratio,
              }}
            >
              <div
                className="relative w-full h-full p-3 rounded overflow-hidden"
                style={{ background: theme.colors[1] }}
              >
                <div style={getGridStyle(frontCover.layoutId)}>
                  {frontCover.photos.map((photo) => (
                    <CoverPhoto key={photo.id} photo={photo} />
                  ))}
                  {Array.from({
                    length: Math.max(
                      0,
                      layout.maxPhotos - frontCover.photos.length,
                    ),
                  }).map((_, i) => (
                    <CoverPhoto key={`empty-${i}`} photo={null} />
                  ))}
                </div>

                {(frontCover.texts || []).map((t) => (
                  <CoverText key={t.id} text={t} />
                ))}
              </div>
            </div>

            <div className="mt-6 max-w-[700px] rounded-2xl bg-[#FDF6E3] border border-[#F0DFA0] px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-2">
                <span className="text-[#B8860B] mt-0.5">⚠</span>
                <p className="text-sm text-[#5A4A1A]">
                  Some photos may print at lower quality depending on
                  resolution.
                </p>
              </div>
              <button className="text-sm text-[#5A4A1A] underline whitespace-nowrap">
                Review photos
              </button>
            </div>

            <label className="mt-3 flex items-center gap-2 text-sm text-[#5A4A1A]">
              <input
                type="checkbox"
                checked={understandLowQuality}
                onChange={(e) => setUnderstandLowQuality(e.target.checked)}
                className="w-4 h-4"
              />
              I understand, print them anyway
            </label>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="border border-[#E5E5E5] rounded-2xl bg-white p-6">
              <p className="text-[12px] tracking-wide text-[#999999] uppercase">
                Your Order
              </p>
              <h2 className="mt-1 text-[22px] font-serif text-[#111111]">
                {bookTitle || "Untitled Book"}
              </h2>
              <p className="mt-1 text-sm text-[#666666]">
                {totalPages} pages · {bookSize?.title}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-medium text-[#111111]">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQty}
                    className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#111111] hover:bg-[#FAF9F7]"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQty}
                    className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#111111] hover:bg-[#FAF9F7]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-[#E5E5E5] space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#444444]">
                    {totalPages} pages × ₹{PRICE_PER_PAGE}
                  </span>
                  <span className="text-[#111111]">₹{pricePerBook}</span>
                </div>
                {quantity > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#444444]">
                      Quantity × {quantity}
                    </span>
                    <span className="text-[#111111]">₹{total}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#F6BE24]">Shipping</span>
                  <span className="text-[#F6BE24]">FREE</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                <span className="text-[17px] font-semibold text-[#111111]">
                  Total
                </span>
                <span className="text-[17px] font-semibold text-[#111111]">
                  ₹{total}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handleBackToEdit}
                  className="flex-1 py-3 rounded-full border border-[#E5E5E5] text-sm font-medium text-[#111111] hover:bg-[#FAF9F7]"
                >
                  ← Back to edit
                </button>
                
                <button
                  onClick={() =>
                    router.push(
                      `/checkout?design_id=${designId}&quantity=${quantity}`,
                    )
                  }
                  className="px-8 h-[52px] rounded-full bg-[#111111] text-white font-medium hover:bg-black transition"
                >
                  Continue to Payment
                </button>
              </div>

              <p className="mt-4 text-[13px] text-[#666666] text-center">
                Need help?{" "}
                <a href="/contact" className="text-[#F6BE24] font-medium">
                  Chat with Us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
