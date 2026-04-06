"use client";

import { RendererStatus } from "@/app/hooks/useAsciiRenderer";

interface ControlsProps {
  status: RendererStatus;
  disabled: boolean;
  isImage: boolean;
  columnCount: number;
  onColumnCountChange: (v: number) => void;
  ramp: string;
  onRampChange: (v: string) => void;
  controls: { play(): void; pause(): void; stop(): void };
}

export default function Controls({
  status,
  disabled,
  isImage,
  columnCount,
  onColumnCountChange,
  ramp,
  onRampChange,
  controls,
}: ControlsProps) {
  const canPlay = !disabled && status !== "playing";
  const canPause = status === "playing";
  const canStop = status === "playing" || status === "paused";

  return (
    <div className="flex flex-col gap-4">
      {!isImage && !disabled && (
        <div className="flex gap-2">
          <button
            className="flex-1 rounded px-3 py-1.5 text-sm bg-[#1a80e6] hover:bg-[#1a70d0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={!canPlay}
            onClick={controls.play}
          >
            Play
          </button>
          <button
            className="flex-1 rounded px-3 py-1.5 text-sm bg-zinc-600 hover:bg-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={!canPause}
            onClick={controls.pause}
          >
            Pause
          </button>
          <button
            className="flex-1 rounded px-3 py-1.5 text-sm bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={!canStop}
            onClick={controls.stop}
          >
            Stop
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-400">Columns: {columnCount}</label>
        <input
          type="range"
          min={40}
          max={200}
          value={columnCount}
          onChange={(e) => onColumnCountChange(Number(e.target.value))}
          className="w-full accent-[#1a80e6]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-400">Character ramp</label>
        <input
          type="text"
          value={ramp}
          onChange={(e) => onRampChange(e.target.value)}
          spellCheck={false}
          className="w-full rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-sm text-zinc-200 font-mono"
        />
      </div>
    </div>
  );
}
