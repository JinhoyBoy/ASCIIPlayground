"use client";

import { useState, useMemo } from "react";
import { useAsciiRenderer, DEFAULT_RAMP } from "@/app/hooks/useAsciiRenderer";
import MediaUploader from "@/app/components/MediaUploader";
import { Minimize2 } from "lucide-react";
import Controls from "@/app/components/Controls";
import AsciiCanvas from "@/app/components/AsciiCanvas";

export default function AsciiApp() {
  const [file, setFile] = useState<File | null>(null);
  const [columnCount, setColumnCount] = useState(100);
  const [ramp, setRamp] = useState(DEFAULT_RAMP);
  const [color, setColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#111111");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoHovered, setLogoHovered] = useState(false);

  const { asciiFrame, videoRef, canvasRef, controls, status, isImage } = useAsciiRenderer(file, columnCount, ramp);

  const sidebarTextColor = useMemo(() => {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return brightness > 0.6 ? "#52525b" : "#d4d4d8"; // zinc-600 : zinc-300
  }, [bgColor]);

  const sidebarHeadingColor = useMemo(() => {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return brightness > 0.6 ? "#27272a" : "#e4e4e7"; // zinc-800 : zinc-200
  }, [bgColor]);

  return (
    <div className="relative h-full w-full" style={{ backgroundColor: bgColor }}>
      {/* Hidden video + canvas used for frame extraction */}
      <video ref={videoRef} playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Minimized logo button */}
      {!sidebarOpen && (
        <button
          className="absolute top-5 left-5 z-10 w-10 h-10 rounded-full bg-zinc-900/10 backdrop-blur-md border border-zinc-700/10 overflow-hidden flex items-center justify-center"
          onClick={() => { setLogoHovered(false); setSidebarOpen(true); }}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <img
            src={logoHovered ? "/Logo-Tongue.svg" : "/Logo-Neutral.svg"}
            alt="Open sidebar"
            className="w-6.5 h-6.5"
          />
        </button>
      )}

      {/* Floating sidebar */}
      {sidebarOpen && (
        <aside className="absolute top-3 left-3 bottom-3 z-10 w-72 flex flex-col gap-6 p-4 rounded-xl bg-zinc-900/10 backdrop-blur-md border border-zinc-700/10">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold" style={{ color: sidebarHeadingColor }}>ASCII Playground</h1>
            <button
              className="w-6 h-6 flex items-center justify-center rounded text-sm hover:opacity-70 transition-opacity"
              style={{ color: sidebarTextColor }}
              onClick={() => setSidebarOpen(false)}
            >
              <Minimize2 size={14} />
            </button>
          </div>
          <MediaUploader onFile={setFile} currentFile={file} textColor={sidebarTextColor} headingColor={sidebarHeadingColor} />
          <Controls
            columnCount={columnCount}
            onColumnCountChange={setColumnCount}
            ramp={ramp}
            onRampChange={setRamp}
            color={color}
            onColorChange={setColor}
            bgColor={bgColor}
            onBgColorChange={setBgColor}
            textColor={sidebarTextColor}
          />
          <p className="text-xs mt-auto" style={{ color: sidebarTextColor }}>
            Made by <a href="https://jinhoan.com" target="_blank" className="underline hover:text-zinc-300">Jinho An</a>
          </p>
        </aside>
      )}

      {/* ASCII output panel */}
      <section className="relative h-full overflow-auto p-2">
        <AsciiCanvas asciiFrame={asciiFrame} columnCount={columnCount} color={color} />
        {file && !isImage && (
          <button
            className="absolute top-6 right-8 w-5 h-5 flex items-center justify-center transition-colors text-2xl"
            onClick={status === "playing" ? controls.pause : controls.play}
          >
            {status === "playing" ? "⏸" : "▶"}
          </button>
        )}
      </section>
    </div>
  );
}
