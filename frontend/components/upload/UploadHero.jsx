"use client";

import { useState, useEffect } from "react";
import UploadArea from "./UploadArea";
import UploadGallery from "./UploadGallery";
import { useRouter, useSearchParams } from "next/navigation";
import { useEditorStore, BOOK_SIZES } from "@/components/store/useEditorStore";
import { fetchWithAuth } from "@/components/lib/fetchWithAuth";

export default function UploadHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [designId] = useState(() => {
    const fromUrl = searchParams.get("design_id");
    return fromUrl || crypto.randomUUID();
  });

  const addUploadedPhotos = useEditorStore((s) => s.addUploadedPhotos);
  const setBookSize = useEditorStore((s) => s.setBookSize);

  useEffect(() => {
    const sizeParam = searchParams.get("size");
    if (sizeParam) {
      const matched = BOOK_SIZES.find((s) => s.title === sizeParam);
      if (matched) setBookSize(matched);
    }
  }, [searchParams, setBookSize]);

  useEffect(() => {
    const fromUrl = searchParams.get("design_id");
    if (!fromUrl) {
      setIsLoading(false);
      return;
    }

    const fetchExistingPhotos = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/photos/${designId}`);
        if (response.ok) {
          const data = await response.json();
          const existingPhotos = data.map((photo) => ({
            id: photo.id,
            url: photo.file_url,
            preview: photo.file_url,
            uploading: false,
          }));
          setPhotos(existingPhotos);
          addUploadedPhotos(existingPhotos);
        } else {
          console.error("Backend returned error status:", response.status);
        }
      } catch (error) {
        console.error("Network / CORS error fetching photos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingPhotos();
  }, [designId, searchParams, addUploadedPhotos]);

  const handleUpload = async (files) => {
    setIsUploading(true);
    setErrorMessage("");

    const fileList = Array.from(files);
    const newPhotos = fileList.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const targetPhoto = newPhotos[i];
        const formData = new FormData();
        formData.append("design_id", designId);
        formData.append("file", file);
        formData.append("dpi_warning", "false");

        try {
          const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/photos/upload`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || `Upload failed with status ${response.status}`);
          }

          const data = await response.json();
          const uploadedItem = {
            id: data.id,
            url: data.file_url,
            preview: data.file_url,
            uploading: false,
          };

          setPhotos((prev) =>
            prev.map((item) => (item.id === targetPhoto.id ? uploadedItem : item))
          );
          addUploadedPhotos([uploadedItem]);
        } catch (error) {
          console.error("Failed to upload photo:", error);
          setErrorMessage(error.message || "Failed to upload one or more photos.");
          // Remove failed photo preview from state
          setPhotos((prev) => prev.filter((item) => item.id !== targetPhoto.id));
        }
      }
    } finally {
      // ALWAYS reset uploading state regardless of errors
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/photos/${photoId}`, { method: "DELETE" });
    } catch (error) {
      console.error("Failed to delete photo from backend:", error);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[#F4B323] text-[11px] tracking-[3px] uppercase font-bold">
              ADD MEMORIES
            </p>
            <h1 className="mt-3 text-[54px] leading-[60px] font-serif font-normal text-[#111111] tracking-tight">
              Upload your photos.
            </h1>
            <p className="mt-2 text-[16px] text-[#7A7A7A]">
              Add 30–500 photos. High resolution recommended.
            </p>
          </div>
          <div className="px-5 py-2.5 bg-white border border-[#E5E5E5] rounded-full shadow-sm">
            <span className="text-[14px] font-medium text-[#333333]">
              {isLoading ? "Loading..." : `${photos.length} photos selected`}
            </span>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage("")}
              className="text-red-500 font-bold ml-4 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        <UploadArea onUpload={handleUpload} />

        {photos.length > 0 && <UploadGallery photos={photos} onDelete={handleDeletePhoto} />}

        <div className="flex items-center justify-between mt-12">
          <button
            onClick={() => router.push("/custom")}
            className="text-[15px] font-medium text-[#444444] hover:text-black flex items-center gap-2"
          >
            ← Back to themes
          </button>
          {photos.length > 0 && (
            <button
              disabled={isUploading}
              onClick={() => router.push(`/generating?design_id=${designId}`)}
              className="px-8 h-[52px] rounded-full bg-[#F4B323] text-[#111111] font-medium hover:bg-[#e0a31f] transition disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Open Editor →"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}