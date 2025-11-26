// components/Panels/PanelTabs
import { Terminal, FileText, AlertCircle } from "lucide-react";

interface PanelTabsProps {
  activePanel: "terminal" | "output" | "problems";
  onPanelChange: (panel: "terminal" | "output" | "problems") => void;
}

export function PanelTabs({ activePanel, onPanelChange }: PanelTabsProps) {
  const tabs = [
    { id: "terminal" as const, label: "Terminal", icon: Terminal },
    { id: "output" as const, label: "Output", icon: FileText },
    { id: "problems" as const, label: "Problems", icon: AlertCircle },
  ];

  return (
    <div className="h-9 bg-card border-b border-border flex items-center px-2 gap-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePanel === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onPanelChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-1 text-xs rounded transition-colors ${
              isActive
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

