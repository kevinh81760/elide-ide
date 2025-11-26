import { useEffect } from "react";
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
    createNewFile,
    createNewFolder,
    collapseAllFolders,
  } = useFileTreeStore();
  const { isVisible, height, setHeight, activePanel, setActivePanel } =
    useTerminalStore();

  useEffect(() => {
    const loadWorkspace = async () => {
      const defaultPath = "/Users";

      try {
        const tree = await buildFileTree(defaultPath, "Workspace", 2);
        setFileTree(tree);
      } catch (error) {
        console.error("Error loading workspace:", error);
      }
    };

    loadWorkspace();
  }, [setFileTree]);

  const handleFileSelect = async (path: string, name: string) => {
    await openFile(path, name);
  };

  const activeTab = getActiveTab();

  return (
    <div className="h-screen flex bg-white">
      {/* Resizable Sidebar with File Explorer */}
      <ResizableSidebar>
        <SidebarHeader
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
