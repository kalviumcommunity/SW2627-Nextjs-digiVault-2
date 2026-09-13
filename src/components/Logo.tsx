import { ShieldCheck } from "lucide-react";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const iconSize = size === "lg" ? 26 : size === "sm" ? 18 : 20;
  const iconBox = size === "lg" ? "w-9 h-9" : size === "sm" ? "w-6 h-6" : "w-7 h-7";

  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${textSize} text-slate-900`}>
      <span className={`inline-flex items-center justify-center rounded-lg bg-brand text-white ${iconBox}`}>
        <ShieldCheck size={iconSize} strokeWidth={2.25} />
      </span>
      Digi<span className="text-brand">Vault</span>
    </span>
  );
}
