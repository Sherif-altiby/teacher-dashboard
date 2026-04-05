import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { API } from "../constants";

interface Level {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface LevelState {
  levels: Level[];
  isLoading: boolean;
  error: string | null;
  fetchLevels: () => Promise<void>;
}

export const useLevelStore = create<LevelState>()(
  persist(
    (set) => ({
      levels: [],
      isLoading: false,
      error: null,

      fetchLevels: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API}/user/get-levels`, {
            credentials: "include"
          });
          const result = await response.json();

          if (result.success) {
            set({ levels: result.data, isLoading: false });
          } else {
            set({ error: "Failed to fetch levels", isLoading: false });
          }
        } catch (err) {
          set({ error: "Network error", isLoading: false });
        }
      },
    }),
    {
      name: "levels-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
