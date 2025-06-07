import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { MapPin, Clock, Stethoscope, Calendar, User, Settings, Heart, FileText, Phone, Shield } from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: MapPin,
    isActive: true,
  },
  {
    title: "Wait Times",
    url: "#",
    icon: Clock,
  },
  {
    title: "Symptom Checker",
    url: "#",
    icon: Stethoscope,
  },
  {
    title: "Appointments",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Medical Records",
    url: "#",
    icon: FileText,
  },
  {
    title: "Health Insights",
    url: "#",
    icon: Heart,
  },
]

const supportItems = [
  {
    title: "Emergency Contacts",
    url: "#",
    icon: Phone,
  },
  {
    title: "Privacy & Security",
    url: "#",
    icon: Shield,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Optimed</h1>
            <p className="text-sm text-slate-500">Smart Healthcare Access</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
          <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">John Doe</p>
            <p className="text-xs text-slate-500">Patient ID: #12345</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
