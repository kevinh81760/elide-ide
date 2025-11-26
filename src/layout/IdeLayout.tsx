import { useState, useEffect } from "react";
import { FileTree } from "@/components/FileTree";
import type { FileNode, Tab } from "@/lib/file-types";
import { X, FolderOpen } from "lucide-react";
import { buildFileTree, readFile } from "@/lib/tauri-fs";

export default function IDELayout() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileNode | null>(null);

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
  }, []);

  const handleFileSelect = async (path: string, name: string) => {
    const existingTab = tabs.find((tab) => tab.path === path);
    if (existingTab) {
      setActiveTabId(path);
      return;
    }

    const content = await readFile(path);

    const newTab: Tab = {
      id: path,
      name: name,
      path: path,
      content: content,
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(path);
  };

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    } else if (newTabs.length === 0) {
      setActiveTabId(null);
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="h-screen flex bg-background">
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
              selectedFile={activeTabId || undefined}
              onFileSelect={handleFileSelect}
            />
          ) : (
            <div className="text-sm text-muted-foreground p-4 text-center">
              No workspace opened
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-10 bg-card border-b border-border flex items-center overflow-x-auto scrollbar-hide">
          {tabs.length > 0 ? (
            <div className="flex items-center gap-1 px-2 md:px-4">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 px-3 py-1 border-t border-l border-r border-border cursor-pointer group whitespace-nowrap shrink-0 ${
                    activeTabId === tab.id
                      ? "bg-background border-b-background"
                      : "bg-card border-b-border hover:bg-background/50"
                  }`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  <span className="text-xs md:text-sm font-mono">
                    {tab.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded p-0.5 transition-all shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground px-4">
              No files open
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto bg-background">
          {activeTab ? (
            <div className="w-full h-full">
              <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
                {activeTab.content}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  Open a file from the explorer to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

