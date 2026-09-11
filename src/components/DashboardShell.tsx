"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardShell({
  children,
  onSearch,
}: {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-brand" size={28} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <DashboardHeader onSearch={onSearch} />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
