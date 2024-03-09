import { create } from "zustand";

export const useUserConfig = create((set) => ({
  user: null,
  setUser: (newUser) => set((state) => ({ user: newUser })),
}));
