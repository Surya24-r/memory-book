"use client";

import { Plus, Trash2 } from 'lucide-react';
import { useEditorStore } from '@/components/store/useEditorStore';

export default function PageThumbnails() {
  const spreads = useEditorStore((s) => s.spreads);
  const currentSpreadIndex = useEditorStore((s) => s.currentSpreadIndex);
  const selectSpread = useEditorStore((s) => s.selectSpread);
  const addPagePair = useEditorStore((s) => s.addPagePair);
  const deleteSpread = useEditorStore((s) => s.deleteSpread);
  const selectedThemeId = useEditorStore((s) => s.selectedThemeId);
  const themes = useEditorStore((s) => s.themes);

  const theme = themes.find((t) => t.id === selectedThemeId) || themes[1];

  return (
    <div className="w-full bg-white border-t border-neutral-200 px-6 py-3 flex items-center gap-4 overflow-x-auto shrink-0 shadow-inner">
      <div className="flex items-center gap-3">
        {spreads.map((spread, idx) => {
          const isActive = idx === currentSpreadIndex;
          const startPage = idx * 2 + 1;

          return (
            <div key={spread.id ? `${spread.id}-${idx}` : idx} className="flex flex-col items-center gap-1 group relative">
              {/* Thumbnail Spread Card */}
              <button
                onClick={() => selectSpread(idx)}
                className={`relative w-28 h-16 rounded border-2 overflow-hidden flex transition p-0.5 ${
                  isActive
                    ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-md scale-105'
                    : 'border-neutral-200 hover:border-neutral-400 opacity-80 hover:opacity-100'
                }`}
                style={{ background: theme.colors[0] }}
              >
                {/* Left Page Mini Preview */}
                <div
                  className="flex-1 h-full rounded-l flex items-center justify-center p-0.5 overflow-hidden"
                  style={{ background: theme.colors[1] }}
                >
                  {spread.left?.photos?.[0] ? (
                    <img
                      src={spread.left.photos[0].url}
                      alt=""
                      className="w-full h-full object-cover rounded-[1px]"
                    />
                  ) : (
                    <div className="text-[9px] text-neutral-400 font-mono">L</div>
                  )}
                </div>

                <div className="w-[1px] bg-black/20 my-0.5" />

                {/* Right Page Mini Preview */}
                <div
                  className="flex-1 h-full rounded-r flex items-center justify-center p-0.5 overflow-hidden"
                  style={{ background: theme.colors[1] }}
                >
                  {spread.right?.photos?.[0] ? (
                    <img
                      src={spread.right.photos[0].url}
                      alt=""
                      className="w-full h-full object-cover rounded-[1px]"
                    />
                  ) : (
                    <div className="text-[9px] text-neutral-400 font-mono">R</div>
                  )}
                </div>

                {/* Delete Spread Button (Hover overlay) */}
                {spreads.length > 1 && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete pages ${startPage}–${startPage + 1}? Photos on these pages will return to Unplaced Photos.`)) {
                        deleteSpread(idx);
                      }
                    }}
                    className="absolute inset-0 bg-neutral-900/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white cursor-pointer"
                    title="Delete Spread"
                  >
                    <Trash2 size={16} className="text-red-400 hover:text-red-200" />
                  </div>
                )}
              </button>

              {/* Page Number Label */}
              <span className={`text-[11px] font-medium ${isActive ? 'text-amber-600 font-semibold' : 'text-neutral-500'}`}>
                p. {startPage}–{startPage + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Add New Page Spread Button */}
      <button
        onClick={addPagePair}
        className="h-16 px-4 border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center gap-1 text-neutral-500 hover:border-amber-500 hover:text-amber-600 transition shrink-0"
      >
        <Plus size={18} />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Add Spread</span>
      </button>
    </div>
  );
}