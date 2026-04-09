"use client";

import { useRef, useState, useEffect } from "react";

interface AsciiCanvasProps {
  asciiFrame: string;
  columnCount: number;
  color: string;
}

export default function AsciiCanvas({ asciiFrame, columnCount, color }: AsciiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(7);

  const rowCount = asciiFrame ? asciiFrame.split("\n").length - 1 : 0;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !rowCount) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const byWidth = width / (columnCount * 0.6);
      const byHeight = height / rowCount;
      setFontSize(Math.min(byWidth, byHeight) * 0.8);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [columnCount, rowCount]);

  if (!asciiFrame) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-300 text-sm">
        Upload a video or image to see the ASCII art
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full flex items-center justify-center">
      <pre className="ascii-output select-none" style={{ fontSize: `${fontSize}px`, color }}>
        {asciiFrame}
      </pre>
    </div>
  );
}
