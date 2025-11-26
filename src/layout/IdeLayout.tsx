import { useEffect } from "react";
import { buildFileTree } from "@/lib/tauri-fs";
import { useEditorStore } from "@/lib/stores/useEditorStore";
import { useFileTreeStore } from "@/lib/stores/useFileTreeStore";
import { ExplorerSidebar } from "@/components/Sidebar";
import { TabBar } from "@/components/Tabs";
import { EditorContent } from "@/components/Editor";

export default function IDELayout() {
  const { tabs, activeTabId, openFile, closeTab, setActiveTab, getActiveTab } =
    useEditorStore();
  const { fileTree, setFileTree } = useFileTreeStore();

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
      {/* Sidebar with File Explorer */}
      <ExplorerSidebar
        fileTree={fileTree}
        selectedFile={activeTabId || undefined}
        onFileSelect={handleFileSelect}
      />

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
      </div>
    </div>
  );
}
