
import React from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserMenu } from "./UserMenu";
import { MobileNavigation } from "./MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-white flex items-center justify-between px-6">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">Superbill Generator</h1>
            </div>
            <UserMenu />
          </header>
          <main className="flex-1 p-8 overflow-auto pb-24 md:pb-8">
            {children}
          </main>
          <MobileNavigation />
        </div>
      </div>
    </SidebarProvider>
  );
}
