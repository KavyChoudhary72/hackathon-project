import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  title: "FoodLink | Turn Surplus Food Into Real Impact",
  description:
    "Hyperlocal food surplus rescue and redistribution connecting banquets, shelters, and communities in Jaipur, Rajasthan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-surface-base text-neutral-900 selection:bg-brand-100 selection:text-brand-900">
        <AuthProvider>
          <I18nProvider>
            <ToastProvider>{children}</ToastProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

