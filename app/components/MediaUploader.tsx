"use client";

import { useState } from "react";
import { Video, Image } from "lucide-react";

interface MediaUploaderProps {
  onFile: (file: File) => void;
  currentFile: File | null;
  textColor: string;
  headingColor: string;
}

export default function MediaUploader({ onFile, currentFile, textColor, headingColor }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith("video/") || file.type.startsWith("image/")) {
      onFile(file);
    }
  };

  const isImageFile = currentFile?.type.startsWith("image/");

  return (
    <div className="flex flex-col gap-2">
      <label
        className="flex flex-col items-center justify-center gap-2 h-20 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors"
        style={{
          borderColor: isDragging
            ? "#1a80e6"
            : currentFile
              ? "#4ade80"
              : isHovered
                ? headingColor
                : textColor,
          backgroundColor: isDragging
            ? "rgba(26,128,230,0.1)"
            : currentFile
              ? "rgba(74,222,128,0.1)"
              : undefined,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        {currentFile ? (
          <span className="flex items-center gap-2 text-xs w-full" style={{ color: textColor }}>
            {isImageFile ? <Image size={16} className="shrink-0" /> : <Video size={16} className="shrink-0" />}
            <span className="truncate">{currentFile.name}</span>
          </span>
        ) : (
          <span className="text-xs text-center" style={{ color: textColor }}>
            Drop a video or image here or click to browse
          </span>
        )}
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
    </div>
  );
}
