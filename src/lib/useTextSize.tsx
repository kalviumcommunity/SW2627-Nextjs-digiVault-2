"use client";

import { createContext, useContext, useEffect, useState } from "react";

type TextSize = "sm" | "md" | "lg";

interface TextSizeContextValue {
  size: TextSize;
  setSize: (size: TextSize) => void;
}

const TextSizeContext = createContext<TextSizeContextValue | null>(null);

const CLASS_MAP: Record<TextSize, string> = {
  sm: "text-size-sm",
  md: "text-size-md",
  lg: "text-size-lg",
};

export function TextSizeProvider({ children }: { children: React.ReactNode }) {
  const [size, setSizeState] = useState<TextSize>("md");

  useEffect(() => {
    const stored = window.localStorage.getItem("digivault_text_size") as TextSize | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate preference from storage on mount
    if (stored) setSizeState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove(...Object.values(CLASS_MAP));
    document.documentElement.classList.add(CLASS_MAP[size]);
    window.localStorage.setItem("digivault_text_size", size);
  }, [size]);

  return (
    <TextSizeContext.Provider value={{ size, setSize: setSizeState }}>
      {children}
    </TextSizeContext.Provider>
  );
}

export function useTextSize(): TextSizeContextValue {
  const ctx = useContext(TextSizeContext);
  if (!ctx) throw new Error("useTextSize must be used within TextSizeProvider");
  return ctx;
}
