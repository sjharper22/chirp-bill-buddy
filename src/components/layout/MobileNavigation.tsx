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
      <div className="flex items-center justify-between bg-white border-t p-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          className={location.pathname === '/' ? 'bg-accent' : ''}
        >
          <Home className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/patients')}
          className={location.pathname === '/patients' ? 'bg-accent' : ''}
        >
          <Users className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="default" 
          size="icon" 
          onClick={() => navigate('/new')}
          className="rounded-full"
        >
          <PlusSquare className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/grouped-submission')}
          className={location.pathname === '/grouped-submission' ? 'bg-accent' : ''}
        >
          <ClipboardList className="h-5 w-5" />
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[385px]">
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
  );
}
