"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CHAR_RAMP = " .:-=+*#%@";

export type RendererStatus = "idle" | "playing" | "paused" | "stopped";

export function useAsciiRenderer(file: File | null, columnCount: number) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const columnCountRef = useRef(columnCount);
  const objectUrlRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const [asciiFrame, setAsciiFrame] = useState("");
  const [status, setStatus] = useState<RendererStatus>("idle");
  const statusRef = useRef<RendererStatus>("idle");
  const [isImage, setIsImage] = useState(false);

  function updateStatus(s: RendererStatus) {
    statusRef.current = s;
    setStatus(s);
  }

  // Sync columnCount into ref
  useEffect(() => {
    columnCountRef.current = columnCount;
  }, [columnCount]);

  const renderToAscii = useCallback((source: HTMLVideoElement | HTMLImageElement, width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !width || !height) return;

    const cols = columnCountRef.current;
    const rows = Math.round(cols * (height / width) * 0.5);

    canvas.width = cols;
    canvas.height = rows;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(source, 0, 0, cols, rows);
    const { data } = ctx.getImageData(0, 0, cols, rows);

    let frame = "";
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        const charIdx = Math.floor((luma / 255) * (CHAR_RAMP.length - 1));
        frame += CHAR_RAMP[charIdx];
      }
      frame += "\n";
    }
    setAsciiFrame(frame);
  }, []);

  const drawFrame = useCallback(() => {
    const img = imageRef.current;
    if (img) {
      renderToAscii(img, img.naturalWidth, img.naturalHeight);
      return;
    }
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    renderToAscii(video, video.videoWidth, video.videoHeight);
  }, [renderToAscii]);

  const tick = useCallback(() => {
    drawFrame();
    rafRef.current = requestAnimationFrame(tick);
  }, [drawFrame]);

  const cancelRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // Load file
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    cancelRaf();
    imageRef.current = null;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (!file) {
      video.src = "";
      setIsImage(false);
      updateStatus("idle");
      setAsciiFrame("");
      return;
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    if (file.type.startsWith("image/")) {
      setIsImage(true);
      video.src = "";
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        drawFrame();
        updateStatus("paused");
      };
      img.src = url;
    } else {
      setIsImage(false);
      video.src = url;
      video.load();
      updateStatus("stopped");
      setAsciiFrame("");
    }
  }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh frame when column count changes while paused (images or paused video)
  useEffect(() => {
    if (statusRef.current === "paused") {
      drawFrame();
    }
  }, [columnCount, drawFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelRaf();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const startPlaying = () => {
      video.play().then(() => {
        cancelRaf();
        updateStatus("playing");
        rafRef.current = requestAnimationFrame(tick);
      }).catch(() => {
        // ignore
      });
    };

    if (video.readyState >= 3) {
      startPlaying();
    } else {
      video.addEventListener("canplay", startPlaying, { once: true });
    }
  }, [tick]);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    cancelRaf();
    updateStatus("paused");
    drawFrame();
  }, [drawFrame]);

  const stop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    cancelRaf();
    updateStatus("stopped");
    setAsciiFrame("");
  }, []);

  // Handle video ended
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      cancelRaf();
      updateStatus("stopped");
      setAsciiFrame("");
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  return {
    asciiFrame,
    videoRef,
    canvasRef,
    controls: { play, pause, stop },
    status,
    isImage,
  };
}
