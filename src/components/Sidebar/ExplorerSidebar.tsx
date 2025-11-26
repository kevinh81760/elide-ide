import { FileTree } from "@/components/FileTree";
import type { FileNode } from "@/lib/file-types";

interface ExplorerSidebarProps {
  fileTree: FileNode | null;
  selectedFile?: string;
  onFileSelect: (path: string, name: string) => void;
}

export function ExplorerSidebar({
  fileTree,
  selectedFile,
  onFileSelect,
}: ExplorerSidebarProps) {
  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-3 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground">
          FILE EXPLORER
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {fileTree ? (
          <FileTree
            node={fileTree}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
          />
        ) : (
          <div className="text-sm text-muted-foreground p-4 text-center">
            No workspace opened
          </div>
        )}
      </div>
    </div>
  );
}

