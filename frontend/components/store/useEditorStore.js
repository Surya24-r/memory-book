import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchWithAuth } from "@/components/lib/fetchWithAuth";

export const LAYOUTS = [
  {
    id: "split-2col",
    name: "2 Columns",
    template: ["1fr 1fr", "1fr"],
    maxPhotos: 2,
  },
  { id: "full", name: "Full Bleed", template: ["1fr", "1fr"], maxPhotos: 1 },
  {
    id: "top-bottom",
    name: "Top / Bottom",
    template: ["1fr", "1fr 1fr"],
    maxPhotos: 2,
  },
  {
    id: "strip-3",
    name: "3 Row Strip",
    template: ["1fr", "1fr 1fr 1fr"],
    maxPhotos: 3,
  },
  {
    id: "big-plus-two",
    name: "Big + Two",
    template: ["1.4fr 1fr", "1fr 1fr"],
    maxPhotos: 3,
  },
  {
    id: "grid-2x2",
    name: "2x2 Grid",
    template: ["1fr 1fr", "1fr 1fr"],
    maxPhotos: 4,
  },
];

export const COVER_LAYOUTS = [
  {
    id: "cover-full",
    name: "Full Bleed",
    template: ["1fr", "1fr"],
    maxPhotos: 1,
  },
  {
    id: "cover-framed",
    name: "Framed",
    template: ["1fr", "1fr"],
    maxPhotos: 1,
  },
  {
    id: "cover-duo",
    name: "Two Photos",
    template: ["1fr 1fr", "1fr"],
    maxPhotos: 2,
  },
  {
    id: "cover-top-band",
    name: "Photo + Title Band",
    template: ["1fr", "1fr 0.3fr"],
    maxPhotos: 1,
  },
];

export const FONT_FAMILIES = [
  { id: "sans", label: "Sans (Default)", value: "'Inter', sans-serif" },
  { id: "serif", label: "Serif", value: "'Playfair Display', serif" },
  { id: "script", label: "Script", value: "'Dancing Script', cursive" },
  { id: "mono", label: "Mono", value: "'Roboto Mono', monospace" },
  { id: "display", label: "Display", value: "'Poppins', sans-serif" },
];

export const BOOK_SIZES = [
  { id: "8x8", title: "8 × 8 inch Classic", ratio: "1 / 1" },
  { id: "10x10", title: "10 × 10 inch Grand", ratio: "1 / 1" },
  { id: "11x8.5", title: "11 × 8.5 inch Landscape", ratio: "11 / 8.5" },
];

export const DEFAULT_BOOK_SIZE = BOOK_SIZES[2]; // Landscape, matches original aspect-[16/9] default

const makePage = (id, layoutId, photos = [], texts = []) => ({
  id,
  layoutId,
  photos,
  texts,
});

const isValidUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const clean = url.trim();
  return !(
    clean === "" ||
    clean === "undefined" ||
    clean === "null" ||
    clean.endsWith("/undefined") ||
    clean.endsWith("/null")
  );
};

const sanitizePhoto = (p) => {
  if (!p) return null;

  if (typeof p === "string") {
    if (!isValidUrl(p)) return null;
    const cleanUrl = p.trim();
    return {
      id: String(Math.random()),
      url: cleanUrl,
      preview: cleanUrl,
      rotation: 0,
      isBW: false,
      caption: "",
      zoom: 1,
      panX: 0,
      panY: 0,
    };
  }

  const photoUrl =
    p.url ||
    p.preview ||
    p.file_url ||
    p.imageUrl ||
    p.path ||
    p.src ||
    p.location ||
    p.secure_url ||
    p.filepath ||
    p.file ||
    p.filename ||
    "";

  if (!isValidUrl(photoUrl)) return null;

  const finalUrl = photoUrl.trim();

  return {
    id: String(p.id || p.photo_id || p._id || Math.random()),
    url: finalUrl,
    preview: finalUrl,
    rotation: p.rotation || 0,
    isBW: !!p.isBW,
    caption: p.caption || "",
    zoom: p.zoom || 1,
    panX: p.panX || 0,
    panY: p.panY || 0,
  };
};

const sanitizePhotoList = (list = []) =>
  (Array.isArray(list) ? list : []).map(sanitizePhoto).filter(Boolean);

// --- Cover-aware page access helpers ---
// spreadIndex === 'cover' routes into draft.cover[side] ('front' | 'back')
// any other spreadIndex routes into draft.spreads[spreadIndex][side] ('left' | 'right')
const clonePagesState = (s) => ({
  spreads: JSON.parse(JSON.stringify(s.spreads)),
  cover: JSON.parse(JSON.stringify(s.cover)),
});

// Creates a safe empty page — used to self-heal any spread/cover slot
// that's missing, instead of letting callers crash on `undefined.photos`.
const makeDefaultPage = () => ({
  id: `page-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  layoutId: "full",
  photos: [],
  texts: [],
});

const getPage = (draft, spreadIndex, side) => {
  if (spreadIndex === "cover") {
    if (!draft.cover) draft.cover = { front: makeDefaultPage(), back: makeDefaultPage() };
    if (!draft.cover[side]) draft.cover[side] = makeDefaultPage();
    return draft.cover[side];
  }

  if (!draft.spreads[spreadIndex]) {
    draft.spreads[spreadIndex] = {
      id: `spread-${spreadIndex}-${Date.now()}`,
      left: makeDefaultPage(),
      right: makeDefaultPage(),
    };
  }
  if (!draft.spreads[spreadIndex][side]) {
    draft.spreads[spreadIndex][side] = makeDefaultPage();
  }
  return draft.spreads[spreadIndex][side];
};

// Module-level debounce handle for autosave. Kept outside the store so it
// survives across store method calls without becoming reactive state.
let _autosaveTimer = null;
const AUTOSAVE_DEBOUNCE_MS = 800;

export const useEditorStore = create(
  persist(
    (set, get) => ({
      designId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      mode: "edit",
      activeTool: null,
      activeSide: "left",
      selectedThemeId: 1,
      bookTitle: "Untitled Book",
      bookSize: DEFAULT_BOOK_SIZE,
      currentStep: 2, // 1=Upload, 2=Layout (edit), 3=Review (preview)
      themes: [
        { id: 0, name: "Dark Theme", colors: ["#1A1A1A", "#1A1A1A"] },
        { id: 1, name: "Wedding Gold", colors: ["#7A2230", "#F2C879"] },
        { id: 2, name: "Ocean Blue", colors: ["#1E3A5F", "#F2C879"] },
        { id: 3, name: "Gold Onyx", colors: ["#1A1A1A", "#F2C879"] },
      ],

      spreads: [
        {
          id: "spread-1",
          left: makePage("p1", "split-2col", []),
          right: makePage("p2", "full", []),
        },
      ],
      currentSpreadIndex: 0, // -1 = cover, 0..N-1 = interior spreads
      totalPages: 2,
      unplacedPhotos: [],
      deletedPhotoIds: [],

      cover: {
        front: makePage("cover-front", "cover-full", []),
        back: makePage("cover-back", "cover-full", []),
      },
      activeCoverSide: "front", // used by LayoutPanel's own toggle
      editingCover: false, // used by LayoutPanel's own toggle

      activeTextId: null,

      activePhoto: { spreadIndex: 0, side: "left", photoId: null },
      history: [],
      historyIndex: -1,

      pushHistory: () => {
        const {
          spreads,
          selectedThemeId,
          history,
          historyIndex,
          unplacedPhotos,
          deletedPhotoIds,
          cover,
        } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(
          JSON.parse(
            JSON.stringify({
              spreads,
              selectedThemeId,
              unplacedPhotos,
              deletedPhotoIds,
              cover,
            }),
          ),
        );
        set({ history: newHistory, historyIndex: newHistory.length - 1 });
      },

      // AUTO-SAVE: Background save that does NOT mark as saved.
      // Debounced so rapid-fire edits (drag, undo/redo, typing, etc.) collapse
      // into a single network request instead of firing one per action —
      // this also avoids two autosave requests racing each other server-side.
      saveDraftSilent: () => {
        clearTimeout(_autosaveTimer);
        _autosaveTimer = setTimeout(async () => {
          const {
            designId,
            selectedThemeId,
            spreads,
            unplacedPhotos,
            deletedPhotoIds,
            cover,
            bookTitle,
            bookSize,
          } = get();
          try {
            await fetchWithAuth(`http://localhost:8000/editor/autosave/${designId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                theme_id: String(selectedThemeId),
                title: bookTitle,
                book_size: bookSize,
                spreads_data: {
                  spreads: spreads,
                  unplaced: unplacedPhotos,
                  deletedPhotoIds: deletedPhotoIds.map(String),
                  cover: cover,
                },
              }),
            });
          } catch (err) {
            console.error("Auto-save error:", err);
          }
        }, AUTOSAVE_DEBOUNCE_MS);
      },

      // EXPLICIT SAVE: User clicked "Save Draft" button - marks as saved.
      // Runs immediately (not debounced) and cancels any pending silent
      // autosave so they don't both fire back-to-back.
      saveDraft: async () => {
        clearTimeout(_autosaveTimer);
        const {
          designId,
          selectedThemeId,
          spreads,
          unplacedPhotos,
          deletedPhotoIds,
          cover,
          bookTitle,
          bookSize,
        } = get();
        try {
          const res = await fetchWithAuth(`http://localhost:8000/editor/save/${designId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              theme_id: String(selectedThemeId),
              title: bookTitle,
              book_size: bookSize,
              spreads_data: {
                spreads: spreads,
                unplaced: unplacedPhotos,
                deletedPhotoIds: deletedPhotoIds.map(String),
                cover: cover,
              },
            }),
          });

          if (!res.ok) throw new Error("Failed to save draft");
          alert("✓ Draft saved successfully!");
        } catch (error) {
          console.error("Save failed:", error);
          alert("Could not save draft. Please try again.");
        }
      },

      setBookTitle: (title) => {
        set({ bookTitle: title });
        get().pushHistory();
        get().saveDraftSilent();
      },

      setBookSize: (size) => {
        set({ bookSize: size });
        get().pushHistory();
        get().saveDraftSilent();
      },

      resetEditorState: (newDesignId) => {
        set({
          designId: newDesignId,
          mode: "edit",
          activeTool: null,
          activeSide: "left",
          selectedThemeId: 1,
          bookTitle: "Untitled Book",
          bookSize: DEFAULT_BOOK_SIZE,
          currentStep: 2,
          spreads: [
            {
              id: "spread-1",
              left: makePage("p1", "split-2col", []),
              right: makePage("p2", "full", []),
            },
          ],
          currentSpreadIndex: 0,
          totalPages: 2,
          unplacedPhotos: [],
          deletedPhotoIds: [],
          cover: {
            front: makePage("cover-front", "cover-full", []),
            back: makePage("cover-back", "cover-full", []),
          },
          activeCoverSide: "front",
          editingCover: false,
          activeTextId: null,
          activePhoto: { spreadIndex: 0, side: "left", photoId: null },
          history: [],
          historyIndex: -1,
        });
      },

      addUploadedPhotos: (newPhotos = []) => {
        const sanitized = sanitizePhotoList(newPhotos);
        if (sanitized.length === 0) return;

        set((s) => {
          const existingIds = new Set([
            ...s.unplacedPhotos.map((p) => String(p.id)),
            ...s.deletedPhotoIds.map(String),
          ]);

          s.spreads.forEach((spread) => {
            spread.left?.photos?.forEach((p) => existingIds.add(String(p.id)));
            spread.right?.photos?.forEach((p) => existingIds.add(String(p.id)));
          });
          s.cover.front?.photos?.forEach((p) => existingIds.add(String(p.id)));
          s.cover.back?.photos?.forEach((p) => existingIds.add(String(p.id)));

          const uniqueNewPhotos = sanitized.filter(
            (p) => !existingIds.has(String(p.id)),
          );

          return {
            unplacedPhotos: [...s.unplacedPhotos, ...uniqueNewPhotos],
          };
        });

        get().pushHistory();
        get().saveDraftSilent();
      },

      uploadPhotos: async (fileList) => {
        const { designId, addUploadedPhotos } = get();
        const files = Array.from(fileList || []);
        if (files.length === 0) return;

        const uploadedItems = [];

        for (const file of files) {
          const formData = new FormData();
          formData.append("design_id", designId);
          formData.append("file", file);
          formData.append("dpi_warning", "false");

          try {
            const res = await fetchWithAuth("http://localhost:8000/photos/upload", {
              method: "POST",
              body: formData,
            });

            if (res.ok) {
              const data = await res.json();
              uploadedItems.push({
                id: data.id,
                url: data.file_url,
                preview: data.file_url,
              });
            } else {
              console.error(
                "Failed to upload file to backend:",
                res.statusText,
              );
            }
          } catch (err) {
            console.error("Error uploading photo:", err);
          }
        }

        if (uploadedItems.length > 0) {
          addUploadedPhotos(uploadedItems);
        } else {
          alert("Failed uploading photos to server.");
        }
      },

      initEditor: async (designId) => {
        const targetDesignId = designId || get().designId;

        // Always start from a clean slate before loading.
        get().resetEditorState(targetDesignId);

        // These two are independent: a brand-new design has uploaded photos
        // but no saved draft yet, so we can't rely on the draft endpoint
        // to also hand back the photo list — fetch both separately.
        const [draftRes, photosRes] = await Promise.allSettled([
          fetchWithAuth(`http://localhost:8000/editor/load/${targetDesignId}`),
          fetchWithAuth(`http://localhost:8000/photos/${targetDesignId}`),
        ]);

        try {
          // ---- Uploaded photos (always attempt this) ----
          let rawPhotos = [];
          if (photosRes.status === "fulfilled" && photosRes.value.ok) {
            const photosData = await photosRes.value.json();
            const rawPhotoList = Array.isArray(photosData) ? photosData : [];
            rawPhotos = sanitizePhotoList(
              rawPhotoList.map((p) => ({
                id: p.id,
                url: p.file_url,
                preview: p.file_url,
              })),
            );
          }

          // ---- Saved draft (may not exist yet for a new design) ----
          let loadedSpreads = null;
          let loadedCover = get().cover;
          let loadedUnplaced = [];
          let loadedDeleted = [];
          let loadedThemeId = 1;
          let loadedTitle = "Untitled Book";
          let loadedBookSize = get().bookSize;

          if (draftRes.status === "fulfilled" && draftRes.value.ok) {
            const data = await draftRes.value.json();
            const draftObj = data.draft || data;
            const draftData = draftObj.spreads_data;

            loadedThemeId = draftObj.theme_id ?? 1;
            loadedTitle = draftObj.title || "Untitled Book";
            loadedBookSize = draftObj.book_size || get().bookSize;

            if (
              draftData &&
              typeof draftData === "object" &&
              !Array.isArray(draftData)
            ) {
              loadedSpreads = draftData.spreads || null;
              if (draftData.cover) loadedCover = draftData.cover;
              if (draftData.unplaced?.length) {
                loadedUnplaced = sanitizePhotoList(draftData.unplaced);
              }
              if (draftData.deletedPhotoIds?.length) {
                loadedDeleted = draftData.deletedPhotoIds.map(String);
              }
            }
          }

          // ---- Merge: any uploaded photo not already placed/deleted/unplaced
          //      goes into the unplaced tray ----
          const deletedSet = new Set(loadedDeleted);
          const activeRawPhotos = rawPhotos.filter(
            (p) => !deletedSet.has(String(p.id)),
          );

          const existingIds = new Set(loadedDeleted);
          if (loadedSpreads) {
            loadedSpreads.forEach((spread) => {
              spread.left?.photos?.forEach((p) => existingIds.add(String(p.id)));
              spread.right?.photos?.forEach((p) => existingIds.add(String(p.id)));
            });
          }
          loadedCover.front?.photos?.forEach((p) => existingIds.add(String(p.id)));
          loadedCover.back?.photos?.forEach((p) => existingIds.add(String(p.id)));
          loadedUnplaced.forEach((p) => existingIds.add(String(p.id)));

          const newlyUploaded = activeRawPhotos.filter(
            (p) => !existingIds.has(String(p.id)),
          );
          const mergedUnplaced = [...loadedUnplaced, ...newlyUploaded];

          set({
            spreads: loadedSpreads || get().spreads,
            cover: loadedCover,
            selectedThemeId: Number(loadedThemeId),
            bookTitle: loadedTitle,
            bookSize: loadedBookSize,
            unplacedPhotos: mergedUnplaced,
            deletedPhotoIds: loadedDeleted,
          });

          get().pushHistory();
        } catch (err) {
          console.error("Failed to load editor data:", err);
        }
      },

      deletePhotoFromPage: (spreadIndex, side, photoId) => {
        set((s) => {
          const draft = clonePagesState(s);
          const page = getPage(draft, spreadIndex, side);
          const removed = page.photos.find(
            (p) => String(p.id) === String(photoId),
          );

          page.photos = page.photos.filter(
            (p) => String(p.id) !== String(photoId),
          );
          const unplaced = removed
            ? [...s.unplacedPhotos, removed]
            : s.unplacedPhotos;

          return {
            spreads: draft.spreads,
            cover: draft.cover,
            unplacedPhotos: unplaced,
            activePhoto: { spreadIndex: -1, side: null, photoId: null },
          };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      deleteUnplacedPhoto: (photoId) => {
        const targetId = String(photoId);
        set((s) => ({
          unplacedPhotos: s.unplacedPhotos.filter(
            (p) => String(p.id) !== targetId,
          ),
          deletedPhotoIds: Array.from(
            new Set([...s.deletedPhotoIds.map(String), targetId]),
          ),
        }));
        get().pushHistory();
        get().saveDraftSilent();
      },

      purgeCorruptPhoto: (spreadIndex, side, photoId) => {
        set((s) => {
          const draft = clonePagesState(s);
          const page = getPage(draft, spreadIndex, side);
          page.photos = page.photos.filter(
            (p) => String(p.id) !== String(photoId),
          );
          return { spreads: draft.spreads, cover: draft.cover };
        });
        get().saveDraftSilent();
      },

      placeUnplacedPhoto: (photoId, targetSpreadIndex, targetSide) => {
        set((s) => {
          const photoToPlace = s.unplacedPhotos.find(
            (p) => String(p.id) === String(photoId),
          );
          if (!photoToPlace) return s;

          const draft = clonePagesState(s);
          const targetPage = getPage(draft, targetSpreadIndex, targetSide);
          const layoutDef =
            LAYOUTS.find((l) => l.id === targetPage.layoutId) || LAYOUTS[0];

          if (targetPage.photos.length >= layoutDef.maxPhotos) {
            alert(
              `This page layout only supports up to ${layoutDef.maxPhotos} photo(s).`,
            );
            return s;
          }

          targetPage.photos.push(photoToPlace);
          const updatedUnplaced = s.unplacedPhotos.filter(
            (p) => String(p.id) !== String(photoId),
          );

          return {
            spreads: draft.spreads,
            cover: draft.cover,
            unplacedPhotos: updatedUnplaced,
          };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      placeUnplacedPhotoOnCover: (photoId, coverSide) => {
        set((s) => {
          const photoToPlace = s.unplacedPhotos.find(
            (p) => String(p.id) === String(photoId),
          );
          if (!photoToPlace) return s;

          const cover = JSON.parse(JSON.stringify(s.cover));
          const targetPage = cover[coverSide];
          const layoutDef =
            COVER_LAYOUTS.find((l) => l.id === targetPage.layoutId) ||
            COVER_LAYOUTS[0];

          if (targetPage.photos.length >= layoutDef.maxPhotos) {
            alert(
              `This cover layout only supports up to ${layoutDef.maxPhotos} photo(s).`,
            );
            return s;
          }

          targetPage.photos.push(photoToPlace);
          const updatedUnplaced = s.unplacedPhotos.filter(
            (p) => String(p.id) !== String(photoId),
          );

          return { cover, unplacedPhotos: updatedUnplaced };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      handleDrop: (dragData, targetSpreadIndex, targetSide, targetPhotoId) => {
        if (!dragData || !dragData.photoId) return;

        const { origin, photoId, sourceSpreadIndex, sourceSide } = dragData;
        const targetIdStr = targetPhotoId ? String(targetPhotoId) : null;
        const draggedIdStr = String(photoId);

        set((s) => {
          const draft = clonePagesState(s);
          let unplacedPhotos = [...s.unplacedPhotos];

          const targetPage = getPage(draft, targetSpreadIndex, targetSide);
          const targetPhotoIndex = targetIdStr
            ? targetPage.photos.findIndex((p) => String(p.id) === targetIdStr)
            : -1;

          if (origin === "unplaced") {
            const photoToPlace = unplacedPhotos.find(
              (p) => String(p.id) === draggedIdStr,
            );
            if (!photoToPlace) return s;

            unplacedPhotos = unplacedPhotos.filter(
              (p) => String(p.id) !== draggedIdStr,
            );

            if (targetPhotoIndex !== -1) {
              const replacedPhoto = targetPage.photos[targetPhotoIndex];
              targetPage.photos[targetPhotoIndex] = photoToPlace;
              if (replacedPhoto) unplacedPhotos.push(replacedPhoto);
            } else {
              targetPage.photos.push(photoToPlace);
            }
          } else if (origin === "canvas") {
            if (
              sourceSpreadIndex === targetSpreadIndex &&
              sourceSide === targetSide &&
              draggedIdStr === targetIdStr
            ) {
              return s;
            }

            const sourcePage = getPage(draft, sourceSpreadIndex, sourceSide);
            const sourcePhotoIndex = sourcePage.photos.findIndex(
              (p) => String(p.id) === draggedIdStr,
            );

            if (sourcePhotoIndex === -1) return s;

            const sourcePhoto = sourcePage.photos[sourcePhotoIndex];

            if (targetPhotoIndex !== -1) {
              const targetPhoto = targetPage.photos[targetPhotoIndex];
              sourcePage.photos[sourcePhotoIndex] = targetPhoto;
              targetPage.photos[targetPhotoIndex] = sourcePhoto;
            } else {
              sourcePage.photos.splice(sourcePhotoIndex, 1);
              targetPage.photos.push(sourcePhoto);
            }
          }

          return { spreads: draft.spreads, cover: draft.cover, unplacedPhotos };
        });

        get().pushHistory();
        get().saveDraftSilent();
      },

      setLayout: (spreadIndex, side, layoutId) => {
        set((s) => {
          const draft = clonePagesState(s);
          const targetPage = getPage(draft, spreadIndex, side);
          const layoutDef =
            LAYOUTS.find((l) => l.id === layoutId) || LAYOUTS[0];

          targetPage.layoutId = layoutId;

          let unplacedPhotos = [...s.unplacedPhotos];
          if (targetPage.photos.length > layoutDef.maxPhotos) {
            const kept = targetPage.photos.slice(0, layoutDef.maxPhotos);
            const trimmed = targetPage.photos.slice(layoutDef.maxPhotos);
            targetPage.photos = kept;
            unplacedPhotos = [...unplacedPhotos, ...trimmed];
          }

          return { spreads: draft.spreads, cover: draft.cover, unplacedPhotos };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      setCoverLayout: (side, layoutId) => {
        set((s) => {
          const cover = JSON.parse(JSON.stringify(s.cover));
          const targetPage = cover[side];
          const layoutDef =
            COVER_LAYOUTS.find((l) => l.id === layoutId) || COVER_LAYOUTS[0];

          targetPage.layoutId = layoutId;

          let unplacedPhotos = [...s.unplacedPhotos];
          if (targetPage.photos.length > layoutDef.maxPhotos) {
            const kept = targetPage.photos.slice(0, layoutDef.maxPhotos);
            const trimmed = targetPage.photos.slice(layoutDef.maxPhotos);
            targetPage.photos = kept;
            unplacedPhotos = [...unplacedPhotos, ...trimmed];
          }

          return { cover, unplacedPhotos };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      setMode: (mode) => set({ mode, currentStep: mode === "preview" ? 3 : 2 }),
      setActiveSide: (side) => set({ activeSide: side }),
      setActiveCoverSide: (side) => set({ activeCoverSide: side }),
      setEditingCover: (val) => set({ editingCover: val }),
      setActiveTool: (tool) =>
        set((s) => ({ activeTool: s.activeTool === tool ? null : tool })),
      setTheme: (id) => {
        set({ selectedThemeId: id });
        get().pushHistory();
        get().saveDraftSilent();
      },
      setActivePhoto: (spreadIndex, side, photoId) =>
        set({ activePhoto: { spreadIndex, side, photoId }, activeSide: side }),
      clearActivePhoto: () =>
        set({ activePhoto: { spreadIndex: -1, side: null, photoId: null } }),
      goPrevSpread: () =>
        set((s) => ({
          currentSpreadIndex: Math.max(-1, s.currentSpreadIndex - 1),
        })),
      goNextSpread: () =>
        set((s) => ({
          currentSpreadIndex: Math.min(
            s.spreads.length,
            s.currentSpreadIndex + 1,
          ),
        })),
      selectSpread: (index) => set({ currentSpreadIndex: index }),

      rotatePhoto: (spreadIndex, side, photoId) => {
        set((s) => {
          const draft = clonePagesState(s);
          const photo = getPage(draft, spreadIndex, side)?.photos.find(
            (p) => String(p.id) === String(photoId),
          );
          if (photo) photo.rotation = ((photo.rotation || 0) + 90) % 360;
          return { spreads: draft.spreads, cover: draft.cover };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      toggleBWPhoto: (spreadIndex, side, photoId) => {
        set((s) => {
          const draft = clonePagesState(s);
          const photo = getPage(draft, spreadIndex, side)?.photos.find(
            (p) => String(p.id) === String(photoId),
          );
          if (photo) photo.isBW = !photo.isBW;
          return { spreads: draft.spreads, cover: draft.cover };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      updatePhotoCrop: (spreadIndex, side, photoId, cropData) => {
        set((s) => {
          const draft = clonePagesState(s);
          const photo = getPage(draft, spreadIndex, side)?.photos.find(
            (p) => String(p.id) === String(photoId),
          );
          if (photo) {
            if (cropData.zoom !== undefined) photo.zoom = cropData.zoom;
            if (cropData.panX !== undefined) photo.panX = cropData.panX;
            if (cropData.panY !== undefined) photo.panY = cropData.panY;
          }
          return { spreads: draft.spreads, cover: draft.cover };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      deleteSpread: (spreadIndex) => {
        set((s) => {
          if (s.spreads.length <= 1) {
            alert("Your photo book must have at least one spread.");
            return s;
          }

          const spreads = JSON.parse(JSON.stringify(s.spreads));
          const removedSpread = spreads[spreadIndex];
          spreads.splice(spreadIndex, 1);

          let unplacedPhotos = [...s.unplacedPhotos];
          if (removedSpread) {
            if (removedSpread.left?.photos)
              unplacedPhotos.push(...removedSpread.left.photos);
            if (removedSpread.right?.photos)
              unplacedPhotos.push(...removedSpread.right.photos);
          }

          const newIndex = Math.min(s.currentSpreadIndex, spreads.length - 1);

          return {
            spreads,
            unplacedPhotos,
            currentSpreadIndex: newIndex,
            totalPages: spreads.length * 2,
          };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      addPagePair: () => {
        set((s) => {
          const timestamp = Date.now();
          const newSpread = {
            id: `spread-${timestamp}`,
            left: makePage(`p-${timestamp}-1`, "full", []),
            right: makePage(`p-${timestamp}-2`, "full", []),
          };
          const updatedSpreads = [...s.spreads, newSpread];
          return {
            spreads: updatedSpreads,
            totalPages: updatedSpreads.length * 2,
            currentSpreadIndex: s.spreads.length - 1,
          };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      addTextElement: (spreadIndex, side) => {
        const newText = {
          id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
          content: "Double-click to edit",
          x: 40,
          y: 40,
          width: 200,
          fontSize: 24,
          color: "#000000",
          fontFamily: FONT_FAMILIES[0].value,
          fontWeight: "normal",
          fontStyle: "normal",
          textAlign: "left",
        };
        set((s) => {
          const draft = clonePagesState(s);
          const page = getPage(draft, spreadIndex, side);
          if (!page.texts) page.texts = [];
          page.texts.push(newText);
          return {
            spreads: draft.spreads,
            cover: draft.cover,
            activeTextId: newText.id,
          };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      updateTextElement: (spreadIndex, side, textId, updates) => {
        set((s) => {
          const draft = clonePagesState(s);
          const text = getPage(draft, spreadIndex, side).texts?.find(
            (t) => t.id === textId,
          );
          if (text) Object.assign(text, updates);
          return { spreads: draft.spreads, cover: draft.cover };
        });
      },

      commitTextChange: () => {
        get().pushHistory();
        get().saveDraftSilent();
      },

      deleteTextElement: (spreadIndex, side, textId) => {
        set((s) => {
          const draft = clonePagesState(s);
          const page = getPage(draft, spreadIndex, side);
          page.texts = (page.texts || []).filter((t) => t.id !== textId);
          return {
            spreads: draft.spreads,
            cover: draft.cover,
            activeTextId: null,
          };
        });
        get().pushHistory();
        get().saveDraftSilent();
      },

      setActiveText: (textId) => set({ activeTextId: textId }),

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const prev = history[historyIndex - 1];
          set({
            spreads: prev.spreads,
            cover: prev.cover || get().cover,
            selectedThemeId: prev.selectedThemeId,
            unplacedPhotos: prev.unplacedPhotos || [],
            deletedPhotoIds: prev.deletedPhotoIds || [],
            historyIndex: historyIndex - 1,
          });
          get().saveDraftSilent();
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const next = history[historyIndex + 1];
          set({
            spreads: next.spreads,
            cover: next.cover || get().cover,
            selectedThemeId: next.selectedThemeId,
            unplacedPhotos: next.unplacedPhotos || [],
            deletedPhotoIds: next.deletedPhotoIds || [],
            historyIndex: historyIndex + 1,
          });
          get().saveDraftSilent();
        }
      },
    }),
    {
      name: "editor-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        unplacedPhotos: state.unplacedPhotos,
        spreads: state.spreads,
        cover: state.cover,
        designId: state.designId,
        selectedThemeId: state.selectedThemeId,
        bookTitle: state.bookTitle,
        bookSize: state.bookSize,
      }),
    },
  ),
);