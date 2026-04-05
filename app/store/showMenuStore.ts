import { create } from "zustand";

interface ShowMenu {
  show: boolean;
  setShow: (value?: boolean) => void;
}

export const useShowStore = create<ShowMenu>()((set) => ({
  show: false,

  // دالة التحديث
  setShow: (value) => 
    set((state) => ({ 
      show: value !== undefined ? value : !state.show 
    })),
}));