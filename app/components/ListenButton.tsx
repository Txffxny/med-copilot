"use client";

import { useState, useRef } from "react";

export default function ListenButton({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [speed, setSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handleClick() {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      audioRef.current.play();
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = speed;
      audioRef.current = audio;
      audio.play();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleSpeedChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 border border-zinc-300 rounded-full px-3 py-1.5 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
      >
        {"🔊 "}
        {loading ? "Loading..." : label}
        {error && <span className="text-red-500 ml-1">{"(failed)"}</span>}
      </button>
      <select
        value={speed}
        onChange={handleSpeedChange}
        className="text-xs text-zinc-500 border border-zinc-300 rounded-full px-2 py-1.5 bg-white cursor-pointer"
        aria-label="Playback speed"
      >
        <option value="0.75">0.75x</option>
        <option value="1">1x</option>
        <option value="1.25">1.25x</option>
        <option value="1.5">1.5x</option>
      </select>
    </div>
  );
}