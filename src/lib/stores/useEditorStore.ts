import { create } from "zustand";
import { readFile } from "@/lib/tauri-fs";
import type { Tab } from "@/lib/file-types";

interface EditorStore {
  tabs: Tab[];
  activeTabId: string | null;
  openFile: (path: string, name: string) => Promise<void>;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  getActiveTab: () => Tab | undefined;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  tabs: [],
  activeTabId: null,

  openFile: async (path: string, name: string) => {
    const { tabs } = get();
    
    // Check if tab already exists
    const existingTab = tabs.find((tab) => tab.path === path);
    if (existingTab) {
      set({ activeTabId: path });
      return;
    }

    // Read file content
    const content = await readFile(path);

    // Add new tab
    const newTab: Tab = {
      id: path,
      name: name,
      path: path,
      content: content,
    };

    set((state) => ({
      tabs: [...state.tabs, newTab],
      activeTabId: path,
    }));
  },

  closeTab: (tabId: string) => {
    const { tabs, activeTabId } = get();
    const newTabs = tabs.filter((tab) => tab.id !== tabId);

    let newActiveTabId = activeTabId;

    // If we closed the active tab, switch to another one
    if (activeTabId === tabId && newTabs.length > 0) {
      newActiveTabId = newTabs[newTabs.length - 1].id;
    } else if (newTabs.length === 0) {
      newActiveTabId = null;
    }

    set({
      tabs: newTabs,
      activeTabId: newActiveTabId,
    });
  },

  setActiveTab: (tabId: string) => {
    set({ activeTabId: tabId });
  },

  getActiveTab: () => {
    const { tabs, activeTabId } = get();
    return tabs.find((tab) => tab.id === activeTabId);
  },
}));

