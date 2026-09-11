"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({
  items,
  defaultOpen,
}: {
  items: { title: string; content: React.ReactNode }[];
  defaultOpen?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);

  return (
    <div className="space-y-2">
      {items.map(({ title, content }) => {
        const isOpen = open === title;
        return (
          <div key={title} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : title)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm font-semibold text-slate-800">{title}</span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed">{content}</div>}
          </div>
        );
      })}
    </div>
  );
}
