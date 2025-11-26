import { FolderOpen } from "lucide-react";
import type { Tab } from "@/lib/file-types";

interface EditorContentProps {
  activeTab: Tab | undefined;
}

export function EditorContent({ activeTab }: EditorContentProps) {
  if (activeTab) {
    return (
      <div className="w-full h-full bg-white">
        <pre className="p-4 font-mono text-sm whitespace-pre-wrap text-black bg-white">
          {activeTab.content}
        </pre>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="text-center text-gray-500">
        <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-sm">Open a file from the explorer to get started</p>
      </div>
    </div>
  );
}

