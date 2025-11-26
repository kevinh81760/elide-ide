import { useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { buildFileTree } from "@/lib/tauri-fs";
import { useEditorStore } from "@/lib/stores/useEditorStore";
import { useFileTreeStore } from "@/lib/stores/useFileTreeStore";
import { useTerminalStore } from "@/lib/stores/useTerminalStore";
import {
  ExplorerSidebar,
  ResizableSidebar,
  SidebarHeader,
} from "@/components/Sidebar";
import { TabBar } from "@/components/Tabs";
import { EditorContent } from "@/components/Editor";
import { Terminal, ResizablePanel } from "@/components/Terminal";
import { PanelTabs } from "@/components/Panels";

export default function IDELayout() {
  const { tabs, activeTabId, openFile, closeTab, setActiveTab, getActiveTab } =
    useEditorStore();
  const {
    fileTree,
    setFileTree,
    currentWorkspacePath,
    setWorkspacePath,
    createNewFile,
    createNewFolder,
    collapseAllFolders,
  } = useFileTreeStore();
  const { isVisible, height, setHeight, activePanel, setActivePanel } =
    useTerminalStore();

  useEffect(() => {
    const loadWorkspace = async () => {
      // Load the last opened workspace if available
      if (currentWorkspacePath) {
        try {
          const folderName = currentWorkspacePath.split("/").pop() || "Workspace";
          const tree = await buildFileTree(currentWorkspacePath, folderName, 2);
          setFileTree(tree);
          console.log("Restored workspace:", currentWorkspacePath);
        } catch (error) {
          console.error("Error restoring workspace:", error);
          // If we can't load the saved workspace, clear it
          setWorkspacePath(null);
        }
      }
    };

    loadWorkspace();
  }, [currentWorkspacePath, setFileTree, setWorkspacePath]);

  const handleOpenFolder = async () => {
    console.log("🔵 Folder open button clicked!");
    
    try {
      console.log("🔵 Calling dialog.open()...");
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Open Folder",
      });

      console.log("🔵 Dialog result:", selected);

      if (selected && typeof selected === "string") {
        console.log("🟢 Opening folder:", selected);
        // Save the workspace path
        setWorkspacePath(selected);
        // Extract folder name from path
        const folderName = selected.split("/").pop() || "Workspace";
        console.log("🔵 Building file tree for:", folderName);
        const tree = await buildFileTree(selected, folderName, 2);
        console.log("🟢 File tree built successfully:", tree);
        setFileTree(tree);
      } else {
        console.log("🟡 User cancelled folder selection or invalid result");
      }
    } catch (error) {
      console.error("🔴 Error opening folder:", error);
      console.error("🔴 Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  };

  const handleFileSelect = async (path: string, name: string) => {
    await openFile(path, name);
  };

  const activeTab = getActiveTab();

  return (
    <div className="h-screen flex bg-white">
      {/* Resizable Sidebar with File Explorer */}
      <ResizableSidebar>
        <SidebarHeader
          onOpenFolder={handleOpenFolder}
          onCreateFile={createNewFile}
          onCreateFolder={createNewFolder}
          onCollapseAll={collapseAllFolders}
        />
        <ExplorerSidebar
          fileTree={fileTree}
          selectedFile={activeTabId || undefined}
          onFileSelect={handleFileSelect}
        />
      </ResizableSidebar>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tab Bar */}
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={setActiveTab}
          onTabClose={closeTab}
        />

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <EditorContent activeTab={activeTab} />
        </div>

        {/* Bottom Panel (Terminal/Output/Problems) */}
        {isVisible && (
          <ResizablePanel height={height} setHeight={setHeight}>
            <div className="h-full flex flex-col">
              <PanelTabs
                activePanel={activePanel}
                onPanelChange={setActivePanel}
              />
              <div className="flex-1 overflow-hidden">
                {activePanel === "terminal" && <Terminal />}
                {activePanel === "output" && (
                  <div className="h-full flex items-center justify-center text-muted-foreground bg-background">
                    Output panel (coming soon)
                  </div>
                )}
                {activePanel === "problems" && (
                  <div className="h-full flex items-center justify-center text-muted-foreground bg-background">
                    Problems panel (coming soon)
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        )}
      </div>
    </div>
  );
}
