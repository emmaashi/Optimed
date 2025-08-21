"use client"

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
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Clock,
  Stethoscope,
  Calendar,
  User,
  Settings,
  Heart,
  FileText,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/app/contexts/auth-provider"
import { useRouter, usePathname } from "next/navigation"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: MapPin,
  },
  {
    title: "Wait Times",
    url: "/wait-times",
    icon: Clock,
  },
  {
    title: "Medical Records",
    url: "/medical-records",
    icon: FileText,
  },
  {
    title: "Symptom Checker",
    url: "/symptom-checker",
    icon: Stethoscope,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Health Insights",
    url: "/health-insights",
    icon: Heart,
  },
]

const supportItems = [
  // {
  //   title: "Privacy & Security",
  //   url: "/privacy-security",
  //   icon: Shield,
  // },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  // Get display name from user metadata or email
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  const healthCardNumber = user?.user_metadata?.health_card_number

  return (
    <Sidebar className="border-r border-gray-100 bg-gray-50/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Optimed</h1>
            <p className="text-sm text-gray-500">Smart Healthcare Access</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
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
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500">{healthCardNumber ? `HC: ${healthCardNumber}` : "No HC on file"}</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleSignOut} 
            className="w-full justify-start h-11 rounded-xl border-gray-200 hover:bg-gray-50 font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
