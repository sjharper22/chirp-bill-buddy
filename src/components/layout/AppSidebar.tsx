
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PracticeLogo } from "@/components/PracticeLogo";
import {
  Home,
  CalendarDays,
  MessageSquare,
  Users,
  FileText,
  ClipboardList,
  PlusSquare,
  Settings,
  FileSpreadsheet,
  Activity,
  Menu,
  LayoutTemplate,
  UserCog,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isEditor } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  // Define menu items with role-based conditional rendering
  const dashboardItems = [
    { title: "Home", icon: Home, url: "/" },
    { title: "Patients", icon: Users, url: "/patients" },
    { title: "Appointments", icon: CalendarDays, url: "/appointments" },
  ];
  
  const superbillItems = [
    ...(isAdmin || isEditor ? [{ title: "Create New", icon: PlusSquare, url: "/new" }] : []),
    { title: "Group Submissions", icon: ClipboardList, url: "/grouped-submission" },
  ];
  
  const otherItems = [
    ...(isAdmin || isEditor ? [{ title: "Templates", icon: LayoutTemplate, url: "/templates" }] : []),
    { title: "Reports", icon: FileSpreadsheet, url: "/reports" },
    ...(isAdmin ? [{ title: "Team", icon: UserCog, url: "/team" }] : []),
    { title: "Settings", icon: Settings, url: "/settings" },
  ];

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <div className={`px-4 py-4 ${isCollapsed ? "flex justify-center" : ""}`}>
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && <PracticeLogo />}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={isCollapsed ? "flex justify-center" : "ml-auto"}>
                  <SidebarTrigger className="hover:bg-sidebar-accent transition-all ease-in-out duration-300">
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 transition-transform duration-300" />
                    ) : (
                      <ChevronLeft className="w-4 h-4 transition-transform duration-300" />
                    )}
                  </SidebarTrigger>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="right"
                sideOffset={12}
              >
                {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>DASHBOARD</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={location.pathname === item.url ? "bg-accent" : ""}
                    onClick={() => navigate(item.url)}
                    tooltip={item.title}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>SUPERBILLS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {superbillItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={location.pathname === item.url ? "bg-accent" : ""}
                    onClick={() => navigate(item.url)}
                    tooltip={item.title}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>OTHER</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={location.pathname === item.url ? "bg-accent" : ""}
                    onClick={() => navigate(item.url)}
                    tooltip={item.title}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
