import { useState, useEffect } from "react";
import { FileTree } from "@/components/FileTree";
import type { FileNode, Tab } from "@/lib/file-types";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Github, Mail, X, Menu, FolderOpen } from "lucide-react";
import { buildFileTree, readFile } from "@/lib/tauri-fs";

export default function IDELayout() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [_workspacePath, setWorkspacePath] = useState<string>("");

  // Initialize with a default workspace path
  useEffect(() => {
    loadWorkspace();
  }, []);

  const loadWorkspace = async () => {
    // For now, we'll use a placeholder path
    // In a real IDE, you'd have a workspace picker
    const defaultPath = "/Users"; // This should be configurable
    setWorkspacePath(defaultPath);
    
    try {
      const tree = await buildFileTree(defaultPath, "Workspace", 2);
      setFileTree(tree);
    } catch (error) {
      console.error("Error loading workspace:", error);
    }
  };

  const handleFileSelect = async (path: string, name: string) => {
    // Check if tab already exists
    const existingTab = tabs.find((tab) => tab.path === path);
    if (existingTab) {
      setActiveTabId(path);
      setSidebarOpen(false); // Close sidebar on mobile
      return;
    }

    // Read file content
    const content = await readFile(path);

    // Add new tab
    const newTab: Tab = {
      id: path,
      name: name,
      path: path,
      content: content,
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(path);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    // If we closed the active tab, switch to another one
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    } else if (newTabs.length === 0) {
      setActiveTabId(null);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const openWorkspace = async () => {
    // This would typically open a dialog to select a folder
    // For now, we'll just reload the current workspace
    await loadWorkspace();
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="h-12 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-3 md:px-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs md:text-sm font-mono text-sidebar-foreground ml-2 md:ml-4 truncate">
            Elide IDE
          </span>
        </div>

        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8 p-0 md:hidden shrink-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={openWorkspace}
            className="h-7 w-7 md:h-8 md:w-8 p-0 shrink-0"
            title="Open Workspace"
          >
            <FolderOpen className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open("https://github.com", "_blank")}
            className="h-7 w-7 md:h-8 md:w-8 p-0 shrink-0"
          >
            <Github className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              window.open("mailto:ryannguyenc@gmail.com", "_blank")
            }
            className="h-7 w-7 md:h-8 md:w-8 p-0 shrink-0"
          >
            <Mail className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-7 w-7 md:h-8 md:w-8 p-0 shrink-0"
          >
            {isDark ? (
              <Sun className="h-3 w-3 md:h-4 md:w-4" />
            ) : (
              <Moon className="h-3 w-3 md:h-4 md:w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`w-80 bg-sidebar border-r border-sidebar-border flex flex-col fixed md:relative z-50 md:z-auto h-full md:h-auto transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-200 ease-in-out`}
        >
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab Bar */}
          <div className="h-10 bg-card border-b border-border flex items-center overflow-x-auto scrollbar-hide">
            {tabs.length > 0 ? (
              <div className="flex items-center gap-1 px-2 md:px-4">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center gap-2 px-3 py-1 border-t border-l border-r border-border cursor-pointer group whitespace-nowrap flex-shrink-0 ${
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
                      className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded p-0.5 transition-all flex-shrink-0"
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

          {/* Content Area */}
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
                  <h2 className="text-xl font-semibold mb-2">
                    Welcome to Elide IDE
                  </h2>
                  <p className="text-sm">
                    Open a file from the explorer to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
