
import React from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { UserMenu } from "./UserMenu";
import { MobileNavigation } from "./MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-background">
        {!isMobile && <AppSidebar />}
        <SidebarInset className="flex-1 bg-background">
          <header className="sticky top-0 z-20 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-4">
                {!isMobile && (
                  <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-foreground">Superbill Generator</h1>
                  </div>
                )}
                {isMobile && (
                  <h1 className="text-lg font-semibold text-foreground">Superbill Generator</h1>
                )}
              </div>
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto max-w-7xl p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
              {children}
            </div>
          </main>
          {isMobile && <MobileNavigation />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
