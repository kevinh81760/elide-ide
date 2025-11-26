import { readDir, readTextFile } from "@tauri-apps/plugin-fs";
import type { FileNode, FileEntry } from "./file-types";

/**
 * Read a directory and return its contents as FileEntry objects
 */
export async function readDirectory(path: string): Promise<FileEntry[]> {
  try {
    const entries = await readDir(path);
    return entries.map((entry) => ({
      name: entry.name,
      path: `${path}/${entry.name}`,
      isDirectory: entry.isDirectory,
    }));
  } catch (error) {
    console.error(`Error reading directory ${path}:`, error);
    return [];
  }
}

/**
 * Read a text file and return its content
 */
export async function readFile(path: string): Promise<string> {
  try {
    const content = await readTextFile(path);
    return content;
  } catch (error) {
    console.error(`Error reading file ${path}:`, error);
    return "";
  }
}

/**
 * Convert a directory path to a FileNode tree structure
 */
export async function buildFileTree(
  path: string,
  name: string = path,
  maxDepth: number = 3,
  currentDepth: number = 0
): Promise<FileNode> {
  const id = path;

  // If we've reached max depth, don't load children
  if (currentDepth >= maxDepth) {
    return {
      id,
      name,
      type: "folder",
      path,
      children: [],
    };
  }

  try {
    const entries = await readDirectory(path);
    
    // Sort: folders first, then files, alphabetically
    const sortedEntries = entries.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    const children: FileNode[] = [];

    for (const entry of sortedEntries) {
      if (entry.isDirectory) {
        // Recursively build tree for subdirectories
        const childNode = await buildFileTree(
          entry.path,
          entry.name,
          maxDepth,
          currentDepth + 1
        );
        children.push(childNode);
      } else {
        // Add file node
        children.push({
          id: entry.path,
          name: entry.name,
          type: "file",
          path: entry.path,
        });
      }
    }

    return {
      id,
      name,
      type: "folder",
      path,
      children,
    };
  } catch (error) {
    console.error(`Error building file tree for ${path}:`, error);
    return {
      id,
      name,
      type: "folder",
      path,
      children: [],
    };
  }
}

/**
 * Lazy load children for a folder node
 */
export async function loadFolderChildren(path: string): Promise<FileNode[]> {
  try {
    const entries = await readDirectory(path);
    
    // Sort: folders first, then files, alphabetically
    const sortedEntries = entries.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    return sortedEntries.map((entry) => ({
      id: entry.path,
      name: entry.name,
      type: entry.isDirectory ? "folder" : "file",
      path: entry.path,
      children: entry.isDirectory ? [] : undefined,
    }));
  } catch (error) {
    console.error(`Error loading children for ${path}:`, error);
    return [];
  }
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.slice(lastDot + 1).toLowerCase();
}

/**
 * Get language ID based on file extension
 */
export function getLanguageFromExtension(filename: string): string {
  const ext = getFileExtension(filename);
  
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    html: "html",
    css: "css",
    scss: "scss",
    less: "less",
    md: "markdown",
    py: "python",
    rs: "rust",
    go: "go",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    swift: "swift",
    kt: "kotlin",
    sql: "sql",
    sh: "shell",
    bash: "shell",
    yml: "yaml",
    yaml: "yaml",
    xml: "xml",
    toml: "toml",
    ini: "ini",
  };

  return languageMap[ext] || "plaintext";
}

