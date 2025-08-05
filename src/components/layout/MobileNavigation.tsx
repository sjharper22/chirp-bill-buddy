import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, PlusSquare, ClipboardList, LayoutTemplate, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    label: "DASHBOARD",
    items: [
      { title: "Home", icon: Home, url: "/" },
      { title: "Patients", icon: Users, url: "/patients" },
    ],
  },
  {
    label: "SUPERBILLS",
    items: [
      { title: "Create New", icon: PlusSquare, url: "/new" },
      { title: "Group Submissions", icon: ClipboardList, url: "/grouped-submission" },
    ],
  },
  {
    label: "OTHER",
    items: [
      { title: "Templates", icon: LayoutTemplate, url: "/templates" },
      { title: "Reports", icon: Users, url: "/reports" },
      { title: "Settings", icon: Users, url: "/settings" },
    ],
  },
];

export function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border h-16 px-2">
        <div className="grid grid-cols-5 gap-1 w-full max-w-md">
          <Button 
            variant={location.pathname === '/' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => navigate('/')}
            className="flex flex-col items-center justify-center h-12 p-1 text-xs"
          >
            <Home className="h-4 w-4 mb-1" />
            <span className="text-[10px] leading-none">Home</span>
          </Button>
          
          <Button 
            variant={location.pathname === '/patients' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => navigate('/patients')}
            className="flex flex-col items-center justify-center h-12 p-1 text-xs"
          >
            <Users className="h-4 w-4 mb-1" />
            <span className="text-[10px] leading-none">Patients</span>
          </Button>
          
          <Button 
            variant={location.pathname === '/new' ? 'secondary' : 'default'} 
            size="sm" 
            onClick={() => navigate('/new')}
            className="flex flex-col items-center justify-center h-12 p-1 text-xs rounded-full"
          >
            <PlusSquare className="h-4 w-4 mb-1" />
            <span className="text-[10px] leading-none">New</span>
          </Button>
          
          <Button 
            variant={location.pathname === '/grouped-submission' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => navigate('/grouped-submission')}
            className="flex flex-col items-center justify-center h-12 p-1 text-xs"
          >
            <ClipboardList className="h-4 w-4 mb-1" />
            <span className="text-[10px] leading-none">Group</span>
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex flex-col items-center justify-center h-12 p-1 text-xs"
              >
                <Menu className="h-4 w-4 mb-1" />
                <span className="text-[10px] leading-none">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="py-6">
                <h2 className="text-xl font-semibold mb-6">Menu</h2>
                {menuItems.map((group) => (
                  <SidebarGroup key={group.label}>
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {group.items.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              className={location.pathname === item.url ? "bg-accent" : ""}
                              onClick={() => navigate(item.url)}
                            >
                              <item.icon className="w-4 h-4" />
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
