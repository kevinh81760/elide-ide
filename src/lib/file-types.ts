export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
  content?: string;
}

export interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  isDirty?: boolean;
}

export interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

