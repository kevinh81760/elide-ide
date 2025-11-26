import { FolderOpen } from "lucide-react";
import Editor from "@monaco-editor/react";
import type { Tab } from "@/lib/file-types";
import { getLanguageFromExtension } from "@/lib/tauri-fs";

interface EditorContentProps {
  activeTab: Tab | undefined;
}

export function EditorContent({ activeTab }: EditorContentProps) {
  if (activeTab) {
    const language = getLanguageFromExtension(activeTab.name);

    return (
      <div className="w-full h-full bg-white">
        <Editor
          height="100%"
          language={language}
          value={activeTab.content}
          theme="light"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            readOnly: false,
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-white">
              <div className="text-gray-600">Loading editor...</div>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="text-center text-gray-600">
        <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-sm">Open a file from the explorer to get started</p>
      </div>
    </div>
  );
}

