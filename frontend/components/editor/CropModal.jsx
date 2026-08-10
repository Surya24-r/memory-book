"use client";

import { useState } from 'react';
import { ZoomIn, ZoomOut, Check, X, RotateCcw } from 'lucide-react';
import { useEditorStore } from '@/components/store/useEditorStore';

export default function CropModal({ spreadIndex, side, photo, onClose }) {
  const updatePhotoCrop = useEditorStore((s) => s.updatePhotoCrop);

  const [zoom, setZoom] = useState(photo.zoom || 1);
  const [panX, setPanX] = useState(photo.panX || 0);
  const [panY, setPanY] = useState(photo.panY || 0);

  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPos({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    // Limit panning ranges based on current zoom
    const maxOffset = (zoom - 1) * 100;
    const newX = Math.min(Math.max(e.clientX - startPos.x, -maxOffset), maxOffset);
    const newY = Math.min(Math.max(e.clientY - startPos.y, -maxOffset), maxOffset);
    setPanX(newX);
    setPanY(newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    updatePhotoCrop(spreadIndex, side, photo.id, { zoom, panX, panY });
    onClose();
  };

  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-800">Crop & Adjust Photo</h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Interactive Crop Viewport */}
        <div
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-full h-80 bg-neutral-900 overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
        >
          <div
            onMouseDown={handleMouseDown}
            className="w-full h-full relative overflow-hidden flex items-center justify-center"
          >
            <img
              src={photo.url}
              alt=""
              className="max-w-full max-h-full object-contain transition-transform duration-75 pointer-events-none"
              style={{
                transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px) rotate(${photo.rotation || 0}deg)`,
                filter: photo.isBW ? 'grayscale(100%)' : 'none',
              }}
            />
          </div>
          <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded pointer-events-none">
            Drag to pan image
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="p-5 space-y-4 bg-neutral-50 border-t border-neutral-200">
          <div className="flex items-center gap-3">
            <ZoomOut size={16} className="text-neutral-500" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => {
                const newZoom = parseFloat(e.target.value);
                setZoom(newZoom);
                if (newZoom === 1) {
                  setPanX(0);
                  setPanY(0);
                }
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <ZoomIn size={16} className="text-neutral-500" />
            <span className="text-xs font-mono w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800"
            >
              <RotateCcw size={13} /> Reset
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-4 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-sm"
              >
                <Check size={14} /> Save Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}