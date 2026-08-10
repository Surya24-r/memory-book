"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import {
  LAYOUTS,
  COVER_LAYOUTS,
  useEditorStore,
} from "@/components/store/useEditorStore";

function LayoutThumb({ template }) {
  const [cols, rows] = template;
  return (
    <div
      className="w-full h-full grid gap-[3px] p-1.5 bg-neutral-50"
      style={{ gridTemplateColumns: cols, gridTemplateRows: rows }}
    >
      {Array.from({
        length: cols.split(" ").length * rows.split(" ").length,
      }).map((_, i) => (
        <div key={i} className="bg-neutral-300 rounded-[2px]" />
      ))}
    </div>
  );
}

export default function LayoutPanel() {
  const [showUnplaced, setShowUnplaced] = useState(true);

  // Spread state
  const spreads = useEditorStore((s) => s.spreads);
  const currentSpreadIndex = useEditorStore((s) => s.currentSpreadIndex);
  const activeSide = useEditorStore((s) => s.activeSide);
  const setActiveSide = useEditorStore((s) => s.setActiveSide);
  const setLayout = useEditorStore((s) => s.setLayout);
  const selectSpread = useEditorStore((s) => s.selectSpread);

  // Cover state
  const cover = useEditorStore((s) => s.cover);
  const activeCoverSide = useEditorStore((s) => s.activeCoverSide);
  const setActiveCoverSide = useEditorStore((s) => s.setActiveCoverSide);
  const setCoverLayout = useEditorStore((s) => s.setCoverLayout);

  // Unplaced photos state
  const unplacedPhotos = useEditorStore((s) => s.unplacedPhotos);
  const placeUnplacedPhoto = useEditorStore((s) => s.placeUnplacedPhoto);
  const placeUnplacedPhotoOnCover = useEditorStore(
    (s) => s.placeUnplacedPhotoOnCover,
  );
  const deleteUnplacedPhoto = useEditorStore((s) => s.deleteUnplacedPhoto);
  const clearActivePhoto = useEditorStore((s) => s.clearActivePhoto);

  // Determine current page info
  let activeLayoutId = "split-2col";
  let isCoverFront = false;
  let isCoverBack = false;
  let isInterior = false;

  if (currentSpreadIndex === -1) {
    isCoverFront = true;
    activeLayoutId = cover.front?.layoutId;
  } else if (currentSpreadIndex === spreads.length) {
    isCoverBack = true;
    activeLayoutId = cover.back?.layoutId;
  } else {
    isInterior = true;
    const spread = spreads[currentSpreadIndex];
    if (spread) {
      activeLayoutId = spread[activeSide]?.layoutId;
    }
  }

  const layoutOptions = isCoverFront || isCoverBack ? COVER_LAYOUTS : LAYOUTS;

  // Handlers
  const handleGoToFrontCover = () => {
    selectSpread(-1);
    setActiveCoverSide("front");
    clearActivePhoto();
  };

  const handleGoToBackCover = () => {
    selectSpread(spreads.length);
    setActiveCoverSide("back");
    clearActivePhoto();
  };

  const handleGoToSpread = (index, side) => {
    selectSpread(index);
    setActiveSide(side);
    clearActivePhoto();
  };

  const handleLayoutClick = (layoutId) => {
    if (isCoverFront) {
      setCoverLayout("front", layoutId);
    } else if (isCoverBack) {
      setCoverLayout("back", layoutId);
    } else if (isInterior) {
      setLayout(currentSpreadIndex, activeSide, layoutId);
    }
  };

  const handlePlacePhoto = (photoId) => {
    if (isCoverFront) {
      placeUnplacedPhotoOnCover(photoId, "front");
    } else if (isCoverBack) {
      placeUnplacedPhotoOnCover(photoId, "back");
    } else if (isInterior) {
      placeUnplacedPhoto(photoId, currentSpreadIndex, activeSide);
    }
  };

  const placeLabel = isCoverFront
    ? "Front Cover"
    : isCoverBack
      ? "Back Cover"
      : activeSide === "left"
        ? "Left Page"
        : "Right Page";

  return (
    <aside className="w-72 h-full shrink-0 bg-white border-l border-neutral-200 overflow-y-auto">
      <div className="p-5">
        {/* ================================================================
            PAGE NAVIGATOR - Shows all pages in flow order
            ================================================================ */}
        <p className="text-sm font-semibold text-neutral-800 mb-3">
          Navigate Pages
        </p>
        <div className="space-y-2 mb-6">
          {/* Front Cover */}
          <button
            onClick={handleGoToFrontCover}
            className={`w-full py-2 text-xs rounded border font-medium transition text-left px-3 ${
              currentSpreadIndex === -1
                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300"
            }`}
          >
            📖 Front Cover
          </button>

          {/* Interior Spreads */}
          {spreads.map((_, idx) => {
            const pageNum = 2 + idx * 2;
            const isActive = currentSpreadIndex === idx;
            return (
              <button
                key={`spread-${idx}`}
                onClick={() => handleGoToSpread(idx, "left")}
                className={`w-full py-2 text-xs rounded border font-medium transition text-left px-3 ${
                  isActive
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
              >
                📄 Pages {pageNum}–{pageNum + 1}
              </button>
            );
          })}

          {/* Back Cover */}
          <button
            onClick={handleGoToBackCover}
            className={`w-full py-2 text-xs rounded border font-medium transition text-left px-3 ${
              currentSpreadIndex === spreads.length
                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300"
            }`}
          >
            📖 Back Cover
          </button>
        </div>

        {/* ================================================================
            PAGE SIDE SELECTOR (for interior spreads only)
            ================================================================ */}
        {isInterior && (
          <>
            <p className="text-sm font-semibold text-neutral-800 mb-2">
              Page Side
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                onClick={() => handleGoToSpread(currentSpreadIndex, "left")}
                className={`py-1.5 text-xs rounded border font-medium transition ${
                  activeSide === "left"
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "bg-neutral-50 border-neutral-200 text-neutral-600"
                }`}
              >
                Left
              </button>
              <button
                onClick={() => handleGoToSpread(currentSpreadIndex, "right")}
                className={`py-1.5 text-xs rounded border font-medium transition ${
                  activeSide === "right"
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "bg-neutral-50 border-neutral-200 text-neutral-600"
                }`}
              >
                Right
              </button>
            </div>
          </>
        )}

        {/* ================================================================
            LAYOUT SELECTOR
            ================================================================ */}
        <p className="text-sm font-semibold text-neutral-800 mb-3">
          {isCoverFront || isCoverBack ? "Cover Layout" : "Page Layout"}
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {layoutOptions.map((layout) => (
            <button
              key={layout.id}
              onClick={() => handleLayoutClick(layout.id)}
              className={`aspect-[4/3] rounded-lg border-2 overflow-hidden transition relative ${
                activeLayoutId === layout.id
                  ? "border-amber-500 ring-1 ring-amber-500"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
              title={layout.name}
            >
              <LayoutThumb template={layout.template} />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-neutral-700 bg-white/80 opacity-0 hover:opacity-100 transition">
                {layout.name}
              </div>
            </button>
          ))}
        </div>

        {/* ================================================================
            UNPLACED PHOTOS DRAWER
            ================================================================ */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
          <button
            onClick={() => setShowUnplaced(!showUnplaced)}
            className="w-full flex items-center justify-between text-xs font-semibold text-neutral-700 p-3 bg-white border-b border-neutral-200 hover:bg-neutral-50"
          >
            <span>Unplaced Photos ({unplacedPhotos.length})</span>
            {showUnplaced ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          {showUnplaced && (
            <div className="p-3 max-h-56 overflow-y-auto">
              {unplacedPhotos.length === 0 ? (
                <p className="text-[11px] text-neutral-400 text-center py-4">
                  All uploaded photos are placed on pages!
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {unplacedPhotos.map((photo) => {
                    const imgSrc = photo.preview || photo.url;
                    return (
                      <div
                        key={photo.id}
                        draggable
                        onDragStart={(e) => {
                          const payload = JSON.stringify({
                            origin: "unplaced",
                            photoId: photo.id,
                          });
                          e.dataTransfer.setData("text/plain", payload);
                          e.dataTransfer.setData("application/json", payload);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        className="relative aspect-square rounded overflow-hidden border border-neutral-200 group bg-neutral-200 cursor-grab active:cursor-grabbing hover:border-amber-500 transition"
                      >
                        <img
                          src={imgSrc}
                          alt=""
                          className="w-full h-full object-cover pointer-events-none"
                        />

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-neutral-900/80 text-white opacity-0 group-hover:opacity-100 flex flex-col justify-between p-1.5 transition">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUnplacedPhoto(photo.id);
                            }}
                            className="self-end p-1 text-red-300 hover:text-red-100 hover:bg-red-600/50 rounded"
                            title="Permanently Delete Photo"
                          >
                            <Trash2 size={13} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlacePhoto(photo.id);
                            }}
                            className="w-full py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-medium flex items-center justify-center gap-1"
                          >
                            <Plus size={12} /> Place on {placeLabel}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}