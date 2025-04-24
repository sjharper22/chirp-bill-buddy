
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
  FileEdit
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isEditor } = useAuth();
  
  // Define menu items with role-based conditional rendering
  const dashboardItems = [
    { title: "Home", icon: Home, url: "/" },
    { title: "Patients", icon: Users, url: "/patients" },
  ];
  
  const superbillItems = [
    ...(isAdmin || isEditor ? [{ title: "Create New", icon: PlusSquare, url: "/new" }] : []),
    { title: "Group Submissions", icon: ClipboardList, url: "/grouped-submission" },
    ...(isAdmin || isEditor ? [{ title: "Letter Builder", icon: FileEdit, url: "/letter-builder" }] : []),
  ];
  
  const otherItems = [
    ...(isAdmin || isEditor ? [{ title: "Templates", icon: LayoutTemplate, url: "/templates" }] : []),
    { title: "Reports", icon: FileSpreadsheet, url: "/reports" },
    ...(isAdmin ? [{ title: "Team", icon: UserCog, url: "/team" }] : []),
    { title: "Settings", icon: Settings, url: "/settings" },
  ];

  return (
    <Sidebar>
      <div className="p-4">
        <PracticeLogo />
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
