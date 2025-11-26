// lib/stores/useTerminalStore
import { create } from "zustand";

interface TerminalStore {
  isVisible: boolean;
  height: number;
  activePanel: "terminal" | "output" | "problems";
  toggleVisibility: () => void;
  setHeight: (h: number) => void;
  setActivePanel: (panel: "terminal" | "output" | "problems") => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  isVisible: true,
  height: 300,
  activePanel: "terminal",
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  setHeight: (h) => set({ height: h }),
  setActivePanel: (panel) => set({ activePanel: panel }),
}));

