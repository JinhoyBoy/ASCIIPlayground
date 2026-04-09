"use client";

import { useState } from "react";

interface VideoUploaderProps {
  onFile: (file: File) => void;
  currentFile: File | null;
}

export default function VideoUploader({ onFile, currentFile }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith("video/") || file.type.startsWith("image/")) {
      onFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors ${
          isDragging
            ? "border-[#1a80e6] bg-[#1a80e6]/10"
            : "border-zinc-600 hover:border-zinc-400"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        <span className="text-sm text-zinc-400 text-center">
          Drop a video or image here or click to browse
        </span>
        <input
          type="file"
          accept="video/*,image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </label>
      {currentFile && (
        <p className="text-xs text-zinc-400 truncate text-center">{currentFile.name}</p>
      )}
    </div>
  );
}
