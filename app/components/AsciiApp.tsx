"use client";

import { useState } from "react";
import { useAsciiRenderer, DEFAULT_RAMP } from "@/app/hooks/useAsciiRenderer";
import VideoUploader from "@/app/components/VideoUploader";
import Controls from "@/app/components/Controls";
import AsciiCanvas from "@/app/components/AsciiCanvas";

export default function AsciiApp() {
  const [file, setFile] = useState<File | null>(null);
  const [columnCount, setColumnCount] = useState(100);
  const [ramp, setRamp] = useState(DEFAULT_RAMP);

  const { asciiFrame, videoRef, canvasRef, controls, status, isImage } = useAsciiRenderer(file, columnCount, ramp);

  return (
    <div className="flex h-full w-full">
      {/* Hidden video + canvas used for frame extraction */}
      <video ref={videoRef} playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-zinc-800 flex flex-col gap-6 p-4 bg-zinc-900">
        <h1 className="text-lg font-semibold text-zinc-100">ASCII Playground</h1>
        <VideoUploader onFile={setFile} currentFile={file} />
        <Controls
          status={status}
          disabled={!file}
          isImage={isImage}
          columnCount={columnCount}
          onColumnCountChange={setColumnCount}
          ramp={ramp}
          onRampChange={setRamp}
          controls={controls}
        />
      </aside>

      {/* ASCII output panel */}
      <section className="flex-1 bg-black overflow-auto p-2">
        <AsciiCanvas asciiFrame={asciiFrame} />
      </section>
    </div>
  );
}
