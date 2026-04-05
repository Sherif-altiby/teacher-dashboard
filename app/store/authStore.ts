import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => set({ user }),
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "al-abqari-auth",  
    },
  ),
);
