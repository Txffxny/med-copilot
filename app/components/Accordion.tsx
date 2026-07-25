"use client";

import { useState } from "react";

export default function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 border border-zinc-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
      >
        <span className="text-sm font-medium text-zinc-700">{title}</span>
        <span
          className={`text-zinc-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          {"▾"}
        </span>
      </button>
      {open && <div className="px-4 py-5 bg-white">{children}</div>}
    </div>
  );
}