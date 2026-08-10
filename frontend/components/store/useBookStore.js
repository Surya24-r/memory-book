import { create } from "zustand";

const useBookStore = create((set) => ({
  selectedSize: "",

  setSelectedSize: (size) =>
    set({
      selectedSize: size,
    }),
}));

export default useBookStore;