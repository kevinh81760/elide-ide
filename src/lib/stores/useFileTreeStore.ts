import { create } from "zustand";
import type { FileNode } from "@/lib/file-types";

interface FileTreeStore {
  fileTree: FileNode | null;
  expandedFolders: Set<string>;
  setFileTree: (tree: FileNode | null) => void;
  toggleFolder: (path: string) => void;
  collapseAllFolders: () => void;
  createNewFile: () => void;
  createNewFolder: () => void;
}

export const useFileTreeStore = create<FileTreeStore>((set, get) => ({
  fileTree: null,
  expandedFolders: new Set<string>(),
  
  setFileTree: (tree) => set({ fileTree: tree }),
  
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
}));

