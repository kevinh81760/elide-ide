import { FilePlus, FolderPlus, ChevronsDownUp } from "lucide-react";

interface SidebarHeaderProps {
  onCreateFile: () => void;
  onCreateFolder: () => void;
  onCollapseAll: () => void;
}

export function SidebarHeader({
  onCreateFile,
  onCreateFolder,
  onCollapseAll,
}: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-sidebar-border bg-sidebar">
      <h2 className="text-sm font-semibold text-sidebar-foreground">
        FILE EXPLORER
      </h2>
      
      <div className="flex items-center gap-1">
        <button
          onClick={onCreateFile}
          className="p-1.5 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          title="New File"
          aria-label="New File"
        >
          <FilePlus className="h-4 w-4" />
        </button>
        
        <button
          onClick={onCreateFolder}
          className="p-1.5 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          title="New Folder"
          aria-label="New Folder"
        >
          <FolderPlus className="h-4 w-4" />
        </button>
        
        <button
          onClick={onCollapseAll}
          className="p-1.5 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          title="Collapse All"
          aria-label="Collapse All"
        >
          <ChevronsDownUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

