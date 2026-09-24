import React from "react";
import { Sidebar } from "@/components/app/Sidebar";
import { AppNavbar } from "@/components/app/AppNavbar";
import { DemoBar } from "@/components/app/DemoBar";
import { ChatWidget } from "@/components/app/ChatWidget";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface-base">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-10">
        <AppNavbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Overlays */}
      <DemoBar />
      <ChatWidget />
    </div>
  );
}
