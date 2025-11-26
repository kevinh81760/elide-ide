// components/Terminal/ResizablePanel
import React from "react";

interface ResizablePanelProps {
  children: React.ReactNode;
  height: number;
  setHeight: (h: number) => void;
  minHeight?: number;
  maxHeight?: number;
}

export function ResizablePanel({
  children,
  height,
  setHeight,
  minHeight = 100,
  maxHeight = 600,
}: ResizablePanelProps) {
  const [isResizing, setIsResizing] = React.useState(false);
  const startY = React.useRef(0);
  const startHeight = React.useRef(0);

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
    startY.current = e.clientY;
    startHeight.current = height;
  };

  const resize = React.useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaY = startY.current - e.clientY;
      const newHeight = startHeight.current + deltaY;
      
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setHeight(newHeight);
      } else if (newHeight < minHeight) {
        setHeight(minHeight);
      } else if (newHeight > maxHeight) {
        setHeight(maxHeight);
      }
    },
    [isResizing, minHeight, maxHeight, setHeight]
  );

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.body.style.userSelect = "none";
      document.body.style.cursor = "ns-resize";
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div
      className="relative bg-background border-t border-border"
      style={{ height: `${height}px` }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-500 transition-colors z-10"
        onMouseDown={startResizing}
        title="Drag to resize"
      />
      {children}
    </div>
  );
}

