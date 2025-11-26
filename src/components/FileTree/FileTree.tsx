import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileNode } from "@/lib/file-types";
import { loadFolderChildren } from "@/lib/tauri-fs";

interface FileTreeProps {
  node: FileNode;
  level?: number;
  selectedFile?: string;
  onFileSelect: (path: string, name: string) => void;
}

export function FileTree({
  node,
  level = 0,
  selectedFile,
  onFileSelect,
}: FileTreeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first two levels
  const [children, setChildren] = useState<FileNode[]>(node.children || []);
  const [isLoading, setIsLoading] = useState(false);

  // Load children when expanded for the first time
  useEffect(() => {
    if (
      isExpanded &&
      node.type === "folder" &&
      children.length === 0 &&
      !isLoading
    ) {
      loadChildren();
    }
  }, [isExpanded]);

  const loadChildren = async () => {
    if (node.type !== "folder") return;
    
    setIsLoading(true);
    try {
      const loadedChildren = await loadFolderChildren(node.path);
      setChildren(loadedChildren);
    } catch (error) {
      console.error("Error loading children:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (node.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node.path, node.name);
    }
  };

  const isSelected = selectedFile === node.path;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1 text-sm cursor-pointer hover:bg-sidebar-accent/50 rounded-sm transition-colors",
          isSelected && "bg-sidebar-accent text-sidebar-accent-foreground",
          "select-none"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === "folder" && (
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 mr-2 text-blue-500" />
            )}
          </div>
        )}
        {node.type === "file" && (
          <File className="h-4 w-4 mr-2 ml-4 text-gray-500" />
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === "folder" && isExpanded && (
        <div>
          {isLoading ? (
            <div
              className="text-xs text-muted-foreground px-2 py-1"
              style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
            >
              Loading...
            </div>
          ) : (
            children.map((child) => (
              <FileTree
                key={child.id}
                node={child}
                level={level + 1}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

