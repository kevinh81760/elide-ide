import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FileNode } from "@/lib/file-types";

interface FileTreeStore {
  fileTree: FileNode | null;
  expandedFolders: Set<string>;
  currentWorkspacePath: string | null;
  setFileTree: (tree: FileNode | null) => void;
  setWorkspacePath: (path: string | null) => void;
  toggleFolder: (path: string) => void;
  collapseAllFolders: () => void;
  createNewFile: () => void;
  createNewFolder: () => void;
}

export const useFileTreeStore = create<FileTreeStore>()(
  persist(
    (set, get) => ({
      fileTree: null,
      expandedFolders: new Set<string>(),
      currentWorkspacePath: null,

      setFileTree: (tree) => set({ fileTree: tree }),

      setWorkspacePath: (path) => set({ currentWorkspacePath: path }),

      toggleFolder: (path: string) => {
        const { expandedFolders } = get();
        const newExpanded = new Set(expandedFolders);

        if (newExpanded.has(path)) {
          newExpanded.delete(path);
        } else {
          newExpanded.add(path);
        }

        set({ expandedFolders: newExpanded });
      },

      collapseAllFolders: () => {
        set({ expandedFolders: new Set<string>() });
      },

      createNewFile: () => {
        console.log("Create new file - implementation pending");
        // TODO: Show input dialog, create file via Tauri FS
        alert("Create New File feature coming soon!");
      },

      createNewFolder: () => {
        console.log("Create new folder - implementation pending");
        // TODO: Show input dialog, create folder via Tauri FS
        alert("Create New Folder feature coming soon!");
      },
    }),
    {
      name: "file-tree-storage",
      partialize: (state) => ({
        currentWorkspacePath: state.currentWorkspacePath,
      }),
    }
  )
);

