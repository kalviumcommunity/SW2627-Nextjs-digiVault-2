"use client";

import { useEffect, useRef, useState } from "react";

export default function OtpInput({
  length = 6,
  onComplete,
  disabled,
}: {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[index] = digit;
    setValues(next);
    if (digit && index < length - 1) inputsRef.current[index + 1]?.focus();
    if (next.every((v) => v !== "")) onComplete(next.join(""));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(length).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setValues(next);
    if (pasted.length === length) onComplete(pasted);
    else inputsRef.current[pasted.length]?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={v}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          style={
            v
              ? { borderColor: "var(--dl-purple)", background: "var(--dl-purple-light)", color: "var(--dl-purple)" }
              : { borderColor: "#d1cce8", background: "#faf9ff", color: "var(--dl-text)" }
          }
          className="w-11 h-13 text-center text-lg font-bold rounded-lg border-2 outline-none transition-all disabled:opacity-50 focus:border-[var(--dl-purple)]"
        />
      ))}
    </div>
  );
}
