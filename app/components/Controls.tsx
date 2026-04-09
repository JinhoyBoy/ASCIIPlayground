"use client";

interface ControlsProps {
  columnCount: number;
  onColumnCountChange: (v: number) => void;
  ramp: string;
  onRampChange: (v: string) => void;
  color: string;
  onColorChange: (v: string) => void;
  bgColor: string;
  onBgColorChange: (v: string) => void;
  textColor: string;
}

export default function Controls({
  columnCount,
  onColumnCountChange,
  ramp,
  onRampChange,
  color,
  onColorChange,
  bgColor,
  onBgColorChange,
  textColor,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: textColor }}>Columns: {columnCount}</label>
        <input
          type="range"
          min={40}
          max={200}
          value={columnCount}
          onChange={(e) => onColumnCountChange(Number(e.target.value))}
          className="w-full accent-white"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs" style={{ color: textColor }}>Text</label>
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full h-8 rounded border border-zinc-600/20 bg-zinc-800/20 cursor-pointer"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs" style={{ color: textColor }}>Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => onBgColorChange(e.target.value)}
            className="w-full h-8 rounded border border-zinc-600/20 bg-zinc-800/20 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: textColor }}>Character ramp</label>
        <input
          type="text"
          value={ramp}
          onChange={(e) => onRampChange(e.target.value)}
          spellCheck={false}
          className="w-full rounded border border-zinc-600/20 bg-zinc-800/20 px-2 py-1 text-sm text-zinc-200 font-mono"
        />
      </div>
    </div>
  );
}
