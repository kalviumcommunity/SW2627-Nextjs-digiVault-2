import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { ToastProvider } from "@/lib/ToastContext";
import { TextSizeProvider } from "@/lib/useTextSize";

export const metadata: Metadata = {
  title: "DigiVault — Your Secure Document Vault",
  description:
    "Store, organize, search, and securely share your important documents in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <TextSizeProvider>
            <AuthProvider>{children}</AuthProvider>
          </TextSizeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
