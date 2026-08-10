import { create } from "zustand";

const usePhotoStore = create((set) => ({
  photo: [],
  setPhotos: (photos) => set({ photos }),
  clearPhotos: () => set({ photos: [] }),
}));

export default usePhotoStore;
