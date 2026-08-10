"use client";

import { useRef } from 'react';
import {
  RotateCw, Crop, ArrowLeftRight, Contrast,
  Type, UploadCloud, Sticker, LayoutGrid,
} from 'lucide-react';
import { useEditorStore } from '@/components/store/useEditorStore';

const TOOLS = [
  { id: 'rotate', label: 'Rotate', icon: RotateCw },
  { id: 'crop', label: 'Crop', icon: Crop },
  { id: 'replace', label: 'Replace', icon: ArrowLeftRight },
  { id: 'bw', label: 'B&W', icon: Contrast },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'upload', label: 'Upload', icon: UploadCloud },
  { id: 'stickers', label: 'Stickers', icon: Sticker },
  { id: 'elements', label: 'Elements', icon: LayoutGrid },
];

export default function ToolsSidebar() {
  const fileInputRef = useRef(null);
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const themes = useEditorStore((s) => s.themes);
  const selectedThemeId = useEditorStore((s) => s.selectedThemeId);
  const setTheme = useEditorStore((s) => s.setTheme);
  const uploadPhotos = useEditorStore((s) => s.uploadPhotos);

 const addTextElement = useEditorStore((s) => s.addTextElement);
const currentSpreadIndex = useEditorStore((s) => s.currentSpreadIndex);
const activeSide = useEditorStore((s) => s.activeSide);

const handleToolClick = (id) => {
  if (id === 'upload') {
    fileInputRef.current?.click();
  } else if (id === 'text') {
    addTextElement(currentSpreadIndex, activeSide);
    setActiveTool('text');
  } else {
    setActiveTool(id);
  }
};

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadPhotos(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <aside className="w-52 bg-white border-r border-neutral-200 p-4 shrink-0 overflow-y-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept="image/*"
        className="hidden"
      />

      <p className="text-xs font-semibold tracking-wide text-neutral-500 mb-3">
        EDIT TOOLS
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {TOOLS.map(({ id, label, icon: Icon }) => {
          const active = activeTool === id;
          return (
            <button
              key={id}
              onClick={() => handleToolClick(id)}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition
                  ${active
                    ? 'bg-neutral-900 border-neutral-900 text-white'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'}`}
              >
                <Icon size={17} />
              </span>
              <span className="text-[11px] text-neutral-600">{label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs font-semibold tracking-wide text-neutral-500 mb-3">
        THEME
      </p>
      <div className="grid grid-cols-2 gap-3">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`w-11 h-11 rounded-full overflow-hidden border-2 transition ${
              selectedThemeId === t.id
                ? 'border-amber-500 scale-105'
                : 'border-transparent'
            }`}
            style={{
              background: `linear-gradient(135deg, ${t.colors[0]} 50%, ${t.colors[1]} 50%)`,
            }}
          />
        ))}
      </div>
    </aside>
  );
}