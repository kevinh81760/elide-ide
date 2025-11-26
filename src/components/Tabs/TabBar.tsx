import { X } from "lucide-react";
import type { Tab } from "@/lib/file-types";

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export function TabBar({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
}: TabBarProps) {
  return (
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
              onClick={() => onTabClick(tab.id)}
            >
              <span className="text-xs md:text-sm font-mono">{tab.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded p-0.5 transition-all shrink-0"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground px-4">No files open</div>
      )}
    </div>
  );
}

