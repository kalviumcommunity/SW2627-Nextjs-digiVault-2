import { FileText, FileImage, FileSpreadsheet, File } from "lucide-react";

const TYPE_STYLES: Record<string, { bg: string; icon: React.ElementType }> = {
  pdf: { bg: "bg-red-500", icon: FileText },
  jpg: { bg: "bg-amber-500", icon: FileImage },
  jpeg: { bg: "bg-amber-500", icon: FileImage },
  png: { bg: "bg-amber-500", icon: FileImage },
  doc: { bg: "bg-blue-500", icon: FileText },
  docx: { bg: "bg-blue-500", icon: FileText },
  xls: { bg: "bg-emerald-600", icon: FileSpreadsheet },
  xlsx: { bg: "bg-emerald-600", icon: FileSpreadsheet },
  ppt: { bg: "bg-orange-500", icon: FileText },
  pptx: { bg: "bg-orange-500", icon: FileText },
  txt: { bg: "bg-slate-500", icon: FileText },
};

export default function DocumentTypeIcon({
  fileType,
  size = "md",
}: {
  fileType: string;
  size?: "sm" | "md";
}) {
  const style = TYPE_STYLES[fileType.toLowerCase()] ?? { bg: "bg-slate-400", icon: File };
  const Icon = style.icon;
  const box = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? 15 : 18;

  return (
    <div className={`rounded-lg ${style.bg} ${box} flex items-center justify-center text-white shrink-0`}>
      <Icon size={iconSize} strokeWidth={2} />
    </div>
  );
}
