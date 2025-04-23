
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  LayoutTemplate
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

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
      { title: "Reports", icon: FileSpreadsheet, url: "/reports" },
      { title: "Settings", icon: Settings, url: "/settings" },
    ],
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <div className="p-4">
        <PracticeLogo />
      </div>
      <SidebarContent>
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
      </SidebarContent>
    </Sidebar>
  );
}
