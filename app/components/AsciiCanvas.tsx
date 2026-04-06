interface AsciiCanvasProps {
  asciiFrame: string;
}

export default function AsciiCanvas({ asciiFrame }: AsciiCanvasProps) {
  if (!asciiFrame) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-600 text-sm">
        Upload a video and press Play
      </div>
    );
  }

  return (
    <pre className="ascii-output text-white">{asciiFrame}</pre>
  );
}
