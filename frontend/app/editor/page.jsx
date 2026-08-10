"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useEditorStore } from "@/components/store/useEditorStore";
import Header from "@/components/editor/Header";
import ToolsSidebar from "@/components/editor/ToolsSidebar";
import EditorCanvas from "@/components/editor/EditorCanvas";
import LayoutPanel from "@/components/editor/LayoutPanel";
import PageThumbnails from "@/components/editor/PageThumbnails";
import StepsFooter from "@/components/editor/StepsFooter";

function EditorContent() {
  const searchParams = useSearchParams();
  const designIdFromUrl = searchParams.get("design_id");
  const initEditor = useEditorStore((s) => s.initEditor);

  useEffect(() => {
    if (!designIdFromUrl) {
      console.error("No design_id in URL — cannot load editor.");
      return;
    }
    initEditor(designIdFromUrl);
  }, [designIdFromUrl, initEditor]);

  if (!designIdFromUrl) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-100 text-neutral-500">
        No book selected. Please start from Upload or My Orders.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-100 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ToolsSidebar />
        <EditorCanvas />
        <LayoutPanel />
      </div>
      <PageThumbnails />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-neutral-100 text-neutral-500">
          Loading editor...
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}