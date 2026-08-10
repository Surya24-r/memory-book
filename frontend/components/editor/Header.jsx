"use client";

import { Undo2, Redo2, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEditorStore } from "@/components/store/useEditorStore";

export default function Header() {
  const router = useRouter();

  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const saveDraft = useEditorStore((s) => s.saveDraftSilent);
  const bookSize = useEditorStore((s) => s.bookSize);
  const designId = useEditorStore((s) => s.designId);

  const handleSaveAndContinue = async () => {
    await saveDraft();
    router.push(`/review?design_id=${designId}`);
  };

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-white">
          <BookOpen size={18} />
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-neutral-900 text-[15px]">
            MemoryBook
          </div>
        </div>
        <span className="text-neutral-300 mx-1">·</span>
        <div className="text-sm text-neutral-500">
          {bookSize?.title || 'Untitled Size'}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={undo} className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50">
          <Undo2 size={16} />
        </button>
        <button onClick={redo} className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50">
          <Redo2 size={16} />
        </button>
        <button onClick={handleSaveAndContinue} className="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800">
          Save & Continue
        </button>
      </div>
    </header>
  );
}