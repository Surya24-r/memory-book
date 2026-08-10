"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import {
  RotateCw, Contrast, Trash2, ChevronLeft, ChevronRight, HelpCircle, Crop,
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, FileDown,
} from 'lucide-react';
import { useEditorStore, LAYOUTS, COVER_LAYOUTS, FONT_FAMILIES } from '@/components/store/useEditorStore';
import CropModal from './CropModal';

// Fallback shape used whenever a page object is missing/malformed, so
// Page/PreviewPage never receive `undefined` and crash on page.layoutId.
const EMPTY_PAGE = { id: 'empty', layoutId: 'full', photos: [], texts: [] };

function PhotoSlot({ spreadIndex, side, photo }) {
  const [hovered, setHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);

  const deletePhotoFromPage = useEditorStore((s) => s.deletePhotoFromPage);
  const purgeCorruptPhoto = useEditorStore((s) => s.purgeCorruptPhoto);
  const rotatePhoto = useEditorStore((s) => s.rotatePhoto);
  const toggleBWPhoto = useEditorStore((s) => s.toggleBWPhoto);
  const setActivePhoto = useEditorStore((s) => s.setActivePhoto);
  const activePhoto = useEditorStore((s) => s.activePhoto);
  const handleDrop = useEditorStore((s) => s.handleDrop);

  const isSelected = photo && String(activePhoto.photoId) === String(photo.id);

  const handleDragStart = (e) => {
    if (!photo) return;
    const payload = JSON.stringify({
      origin: 'canvas',
      photoId: photo.id,
      sourceSpreadIndex: spreadIndex,
      sourceSide: side,
    });
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleOnDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const raw = e.dataTransfer.getData('text/plain');
      if (!raw) return;
      const dragData = JSON.parse(raw);
      handleDrop(dragData, spreadIndex, side, photo ? photo.id : null);
    } catch (err) {
      console.error("Failed to parse drag payload:", err);
    }
  };

  const zoom = photo?.zoom || 1;
  const panX = photo?.panX || 0;
  const panY = photo?.panY || 0;

  return (
    <>
      <div
        draggable={!!photo}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleOnDrop}
        onClick={() => photo && setActivePhoto(spreadIndex, side, photo.id)}
        className={`relative group overflow-hidden rounded-sm cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-amber-500' : ''
        } ${
          isDragOver ? 'ring-2 ring-blue-500 bg-blue-50/50 scale-[0.99]' : 'bg-neutral-100/50'
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {photo ? (
          <div className="w-full h-full overflow-hidden flex items-center justify-center">
            <img
              src={photo.url}
              alt=""
              onError={() => purgeCorruptPhoto(spreadIndex, side, photo.id)}
              className="w-full h-full object-cover transition-transform duration-100 pointer-events-none"
              style={{
                transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px) rotate(${photo.rotation || 0}deg)`,
                filter: photo.isBW ? 'grayscale(100%)' : 'none',
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs hover:border-amber-500 hover:text-amber-600 transition pointer-events-none">
            + Drag / Add photo
          </div>
        )}

        {photo && (hovered || isSelected) && (
          <div className="absolute inset-x-0 bottom-0 bg-neutral-900/90 text-white text-[11px] flex divide-x divide-white/15">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCropModal(true);
              }}
              className="flex-1 py-1.5 flex items-center justify-center gap-1 hover:bg-white/10"
            >
              <Crop size={12} /> Crop
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                rotatePhoto(spreadIndex, side, photo.id);
              }}
              className="flex-1 py-1.5 flex items-center justify-center gap-1 hover:bg-white/10"
            >
              <RotateCw size={12} /> Rotate
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBWPhoto(spreadIndex, side, photo.id);
              }}
              className="flex-1 py-1.5 flex items-center justify-center gap-1 hover:bg-white/10"
            >
              <Contrast size={12} /> B&W
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deletePhotoFromPage(spreadIndex, side, photo.id);
              }}
              className="flex-1 py-1.5 flex items-center justify-center gap-1 hover:bg-red-600/80 text-red-200"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        )}
      </div>

      {showCropModal && photo && (
        <CropModal
          spreadIndex={spreadIndex}
          side={side}
          photo={photo}
          onClose={() => setShowCropModal(false)}
        />
      )}
    </>
  );
}

/* ============================================================================
   PREVIEW COMPONENTS
   ============================================================================ */

function PreviewPhoto({ photo }) {
  if (!photo) return <div className="w-full h-full bg-black/5" />;

  const zoom = photo.zoom || 1;
  const panX = photo.panX || 0;
  const panY = photo.panY || 0;

  return (
    <div className="w-full h-full overflow-hidden rounded-sm">
      <img
        src={photo.url}
        alt=""
        crossOrigin="anonymous"
        className="w-full h-full object-cover"
        style={{
          transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px) rotate(${photo.rotation || 0}deg)`,
          filter: photo.isBW ? 'grayscale(100%)' : 'none',
        }}
      />
    </div>
  );
}

function PreviewTextBox({ text }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${text.x}%`,
        top: `${text.y}%`,
        width: `${text.width}px`,
        maxWidth: '90%',
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
          wordBreak: 'break-word',
        }}
      >
        {text.content}
      </div>
    </div>
  );
}

function PreviewPage({ page, isCover = false }) {
  // Defensive fallback: never let an undefined/malformed page reach
  // layoutOptions.find(...page.layoutId), which was the source of the
  // "Cannot read properties of undefined (reading 'layoutId')" crash.
  const safePage = page && Array.isArray(page.photos) ? page : EMPTY_PAGE;

  const layoutOptions = isCover ? COVER_LAYOUTS : LAYOUTS;
  const layout = layoutOptions.find((l) => l.id === safePage.layoutId) || layoutOptions[0];

  return (
    <div className="relative w-full h-full">
      <div style={getGridStyle(safePage.layoutId, isCover)}>
        {safePage.photos.map((photo) => (
          <PreviewPhoto key={photo.id} photo={photo} />
        ))}
        {Array.from({ length: Math.max(0, layout.maxPhotos - safePage.photos.length) }).map((_, i) => (
          <PreviewPhoto key={`empty-${i}`} photo={null} />
        ))}
      </div>

      {(safePage.texts || []).map((t) => (
        <PreviewTextBox key={t.id} text={t} />
      ))}
    </div>
  );
}

/* ============================================================================
   TEXT BOX COMPONENT
   ============================================================================ */

function TextBox({ spreadIndex, side, text, containerRef }) {
  const updateTextElement = useEditorStore((s) => s.updateTextElement);
  const commitTextChange = useEditorStore((s) => s.commitTextChange);
  const deleteTextElement = useEditorStore((s) => s.deleteTextElement);
  const setActiveText = useEditorStore((s) => s.setActiveText);
  const activeTextId = useEditorStore((s) => s.activeTextId);

  const [isEditing, setIsEditing] = useState(false);
  const dragRef = useRef(null);
  const boxRef = useRef(null);

  const isSelected = activeTextId === text.id;

  const handleMouseDown = (e) => {
    if (isEditing) return;
    e.stopPropagation();
    setActiveText(text.id);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: text.x,
      origY: text.y,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dxPct = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
    const dyPct = ((e.clientY - dragRef.current.startY) / rect.height) * 100;

    let newX = dragRef.current.origX + dxPct;
    let newY = dragRef.current.origY + dyPct;
    newX = Math.max(0, Math.min(95, newX));
    newY = Math.max(0, Math.min(95, newY));

    updateTextElement(spreadIndex, side, text.id, { x: newX, y: newY });
  }, [containerRef, spreadIndex, side, text.id, updateTextElement]);

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    commitTextChange();
  }, [handleMouseMove, commitTextChange]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleBlur = (e) => {
    setIsEditing(false);
    const newContent = e.target.innerText;
    updateTextElement(spreadIndex, side, text.id, { content: newContent });
    commitTextChange();
  };

  const patch = (updates) => {
    updateTextElement(spreadIndex, side, text.id, updates);
  };
  const patchAndCommit = (updates) => {
    updateTextElement(spreadIndex, side, text.id, updates);
    commitTextChange();
  };

  return (
    <div
      ref={boxRef}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`absolute select-none ${isSelected ? 'ring-2 ring-amber-500' : 'ring-1 ring-transparent hover:ring-neutral-300'} ${
        isEditing ? 'cursor-text' : 'cursor-move'
      }`}
      style={{
        left: `${text.x}%`,
        top: `${text.y}%`,
        width: `${text.width}px`,
        maxWidth: '90%',
        zIndex: isSelected ? 30 : 10,
      }}
    >
      <div
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleBlur}
        style={{
          fontFamily: text.fontFamily,
          fontSize: `${text.fontSize}px`,
          color: text.color,
          fontWeight: text.fontWeight,
          fontStyle: text.fontStyle,
          textAlign: text.textAlign,
          outline: 'none',
          wordBreak: 'break-word',
          lineHeight: 1.3,
          padding: '2px 4px',
        }}
      >
        {text.content}
      </div>

      {isSelected && !isEditing && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute -top-11 left-0 flex items-center gap-1 bg-neutral-900 text-white rounded-md shadow-lg px-1.5 py-1 text-[11px] whitespace-nowrap"
        >
          <select
            value={text.fontFamily}
            onChange={(e) => patchAndCommit({ fontFamily: e.target.value })}
            className="bg-neutral-800 rounded px-1 py-0.5 text-[11px] outline-none"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.id} value={f.value}>{f.label}</option>
            ))}
          </select>

          <input
            type="number"
            min={8}
            max={96}
            value={text.fontSize}
            onChange={(e) => patch({ fontSize: Number(e.target.value) || text.fontSize })}
            onBlur={(e) => patchAndCommit({ fontSize: Number(e.target.value) || text.fontSize })}
            className="w-11 bg-neutral-800 rounded px-1 py-0.5 text-[11px] outline-none"
          />

          <input
            type="color"
            value={text.color}
            onChange={(e) => patch({ color: e.target.value })}
            onBlur={(e) => patchAndCommit({ color: e.target.value })}
            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
          />

          <button
            onClick={() => patchAndCommit({ fontWeight: text.fontWeight === 'bold' ? 'normal' : 'bold' })}
            className={`p-1 rounded hover:bg-white/10 ${text.fontWeight === 'bold' ? 'bg-white/20' : ''}`}
          >
            <Bold size={13} />
          </button>
          <button
            onClick={() => patchAndCommit({ fontStyle: text.fontStyle === 'italic' ? 'normal' : 'italic' })}
            className={`p-1 rounded hover:bg-white/10 ${text.fontStyle === 'italic' ? 'bg-white/20' : ''}`}
          >
            <Italic size={13} />
          </button>

          <button onClick={() => patchAndCommit({ textAlign: 'left' })} className={`p-1 rounded hover:bg-white/10 ${text.textAlign === 'left' ? 'bg-white/20' : ''}`}>
            <AlignLeft size={13} />
          </button>
          <button onClick={() => patchAndCommit({ textAlign: 'center' })} className={`p-1 rounded hover:bg-white/10 ${text.textAlign === 'center' ? 'bg-white/20' : ''}`}>
            <AlignCenter size={13} />
          </button>
          <button onClick={() => patchAndCommit({ textAlign: 'right' })} className={`p-1 rounded hover:bg-white/10 ${text.textAlign === 'right' ? 'bg-white/20' : ''}`}>
            <AlignRight size={13} />
          </button>

          <button
            onClick={() => deleteTextElement(spreadIndex, side, text.id)}
            className="p-1 rounded hover:bg-red-600/80 text-red-200"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   HELPER FUNCTIONS
   ============================================================================ */

function getGridStyle(layoutId, isCover = false) {
  const layoutOptions = isCover ? COVER_LAYOUTS : LAYOUTS;
  const layout = layoutOptions.find((l) => l.id === layoutId) || layoutOptions[0];
  const [cols, rows] = layout.template;
  return {
    display: 'grid',
    gridTemplateColumns: cols,
    gridTemplateRows: rows,
    gap: '6px',
    width: '100%',
    height: '100%',
  };
}

function Page({ spreadIndex, side, page, isCover = false }) {
  // Defensive fallback: same reasoning as PreviewPage above — a missing
  // or malformed page object must never crash the render.
  const safePage = page && Array.isArray(page.photos) ? page : EMPTY_PAGE;

  const layoutOptions = isCover ? COVER_LAYOUTS : LAYOUTS;
  const layout = layoutOptions.find((l) => l.id === safePage.layoutId) || layoutOptions[0];
  const containerRef = useRef(null);
  const setActiveText = useEditorStore((s) => s.setActiveText);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseDown={(e) => {
        if (e.target === containerRef.current) setActiveText(null);
      }}
    >
      <div style={getGridStyle(safePage.layoutId, isCover)}>
        {safePage.photos.map((photo) => (
          <PhotoSlot key={photo.id} spreadIndex={spreadIndex} side={side} photo={photo} />
        ))}
        {Array.from({ length: Math.max(0, layout.maxPhotos - safePage.photos.length) }).map((_, i) => (
          <PhotoSlot key={`empty-${i}`} spreadIndex={spreadIndex} side={side} photo={null} />
        ))}
      </div>

      {(safePage.texts || []).map((t) => (
        <TextBox
          key={t.id}
          spreadIndex={spreadIndex}
          side={side}
          text={t}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}

/* ============================================================================
   PDF EXPORT HELPERS
   ============================================================================ */

// Render width in px used for the off-screen capture — bump this for
// higher print resolution (2400 ≈ good quality without huge file sizes).
const EXPORT_RENDER_WIDTH = 2400;
const EXPORT_SCALE = 2; // extra html2canvas supersampling on top of render width

function waitForImagesToLoad(container) {
  const imgs = Array.from(container.querySelectorAll('img'));
  return Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        // safety timeout so one bad image never hangs the whole export
        setTimeout(resolve, 4000);
      });
    })
  );
}

/* ============================================================================
   MAIN EDITOR CANVAS COMPONENT
   ============================================================================ */

export default function EditorCanvas() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const spreads = useEditorStore((s) => s.spreads);
  const cover = useEditorStore((s) => s.cover);
  const currentSpreadIndex = useEditorStore((s) => s.currentSpreadIndex);
  const goPrev = useEditorStore((s) => s.goPrevSpread);
  const goNext = useEditorStore((s) => s.goNextSpread);
  const saveDraft = useEditorStore((s) => s.saveDraft);
  const selectedThemeId = useEditorStore((s) => s.selectedThemeId);
  const themes = useEditorStore((s) => s.themes);
  const bookTitle = useEditorStore((s) => s.bookTitle);
  const setBookTitle = useEditorStore((s) => s.setBookTitle);
  const bookSize = useEditorStore((s) => s.bookSize);

  const theme = themes.find((t) => t.id === selectedThemeId) || themes[1];

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
  const pageRefs = useRef({});

  // ================================================================
  // PDF EXPORT LOGIC
  // ================================================================
  const buildExportPages = () => {
    const pages = [{ key: 'cover-front', isCover: true, page: cover?.front || EMPTY_PAGE }];
    spreads.forEach((spread, idx) => {
      pages.push({
        key: `spread-${idx}`,
        isSpread: true,
        left: spread?.left || EMPTY_PAGE,
        right: spread?.right || EMPTY_PAGE,
      });
    });
    pages.push({ key: 'cover-back', isCover: true, page: cover?.back || EMPTY_PAGE });
    return pages;
  };

  const exportToPDF = async () => {
    const exportPages = buildExportPages();
    setIsExporting(true);
    setExportProgress({ current: 0, total: exportPages.length });

    try {
      let pdf = null;

      for (let i = 0; i < exportPages.length; i++) {
        const item = exportPages[i];
        const node = pageRefs.current[item.key];
        if (!node) continue;

        await waitForImagesToLoad(node);
        // let the browser settle a paint frame before snapshotting
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const canvas = await html2canvas(node, {
          scale: EXPORT_SCALE,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.92);

        // Convert captured pixel size back to mm for the PDF page,
        // treating the render as 96dpi before the html2canvas scale factor.
        const pxWidth = canvas.width / EXPORT_SCALE;
        const pxHeight = canvas.height / EXPORT_SCALE;
        const mmWidth = (pxWidth / 96) * 25.4;
        const mmHeight = (pxHeight / 96) * 25.4;
        const orientation = mmWidth >= mmHeight ? 'landscape' : 'portrait';

        if (!pdf) {
          pdf = new jsPDF({ orientation, unit: 'mm', format: [mmWidth, mmHeight] });
        } else {
          pdf.addPage([mmWidth, mmHeight], orientation);
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, mmWidth, mmHeight);
        setExportProgress({ current: i + 1, total: exportPages.length });
      }

      if (pdf) {
        const filename = (bookTitle || 'photobook').trim().replace(/[^\w\-]+/g, '_');
        pdf.save(`${filename}.pdf`);
      }
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Something went wrong exporting the PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress({ current: 0, total: 0 });
    }
  };

  // ================================================================
  // PAGE FLOW LOGIC
  // ================================================================
  // Flow: 0 = Front Cover, 1-(N+1) = Spreads, N+2 = Back Cover
  const totalPages = 2 + spreads.length * 2; // Front + Back + Spreads

  const getPageInfo = () => {
    if (currentSpreadIndex === -1) {
      // Front Cover
      return {
        type: 'cover',
        side: 'front',
        page: cover?.front || EMPTY_PAGE,
        label: 'Front Cover',
        isCover: true,
        canGoPrev: false,
        canGoNext: true,
      };
    } else if (currentSpreadIndex === spreads.length) {
      // Back Cover
      return {
        type: 'cover',
        side: 'back',
        page: cover?.back || EMPTY_PAGE,
        label: 'Back Cover',
        isCover: true,
        canGoPrev: true,
        canGoNext: false,
      };
    } else {
      // Interior Spread
      const spreadIdx = currentSpreadIndex;
      const spread = spreads[spreadIdx];
      const startPage = 2 + spreadIdx * 2;
      return {
        type: 'spread',
        spreadIdx,
        leftPage: spread?.left || EMPTY_PAGE,
        rightPage: spread?.right || EMPTY_PAGE,
        label: `Pages ${startPage}–${startPage + 1}`,
        isCover: false,
        canGoPrev: currentSpreadIndex > -1,
        canGoNext: currentSpreadIndex < spreads.length,
      };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="flex-1 flex flex-col items-center px-8 py-6 overflow-y-auto">
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            placeholder="Untitled Book"
            className="text-lg font-semibold text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-amber-500 focus:outline-none px-1 py-0.5 max-w-[220px] transition"
          />
          <div className="inline-flex rounded-full border border-neutral-200 bg-white p-1">
            <button
              onClick={() => setMode('preview')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                mode === 'preview' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                mode === 'edit' ? 'bg-amber-500 text-white' : 'text-neutral-500'
              }`}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={saveDraft} className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900">
            <HelpCircle size={15} /> Save Draft
          </button>
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 text-sm text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed px-3.5 py-1.5 rounded-full transition"
          >
            <FileDown size={15} />
            {isExporting
              ? `Exporting ${exportProgress.current}/${exportProgress.total}…`
              : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-4xl">
        {mode === 'preview' && (
          <>
            <button
              onClick={goPrev}
              disabled={!pageInfo.canGoPrev}
              className="absolute left-[-52px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              disabled={!pageInfo.canGoNext}
              className="absolute right-[-52px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* COVER SINGLE PAGE RENDER */}
       {pageInfo.isCover ? (
  <div
    className="w-full rounded-lg shadow-xl flex items-center justify-center overflow-hidden p-3 transition-colors duration-300"
    style={{ background: theme.colors[0], aspectRatio: bookSize.ratio }}
  >
    <div className="w-full h-full p-3 rounded" style={{ background: theme.colors[1] }}>
      {mode === 'preview' ? (
        <PreviewPage page={pageInfo.page} isCover={true} />
      ) : (
        <Page
          spreadIndex="cover"
          side={pageInfo.side}
          page={pageInfo.page}
          isCover={true}
        />
      )}
    </div>
  </div>
) : (
          /* INTERIOR SPREAD TWO-PAGE RENDER */
          <div
            className="w-full rounded-lg shadow-xl flex overflow-hidden p-3 transition-colors duration-300"
            style={{ background: theme.colors[0], aspectRatio: bookSize.ratio }}
          >
            <div className="flex-1 p-3 rounded-l" style={{ background: theme.colors[1] }}>
              {mode === 'preview' ? (
                <PreviewPage page={pageInfo.leftPage} isCover={false} />
              ) : (
                <Page
                  spreadIndex={pageInfo.spreadIdx}
                  side="left"
                  page={pageInfo.leftPage}
                  isCover={false}
                />
              )}
            </div>
            <div className="w-1 bg-black/10 mx-1" />
            <div className="flex-1 p-3 rounded-r" style={{ background: theme.colors[1] }}>
              {mode === 'preview' ? (
                <PreviewPage page={pageInfo.rightPage} isCover={false} />
              ) : (
                <Page
                  spreadIndex={pageInfo.spreadIdx}
                  side="right"
                  page={pageInfo.rightPage}
                  isCover={false}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* PAGE NAVIGATION INFO */}
      {mode === 'edit' && (
        <div className="flex items-center gap-4 mt-4 text-sm text-neutral-600">
          <button onClick={goPrev} disabled={!pageInfo.canGoPrev} className="p-1 rounded-full hover:bg-neutral-200 disabled:opacity-30">
            <ChevronLeft size={18} />
          </button>
          <span>{pageInfo.label}</span>
          <button onClick={goNext} disabled={!pageInfo.canGoNext} className="p-1 rounded-full hover:bg-neutral-200 disabled:opacity-30">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {mode === 'preview' && (
        <div className="text-sm text-neutral-600 mt-4">
          {pageInfo.label}
        </div>
      )}

      {/* ================================================================
          OFF-SCREEN EXPORT RENDER TARGET
          Rendered permanently (not display:none — html2canvas needs real
          layout) but pushed far off-screen so it's invisible to the user.
          ================================================================ */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: '-99999px',
          pointerEvents: 'none',
        }}
      >
        {buildExportPages().map((item) => {
          if (item.isSpread) {
            return (
              <div
                key={item.key}
                ref={(el) => { pageRefs.current[item.key] = el; }}
                style={{
                  width: `${EXPORT_RENDER_WIDTH}px`,
                  aspectRatio: bookSize.ratio,
                  display: 'flex',
                  background: theme.colors[0],
                  padding: '18px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ flex: 1, background: theme.colors[1], padding: '18px', boxSizing: 'border-box' }}>
                  <PreviewPage page={item.left} isCover={false} />
                </div>
                <div style={{ width: '4px', background: 'rgba(0,0,0,0.1)', margin: '0 6px' }} />
                <div style={{ flex: 1, background: theme.colors[1], padding: '18px', boxSizing: 'border-box' }}>
                  <PreviewPage page={item.right} isCover={false} />
                </div>
              </div>
            );
          }
          return (
            <div
              key={item.key}
              ref={(el) => { pageRefs.current[item.key] = el; }}
              style={{
                width: `${EXPORT_RENDER_WIDTH}px`,
                aspectRatio: bookSize.ratio,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.colors[0],
                padding: '18px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ width: '100%', height: '100%', background: theme.colors[1], padding: '18px', boxSizing: 'border-box' }}>
                <PreviewPage page={item.page} isCover={true} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}